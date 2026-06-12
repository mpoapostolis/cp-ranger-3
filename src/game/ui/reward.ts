import Phaser from 'phaser'
import { COLORS, GAME_W, GAME_H, DEPTH } from '../theme'

export function confettiBurst(scene: Phaser.Scene, x: number = GAME_W / 2, y: number = 120): void {
  if (!scene.textures.exists('spark')) return
  const tints = [COLORS.accent, COLORS.gold, COLORS.correct, COLORS.folder, COLORS.danger, COLORS.white]
  const emitter = scene.add.particles(x, y, 'spark', {
    speed: { min: 220, max: 560 },
    angle: { min: 220, max: 320 },
    gravityY: 760,
    lifespan: { min: 900, max: 1800 },
    scale: { start: 1.1, end: 0 },
    rotate: { start: 0, end: 360 },
    tint: tints,
    emitting: false,
  })
  emitter.setDepth(DEPTH.fx)
  emitter.explode(70, x, y)
  scene.time.delayedCall(2400, () => emitter.destroy())
}

export function flash(scene: Phaser.Scene, color: number, alpha = 0.22): void {
  const r = scene.add.rectangle(0, 0, GAME_W, GAME_H, color, alpha).setOrigin(0, 0).setDepth(DEPTH.fx).setScrollFactor(0)
  scene.tweens.add({ targets: r, alpha: 0, duration: 420, ease: 'Quad.out', onComplete: () => r.destroy() })
}
