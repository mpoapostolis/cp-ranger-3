import Phaser from 'phaser'
import { CASES } from '../content'
import { Progress } from '../state'
import { getLang, setLang, t, UI, loc } from '../lang'
import { sfx } from '../audio'
import type { Loc } from '../lang'
import type { WorldScene } from './WorldScene'

/**
 * HUD του κόσμου ως PLAIN HTML overlay μέσα στο #app (άρα φαίνεται και σε
 * fullscreen), με z-index ΠΑΝΩ από τον καμβά. Θέσεις σε γωνίες με CSS (viewport),
 * όχι Phaser add.dom — απόλυτα σταθερό stacking & positioning. Native clicks/touch.
 */
const ICON_BTN =
  'cp-btn pointer-events-auto w-10 h-10 grid place-items-center rounded-xl bg-black/55 backdrop-blur-md border border-[#3a3530] text-[#cfe0f5] text-lg hover:text-white hover:border-[#10b981] shadow-md'

function checkMobile(scene: Phaser.Scene): boolean {
  return (
    !scene.sys.game.device.os.desktop ||
    scene.sys.game.device.input.touch ||
    'ontouchstart' in window ||
    (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 0)
  )
}

export class UIScene extends Phaser.Scene {
  private joyVec = new Phaser.Math.Vector2(0, 0)
  private joyId: number | null = null
  private hud!: HTMLDivElement
  private thumb!: HTMLDivElement
  private interactEl!: HTMLButtonElement
  private promptEl!: HTMLDivElement
  private hintEl!: HTMLDivElement
  private shownKey: string | null = null
  private onMove!: (e: PointerEvent) => void
  private onUp!: (e: PointerEvent) => void

  constructor() {
    super('Ui')
  }

  create(): void {
    this.shownKey = null
    this.joyVec.set(0, 0)
    document.getElementById('cp-hud')?.remove()

    const lang = getLang()
    const isMobile = checkMobile(this)
    const solved = Progress.solvedCount()
    const total = CASES.length
    const elActive = lang === 'el'

    const hud = document.createElement('div')
    hud.id = 'cp-hud'
    hud.style.cssText = 'position:absolute;inset:0;z-index:40;pointer-events:none;font-family:\'Chakra Petch\',Inter,system-ui,sans-serif'
    hud.innerHTML = `
      <div style="position:absolute;left:24px;top:16px" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/55 backdrop-blur-md border border-[#10b981]/40 text-[#eaf1fb] font-bold text-lg shadow-lg">
        🗂 <span>${t(UI.progress)} ${solved}/${total}</span>
      </div>
      <div style="position:absolute;right:24px;top:16px" class="flex items-center gap-2">
        <button id="cp-sound" class="${ICON_BTN}">${sfx.muted ? '🔇' : '🔊'}</button>
        <button id="cp-full" class="${ICON_BTN}">⛶</button>
        <div class="pointer-events-auto flex items-center gap-2 px-3 h-10 rounded-xl bg-black/55 backdrop-blur-md border border-[#3a3530] font-bold shadow-md">
          <button id="cp-el" class="${elActive ? 'text-[#10b981]' : 'text-[#78716c] hover:text-white'}">ΕΛ</button>
          <span class="text-[#78716c]">|</span>
          <button id="cp-en" class="${!elActive ? 'text-[#10b981]' : 'text-[#78716c] hover:text-white'}">EN</button>
        </div>
      </div>
      <div id="cp-joy" style="position:absolute;left:32px;bottom:32px;width:150px;height:150px;touch-action:none;display:${isMobile ? 'block' : 'none'}" class="pointer-events-auto rounded-full bg-black/35 backdrop-blur-[4px] border-2 border-[#10b981]/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div id="cp-thumb" style="position:absolute;left:50%;top:50%;width:66px;height:66px;transform:translate(-50%,-50%)" class="rounded-full bg-[#10b981]/90 shadow-lg"></div>
      </div>
      <button id="cp-interact" style="position:absolute;right:36px;bottom:40px;width:104px;height:104px;display:${isMobile ? 'grid' : 'none'}" class="cp-btn pointer-events-auto rounded-full grid place-items-center text-4xl border-2"></button>
      <div id="cp-prompt" style="position:absolute;left:50%;bottom:158px;white-space:nowrap" class="cp-prompt px-6 py-3 rounded-2xl bg-black/75 backdrop-blur-md border border-[#10b981]/50 text-[#eaf1fb] font-bold text-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)]">…</div>
      <div id="cp-hint" style="position:absolute;left:50%;bottom:46px;transform:translateX(-50%);white-space:nowrap;text-shadow:0 2px 4px #000" class="text-[#a8a29e] text-sm">${isMobile ? t(UI.moveHint) : t(loc('Κίνηση: WASD / βέλη', 'Move: WASD / arrows'))}</div>
    `
    const app = document.getElementById('app') ?? document.body
    app.appendChild(hud)
    this.hud = hud

    this.thumb = hud.querySelector('#cp-thumb') as HTMLDivElement
    this.interactEl = hud.querySelector('#cp-interact') as HTMLButtonElement
    this.promptEl = hud.querySelector('#cp-prompt') as HTMLDivElement
    this.hintEl = hud.querySelector('#cp-hint') as HTMLDivElement
    this.setInteractEnabled(false, '🔍')

    // — joystick (screen-space pointer math) —
    const joy = hud.querySelector('#cp-joy') as HTMLDivElement
    const RADIUS_LOCAL = 50
    const apply = (e: PointerEvent): void => {
      const r = joy.getBoundingClientRect()
      const rad = r.width / 2
      let dx = e.clientX - (r.left + rad)
      let dy = e.clientY - (r.top + rad)
      const len = Math.hypot(dx, dy)
      if (len > rad) {
        dx = (dx / len) * rad
        dy = (dy / len) * rad
      }
      this.joyVec.set(dx / rad, dy / rad)
      this.thumb.style.transform = `translate(calc(-50% + ${this.joyVec.x * RADIUS_LOCAL}px), calc(-50% + ${this.joyVec.y * RADIUS_LOCAL}px))`
    }
    const resetJoy = (): void => {
      this.joyId = null
      this.joyVec.set(0, 0)
      this.thumb.style.transform = 'translate(-50%, -50%)'
    }
    joy.addEventListener('pointerdown', (e) => {
      this.joyId = e.pointerId
      apply(e)
    })
    this.onMove = (e: PointerEvent): void => {
      if (e.pointerId === this.joyId) apply(e)
    }
    this.onUp = (e: PointerEvent): void => {
      if (e.pointerId === this.joyId) resetJoy()
    }
    window.addEventListener('pointermove', this.onMove)
    window.addEventListener('pointerup', this.onUp)
    window.addEventListener('pointercancel', this.onUp)

    // — buttons —
    this.interactEl.addEventListener('click', () => (this.scene.get('World') as WorldScene).requestInteract())
    ;(hud.querySelector('#cp-sound') as HTMLButtonElement).addEventListener('click', (e) => {
      const m = sfx.toggle()
      ;(e.currentTarget as HTMLButtonElement).textContent = m ? '🔇' : '🔊'
      if (!m) sfx.click()
    })
    ;(hud.querySelector('#cp-full') as HTMLButtonElement).addEventListener('click', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen()
      else this.scale.startFullscreen()
    })
    const relang = (code: 'el' | 'en') => () => {
      if (getLang() === code) return
      setLang(code)
      sfx.click()
      ;(this.scene.get('World') as Phaser.Scene).scene.restart()
    }
    ;(hud.querySelector('#cp-el') as HTMLButtonElement).addEventListener('click', relang('el'))
    ;(hud.querySelector('#cp-en') as HTMLButtonElement).addEventListener('click', relang('en'))

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.teardown())
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.teardown())
  }

  private teardown(): void {
    window.removeEventListener('pointermove', this.onMove)
    window.removeEventListener('pointerup', this.onUp)
    window.removeEventListener('pointercancel', this.onUp)
    this.hud?.remove()
  }

  private setInteractEnabled(on: boolean, glyph: string): void {
    this.interactEl.textContent = glyph
    this.interactEl.disabled = !on
    const isMobile = checkMobile(this)
    this.interactEl.style.display = isMobile ? 'grid' : 'none'
    if (on) {
      this.interactEl.style.background = 'linear-gradient(135deg, #10b981, #059669)'
      this.interactEl.style.borderColor = '#ffffff'
      this.interactEl.style.opacity = '1'
      this.interactEl.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)'
    } else {
      this.interactEl.style.background = 'rgba(33, 30, 27, 0.8)'
      this.interactEl.style.borderColor = '#3a3530'
      this.interactEl.style.opacity = '0.5'
      this.interactEl.style.boxShadow = 'none'
    }
  }

  /** Διάνυσμα κίνησης από το (DOM) joystick. */
  vector(): Phaser.Math.Vector2 {
    return this.joyVec
  }

  hideMoveHint(): void {
    if (this.hintEl && this.hintEl.style.opacity !== '0') {
      this.hintEl.style.transition = 'opacity .5s'
      this.hintEl.style.opacity = '0'
    }
  }

  showPrompt(p: { key: string; title: Loc; isHq: boolean; locked?: boolean } | null): void {
    const key = p ? p.key : null
    if (key === this.shownKey) return
    this.shownKey = key
    if (!this.interactEl) return
    if (p) {
      if (p.locked) {
        this.setInteractEnabled(false, '🔒')
        this.promptEl.textContent = `🔒  ${t(UI.finalLockedHint)}`
      } else {
        const isMobile = checkMobile(this)
        this.setInteractEnabled(isMobile, p.isHq ? '⚖️' : '🔍')
        const suffix = isMobile ? '' : ' [E / SPACE]'
        this.promptEl.textContent = `${t(p.title)}    ▸ ${t(p.isHq ? UI.enter : UI.investigate)}${suffix}`
      }
      this.promptEl.classList.add('cp-prompt-visible')
    } else {
      this.setInteractEnabled(false, '🔍')
      this.promptEl.classList.remove('cp-prompt-visible')
    }
  }
}
