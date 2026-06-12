import Phaser from 'phaser'
import { clearDom } from '../ui/hud'
import { CASES } from '../content'
import { Progress } from '../state'
import { goTo } from '../ui/transition'
import { sfx } from '../audio'
import { t, UI, loc, getLang, setLang } from '../lang'
import type { CaseData, EvidenceBlock } from '../types'

const BTN_PRIMARY =
  'cp-btn pointer-events-auto inline-flex items-center justify-center gap-2 font-bold rounded-xl px-7 h-14 text-[17px] text-white bg-gradient-to-r from-[#059669] to-[#10b981] border border-white/20 shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:from-[#10b981] hover:to-[#34d399]'
const BTN_GHOST =
  'cp-btn pointer-events-auto inline-flex items-center justify-center gap-2 font-bold rounded-xl px-6 h-12 text-[15px] text-[#a8a29e] bg-white/5 border border-[#3a3530]/70 hover:bg-white/10 hover:text-white'

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string)
}

export class CaseScene extends Phaser.Scene {
  private caseData!: CaseData
  private root!: HTMLDivElement
  private step: 'file' | 'evidence' | 'verdict' = 'file'
  private sortZones: Record<string, string> = {}
  private sortSel: string | null = null

  constructor() {
    super('Case')
  }

  init(d: { caseId: number }): void {
    this.caseData = CASES.find((c) => c.id === d.caseId) ?? CASES[0]
  }

  create(): void {
    clearDom(this)
    document.getElementById('cp-case')?.remove()
    const root = document.createElement('div')
    root.id = 'cp-case'
    root.style.cssText =
      'position:absolute;inset:0;z-index:45;overflow:hidden;font-family:\'Chakra Petch\',Inter,system-ui,sans-serif;background:radial-gradient(120% 90% at 18% 0%,#26221f 0%,#1d1a18 55%,#141210 100%);animation:cp-fade .25s ease both'
    ;(document.getElementById('app') ?? document.body).appendChild(root)
    this.root = root
    window.addEventListener('keydown', this.onKey)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('keydown', this.onKey)
      this.root?.remove()
    })
    this.render('file')
  }

  // ─────────── shell ───────────

  private render(step: 'file' | 'evidence' | 'verdict'): void {
    this.step = step
    const c = this.caseData
    const steps = [
      ['file', t(UI.stepFolder)],
      ['evidence', t(UI.stepEvidence)],
      ['verdict', t(UI.stepVerdict)],
    ] as const
    const pills = steps
      .map(([k, lbl]) => `<span class="${k === step ? 'text-[#10b981]' : 'text-[#78716c]'} font-bold tracking-wider text-xs">${esc(lbl)}</span>`)
      .join('<span class="text-[#78716c]">▸</span>')
    const lang = getLang()
    const langTg = `<div class="flex items-center gap-2 font-bold"><button data-lang="el" class="${lang === 'el' ? 'text-[#10b981]' : 'text-[#78716c] hover:text-white'}">ΕΛ</button><span class="text-[#78716c]">|</span><button data-lang="en" class="${lang === 'en' ? 'text-[#10b981]' : 'text-[#78716c] hover:text-white'}">EN</button></div>`

    let body = ''
    let footer = ''
    if (step === 'file') {
      body = this.fileBody()
      footer = `${this.ghost('cp-back', '←  ' + t(UI.backToMap))}${this.primary('cp-next', t(UI.seeEvidence) + '  →')}`
    } else if (step === 'evidence') {
      body = `<div class="h-full overflow-y-auto pr-2 cp-scroll">${this.evidenceBody()}</div>`
      footer = `${this.ghost('cp-back', '←  ' + t(UI.backFolder))}${this.primary('cp-next', t(UI.toVerdict) + '  →')}`
    } else {
      body = this.verdictBody()
      footer =
        this.caseData.verdict.type === 'sort'
          ? `${this.ghost('cp-back', '←  ' + t(UI.backEvidence))}${this.primary('cp-check', t(UI.checkAnswers), true)}`
          : `${this.ghost('cp-back', '←  ' + t(UI.backEvidence))}<span></span>`
    }

    this.root.innerHTML = `
      <div class="h-full w-full max-w-[1180px] mx-auto px-7 py-6 flex flex-col gap-4" style="height:100%">
        <header class="flex items-start justify-between gap-4 shrink-0">
          <div class="min-w-0">
            <div class="font-mono text-[13px] font-bold text-[#10b981] tracking-wide truncate">${esc(t(c.folderHeader))}</div>
            <h1 class="text-[30px] sm:text-[34px] font-extrabold text-[#eaf1fb] leading-tight">${esc(t(c.title))}</h1>
            <div class="mt-2 h-1 w-16 rounded bg-[#10b981]"></div>
          </div>
          <div class="flex items-center gap-5 shrink-0 pt-1">
            <div class="hidden sm:flex items-center gap-2">${pills}</div>
            ${langTg}
          </div>
        </header>
        <main class="flex-1 min-h-0">${body}</main>
        <footer class="shrink-0 flex items-center justify-between gap-3 pt-1">${footer}</footer>
      </div>`

    this.wire()
  }

  private primary(id: string, label: string, disabled = false): string {
    return `<button id="${id}" ${disabled ? 'disabled' : ''} class="${BTN_PRIMARY}" style="${disabled ? 'opacity:.4;cursor:not-allowed' : ''}">${esc(label)}</button>`
  }
  private ghost(id: string, label: string): string {
    return `<button id="${id}" class="${BTN_GHOST}">${esc(label)}</button>`
  }

  // ─────────── ΦΑΚΕΛΟΣ ───────────

  private fileBody(): string {
    const c = this.caseData
    const visual = c.visual === 'chart' ? this.chartSvg() : `<div class="text-[120px] leading-none drop-shadow-lg">${c.glyph}</div>`
    const caption = c.caption
      ? `<div class="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-sm italic text-[#9fb2cc]">${esc(t(c.caption))}</div>`
      : ''
    const intro = esc(t(c.intro)).replace(/\n/g, '<br>')
    return `
      <div class="grid md:grid-cols-2 gap-8 h-full content-center items-center">
        <div class="relative rounded-2xl overflow-hidden border border-[#c9933b]/40 min-h-[340px] grid place-items-center shadow-lg"
             style="background:linear-gradient(160deg,#3a2f17,#241b0c)">
          <div class="absolute left-3 top-3 font-mono text-[12px] font-bold tracking-wider text-[#e6c074]">${t(UI.material)}</div>
          <div class="absolute right-3 top-3 w-2.5 h-2.5 rounded-full bg-[#e05a4f] animate-pulse"></div>
          ${visual}
          ${caption}
        </div>
        <div class="flex flex-col relative border border-[#3a3530]/60 rounded-2xl bg-[#1d1a18]/45 p-6 shadow-2xl backdrop-blur-sm">
          <!-- Cyberpunk Corner Accents -->
          <div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#10b981]/60 rounded-tl-md"></div>
          <div class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#10b981]/60 rounded-tr-md"></div>
          <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#10b981]/60 rounded-bl-md"></div>
          <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#10b981]/60 rounded-br-md"></div>

          <div class="font-mono text-[13px] font-bold tracking-wider text-[#10b981] mb-3">${t(UI.report)}</div>
          <p class="text-[19px] leading-relaxed text-[#eaf1fb]">${intro}</p>
        </div>
      </div>`
  }

  private chartSvg(): string {
    let path = 'M 20 70'
    for (let i = 1; i <= 40; i++) {
      const x = 20 + (i / 40) * 240
      const y = 70 + Math.sin(i * 0.85) * 12 + Math.cos(i * 0.42) * 7
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
    }
    return `<div class="w-[88%]">
      <div class="text-[#e05a4f] font-extrabold text-base mb-1">${esc(t(loc('«Η ΥΠΕΡΘΕΡΜΑΝΣΗ ΣΤΑΜΑΤΗΣΕ!»', '"GLOBAL WARMING HAS STOPPED!"')))}</div>
      <svg viewBox="0 0 280 120" class="w-full bg-[#0c1426] rounded-lg border border-[#e05a4f]/40">
        <line x1="20" y1="14" x2="20" y2="100" stroke="#6b7e99" stroke-width="1"/>
        <line x1="20" y1="100" x2="270" y2="100" stroke="#6b7e99" stroke-width="1"/>
        <path d="${path}" fill="none" stroke="#e05a4f" stroke-width="2.5"/>
      </svg>
      <div class="font-mono text-[11px] text-[#6b7e99] mt-1">UAH / NSSTC · 2014–2022</div>
    </div>`
  }

  // ─────────── ΣΤΟΙΧΕΙΑ ───────────

  private evidenceBody(): string {
    return this.caseData.evidence.map((b) => this.blockHtml(b)).join('')
  }

  private blockHtml(b: EvidenceBlock): string {
    if (b.kind === 'bullets') {
      const title = b.title ? `<div class="text-[17px] font-bold text-[#10b981] mb-2">${esc(t(b.title))}</div>` : ''
      const items = b.items
        .map((it) => {
          const mark = b.positive ? '<span class="text-[#10b981] font-bold">✓</span>' : '<span class="text-[#10b981]">•</span>'
          return `<li class="flex gap-3 items-start"><span class="mt-0.5">${mark}</span><span>${esc(t(it))}</span></li>`
        })
        .join('')
      return `<section class="mb-5 relative border border-[#3a3530]/50 rounded-2xl bg-[#1d1a18]/25 p-5 shadow-sm">
        <!-- cyber brackets -->
        <div class="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#10b981]/50 rounded-tl"></div>
        <div class="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#10b981]/50 rounded-br"></div>
        ${title}
        <ul class="space-y-2 text-[17px] text-[#eaf1fb]">${items}</ul>
      </section>`
    }
    if (b.kind === 'table') {
      const title = b.title ? `<div class="text-[17px] font-bold text-[#10b981] mb-2">${esc(t(b.title))}</div>` : ''
      const th = b.headers.map((hd) => `<th class="text-left font-bold text-[#10b981] px-3 py-2">${esc(t(hd))}</th>`).join('')
      const rows = b.rows
        .map(
          (r, i) =>
            `<tr class="${i % 2 ? 'bg-white/[0.03]' : ''}">${r.map((cell) => `<td class="px-3 py-2 align-top text-[#eaf1fb]">${esc(t(cell))}</td>`).join('')}</tr>`,
        )
        .join('')
      const note = b.note ? `<div class="mt-3 ${this.calloutCls()}">${esc(t(b.note))}</div>` : ''
      return `<section class="mb-5 relative border border-[#3a3530]/50 rounded-2xl bg-[#1d1a18]/25 p-5 shadow-sm">
        <!-- cyber brackets -->
        <div class="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#10b981]/50 rounded-tl"></div>
        <div class="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#10b981]/50 rounded-br"></div>
        ${title}
        <div class="rounded-xl border border-[#3a3530] overflow-hidden text-[15px]"><table class="w-full border-collapse"><thead class="bg-[#10b981]/10">${th}</thead><tbody>${rows}</tbody></table></div>
        ${note}
      </section>`
    }
    return `<section class="mb-5"><div class="${this.calloutCls()}">${esc(t(b.text))}</div></section>`
  }

  private calloutCls(): string {
    return 'rounded-xl border-l-4 border-[#10b981] bg-[#10b981]/10 px-4 py-3 text-[16px] text-[#eaf1fb]'
  }

  // ─────────── ΕΤΥΜΗΓΟΡΙΑ ───────────

  private verdictBody(): string {
    const v = this.caseData.verdict
    if (v.type === 'choice') {
      const opts = v.choices
        .map(
          (ch) =>
            `<button data-choice="${ch.id}" class="cp-choice w-full flex items-center gap-4 text-left rounded-2xl border bg-gradient-to-r from-[#2a2622] to-[#211e1b] border-[#3a3530] hover:border-[#10b981] hover:from-[#3a3530] hover:to-[#2a2622] p-4 shadow-md hover:shadow-lg hover:shadow-[#10b981]/5">
              <span class="cp-badge shrink-0 grid place-items-center w-11 h-11 rounded-xl font-extrabold text-[20px] text-[#022c1b] bg-[#10b981]">${ch.id}</span>
              <span class="text-[18px] text-[#eaf1fb] leading-snug">${esc(t(ch.text))}</span>
            </button>`,
        )
        .join('')
      return `<div class="h-full flex flex-col gap-3">
        <p class="text-[21px] font-bold text-[#eaf1fb] shrink-0">${esc(t(v.prompt))}</p>
        <div class="text-[13px] text-[#78716c] shrink-0 -mt-1">${esc(t(loc('⌨ Πλήκτρα: A–D ή 1–4', '⌨ Keys: A–D or 1–4')))}</div>
        <div class="flex-1 min-h-0 overflow-y-auto cp-scroll grid gap-3 content-start pr-1">${opts}</div>
      </div>`
    }
    // sort
    if (!Object.keys(this.sortZones).length) v.cards.forEach((cd) => (this.sortZones[cd.id] = 'T'))
    const cols = [{ id: 'T', label: t(UI.sortTray), color: '#78716c' }, ...v.categories.map((cat) => ({ id: cat.id, label: t(cat.label), color: '#' + cat.color.toString(16).padStart(6, '0') }))]
    const colHtml = cols
      .map((col) => {
        const cards = v.cards
          .filter((cd) => this.sortZones[cd.id] === col.id)
          .map((cd) => {
            const sel = this.sortSel === cd.id
            return `<button data-card="${cd.id}" class="cp-sortcard w-full text-left text-[13px] rounded-lg border px-2.5 py-2 ${sel ? 'border-[#10b981] ring-2 ring-[#10b981]/60 bg-[#2a2622]' : 'border-[#3a3530] bg-[#1d1a18]'} text-[#eaf1fb]" style="border-left:4px solid ${col.color}">${esc(t(cd.text))}</button>`
          })
          .join('')
        return `<div data-zone="${col.id}" class="cp-zone flex-1 min-w-0 flex flex-col rounded-xl border border-[#3a3530] bg-black/20 p-2 gap-1.5">
          <div class="text-[12px] font-bold mb-1 leading-tight" style="color:${col.color}">${esc(col.label).replace(/\n/g, '<br>')}</div>
          <div class="flex flex-col gap-1.5 overflow-y-auto cp-scroll">${cards}</div>
        </div>`
      })
      .join('')
    return `<div class="h-full flex flex-col gap-3">
      <p class="text-[20px] font-bold text-[#eaf1fb] shrink-0">${esc(t(v.prompt))}</p>
      <div class="text-[15px] text-[#a8a29e] shrink-0">${esc(t(v.instruction))} <span class="text-[#78716c]">— ${t(loc('πάτα κάρτα μετά κατηγορία', 'tap a card, then a category'))}</span></div>
      <div class="flex-1 min-h-0 flex gap-3">${colHtml}</div>
    </div>`
  }

  // ─────────── wiring ───────────

  private wire(): void {
    const r = this.root
    r.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) =>
      b.addEventListener('click', () => {
        const code = b.dataset.lang as 'el' | 'en'
        if (getLang() === code) return
        setLang(code)
        sfx.click()
        this.render(this.step)
      }),
    )
    r.querySelector('#cp-back')?.addEventListener('click', () => {
      sfx.click()
      if (this.step === 'file') goTo(this, 'World')
      else if (this.step === 'evidence') this.render('file')
      else this.render('evidence')
    })
    r.querySelector('#cp-next')?.addEventListener('click', () => {
      sfx.click()
      this.render(this.step === 'file' ? 'evidence' : 'verdict')
    })

    if (this.step === 'verdict') {
      const v = this.caseData.verdict
      if (v.type === 'choice') {
        r.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((b) =>
          b.addEventListener('click', () => this.answerChoice(b.dataset.choice as string)),
        )
      } else {
        r.querySelectorAll<HTMLButtonElement>('[data-card]').forEach((b) =>
          b.addEventListener('click', () => {
            sfx.hover()
            this.sortSel = this.sortSel === b.dataset.card ? null : (b.dataset.card as string)
            this.render('verdict')
          }),
        )
        r.querySelectorAll<HTMLElement>('[data-zone]').forEach((z) =>
          z.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).closest('[data-card]')) return
            if (!this.sortSel) return
            this.sortZones[this.sortSel] = z.dataset.zone as string
            this.sortSel = null
            sfx.click()
            this.render('verdict')
            this.refreshCheck()
          }),
        )
        this.refreshCheck()
        r.querySelector('#cp-check')?.addEventListener('click', () => this.checkSort())
      }
    }
  }

  private refreshCheck(): void {
    const btn = this.root.querySelector<HTMLButtonElement>('#cp-check')
    if (!btn) return
    const all = Object.values(this.sortZones).every((z) => z !== 'T')
    btn.disabled = !all
    btn.style.opacity = all ? '1' : '.4'
    btn.style.cursor = all ? 'pointer' : 'not-allowed'
  }

  // ─────────── answers ───────────

  private answerChoice(id: string): void {
    const v = this.caseData.verdict
    if (v.type !== 'choice') return
    const correct = id === v.correctId
    this.root.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((b) => {
      b.disabled = true
      b.classList.remove('hover:border-[#10b981]', 'hover:from-[#3a3530]', 'hover:to-[#2a2622]')
      const badge = b.firstElementChild as HTMLElement
      if (b.dataset.choice === id) {
        const ok = correct
        b.className = `cp-choice ${ok ? 'cp-correct' : 'cp-wrong'} w-full flex items-center gap-4 text-left rounded-2xl border p-4 ${ok ? 'bg-[#10b981]/15 border-[#10b981]' : 'bg-[#e05a4f]/15 border-[#e05a4f]'}`
        badge.style.background = ok ? '#10b981' : '#e05a4f'
        badge.style.color = ok ? '#06351f' : '#fff'
      } else {
        b.style.opacity = '0.45'
      }
    })
    sfx[correct ? 'correct' : 'wrong']()
    this.time.delayedCall(420, () => this.feedback(correct, t(correct ? v.positive : v.negative)))
  }

  private checkSort(): void {
    const v = this.caseData.verdict
    if (v.type !== 'sort') return
    const ok = v.cards.every((cd) => this.sortZones[cd.id] === cd.category)
    this.root.querySelectorAll<HTMLButtonElement>('[data-card]').forEach((b) => {
      const cd = v.cards.find((x) => x.id === b.dataset.card)
      const good = cd && this.sortZones[cd.id] === cd.category
      b.insertAdjacentHTML('beforeend', ` <span class="font-bold ${good ? 'text-[#49d18a]' : 'text-[#e05a4f]'}">${good ? '✓' : '✗'}</span>`)
    })
    sfx[ok ? 'correct' : 'wrong']()
    this.time.delayedCall(560, () => this.feedback(ok, t(ok ? v.positive : v.negative)))
  }

  // ─────────── feedback ───────────

  private feedback(correct: boolean, text: string): void {
    if (correct && !Progress.isSolved(this.caseData.id)) Progress.markSolved(this.caseData.id)
    const head = correct ? COLORS_CORRECT : COLORS_WARN
    const next = CASES.find((c) => !Progress.isSolved(c.id))
    const actions = correct
      ? `${this.ghost('fb-map', t(UI.caseMap))}${this.primary('fb-next', (next ? t(UI.nextFolder) : t(UI.toFinalTest)) + '  →')}`
      : `${this.ghost('fb-other', t(UI.otherCase))}${this.primary('fb-retry', t(UI.retry))}`

    const modal = document.createElement('div')
    modal.style.cssText = 'position:absolute;inset:0;z-index:60;display:grid;place-items:center;padding:24px;background:rgba(20,18,16,0.6);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:cp-fade .25s ease both'
    modal.innerHTML = `
      <div class="w-full max-w-[860px] rounded-3xl border bg-[#211e1b]/95 backdrop-blur-md p-9 shadow-2xl" style="border-color:${head};animation:cp-pop .3s cubic-bezier(.2,.9,.3,1.3) both">
        <div class="text-[30px] font-extrabold mb-3" style="color:${head}">${correct ? t(UI.correctHead) : t(UI.retryHead)}</div>
        <p class="text-[18px] leading-relaxed text-[#eaf1fb]">${esc(text).replace(/\n/g, '<br>')}</p>
        <div class="mt-7 flex items-center justify-between gap-3">${actions}</div>
      </div>`
    this.root.appendChild(modal)
    if (correct) this.spawnConfetti(modal)

    const go = (fn: () => void) => () => {
      sfx.click()
      fn()
    }
    modal.querySelector('#fb-map')?.addEventListener('click', go(() => goTo(this, 'World')))
    modal.querySelector('#fb-next')?.addEventListener('click', go(() => (next ? this.scene.start('Case', { caseId: next.id }) : goTo(this, 'Final'))))
    modal.querySelector('#fb-other')?.addEventListener('click', go(() => goTo(this, 'World')))
    modal.querySelector('#fb-retry')?.addEventListener('click', go(() => { modal.remove(); this.render('verdict') }))
  }

  private spawnConfetti(host: HTMLElement): void {
    const colors = ['#10b981', '#e5ba73', '#ffd35c', '#e05a4f', '#b98cff', '#ffffff']
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('span')
      s.className = 'cp-confetti'
      s.style.left = `${26 + Math.random() * 48}%`
      s.style.top = '20%'
      s.style.background = colors[i % colors.length]
      s.style.animation = `cp-confetti ${0.9 + Math.random() * 0.9}s ease-in ${Math.random() * 0.35}s forwards`
      host.appendChild(s)
      window.setTimeout(() => s.remove(), 2400)
    }
  }

  /** Πληκτρολόγιο: A–D ή 1–4 για απάντηση, Enter/→ επόμενο, ← πίσω, Escape για έξοδο. */
  private onKey = (e: KeyboardEvent): void => {
    if (!this.root) return
    if (e.key === 'Escape') {
      e.preventDefault()
      sfx.click()
      const fbMap = this.root.querySelector('#fb-map, #fb-other') as HTMLButtonElement | null
      if (fbMap) {
        fbMap.click()
      } else {
        goTo(this, 'World')
      }
      return
    }
    const fb = this.root.querySelector('#fb-next, #fb-retry') as HTMLButtonElement | null
    if (fb) {
      if (e.key === 'Enter') {
        e.preventDefault()
        fb.click()
      }
      return
    }
    if (e.key === 'ArrowLeft' && this.step !== 'file') {
      ;(this.root.querySelector('#cp-back') as HTMLButtonElement | null)?.click()
      return
    }
    if (this.step === 'verdict') {
      if (this.caseData.verdict.type === 'choice') {
        const v = this.caseData.verdict
        const up = e.key.toUpperCase()
        let id: string | null = null
        if (up === 'A' || up === 'B' || up === 'C' || up === 'D') id = up
        else if (e.key >= '1' && e.key <= '4') id = v.choices[Number(e.key) - 1]?.id ?? null
        if (id) {
          const b = this.root.querySelector(`[data-choice="${id}"]`) as HTMLButtonElement | null
          if (b && !b.disabled) {
            e.preventDefault()
            b.click()
          }
        }
      }
      return
    }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault()
      ;(this.root.querySelector('#cp-next') as HTMLButtonElement | null)?.click()
    }
  }
}

const COLORS_CORRECT = '#49d18a'
const COLORS_WARN = '#f2b347'
