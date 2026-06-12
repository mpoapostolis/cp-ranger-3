import Phaser from 'phaser'
import { COLORS } from '../theme'
import { label } from './text'

/** Πίνακας στοιχείων με κεφαλίδες + γραμμές, αυτόματο wrapping & ύψος. */
export class Table extends Phaser.GameObjects.Container {
  readonly h: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    totalWidth: number,
    headers: string[],
    rows: string[][],
    weights?: number[],
  ) {
    super(scene, x, y)
    const cols = headers.length
    const wts = weights && weights.length === cols ? weights : new Array(cols).fill(1)
    const sum = wts.reduce((a, b) => a + b, 0)
    const colW = wts.map((v) => (v / sum) * totalWidth)
    const colX: number[] = []
    let acc = 0
    for (let i = 0; i < cols; i++) {
      colX.push(acc)
      acc += colW[i]
    }
    const padX = 12
    const padY = 10
    const texts: Phaser.GameObjects.Text[] = []

    const headerCells = headers.map((hh, i) =>
      label(scene, colX[i] + padX, 0, hh, { wrap: colW[i] - 2 * padX, size: 15, bold: true, color: COLORS.accent }),
    )
    const headerH = Math.max(...headerCells.map((tt) => tt.height)) + padY * 2
    headerCells.forEach((tt) => tt.setY((headerH - tt.height) / 2))
    texts.push(...headerCells)

    const rowMeta: { y: number; h: number; odd: boolean }[] = []
    let yCur = headerH
    rows.forEach((row, ri) => {
      const cells = row.map((c, i) => label(scene, colX[i] + padX, 0, c, { wrap: colW[i] - 2 * padX, size: 15, color: COLORS.ink }))
      const rh = Math.max(...cells.map((tt) => tt.height)) + padY * 2
      cells.forEach((tt) => tt.setY(yCur + (rh - tt.height) / 2))
      texts.push(...cells)
      rowMeta.push({ y: yCur, h: rh, odd: ri % 2 === 1 })
      yCur += rh
    })
    const totalH = yCur

    const g = scene.add.graphics()
    g.fillStyle(COLORS.panel, 0.55)
    g.fillRoundedRect(0, 0, totalWidth, totalH, 12)
    g.fillStyle(COLORS.accent, 0.12)
    g.fillRoundedRect(0, 0, totalWidth, headerH, { tl: 12, tr: 12, bl: 0, br: 0 })
    rowMeta.forEach((m) => {
      if (m.odd) {
        g.fillStyle(COLORS.white, 0.03)
        g.fillRect(0, m.y, totalWidth, m.h)
      }
    })
    g.lineStyle(1, COLORS.panelBorder, 0.5)
    for (let i = 1; i < cols; i++) g.lineBetween(colX[i], 0, colX[i], totalH)
    g.lineBetween(0, headerH, totalWidth, headerH)
    rowMeta.forEach((m, idx) => {
      if (idx > 0) g.lineBetween(0, m.y, totalWidth, m.y)
    })
    g.lineStyle(1.5, COLORS.panelBorder, 0.9)
    g.strokeRoundedRect(0, 0, totalWidth, totalH, 12)

    this.add(g)
    this.add(texts)
    this.h = totalH
    this.setSize(totalWidth, totalH)
    scene.add.existing(this)
  }
}
