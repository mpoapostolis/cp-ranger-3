import Phaser from 'phaser'
import { COLORS, GAME_W, GAME_H, FONT, MONO, css } from '../theme'
import { goTo } from '../ui/transition'
import { label } from '../ui/text'
import { t, UI, getLang } from '../lang'

/** Φορτώνει τα assets (χάρτης, tileset, χαρακτήρας), φτιάχνει animations & textures. */
export class BootScene extends Phaser.Scene {
  private startedAt = 0
  private bar!: Phaser.GameObjects.Graphics
  private pct!: Phaser.GameObjects.Text
  private feedText!: Phaser.GameObjects.Text
  private failed = false

  constructor() {
    super('Boot')
  }

  preload(): void {
    this.startedAt = this.time.now

    // — Branded static backdrop (φθηνό, χωρίς tweens) —
    const bg = this.add.graphics()
    bg.fillGradientStyle(COLORS.bg1, COLORS.bg1, COLORS.bg0, COLORS.bg0, 1)
    bg.fillRect(0, 0, GAME_W, GAME_H)

    const cx = GAME_W / 2
    const by = GAME_H / 2 + 28
    const bw = 420
    const bx = cx - bw / 2

    label(this, cx, by - 96, t(UI.mission), { family: MONO, size: 14, bold: true, color: COLORS.accent, align: 'center' })
    const title = this.add.text(cx, by - 64, `🔍  ${t(UI.title)}`, { fontFamily: FONT, fontSize: '30px', fontStyle: 'bold', color: css(COLORS.ink) }).setOrigin(0.5)
    title.setShadow(0, 0, css(COLORS.accent), 18)
    const ul = this.add.graphics()
    ul.fillStyle(COLORS.accent, 1).fillRoundedRect(cx - 48, by - 34, 96, 3, 2)

    const frame = this.add.graphics()
    frame.fillStyle(COLORS.black, 0.35).fillRoundedRect(bx, by, bw, 16, 8)
    frame.lineStyle(1.5, COLORS.panelBorder, 1).strokeRoundedRect(bx, by, bw, 16, 8)

    this.bar = this.add.graphics()
    this.pct = this.add.text(cx, by + 34, `${t(UI.loading)} 0%`, { fontFamily: MONO, fontSize: '14px', color: css(COLORS.inkMuted) }).setOrigin(0.5)
    this.feedText = this.add.text(cx, by + 62, '', { fontFamily: MONO, fontSize: '12px', color: css(COLORS.accent) }).setOrigin(0.5)

    const drawBar = (v: number): void => {
      this.bar.clear()
      this.bar.fillStyle(COLORS.accent, 1)
      this.bar.fillRoundedRect(bx + 3, by + 3, Math.max(0, (bw - 6) * v), 10, 5)
    }

    const getLog = (val: number): string => {
      const lang = getLang()
      if (val < 0.25) return lang === 'el' ? 'ΣΥΝΔΕΣΗ ΜΕ ΔΟΡΥΦΟΡΟ CP TEAM...' : 'ESTABLISHING SAT-LINK TO CP TEAM...'
      if (val < 0.5) return lang === 'el' ? 'ΦΟΡΤΩΣΗ ΓΕΩΓΡΑΦΙΚΩΝ ΔΕΔΟΜΕΝΩΝ...' : 'DOWNLOADING DISTRICT MAP GRIDS...'
      if (val < 0.75) return lang === 'el' ? 'ΑΝΑΚΤΗΣΗ ΦΑΚΕΛΩΝ ΥΠΟΘΕΣΗΣ...' : 'DECRYPTING CASE ARCHIVES...'
      if (val < 0.95) return lang === 'el' ? 'ΣΥΓΧΡΟΝΙΣΜΟΣ ΣΤΟΙΧΕΙΩΝ...' : 'SYNCHRONIZING EVIDENCE DOSSIERS...'
      return lang === 'el' ? 'ΣΥΣΤΗΜΑΤΑ ΣΕ ΕΤΟΙΜΟΤΗΤΑ. ΕΚΚΙΝΗΣΗ.' : 'SYSTEMS ONLINE. READY FOR DEPLOYMENT.'
    }

    this.load.on('progress', (v: number) => {
      drawBar(v)
      if (!this.failed) {
        this.pct.setText(`${t(UI.loading)} ${Math.round(v * 100)}%`)
        this.feedText.setText(`[ ${getLog(v)} ]`)
      }
    })
    this.load.on('complete', () => drawBar(1))

    // — Error-proofing: never silently black-screen —
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      if (this.failed) return
      this.failed = true
      this.pct.setColor(css(COLORS.danger)).setText(`⚠ ${t(UI.loadError)}`)
      this.pct.setFontSize(15)
      const retry = this.add.text(cx, by + 64, `↻  ${t(UI.retry)}`, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: css(COLORS.accent) }).setOrigin(0.5)
      retry.setInteractive({ useHandCursor: true })
      retry.once('pointerup', () => this.scene.restart())
      void file
    })

    this.load.image('tiles', 'assets/rpg/tiles.png')
    this.load.tilemapTiledJSON('town', 'assets/rpg/town.json')
    this.load.atlas('misa', 'assets/rpg/atlas.png', 'assets/rpg/atlas.json')
  }

  create(): void {
    if (this.failed) return // περίμενε retry

    // Texture κομφετί (frozen: key 'spark')
    const g = this.make.graphics()
    g.fillStyle(0xffffff, 1)
    g.fillRoundedRect(0, 0, 12, 8, 2)
    g.generateTexture('spark', 12, 8)
    g.destroy()

    // Animations χαρακτήρα (frozen: misa-{dir}-walk.000..003)
    const dirs = ['left', 'right', 'front', 'back'] as const
    for (const d of dirs) {
      this.anims.create({
        key: `misa-${d}-walk`,
        frames: this.anims.generateFrameNames('misa', { prefix: `misa-${d}-walk.`, start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1,
      })
    }

    // Min-display ~600ms ώστε το branded splash να μη «τρεμοπαίζει» ένα frame,
    // μετά fade-out -> Title.
    const elapsed = this.time.now - this.startedAt
    const wait = Math.max(0, 600 - elapsed)
    this.time.delayedCall(wait, () => goTo(this, 'Title'))
  }
}
