import Phaser from 'phaser'
import { COLORS } from '../theme'

export interface PanelStyle {
  radius?: number
  fill?: number
  fillAlpha?: number
  stroke?: number
  strokeAlpha?: number
  strokeWidth?: number
}

export function paintRoundRect(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  style: PanelStyle = {},
): void {
  const r = style.radius ?? 16
  if (style.fill !== undefined) {
    g.fillStyle(style.fill, style.fillAlpha ?? 1)
    g.fillRoundedRect(x, y, w, h, r)
  }
  if (style.stroke !== undefined) {
    g.lineStyle(style.strokeWidth ?? 2, style.stroke, style.strokeAlpha ?? 1)
    g.strokeRoundedRect(x, y, w, h, r)
  }
}

export function addPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  style: PanelStyle = {},
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics()
  paintRoundRect(g, x, y, w, h, {
    radius: 18,
    fill: COLORS.panel,
    fillAlpha: 0.96,
    stroke: COLORS.panelBorder,
    strokeWidth: 1.5,
    ...style,
  })
  return g
}
