import Phaser from 'phaser'
import { COLORS, FONT, DEPTH, css } from '../theme'

/** Εικονικό joystick (touch + ποντίκι), σταθερό στην οθόνη. */
export class Joystick {
  readonly vector = new Phaser.Math.Vector2(0, 0)
  private baseX: number
  private baseY: number
  private radius: number
  private thumb: Phaser.GameObjects.Arc
  private pointerId: number | null = null

  constructor(scene: Phaser.Scene, x: number, y: number, radius = 78) {
    this.baseX = x
    this.baseY = y
    this.radius = radius

    const ring = scene.add.graphics().setScrollFactor(0).setDepth(DEPTH.hud)
    ring.fillStyle(COLORS.black, 0.28)
    ring.fillCircle(x, y, radius)
    ring.lineStyle(2, COLORS.accent, 0.5)
    ring.strokeCircle(x, y, radius)

    this.thumb = scene.add.circle(x, y, radius * 0.42, COLORS.accent, 0.9).setScrollFactor(0).setDepth(DEPTH.hud)

    const zone = scene.add.circle(x, y, radius * 1.7, 0xffffff, 0.001).setScrollFactor(0).setDepth(DEPTH.hud).setInteractive()
    zone.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.pointerId = p.id
      this.move(p)
    })
    scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.id === this.pointerId) this.move(p)
    })
    scene.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (p.id === this.pointerId) this.reset()
    })
  }

  private move(p: Phaser.Input.Pointer): void {
    let dx = p.x - this.baseX
    let dy = p.y - this.baseY
    const len = Math.hypot(dx, dy)
    if (len > this.radius) {
      dx = (dx / len) * this.radius
      dy = (dy / len) * this.radius
    }
    this.thumb.setPosition(this.baseX + dx, this.baseY + dy)
    this.vector.set(dx / this.radius, dy / this.radius)
  }

  private reset(): void {
    this.pointerId = null
    this.thumb.setPosition(this.baseX, this.baseY)
    this.vector.set(0, 0)
  }
}

/** Στρογγυλό κουμπί δράσης (σταθερό στην οθόνη). */
export class InteractButton {
  private cont: Phaser.GameObjects.Container
  private bg: Phaser.GameObjects.Graphics
  private txt: Phaser.GameObjects.Text
  private r: number
  private enabled = false
  private cb: () => void
  private pulse?: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, x: number, y: number, glyph: string, onClick: () => void, r = 56) {
    this.r = r
    this.cb = onClick
    this.cont = scene.add.container(x, y).setScrollFactor(0).setDepth(DEPTH.hud)
    this.bg = scene.add.graphics()
    this.txt = scene.add.text(0, 0, glyph, { fontFamily: FONT, fontSize: `${Math.round(r * 0.7)}px`, color: css(COLORS.accentInk) }).setOrigin(0.5)
    this.cont.add([this.bg, this.txt])
    this.draw()
    this.cont.setSize(r * 2, r * 2)
    this.cont.setInteractive(new Phaser.Geom.Circle(0, 0, r), Phaser.Geom.Circle.Contains)
    this.cont.on('pointerdown', () => {
      if (!this.enabled) return
      scene.tweens.add({ targets: this.cont, scale: 0.9, duration: 70, yoyo: true })
      this.cb()
    })
    this.setEnabled(false)
  }

  private draw(): void {
    const g = this.bg
    g.clear()
    g.fillStyle(COLORS.black, 0.3)
    g.fillCircle(0, 4, this.r)
    g.fillStyle(this.enabled ? COLORS.accent : COLORS.panelAlt, 1)
    g.fillCircle(0, 0, this.r)
    g.lineStyle(2.5, this.enabled ? COLORS.white : COLORS.panelBorder, 0.9)
    g.strokeCircle(0, 0, this.r)
  }

  setEnabled(on: boolean): void {
    if (this.enabled === on) return
    this.enabled = on
    this.txt.setColor(css(on ? COLORS.accentInk : COLORS.inkDim))
    this.draw()
    this.cont.setAlpha(on ? 1 : 0.5)
    this.pulse?.stop()
    this.cont.setScale(1)
    if (on) {
      this.pulse = this.cont.scene.tweens.add({ targets: this.cont, scale: 1.08, duration: 620, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    }
  }

  setGlyph(glyph: string): void {
    this.txt.setText(glyph)
  }
}
