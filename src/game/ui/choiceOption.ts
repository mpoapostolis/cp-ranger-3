import Phaser from 'phaser'
import { sfx } from '../audio'

/**
 * Επιλογή πολλαπλής επιλογής ως HTML <button> (Tailwind) μέσα σε wrapper που
 * positionάρει το Phaser. Παιχνιδιάρικο: staggered entrance, hover lift + badge
 * wiggle, pop στο σωστό / shake στο λάθος. Ίδιο public API.
 */
const BASE =
  'cp-choice pointer-events-auto flex items-center gap-4 text-left rounded-2xl border outline-none box-border w-full'
const DEFAULT_CLS = 'bg-gradient-to-r from-[#2a2622] to-[#211e1b] border-[#3a3530] hover:border-[#10b981] hover:from-[#3a3530] hover:to-[#2a2622] cursor-pointer shadow-md'
const CORRECT_CLS = 'cp-correct bg-[#10b981]/15 border-[#10b981] cursor-default'
const WRONG_CLS = 'cp-wrong bg-[#e05a4f]/15 border-[#e05a4f] cursor-default'
const BADGE = 'cp-badge shrink-0 grid place-items-center font-extrabold rounded-xl'

export class ChoiceOption extends Phaser.GameObjects.DOMElement {
  readonly id: string
  readonly h: number
  private root: HTMLButtonElement
  private badge: HTMLDivElement
  private locked = false
  private pickCb: (id: string) => void

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, id: string, text: string, onPick: (id: string) => void) {
    const stagger = document.querySelectorAll('.cp-choice').length

    const wrap = document.createElement('div')
    wrap.style.width = `${w}px`
    wrap.style.pointerEvents = 'auto'

    const root = document.createElement('button')
    root.type = 'button'
    root.className = `${BASE} ${DEFAULT_CLS}`
    root.style.minHeight = '72px'
    root.style.padding = '16px 18px'
    root.style.animationDelay = `${stagger * 0.06}s`

    const badge = document.createElement('div')
    badge.textContent = id
    badge.className = `${BADGE} text-[#022c1b] bg-[#10b981]`
    badge.style.width = '42px'
    badge.style.height = '42px'
    badge.style.fontSize = '20px'

    const span = document.createElement('div')
    span.textContent = text
    span.className = 'text-[#eaf1fb] leading-snug'
    span.style.fontSize = '18px'

    root.append(badge, span)
    wrap.appendChild(root)
    super(scene, x, y, wrap)
    this.setOrigin(0, 0)

    this.id = id
    this.root = root
    this.badge = badge
    this.pickCb = onPick
    root.addEventListener('click', (e) => {
      e.preventDefault()
      if (this.locked) return
      sfx.click()
      this.pickCb(this.id)
    })
    root.addEventListener('pointerenter', () => {
      if (!this.locked) sfx.hover()
    })

    scene.add.existing(this)
    this.h = Math.max(72, wrap.offsetHeight)
  }

  lock(): this {
    this.locked = true
    this.root.style.cursor = 'default'
    return this
  }

  markCorrect(): this {
    this.locked = true
    this.root.className = `${BASE} ${CORRECT_CLS}`
    this.badge.className = `${BADGE} text-[#06351f] bg-[#10b981]`
    return this
  }

  markWrong(): this {
    this.locked = true
    this.root.className = `${BASE} ${WRONG_CLS}`
    this.badge.className = `${BADGE} text-white bg-[#e05a4f]`
    return this
  }

  dim(): this {
    this.locked = true
    this.root.style.opacity = '0.4'
    return this
  }
}
