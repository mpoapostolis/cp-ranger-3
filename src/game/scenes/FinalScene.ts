import Phaser from 'phaser'
import { COLORS, GAME_W, GAME_H, DEPTH } from '../theme'
import { paintBackdrop } from '../ui/background'
import { label } from '../ui/text'
import { Button } from '../ui/button'
import { ChoiceOption } from '../ui/choiceOption'
import { pageHeader, langToggle, clearDom, MARGIN, CONTENT_W } from '../ui/hud'
import { goTo, fadeIn } from '../ui/transition'
import { confettiBurst, flash } from '../ui/reward'
import { sfx } from '../audio'
import { FINAL } from '../content'
import { Progress } from '../state'
import { t, UI } from '../lang'

const FOOTER_Y = 724

export class FinalScene extends Phaser.Scene {
  private options: ChoiceOption[] = []

  constructor() {
    super('Final')
  }

  create(): void {
    fadeIn(this)
    window.addEventListener('keydown', this.onKey)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('keydown', this.onKey)
    })
    this.build()
  }

  private onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault()
      sfx.click()
      goTo(this, 'World')
    }
  }

  private build(): void {
    clearDom(this)
    this.options = []
    this.tweens.killAll()
    this.children.removeAll(true)
    paintBackdrop(this, { radar: true, motes: 14 })
    langToggle(this)
    pageHeader(this, { kicker: t(UI.finalKicker), title: t(UI.finalTitle), titleColor: COLORS.gold })

    const intro = label(this, MARGIN, 128, t(FINAL.intro), { size: 17, color: COLORS.inkMuted, wrap: CONTENT_W })
    let y = 128 + intro.height + 14

    const pad = 18
    const qtxt = label(this, MARGIN + pad + 34, y + pad, t(FINAL.quote), { size: 19, italic: true, color: COLORS.ink, wrap: CONTENT_W - pad * 2 - 44 })
    const qh = qtxt.height + pad * 2
    const qg = this.add.graphics()
    qg.fillStyle(COLORS.gold, 0.1)
    qg.fillRoundedRect(MARGIN, y, CONTENT_W, qh, 14)
    qg.fillStyle(COLORS.gold, 1)
    qg.fillRoundedRect(MARGIN, y, 5, qh, { tl: 14, bl: 14, tr: 0, br: 0 })
    qg.lineStyle(1.5, COLORS.gold, 0.4)
    qg.strokeRoundedRect(MARGIN, y, CONTENT_W, qh, 14)
    this.add.text(MARGIN + 16, y + pad - 4, '💬', { fontSize: '22px' })
    this.children.bringToTop(qtxt)
    y += qh + 18

    const prompt = label(this, MARGIN, y, t(FINAL.verdict.prompt), { size: 20, bold: true, color: COLORS.ink, wrap: CONTENT_W })
    y += prompt.height + 14

    for (const ch of FINAL.verdict.choices) {
      const opt = new ChoiceOption(this, MARGIN, y, CONTENT_W, ch.id, t(ch.text), (id) => this.answer(id))
      this.options.push(opt)
      y += opt.h + 10
    }

    new Button(this, MARGIN + 110, FOOTER_Y, `←  ${t(UI.backToMap)}`, { variant: 'ghost', width: 200, height: 48, size: 15, onClick: () => goTo(this, 'World') })
    this.cameras.main.fadeIn(160, (COLORS.bg0 >> 16) & 0xff, (COLORS.bg0 >> 8) & 0xff, COLORS.bg0 & 0xff)
  }

  private answer(id: string): void {
    const v = FINAL.verdict
    const correct = id === v.correctId
    this.options.forEach((o) => {
      o.lock()
      if (o.id === id) (correct ? o.markCorrect() : o.markWrong())
      else o.dim()
    })
    this.time.delayedCall(380, () => this.feedback(correct, t(correct ? v.positive : v.negative)))
  }

  private feedback(correct: boolean, text: string): void {
    clearDom(this)
    if (correct) Progress.markFinalDone()

    const blocker = this.add.rectangle(0, 0, GAME_W, GAME_H, COLORS.black, 0).setOrigin(0, 0).setInteractive().setDepth(DEPTH.overlay)
    const pw = 860
    const pad = 36
    const headColor = correct ? COLORS.correct : COLORS.warn
    const panel = this.add.container(GAME_W / 2, GAME_H / 2).setDepth(DEPTH.feedback)

    const body = label(this, 0, 0, text, { size: 18, color: COLORS.ink, wrap: pw - pad * 2, lineSpacing: 9 })
    const ph = pad + 46 + 18 + body.height + 34 + 56 + pad
    const left = -pw / 2
    const topp = -ph / 2

    const g = this.add.graphics()
    g.fillStyle(COLORS.black, 0.4)
    g.fillRoundedRect(left + 4, topp + 8, pw, ph, 20)
    g.fillStyle(COLORS.panel, 1)
    g.fillRoundedRect(left, topp, pw, ph, 20)
    g.lineStyle(2, headColor, 0.9)
    g.strokeRoundedRect(left, topp, pw, ph, 20)
    g.fillStyle(headColor, 1)
    g.fillRoundedRect(left, topp, pw, 6, { tl: 20, tr: 20, bl: 0, br: 0 })
    panel.add(g)
    panel.add(label(this, left + pad, topp + pad, t(correct ? UI.correctHead : UI.retryHead), { size: 30, bold: true, color: headColor }))
    body.setPosition(left + pad, topp + pad + 56)
    panel.add(body)

    const btnY = topp + ph - pad - 26
    if (correct) {
      new Button(this, GAME_W / 2 + pw / 2 - pad - 130, GAME_H / 2 + btnY, `${t(UI.complete)}  →`, { variant: 'primary', width: 260, height: 54, size: 18, onClick: () => goTo(this, 'End') })
      confettiBurst(this, GAME_W / 2, GAME_H / 2 - ph / 2)
      flash(this, COLORS.correct, 0.16)
      sfx.correct()
    } else {
      new Button(this, GAME_W / 2 + pw / 2 - pad - 120, GAME_H / 2 + btnY, t(UI.retry), { variant: 'primary', width: 240, height: 54, size: 18, onClick: () => this.build() })
      new Button(this, GAME_W / 2 + left + pad + 110, GAME_H / 2 + btnY, t(UI.backToMap), { variant: 'ghost', width: 200, height: 50, size: 15, onClick: () => goTo(this, 'World') })
      sfx.wrong()
      this.cameras.main.shake(220, 0.01)
    }

    panel.setScale(0.9).setAlpha(0)
    this.tweens.add({ targets: blocker, fillAlpha: 0.6, duration: 200 })
    this.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 240, ease: 'Back.out' })
  }
}
