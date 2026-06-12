import Phaser from 'phaser'
import { COLORS, GAME_W, MONO, css } from '../theme'
import { paintBackdrop } from '../ui/background'
import { goTo, restartWithFade, fadeIn } from '../ui/transition'
import { openCredits } from '../ui/credits'
import { CASES } from '../content'
import { Progress } from '../state'
import { t, UI, loc, getLang, setLang } from '../lang'
import { sfx } from '../audio'
import { clearDom } from '../ui/hud'

export class TitleScene extends Phaser.Scene {
  private root!: HTMLDivElement

  constructor() {
    super('Title')
  }

  create(): void {
    clearDom(this)
    document.getElementById('cp-title-screen')?.remove()

    // 1. Paint background graphics on the canvas (radar grid + cyber-embers)
    fadeIn(this)
    paintBackdrop(this, { radar: true, motes: 20 })

    const cx = GAME_W / 2
    const ry = 416

    const radarGrid = this.add.graphics().setDepth(1.2)
    radarGrid.lineStyle(1.5, COLORS.accent, 0.08)
    for (const radius of [50, 110, 170, 230]) {
      radarGrid.strokeCircle(cx, ry, radius)
    }
    radarGrid.lineStyle(1, COLORS.accent, 0.05)
    radarGrid.lineBetween(cx - 250, ry, cx + 250, ry)
    radarGrid.lineBetween(cx, ry - 250, cx, ry + 250)

    const ticks = ['N', 'E', 'S', 'W']
    const offsets = [
      { x: cx, y: ry - 245 },
      { x: cx + 245, y: ry },
      { x: cx, y: ry + 245 },
      { x: cx - 245, y: ry }
    ]
    ticks.forEach((tick, idx) => {
      const pos = offsets[idx]!
      this.add.text(pos.x, pos.y, tick, {
        fontFamily: MONO,
        fontSize: '11px',
        color: css(COLORS.accent),
      }).setOrigin(0.5).setAlpha(0.35).setDepth(1.2)
    })

    const sweep = this.add.graphics().setDepth(1.3)
    sweep.setPosition(cx, ry)
    sweep.fillStyle(COLORS.accent, 0.05)
    sweep.slice(0, 0, 230, Phaser.Math.DegToRad(-15), Phaser.Math.DegToRad(15), false)
    sweep.fillPath()
    sweep.lineStyle(2, COLORS.accent, 0.35)
    sweep.lineBetween(0, 0, 230, 0)

    this.tweens.add({
      targets: sweep,
      angle: 360,
      duration: 7500,
      repeat: -1
    })

    this.add.particles(0, 0, 'spark', {
      x: { min: cx - 120, max: cx + 120 },
      y: ry + 50,
      lifespan: { min: 1400, max: 2800 },
      speedY: { min: -60, max: -20 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: COLORS.accent,
      quantity: 1,
      frequency: 180,
      blendMode: 'ADD',
    }).setDepth(1.4)

    // 2. Build the HTML UI Overlay (perfect viewport scaling & touch event routing)
    const root = document.createElement('div')
    root.id = 'cp-title-screen'
    root.className = 'absolute inset-0 z-[45] flex flex-col items-center justify-between p-6 sm:p-10 text-white font-sans pointer-events-none select-none'
    root.style.fontFamily = "'Chakra Petch', sans-serif"
    ;(document.getElementById('app') ?? document.body).appendChild(root)
    this.root = root

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.root?.remove()
    })

    this.render()
  }

  private render(): void {
    const esc = (s: string): string => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string)
    const solved = Progress.solvedCount()
    const lang = getLang()
    const elActive = lang === 'el'

    const ctrl = `🚶 ${t(loc('Κίνηση', 'Move'))}      🔍 ${t(UI.investigate)}      ⚖️ ${t(loc('Ετυμηγορία', 'Verdict'))}`

    const ICON_BTN_CLS = 'cp-btn pointer-events-auto w-10 h-10 grid place-items-center rounded-xl bg-black/55 backdrop-blur-md border border-[#3a3530] text-[#cfe0f5] text-lg hover:text-white hover:border-[#10b981] shadow-md'
    const BTN_PRIMARY_CLS = 'cp-btn pointer-events-auto w-full max-w-[340px] h-14 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-[#059669] to-[#10b981] border border-white/20 shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:from-[#10b981] hover:to-[#34d399] transition-all'
    const BTN_GHOST_CLS = 'cp-btn pointer-events-auto w-full max-w-[280px] h-10 rounded-xl font-bold text-sm text-[#a8a29e] bg-white/5 border border-[#3a3530]/70 hover:text-white transition-all'

    this.root.innerHTML = `
      <!-- Top Settings Bar -->
      <div class="w-full flex justify-between items-center pointer-events-none shrink-0">
        <div class="flex gap-2 pointer-events-auto">
          <button id="cp-sound" class="${ICON_BTN_CLS}">${sfx.muted ? '🔇' : '🔊'}</button>
          <button id="cp-full" class="${ICON_BTN_CLS}">⛶</button>
        </div>
        <div class="pointer-events-auto flex items-center gap-2 px-3 h-10 rounded-xl bg-black/55 backdrop-blur-md border border-[#3a3530] font-bold shadow-md">
          <button id="cp-el" class="${elActive ? 'text-[#10b981]' : 'text-[#78716c] hover:text-white'}">ΕΛ</button>
          <span class="text-[#78716c]">|</span>
          <button id="cp-en" class="${!elActive ? 'text-[#10b981]' : 'text-[#78716c] hover:text-white'}">EN</button>
        </div>
      </div>

      <!-- Center Logo & Subtext -->
      <div class="flex flex-col items-center text-center max-w-[800px] w-full my-auto pointer-events-none">
        <div class="font-mono text-[#10b981] text-[13px] sm:text-[15px] font-bold tracking-[0.22em] uppercase animate-pulse mb-3">${esc(t(UI.mission))}</div>
        <h1 class="text-[34px] sm:text-[52px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-[#10b981] to-[#059669] tracking-tight leading-none drop-shadow-[0_8px_20px_rgba(16,185,129,0.4)]">${esc(t(UI.title))}</h1>
        <div class="mx-auto mt-4 h-[4px] w-36 rounded-full bg-gradient-to-r from-transparent via-[#10b981] to-transparent shadow-[0_0_12px_#10b981]"></div>
        <p class="mt-5 text-[15px] sm:text-[18px] text-[#a8a29e] max-w-[720px] mx-auto leading-relaxed drop-shadow-md">${esc(t(UI.tagline))}</p>
      </div>

      <!-- Bottom Control Actions -->
      <div class="flex flex-col items-center gap-3 w-full max-w-[360px] shrink-0 pointer-events-auto">
        <div class="text-[13px] text-[#78716c] font-bold tracking-wider mb-1">${ctrl}</div>
        <button id="cp-start" class="${BTN_PRIMARY_CLS}">${solved > 0 ? t(UI.continueGame) : t(UI.start)}  →</button>
        <div class="font-mono text-[13px] text-[#78716c] mb-1">${t(UI.progress)}: ${solved}/${CASES.length}</div>
        ${
          solved > 0 || Progress.isFinalDone()
            ? `<button id="cp-reset" class="${BTN_GHOST_CLS}">${t(UI.reset)}</button>`
            : ''
        }
        <button id="cp-credits" class="${BTN_GHOST_CLS}">ⓘ ${t(loc('Συντελεστές & άδειες', 'Credits & licenses'))}</button>
      </div>
    `

    this.wire()
  }

  private wire(): void {
    const r = this.root

    r.querySelector('#cp-start')?.addEventListener('click', () => {
      sfx.click()
      goTo(this, 'World')
    })

    r.querySelector('#cp-credits')?.addEventListener('click', () => {
      openCredits()
    })

    r.querySelector('#cp-sound')?.addEventListener('click', (e) => {
      const m = sfx.toggle()
      const btn = e.currentTarget as HTMLButtonElement
      btn.textContent = m ? '🔇' : '🔊'
      if (!m) sfx.click()
    })

    r.querySelector('#cp-full')?.addEventListener('click', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen()
      else this.scale.startFullscreen()
    })

    r.querySelector('#cp-el')?.addEventListener('click', () => {
      if (getLang() === 'el') return
      setLang('el')
      sfx.click()
      this.render()
    })

    r.querySelector('#cp-en')?.addEventListener('click', () => {
      if (getLang() === 'en') return
      setLang('en')
      sfx.click()
      this.render()
    })

    r.querySelector('#cp-reset')?.addEventListener('click', () => {
      sfx.click()
      Progress.reset()
      this.registry.set('wx', undefined)
      this.registry.set('wy', undefined)
      restartWithFade(this)
    })
  }
}
