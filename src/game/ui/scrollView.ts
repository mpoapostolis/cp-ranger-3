import Phaser from 'phaser'
import { COLORS } from '../theme'

/** Περιοχή με κύλιση (mask + wheel + drag) για ΜΗ-διαδραστικό περιεχόμενο. */
export class ScrollView extends Phaser.GameObjects.Container {
  readonly inner: Phaser.GameObjects.Container
  private vw: number
  private vh: number
  private maxScroll = 0
  private bar: Phaser.GameObjects.Graphics
  private maskG: Phaser.GameObjects.Graphics
  private dragging = false
  private dragStartPointer = 0
  private dragStartInner = 0

  constructor(scene: Phaser.Scene, x: number, y: number, vw: number, vh: number) {
    super(scene, x, y)
    this.vw = vw
    this.vh = vh

    const zone = scene.add.zone(0, 0, vw, vh).setOrigin(0, 0)
    zone.setInteractive()
    this.add(zone)

    this.inner = scene.add.container(0, 0)
    this.add(this.inner)

    this.maskG = scene.make.graphics()
    this.maskG.fillStyle(0xffffff)
    this.maskG.fillRect(x, y, vw, vh)
    this.inner.setMask(this.maskG.createGeometryMask())

    this.bar = scene.add.graphics()
    this.add(this.bar)

    zone.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragging = true
      this.dragStartPointer = p.y
      this.dragStartInner = this.inner.y
    })
    scene.input.on('wheel', this.onWheel)
    scene.input.on('pointermove', this.onMove)
    scene.input.on('pointerup', this.onUp)

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.input.off('wheel', this.onWheel)
      scene.input.off('pointermove', this.onMove)
      scene.input.off('pointerup', this.onUp)
      this.maskG.destroy()
    })

    scene.add.existing(this)
  }

  private inViewport(p: Phaser.Input.Pointer): boolean {
    return p.x >= this.x && p.x <= this.x + this.vw && p.y >= this.y && p.y <= this.y + this.vh
  }

  private onWheel = (p: Phaser.Input.Pointer, _o: unknown, _dx: number, dy: number): void => {
    if (!this.inViewport(p) || this.maxScroll <= 0) return
    this.inner.y = Phaser.Math.Clamp(this.inner.y - dy * 0.6, -this.maxScroll, 0)
    this.drawBar()
  }

  private onMove = (p: Phaser.Input.Pointer): void => {
    if (!this.dragging) return
    this.inner.y = Phaser.Math.Clamp(this.dragStartInner + (p.y - this.dragStartPointer), -this.maxScroll, 0)
    this.drawBar()
  }

  private onUp = (): void => {
    this.dragging = false
  }

  setContentHeight(h: number): this {
    this.maxScroll = Math.max(0, h - this.vh)
    this.inner.y = Phaser.Math.Clamp(this.inner.y, -this.maxScroll, 0)
    this.drawBar()
    return this
  }

  get scrollable(): boolean {
    return this.maxScroll > 0
  }

  private drawBar(): void {
    this.bar.clear()
    if (this.maxScroll <= 0) return
    const contentH = this.vh + this.maxScroll
    const thumbH = Math.max(40, (this.vh / contentH) * this.vh)
    const tt = -this.inner.y / this.maxScroll
    const thumbY = tt * (this.vh - thumbH)
    const bx = this.vw - 7
    this.bar.fillStyle(COLORS.panelBorder, 0.5)
    this.bar.fillRoundedRect(bx, 0, 5, this.vh, 3)
    this.bar.fillStyle(COLORS.accent, 0.85)
    this.bar.fillRoundedRect(bx, thumbY, 5, thumbH, 3)
  }
}
