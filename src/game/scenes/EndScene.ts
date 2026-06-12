import Phaser from 'phaser'
import { COLORS, GAME_W, MONO } from '../theme'
import { paintBackdrop } from '../ui/background'
import { label } from '../ui/text'
import { Button } from '../ui/button'
import { addPanel } from '../ui/panel'
import { iconPlate, langToggle, clearDom } from '../ui/hud'
import { confettiBurst } from '../ui/reward'
import { sfx } from '../audio'
import { CASES } from '../content'
import { Progress } from '../state'
import { t, UI } from '../lang'
import { goTo, fadeIn } from '../ui/transition'

export class EndScene extends Phaser.Scene {
  constructor() {
    super('End')
  }

  create(): void {
    clearDom(this)
    Progress.markFinalDone()
    fadeIn(this)
    paintBackdrop(this, { radar: true, motes: 18 })
    langToggle(this)
    const cx = GAME_W / 2

    const plate = iconPlate(this, cx, 150, 104, '🏆', COLORS.gold)
    this.tweens.add({ targets: plate, angle: { from: -4, to: 4 }, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.inOut' })

    label(this, cx, 224, t(UI.endKicker), { family: MONO, size: 16, bold: true, color: COLORS.gold, align: 'center' })
    label(this, cx, 252, t(UI.endTitle), { size: 52, bold: true, color: COLORS.ink, align: 'center' })
    label(this, cx, 330, t(UI.endBody), { size: 19, color: COLORS.inkMuted, align: 'center', wrap: 820 })

    const bw = 540
    const bh = 92
    const bx = cx - bw / 2
    const by = 414
    addPanel(this, bx, by, bw, bh, { fill: COLORS.panel, radius: 16, stroke: COLORS.gold, strokeAlpha: 0.6 })
    label(this, bx + 28, by + 22, `🗂️  ${t(UI.casesLabel)}: ${Progress.solvedCount()}/${CASES.length}`, { size: 19, bold: true, color: COLORS.ink })
    label(this, bx + 28, by + 54, `⚖️  ${t(UI.finalDoneLabel)}`, { size: 16, color: COLORS.correct })
    label(this, bx + bw - 24, by + bh / 2, 'CP TEAM', { family: MONO, size: 16, bold: true, color: COLORS.gold }).setOrigin(1, 0.5)

    const toast = label(this, cx, 636, '', { size: 15, color: COLORS.accent, align: 'center' }).setOrigin(0.5, 0)

    new Button(this, cx - 155, 566, `${t(UI.returnRise)}  →`, {
      variant: 'primary',
      width: 290,
      height: 58,
      size: 19,
      onClick: () => {
        this.notifyHost()
        toast.setText(t(UI.riseToast))
      },
    })
    new Button(this, cx + 155, 566, t(UI.playAgain), {
      variant: 'ghost',
      width: 200,
      height: 56,
      size: 16,
      onClick: () => {
        Progress.reset()
        this.registry.set('wx', undefined)
        this.registry.set('wy', undefined)
        goTo(this, 'Title')
      },
    })

    sfx.win()
    confettiBurst(this, cx, 120)
    this.time.delayedCall(550, () => confettiBurst(this, cx - 320, 150))
    this.time.delayedCall(1100, () => confettiBurst(this, cx + 320, 150))
    this.notifyHost()
  }

  private notifyHost(): void {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'cp-detective-complete', solved: Progress.solvedCount() }, '*')
      }
    } catch {
      /* ignore */
    }
  }
}
