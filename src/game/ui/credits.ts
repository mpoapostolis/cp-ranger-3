import { sfx } from '../audio'
import { getLang } from '../lang'

/**
 * Διακριτική οθόνη «Συντελεστές / Credits» (HTML overlay). Νόμιμο attribution
 * για CC-BY-SA assets — μέσα στο μενού, όχι στην αρχική.
 */
export function openCredits(): void {
  document.getElementById('cp-credits')?.remove()
  const en = getLang() === 'en'
  const el = document.createElement('div')
  el.id = 'cp-credits'
  el.style.cssText =
    'position:absolute;inset:0;z-index:70;display:grid;place-items:center;padding:24px;background:rgba(20,18,16,.75);animation:cp-fade .2s ease both;font-family:\'Chakra Petch\',Inter,system-ui,sans-serif'

  const row = (icon: string, head: string, body: string) =>
    `<div class="flex gap-3 items-start"><span class="text-xl">${icon}</span><div><div class="font-bold text-[#eaf1fb]">${head}</div><div class="text-[14px] text-[#a8a29e]">${body}</div></div></div>`

  el.innerHTML = `
    <div class="w-full max-w-[640px] rounded-3xl border border-[#3a3530] bg-[#211e1b] p-8 shadow-2xl" style="animation:cp-pop .3s cubic-bezier(.2,.9,.3,1.3) both">
      <div class="font-mono text-[13px] font-bold tracking-wider text-[#10b981] mb-1">CP TEAM</div>
      <h2 class="text-[28px] font-extrabold text-[#eaf1fb] mb-5">${en ? 'Credits & Licenses' : 'Συντελεστές & Άδειες'}</h2>
      <div class="space-y-4">
        ${row('🎨', en ? 'Art (tileset & character)' : 'Γραφικά (tileset & χαρακτήρας)', 'Tuxemon project — “Misa” & town tileset · CC BY-SA 4.0 · github.com/Tuxemon/Tuxemon')}
        ${row('🎮', en ? 'Engine' : 'Μηχανή', 'Phaser 3 · MIT · phaser.io')}
        ${row('🔊', en ? 'Sound' : 'Ήχος', en ? 'Procedural (WebAudio) — original' : 'Διαδικαστικός (WebAudio) — πρωτότυπος')}
        ${row('📝', en ? 'Code & content' : 'Κώδικας & περιεχόμενο', en ? 'Original — CP TEAM' : 'Πρωτότυπο — CP TEAM')}
      </div>
      <button id="cp-credits-close" class="cp-btn pointer-events-auto mt-7 w-full h-12 rounded-xl font-bold text-white bg-gradient-to-r from-[#059669] to-[#10b981] border border-white/20 hover:from-[#10b981] hover:to-[#34d399]">${en ? 'Close' : 'Κλείσιμο'}</button>
    </div>`

  ;(document.getElementById('app') ?? document.body).appendChild(el)
  const close = () => {
    sfx.click()
    el.remove()
  }
  el.querySelector('#cp-credits-close')?.addEventListener('click', close)
  el.addEventListener('click', (e) => {
    if (e.target === el) el.remove()
  })
}
