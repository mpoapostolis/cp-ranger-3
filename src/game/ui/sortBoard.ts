import Phaser from 'phaser'
import { COLORS, DEPTH, MONO, css, shade } from '../theme'
import { label } from './text'
import { t, UI } from '../lang'
import type { SortCard, SortCategory } from '../types'

const GAP = 16
const HEADER_H = 64
const CARD_GAP = 7
const CARD_PAD_Y = 12

class CardObj extends Phaser.GameObjects.Container {
  readonly cardId: string
  readonly correctCat: string
  zone = 'T'
  readonly ch: number
  private cw: number
  private bg: Phaser.GameObjects.Graphics
  private stripeColor: number = COLORS.inkDim

  constructor(scene: Phaser.Scene, w: number, data: SortCard, onDrop: (c: CardObj) => void) {
    super(scene, 0, 0)
    this.cardId = data.id
    this.correctCat = data.category
    this.cw = w

    const txt = label(scene, 16, 0, t(data.text), { wrap: w - 28, size: 13.5, lineSpacing: 3 })
    this.ch = Math.max(44, txt.height + CARD_PAD_Y * 2)
    txt.setY((this.ch - txt.height) / 2)

    this.bg = scene.add.graphics()
    this.add([this.bg, txt])
    this.paint(false)

    this.setSize(w, this.ch)
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, this.ch), Phaser.Geom.Rectangle.Contains)
    scene.input.setDraggable(this)
    if (this.input) this.input.cursor = 'grab'

    this.on('dragstart', () => {
      this.setDepth(DEPTH.fx)
      this.paint(true)
      scene.tweens.add({ targets: this, scale: 1.05, duration: 90 })
    })
    this.on('drag', (_p: Phaser.Input.Pointer, dx: number, dy: number) => {
      this.x = dx
      this.y = dy
    })
    this.on('dragend', () => {
      scene.tweens.add({ targets: this, scale: 1, duration: 90 })
      this.paint(false)
      onDrop(this)
    })

    scene.add.existing(this)
  }

  setStripe(color: number): void {
    this.stripeColor = color
    this.paint(false)
  }

  private paint(active: boolean): void {
    const g = this.bg
    g.clear()
    if (active) {
      g.fillStyle(COLORS.black, 0.3)
      g.fillRoundedRect(2, 4, this.cw, this.ch, 11)
    }
    g.fillStyle(active ? shade(COLORS.panelAlt, 0.12) : COLORS.panelAlt, 1)
    g.fillRoundedRect(0, 0, this.cw, this.ch, 11)
    g.fillStyle(this.stripeColor, 1)
    g.fillRoundedRect(0, 0, 6, this.ch, { tl: 11, bl: 11, tr: 0, br: 0 })
    g.lineStyle(active ? 2.5 : 1.5, active ? COLORS.accent : COLORS.panelBorder, active ? 1 : 0.8)
    g.strokeRoundedRect(0, 0, this.cw, this.ch, 11)
  }
}

interface Zone {
  id: string
  rect: Phaser.Geom.Rectangle
  color: number
}

/** Ταμπλό ταξινόμησης: στήλη «κάρτες» + 3 κάδοι κατηγοριών (drag & drop). */
export class SortBoard {
  private objects: Phaser.GameObjects.GameObject[] = []
  private cards: CardObj[] = []
  private zones: Zone[] = []
  private onChange: () => void
  private scene: Phaser.Scene

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    w: number,
    h: number,
    categories: SortCategory[],
    cards: SortCard[],
    onChange: () => void,
  ) {
    this.scene = scene
    this.onChange = onChange

    const colW = (w - GAP * 3) / 4
    const bodyTop = y + HEADER_H
    const bodyH = h - HEADER_H

    const columns: { id: string; label: string; color: number }[] = [
      { id: 'T', label: t(UI.sortTray), color: COLORS.inkDim },
      ...categories.map((c) => ({ id: c.id, label: t(c.label), color: c.color })),
    ]

    const g = scene.add.graphics()
    this.objects.push(g)
    columns.forEach((col, i) => {
      const cx = x + i * (colW + GAP)
      g.fillStyle(COLORS.panel, 0.4)
      g.fillRoundedRect(cx, bodyTop, colW, bodyH, 12)
      g.lineStyle(1.5, col.color, i === 0 ? 0.35 : 0.6)
      g.strokeRoundedRect(cx, bodyTop, colW, bodyH, 12)
      g.fillStyle(col.color, 0.16)
      g.fillRoundedRect(cx, y, colW, HEADER_H - 8, 12)
      const head = label(scene, cx + 12, y + 10, col.label, {
        size: i === 0 ? 14 : 13.5,
        bold: true,
        color: i === 0 ? COLORS.inkMuted : col.color,
        wrap: colW - 24,
        lineSpacing: 2,
      })
      this.objects.push(head)
      const rect = new Phaser.Geom.Rectangle(cx, bodyTop, colW, bodyH)
      if (i > 0) this.zones.push({ id: col.id, color: col.color, rect })
      else this.zones.unshift({ id: 'T', color: col.color, rect })
    })

    const cardW = colW - 14
    cards.forEach((cd) => {
      const card = new CardObj(scene, cardW, cd, (c) => this.handleDrop(c))
      this.cards.push(card)
      this.objects.push(card)
    })

    this.reflow()
  }

  private handleDrop(card: CardObj): void {
    const cx = card.x + (card.width as number) / 2
    const cy = card.y + card.ch / 2
    const hit = this.zones.find((z) => z.rect.contains(cx, cy))
    card.zone = hit ? hit.id : card.zone
    card.setDepth(DEPTH.content)
    this.reflow()
    this.onChange()
  }

  private reflow(): void {
    this.zones.forEach((z) => {
      const inZone = this.cards.filter((c) => c.zone === z.id)
      const n = inZone.length
      if (!n) return
      const top = z.rect.y + 12
      const bottom = z.rect.bottom - 12
      const ch = inZone[0].ch
      // Διάστημα που χωράει ΟΛΕΣ τις κάρτες μέσα στη στήλη — συμπιέζει (ελαφρύ
      // overlap σαν «βεντάλια») αν δεν χωρούν, ώστε να ΜΗΝ ξεχειλίζουν πάνω στα
      // κουμπιά του footer (8 κάρτες στη θήκη σε στενή οθόνη).
      const step = n > 1 ? Math.min(ch + CARD_GAP, Math.max(ch * 0.42, (bottom - top - ch) / (n - 1))) : ch + CARD_GAP
      inZone.forEach((c, i) => {
        c.setStripe(z.color)
        const yy = Math.min(top + i * step, bottom - ch)
        this.scene.tweens.add({ targets: c, x: z.rect.x + 7, y: yy, duration: 160, ease: 'Quad.out' })
      })
    })
  }

  allPlaced(): boolean {
    return this.cards.every((c) => c.zone !== 'T')
  }

  validate(): boolean {
    return this.cards.every((c) => c.zone === c.correctCat)
  }

  reveal(): void {
    this.cards.forEach((c) => {
      const ok = c.zone === c.correctCat
      const mark = this.scene.add
        .text(c.x + (c.width as number) - 14, c.y + c.ch / 2, ok ? '✓' : '✗', {
          fontFamily: MONO,
          fontSize: '20px',
          fontStyle: 'bold',
          color: css(ok ? COLORS.correct : COLORS.danger),
        })
        .setOrigin(1, 0.5)
        .setDepth(DEPTH.feedback)
      this.objects.push(mark)
    })
  }

  setEnabled(on: boolean): void {
    this.cards.forEach((c) => {
      if (c.input) c.input.enabled = on
    })
  }

  destroy(): void {
    this.objects.forEach((o) => o.destroy())
    this.objects = []
    this.cards = []
  }
}
