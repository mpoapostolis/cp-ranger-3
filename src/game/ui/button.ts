import Phaser from 'phaser'
import { sfx } from '../audio'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonOpts {
  width?: number
  height?: number
  variant?: ButtonVariant
  size?: number
  onClick?: () => void
}

/**
 * Κουμπί ως ΠΡΑΓΜΑΤΙΚΟ HTML <button> (Tailwind) μέσα σε wrapper που το
 * positionάρει το Phaser (this.add.dom). Τα animations/hover μπαίνουν στο
 * inner <button> (.cp-btn) — όχι στο wrapper — για να μη χαλάει το transform
 * του Phaser. Native clicks, καλά fonts.
 */
const BASE =
  'cp-btn pointer-events-auto inline-flex items-center justify-center text-center font-bold rounded-xl px-6 leading-none box-border select-none cursor-pointer outline-none whitespace-nowrap'

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'text-white bg-gradient-to-r from-[#059669] to-[#10b981] border border-white/20 shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:from-[#10b981] hover:to-[#34d399]',
  secondary: 'text-[#f5f5f4] bg-[#2a2622] border border-[#3a3530] shadow-lg shadow-black/35 hover:bg-[#342f2a] hover:text-white',
  ghost: 'text-[#a8a29e] bg-white/5 border border-[#3a3530]/70 hover:text-white',
  danger: 'text-white bg-gradient-to-b from-[#ef4444] to-[#c0392b] border border-white/40 shadow-lg',
}

export class Button extends Phaser.GameObjects.DOMElement {
  private btn: HTMLButtonElement
  private enabled = true
  private clickCb?: () => void

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, opts: ButtonOpts = {}) {
    const wrap = document.createElement('div')
    wrap.style.display = 'inline-block'
    wrap.style.pointerEvents = 'auto'

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = text
    btn.className = `${BASE} ${VARIANT[opts.variant ?? 'secondary']}`
    if (opts.width) btn.style.width = `${opts.width}px`
    btn.style.height = `${opts.height ?? 54}px`
    btn.style.fontSize = `${opts.size ?? 19}px`
    wrap.appendChild(btn)

    super(scene, x, y, wrap)
    this.btn = btn
    this.clickCb = opts.onClick
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      if (!this.enabled) return
      sfx.click()
      this.clickCb?.()
    })
    btn.addEventListener('pointerenter', () => {
      if (this.enabled) sfx.hover()
    })
    scene.add.existing(this)
  }

  setEnabled(on: boolean): this {
    this.enabled = on
    this.btn.disabled = !on
    this.btn.style.opacity = on ? '1' : '0.4'
    this.btn.style.cursor = on ? 'pointer' : 'not-allowed'
    return this
  }

  setLabel(text: string): this {
    this.btn.textContent = text
    return this
  }
}
