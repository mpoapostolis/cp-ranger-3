import Phaser from 'phaser'
import { COLORS, FONT, css } from '../theme'

export interface LabelOpts {
  size?: number
  color?: number
  bold?: boolean
  italic?: boolean
  wrap?: number
  align?: 'left' | 'center' | 'right'
  lineSpacing?: number
  family?: string
  alpha?: number
}

/** Δημιουργεί κείμενο με τις προεπιλογές του παιχνιδιού (ελληνικά + wrapping). */
export function label(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  opts: LabelOpts = {},
): Phaser.GameObjects.Text {
  const style: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: opts.family ?? FONT,
    fontSize: `${opts.size ?? 20}px`,
    color: css(opts.color ?? COLORS.ink),
    align: opts.align ?? 'left',
    lineSpacing: opts.lineSpacing ?? 7,
  }
  const weight: string[] = []
  if (opts.bold) weight.push('bold')
  if (opts.italic) weight.push('italic')
  if (weight.length) style.fontStyle = weight.join(' ')
  if (opts.wrap) style.wordWrap = { width: opts.wrap, useAdvancedWrap: true }

  const tx = scene.add.text(x, y, text, style)
  if (opts.align === 'center') tx.setOrigin(0.5, 0)
  if (opts.alpha !== undefined) tx.setAlpha(opts.alpha)
  return tx
}
