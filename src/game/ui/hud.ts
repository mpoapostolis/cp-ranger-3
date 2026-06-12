import Phaser from 'phaser'
import { COLORS, GAME_W, MONO, FONT, DEPTH, css } from '../theme'
import { getLang, setLang } from '../lang'
import { sfx } from '../audio'
import { label } from './text'

export const MARGIN = 56
export const CONTENT_W = GAME_W - MARGIN * 2

export interface HeaderOpts {
  kicker?: string
  title: string
  titleColor?: number
}

export function pageHeader(scene: Phaser.Scene, opts: HeaderOpts): number {
  const x = MARGIN
  let y = 28
  if (opts.kicker) {
    label(scene, x, y, opts.kicker, { family: MONO, size: 14, color: COLORS.accent, bold: true })
    y += 24
  }
  label(scene, x, y, opts.title, { size: 30, bold: true, color: opts.titleColor ?? COLORS.ink, wrap: CONTENT_W })
  y += 48
  const g = scene.add.graphics()
  g.lineStyle(2, COLORS.accent, 0.3)
  g.lineBetween(x, y, GAME_W - MARGIN, y)
  g.lineStyle(3, COLORS.accent, 1)
  g.lineBetween(x, y, x + 72, y)
  return y + 26
}

export function iconPlate(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  glyph: string,
  color: number = COLORS.accent,
): Phaser.GameObjects.Container {
  const c = scene.add.container(x, y)
  const g = scene.add.graphics()
  g.fillStyle(color, 0.16)
  g.fillRoundedRect(-size / 2, -size / 2, size, size, size * 0.26)
  g.lineStyle(2, color, 0.65)
  g.strokeRoundedRect(-size / 2, -size / 2, size, size, size * 0.26)
  const tt = scene.add
    .text(0, 0, glyph, { fontFamily: FONT, fontSize: `${Math.round(size * 0.5)}px`, color: css(COLORS.ink) })
    .setOrigin(0.5)
  c.add([g, tt])
  return c
}

/** Κουμπί πλήρους οθόνης (χρήσιμο κυρίως σε mobile). */
export function fullscreenButton(scene: Phaser.Scene, x: number, y: number): void {
  const size = 36
  const c = scene.add.container(x, y).setScrollFactor(0).setDepth(DEPTH.hud)
  const g = scene.add.graphics()
  g.fillStyle(COLORS.black, 0.4)
  g.fillRoundedRect(-size / 2, -size / 2, size, size, 9)
  g.lineStyle(1.5, COLORS.inkDim, 0.7)
  g.strokeRoundedRect(-size / 2, -size / 2, size, size, 9)
  // εικονίδιο: 4 γωνίες
  g.lineStyle(2.5, COLORS.inkMuted, 1)
  const a = 9
  const i = 4
  g.lineBetween(-a, -a + i, -a, -a); g.lineBetween(-a, -a, -a + i, -a)
  g.lineBetween(a, -a + i, a, -a); g.lineBetween(a, -a, a - i, -a)
  g.lineBetween(-a, a - i, -a, a); g.lineBetween(-a, a, -a + i, a)
  g.lineBetween(a, a - i, a, a); g.lineBetween(a, a, a - i, a)
  c.add(g)
  c.setSize(size, size).setInteractive(new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size), Phaser.Geom.Rectangle.Contains)
  if (c.input) c.input.cursor = 'pointer'
  c.on('pointerup', () => {
    if (scene.scale.isFullscreen) scene.scale.stopFullscreen()
    else scene.scale.startFullscreen()
  })
}

/**
 * Καθαρίζει ΟΛΑ τα leftover DOM στοιχεία (Button/ChoiceOption) από το container
 * του Phaser. Το `removeAll(true)`/scene-shutdown ΔΕΝ αφαιρεί τα HTML nodes, κι
 * επειδή τα DOM στοιχεία ζωγραφίζονται ΠΑΝΤΑ πάνω από τον καμβά, θα «έβγαιναν»
 * σε επόμενες οθόνες. Κάθε οθόνη με DOM το καλεί στην αρχή του render.
 * (Ασφαλές: μόνο μία DOM-οθόνη είναι ενεργή κάθε στιγμή — ο κόσμος/HUD είναι canvas.)
 */
export function clearDom(scene: Phaser.Scene): void {
  const dc = scene.game.domContainer
  if (dc) dc.replaceChildren()
}

/** Κουμπί ήχου on/off. */
export function soundButton(scene: Phaser.Scene, x: number, y: number): void {
  const size = 36
  const c = scene.add.container(x, y).setScrollFactor(0).setDepth(DEPTH.hud)
  const g = scene.add.graphics()
  g.fillStyle(COLORS.black, 0.4)
  g.fillRoundedRect(-size / 2, -size / 2, size, size, 9)
  g.lineStyle(1.5, COLORS.inkDim, 0.7)
  g.strokeRoundedRect(-size / 2, -size / 2, size, size, 9)
  const tt = scene.add.text(0, 0, sfx.muted ? '🔇' : '🔊', { fontFamily: FONT, fontSize: '18px' }).setOrigin(0.5)
  c.add([g, tt])
  c.setSize(size, size).setInteractive(new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size), Phaser.Geom.Rectangle.Contains)
  if (c.input) c.input.cursor = 'pointer'
  c.on('pointerup', () => {
    const m = sfx.toggle()
    tt.setText(m ? '🔇' : '🔊')
    if (!m) sfx.click()
  })
}

/** Διακόπτης γλώσσας ΕΛ | EN (πάνω δεξιά). Κάνει restart τη σκηνή. */
export function langToggle(scene: Phaser.Scene, y = 28): void {
  const cont = scene.add.container(0, 0).setScrollFactor(0).setDepth(DEPTH.hud)
  const lang = getLang()
  const mk = (code: 'el' | 'en', txt: string): Phaser.GameObjects.Text => {
    const active = lang === code
    const tt = scene.add.text(0, 0, txt, { fontFamily: MONO, fontSize: '16px', fontStyle: 'bold', color: css(active ? COLORS.accent : COLORS.inkDim) })
    if (!active) {
      tt.setInteractive({ useHandCursor: true })
      tt.on('pointerup', () => {
        setLang(code)
        scene.scene.restart()
      })
    }
    return tt
  }
  const el = mk('el', 'ΕΛ')
  const sep = scene.add.text(0, 0, '|', { fontFamily: MONO, fontSize: '16px', color: css(COLORS.inkDim) })
  const en = mk('en', 'EN')
  const gap = 9
  const totalW = el.width + sep.width + en.width + gap * 2
  let x = GAME_W - MARGIN - totalW
  el.setPosition(x, y)
  x += el.width + gap
  sep.setPosition(x, y)
  x += sep.width + gap
  en.setPosition(x, y)
  cont.add([el, sep, en])
}
