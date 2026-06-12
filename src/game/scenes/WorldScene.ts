import Phaser from 'phaser'
import { COLORS, MONO, FONT, css } from '../theme'
import { CASES } from '../content'
import { Progress } from '../state'
import { sfx } from '../audio'
import { clearDom } from '../ui/hud'
import { UI } from '../lang'
import type { Loc } from '../lang'
import type { UIScene } from './UIScene'
import { fadeIn, FADE } from '../ui/transition'

interface Target {
  kind: 'case' | 'hq'
  id?: number
  x: number
  y: number
  radius: number
  title: Loc
  enabled: () => boolean
  locked?: () => boolean
}

/**
 * Θέσεις σημείων έρευνας — ΠΑΝΩ σε περπατήσιμα πλακίδια δρόμου (επαληθευμένα από
 * το collision grid του χάρτη), ώστε ο παίκτης να φτάνει σε όλα.
 */
const SPOTS: Record<number, { x: number; y: number }> = {
  1: { x: 336, y: 144 }, // πάνω-αριστερά
  2: { x: 720, y: 304 }, // μπροστά στο μεγάλο κτήριο (πάνω-κέντρο)
  3: { x: 848, y: 592 }, // δεξιά-κέντρο (μετακινήθηκε: το παλιό (1072,208) ήταν σε κλειστή πλατεία -> Case 3 ανέφικτο). Επαληθευμένο με flood-fill από SPAWN.
  4: { x: 144, y: 368 }, // αριστερά
  5: { x: 1072, y: 592 }, // δεξιά-κέντρο
  6: { x: 144, y: 1008 }, // κάτω-αριστερά
  7: { x: 560, y: 976 }, // κάτω-κέντρο
  8: { x: 976, y: 1072 }, // κάτω-δεξιά
}
const HQ_POS = { x: 624, y: 592 } // κεντρικός δρόμος
const SPAWN = { x: 640, y: 980 } // κάτω-κέντρο, ανοιχτός δρόμος

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private shadow!: Phaser.GameObjects.Graphics
  private facing: 'left' | 'right' | 'front' | 'back' = 'front'
  private keys!: Record<string, Phaser.Input.Keyboard.Key>
  private targets: Target[] = []
  private active: Target | null = null
  private moved = false
  private nextStep = 0

  constructor() {
    super('World')
  }

  create(): void {
    clearDom(this)
    this.targets = []
    this.active = null
    this.moved = false

    const map = this.make.tilemap({ key: 'town' })
    const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles', 32, 32, 1, 2)!
    const below = map.createLayer('Below Player', tileset, 0, 0)!
    const world = map.createLayer('World', tileset, 0, 0)!
    const above = map.createLayer('Above Player', tileset, 0, 0)!
    below.setDepth(0)
    world.setDepth(1)
    above.setDepth(10)
    world.setCollisionByProperty({ collides: true })

    CASES.forEach((c) => {
      const p = SPOTS[c.id]
      this.addMarker('case', c.id, p.x, p.y, c.glyph, c.themeColor, Progress.isSolved(c.id), c.title)
    })
    const hqUnlocked = Progress.allSolved(CASES.length)
    this.addMarker('hq', 0, HQ_POS.x, HQ_POS.y, hqUnlocked ? '⚖️' : '🔒', COLORS.gold, false, UI.finalTitle, hqUnlocked)

    if (import.meta.env.DEV) this.assertReachable(map, world)

    const sx = (this.registry.get('wx') as number) ?? SPAWN.x
    const sy = (this.registry.get('wy') as number) ?? SPAWN.y
    this.shadow = this.add.graphics().setDepth(1.9)
    this.player = this.physics.add.sprite(sx, sy, 'misa', 'misa-front').setDepth(2)
    const pbody = this.player.body as Phaser.Physics.Arcade.Body
    pbody.setSize(this.player.width * 0.55, this.player.height * 0.42).setOffset(this.player.width * 0.22, this.player.height * 0.55)
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, world)

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    const cam = this.cameras.main
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    cam.startFollow(this.player, true, 0.12, 0.12)
    cam.setZoom(1.35)
    cam.setRoundPixels(true)
    fadeIn(this)

    this.setupControls()
    this.scene.launch('Ui')
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scene.stop('Ui'))
  }

  private assertReachable(map: Phaser.Tilemaps.Tilemap, world: Phaser.Tilemaps.TilemapLayer): void {
    const W = map.width
    const H = map.height
    const blocked = (tx: number, ty: number): boolean => {
      if (tx < 0 || ty < 0 || tx >= W || ty >= H) return true
      const tile = world.getTileAt(tx, ty)
      return tile ? tile.canCollide : false
    }
    const toTile = (px: number, py: number): { tx: number; ty: number } | null => {
      const tx = map.worldToTileX(px)
      const ty = map.worldToTileY(py)
      return tx === null || ty === null ? null : { tx, ty }
    }

    const spawn = toTile(SPAWN.x, SPAWN.y)
    if (!spawn || blocked(spawn.tx, spawn.ty)) {
      console.error(`[reachability] SPAWN px(${SPAWN.x},${SPAWN.y}) is invalid or colliding — players cannot stand here.`)
      return
    }

    const reached: boolean[] = new Array(W * H).fill(false)
    const idx = (tx: number, ty: number): number => ty * W + tx
    const queue: Array<[number, number]> = [[spawn.tx, spawn.ty]]
    reached[idx(spawn.tx, spawn.ty)] = true
    const dirs: Array<[number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    while (queue.length) {
      const [x, y] = queue.shift()!
      for (const [dx, dy] of dirs) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
        if (reached[idx(nx, ny)] || blocked(nx, ny)) continue
        reached[idx(nx, ny)] = true
        queue.push([nx, ny])
      }
    }

    const check = (label: string, px: number, py: number): void => {
      const t = toTile(px, py)
      if (!t) {
        console.error(`[reachability] ${label} px(${px},${py}) is outside the map.`)
        return
      }
      if (blocked(t.tx, t.ty)) {
        console.error(`[reachability] ${label} px(${px},${py}) tile(${t.tx},${t.ty}) sits on a COLLIDING tile.`)
        return
      }
      if (!reached[idx(t.tx, t.ty)]) {
        console.error(`[reachability] ${label} px(${px},${py}) tile(${t.tx},${t.ty}) is UNREACHABLE from SPAWN — relocate it in SPOTS/HQ_POS.`)
      }
    }

    CASES.forEach((c) => {
      const p = SPOTS[c.id]
      if (!p) {
        console.error(`[reachability] Case ${c.id} has no SPOTS entry.`)
        return
      }
      check(`SPOT${c.id}`, p.x, p.y)
    })
    check('HQ', HQ_POS.x, HQ_POS.y)
  }

  private addMarker(kind: 'case' | 'hq', id: number, x: number, y: number, glyph: string, color: number, solved: boolean, title: Loc, hqUnlocked = false): void {
    const live = kind === 'case' || hqUnlocked
    const ringColor = solved ? COLORS.correct : live ? color : COLORS.inkDim

    const glow = this.add.graphics().setDepth(1.6)
    glow.fillStyle(ringColor, 0.22)
    glow.fillEllipse(x, y, 92, 40)
    glow.lineStyle(2, ringColor, 0.6)
    glow.strokeEllipse(x, y, 92, 40)
    if (live && !solved) this.tweens.add({ targets: glow, alpha: { from: 0.5, to: 1 }, duration: 900, yoyo: true, repeat: -1 })

    const marker = this.add.container(x, y - 70).setDepth(20)
    const mg = this.add.graphics()
    mg.fillStyle(COLORS.black, 0.25)
    mg.fillEllipse(0, 30, 30, 8)
    mg.fillStyle(ringColor, 1)
    mg.fillCircle(0, 0, 19)
    mg.lineStyle(3, COLORS.white, 0.92)
    mg.strokeCircle(0, 0, 19)
    mg.fillStyle(ringColor, 1)
    mg.fillTriangle(-8, 15, 8, 15, 0, 27)
    const mt = this.add.text(0, -1, solved ? '✓' : glyph, { fontFamily: FONT, fontSize: '18px', color: css(COLORS.white) }).setOrigin(0.5)
    marker.add([mg, mt])
    this.tweens.add({ targets: marker, y: y - 80, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' })

    if (kind === 'case') {
      this.add
        .text(x, y + 26, String(id).padStart(2, '0'), { fontFamily: MONO, fontSize: '13px', fontStyle: 'bold', color: css(solved ? COLORS.correct : COLORS.white) })
        .setOrigin(0.5)
        .setDepth(20)
        .setShadow(0, 1, '#000000', 3)
    }

    this.targets.push({ kind, id, x, y, radius: 92, title, enabled: () => true, locked: kind === 'hq' ? () => !Progress.allSolved(CASES.length) : undefined })
  }

  private setupControls(): void {
    const kb = this.input.keyboard
    if (kb) {
      this.keys = kb.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT,E,SPACE,SHIFT') as Record<string, Phaser.Input.Keyboard.Key>
      kb.on('keydown-E', () => this.requestInteract())
      kb.on('keydown-SPACE', () => this.requestInteract())
    } else {
      this.keys = {}
    }
  }

  /** Καλείται από το UIScene (κουμπί) ή το πληκτρολόγιο. */
  requestInteract(): void {
    if (!this.active) return
    if (this.active.locked && this.active.locked()) {
      sfx.wrong()
      return
    }
    const cam = this.cameras.main
    if (cam.fadeEffect.isRunning) return // αποφυγή διπλής μετάβασης
    this.registry.set('wx', this.player.x)
    this.registry.set('wy', this.player.y)
    this.player.setVelocity(0, 0)
    sfx.open()
    const target = this.active.kind === 'hq' ? { key: 'Final', data: undefined as undefined } : { key: 'Case', data: { caseId: this.active.id } }
    this.scene.stop('Ui') // το HUD/joystick φεύγει ακαριαία· ο κόσμος κάνει fade από κάτω
    this.tweens.add({
      targets: cam,
      zoom: 1.9,
      duration: FADE.dur,
      ease: 'Quad.easeInOut',
    })
    cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(target.key, target.data)
    })
    cam.fadeOut(FADE.dur, (COLORS.bg0 >> 16) & 0xff, (COLORS.bg0 >> 8) & 0xff, COLORS.bg0 & 0xff)
  }

  update(): void {
    if (!this.player) return
    this.shadow.clear()
    this.shadow.fillStyle(0x000000, 0.35)
    this.shadow.fillEllipse(this.player.x, this.player.y + 19, 26, 10)

    if (this.cameras.main.fadeEffect.isRunning) { this.player.setVelocity(0, 0); return }
    const ui = this.scene.get('Ui') as UIScene
    const k = this.keys
    let vx = 0
    let vy = 0
    if (k.A?.isDown || k.LEFT?.isDown) vx -= 1
    if (k.D?.isDown || k.RIGHT?.isDown) vx += 1
    if (k.W?.isDown || k.UP?.isDown) vy -= 1
    if (k.S?.isDown || k.DOWN?.isDown) vy += 1
    const jv = ui ? ui.vector() : null
    if (jv) {
      vx += jv.x
      vy += jv.y
    }
    const len = Math.hypot(vx, vy)
    if (len > 1) {
      vx /= len
      vy /= len
    }

    const joystickMagnitude = jv ? Math.hypot(jv.x, jv.y) : 0
    const isSprinting = Boolean(k.SHIFT?.isDown) || joystickMagnitude > 0.95
    const speed = isSprinting ? 310 : 215
    this.player.setVelocity(vx * speed, vy * speed)

    const moving = vx * vx + vy * vy > 0.02
    if (moving && !this.moved) {
      this.moved = true
      ui?.hideMoveHint()
    }
    if (moving) {
      if (Math.abs(vx) > Math.abs(vy)) this.facing = vx < 0 ? 'left' : 'right'
      else this.facing = vy < 0 ? 'back' : 'front'
      this.player.anims.play(`misa-${this.facing}-walk`, true)
      this.player.anims.timeScale = isSprinting ? 1.6 : 1.0
      if (this.time.now > this.nextStep) {
        sfx.step()
        this.nextStep = this.time.now + (isSprinting ? 190 : 300)
      }
    } else {
      this.player.anims.stop()
      this.player.setFrame(`misa-${this.facing}`)
    }

    this.updateInteraction(ui)
  }

  private updateInteraction(ui: UIScene | undefined): void {
    let best: Target | null = null
    let bestD = Infinity
    for (const tg of this.targets) {
      if (!tg.enabled()) continue
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, tg.x, tg.y)
      if (d < tg.radius && d < bestD) {
        best = tg
        bestD = d
      }
    }
    if (best !== this.active) {
      this.active = best
      if (ui) {
        if (best) {
          const locked = best.locked ? best.locked() : false
          ui.showPrompt({ key: `${best.kind}-${best.id}-${locked}`, title: best.title, isHq: best.kind === 'hq', locked })
        } else {
          ui.showPrompt(null)
        }
      }
    }
  }
}
