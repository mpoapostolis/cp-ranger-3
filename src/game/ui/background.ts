import Phaser from 'phaser'
import { COLORS, GAME_W, GAME_H, DEPTH } from '../theme'

function glow(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number, color: number): void {
  for (let i = 6; i >= 1; i--) {
    g.fillStyle(color, 0.04)
    g.fillCircle(x, y, (r * i) / 6)
  }
}

export interface BackdropOpts {
  radar?: boolean
  motes?: number
}

/** Φόντο «κέντρου ελέγχου» για τις οθόνες μενού/υπόθεσης (όχι για τον κόσμο). */
export function paintBackdrop(scene: Phaser.Scene, opts: BackdropOpts = {}): void {
  const g = scene.add.graphics().setDepth(DEPTH.bg)
  g.fillGradientStyle(COLORS.bg1, COLORS.bg1, COLORS.bg0, COLORS.bg0, 1)
  g.fillRect(0, 0, GAME_W, GAME_H)
  glow(g, GAME_W * 0.12, GAME_H * 0.12, 360, COLORS.accent)
  glow(g, GAME_W * 0.9, GAME_H * 0.92, 420, COLORS.folder)
  g.lineStyle(1, COLORS.accent, 0.05)
  for (let x = 0; x <= GAME_W; x += 48) g.lineBetween(x, 0, x, GAME_H)
  for (let y = 0; y <= GAME_H; y += 48) g.lineBetween(0, y, GAME_W, y)

  if (opts.radar) {
    const cx = GAME_W / 2
    const cy = GAME_H / 2
    const ring = scene.add.graphics().setDepth(DEPTH.bg)
    ring.lineStyle(1.5, COLORS.accent, 0.12)
    for (const rr of [180, 320, 460]) ring.strokeCircle(cx, cy, rr)
    const sweep = scene.add.graphics().setDepth(DEPTH.bg)
    sweep.fillStyle(COLORS.accent, 0.06)
    sweep.slice(0, 0, 470, Phaser.Math.DegToRad(-18), Phaser.Math.DegToRad(18), false)
    sweep.fillPath()
    sweep.setPosition(cx, cy)
    scene.tweens.add({ targets: sweep, angle: 360, duration: 9000, repeat: -1 })
  }

  const motes = opts.motes ?? 0
  for (let i = 0; i < motes; i++) {
    const dot = scene.add.circle(
      Phaser.Math.Between(0, GAME_W),
      Phaser.Math.Between(0, GAME_H),
      Phaser.Math.Between(1, 3),
      COLORS.accent,
      Phaser.Math.FloatBetween(0.15, 0.5),
    )
    dot.setDepth(DEPTH.bg)
    scene.tweens.add({
      targets: dot,
      y: dot.y - Phaser.Math.Between(40, 120),
      alpha: 0,
      duration: Phaser.Math.Between(4000, 9000),
      delay: Phaser.Math.Between(0, 4000),
      repeat: -1,
      onRepeat: () => {
        dot.y = GAME_H + 10
        dot.x = Phaser.Math.Between(0, GAME_W)
        dot.setAlpha(Phaser.Math.FloatBetween(0.15, 0.5))
      },
    })
  }
}
