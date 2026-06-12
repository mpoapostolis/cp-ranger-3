import Phaser from 'phaser'
import { COLORS } from '../theme'

/** Ενιαίος χρόνος/χρώμα για όλες τις μεταβάσεις (fade). */
export const FADE = { dur: 220, color: COLORS.bg0 } as const

function rgb(color: number): [number, number, number] {
  return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff]
}

/**
 * Κάνει fade-out την κάμερα της τρέχουσας σκηνής και μετά ξεκινά την επόμενη.
 * Χρησιμοποιείται για ΚΑΘΕ πλοήγηση scene->scene (αντικαθιστά τα σκληρά scene.start).
 */
export function goTo<T extends object | undefined = undefined>(
  scene: Phaser.Scene,
  key: string,
  data?: T,
): void {
  const cam = scene.cameras.main
  // Re-entrancy guard: μην ξεκινήσεις δεύτερο fade/δεύτερο scene.start σε διπλό κλικ.
  if (!cam || cam.fadeEffect.isRunning) return
  const [r, g, b] = rgb(FADE.color)
  cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    scene.scene.start(key, data)
  })
  cam.fadeOut(FADE.dur, r, g, b)
}

/** Επανεκκίνηση της ΙΔΙΑΣ σκηνής με fade (π.χ. αλλαγή γλώσσας / reset). */
export function restartWithFade(scene: Phaser.Scene): void {
  const cam = scene.cameras.main
  if (!cam || cam.fadeEffect.isRunning) return
  const [r, g, b] = rgb(FADE.color)
  cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => scene.scene.restart())
  cam.fadeOut(FADE.dur, r, g, b)
}

/** Καλείται στην αρχή κάθε create(): η σκηνή εμφανίζεται με fade-in. */
export function fadeIn(scene: Phaser.Scene, dur: number = FADE.dur): void {
  const cam = scene.cameras.main
  if (!cam) return
  const [r, g, b] = rgb(FADE.color)
  cam.fadeIn(dur, r, g, b)
}

/**
 * Crossfade περιεχομένου ΜΕΣΑ στην ίδια σκηνή (αλλαγή βήματος υπόθεσης):
 * το νέο container ξεκινά αόρατο και εμφανίζεται απαλά. (Το παλιό έχει ήδη
 * αφαιρεθεί από το resetScene, οπότε φτάνει ένα fade-in.)
 */
export function fadeInContainer(
  scene: Phaser.Scene,
  obj: Phaser.GameObjects.Components.AlphaSingle,
  dur = 180,
): void {
  obj.setAlpha(0)
  scene.tweens.add({ targets: obj, alpha: 1, duration: dur, ease: 'Quad.out' })
}
