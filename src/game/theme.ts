/**
 * Κεντρικό σύστημα εμφάνισης (χρώματα, γραμματοσειρές, μεγέθη).
 * "Ντετέκτιβ + κλίμα" look: σκούρο control-room navy, manila φάκελοι, cyan CP TEAM accent.
 *
 * Τα χρώματα δίνονται ως αριθμοί (για Phaser). Το `css()` τα μετατρέπει σε "#rrggbb".
 */

export const COLORS = {
  // Φόντο / σκηνή
  bg0: 0x141210, // βαθύ warm stone (canvas base)
  bg1: 0x1d1a18, // ελαφρώς πιο ανοιχτό (gradient top)
  bg2: 0x26221f,

  // Πάνελ
  panel: 0x211e1b,
  panelAlt: 0x2a2622,
  panelBorder: 0x3a3530,
  panelGlow: 0x10b981,

  // Κείμενο
  ink: 0xf5f5f4,
  inkMuted: 0xa8a29e,
  inkDim: 0x78716c,

  // Accent (CP TEAM / τεχνολογία)
  accent: 0x10b981, // Vibrant Forest Green
  accentDeep: 0x059669,
  accentInk: 0x022c1b,

  // Φάκελος υπόθεσης (manila)
  folder: 0xe5ba73,
  folderDeep: 0xc59c59,
  folderInk: 0x4a3414,

  // Σήμανση / σημασίες
  danger: 0xef4444, // κόκκινο
  correct: 0x10b981, // πράσινο σωστό
  warn: 0xf59e0b, // πορτοκαλί
  gold: 0xe5ba73, // χρυσό / επιβράβευση

  // Κατηγορίες ταξινόμησης
  catHigh: 0xef4444, // 🔴 μεγάλος αντίκτυπος
  catMid: 0xf59e0b, // 🟡 μεσαίος
  catLow: 0x10b981, // 🟢 μικρός

  white: 0xffffff,
  black: 0x000000,
} as const

export const FONT = "'Chakra Petch', 'Inter', 'Segoe UI', system-ui, sans-serif"
export const MONO = "'Share Tech Mono', 'Courier New', ui-monospace, monospace"

/**
 * Λογικές διαστάσεις του καμβά. Ύψος σταθερό· πλάτος = ανάλογο του aspect ratio
 * του browser, ώστε με Scale.FIT να γεμίζει ΟΛΗ την οθόνη χωρίς μαύρες μπάρες.
 * (Σε portrait/ακραία αναλογία κάνουμε clamp — εκεί πιάνει το «γύρνα τη συσκευή».)
 */
export const GAME_H = 800
export const ASPECT_MIN = 1.3 // ΚΑΙ το κατώφλι του rotate-gate (style.css max-aspect-ratio: 13/10)
export const ASPECT_MAX = 2.4

/** Καθαρή συνάρτηση: λογικό πλάτος καμβά από το τρέχον aspect ratio του παραθύρου. */
export function computeGameW(): number {
  const ratio =
    typeof window !== 'undefined' && window.innerWidth && window.innerHeight
      ? window.innerWidth / window.innerHeight
      : 1.6
  return Math.round(GAME_H * Math.min(ASPECT_MAX, Math.max(ASPECT_MIN, ratio)))
}

/** Πλάτος που «παγώνει» στο load (το χρησιμοποιούν όλα τα UI αρχεία). */
export const GAME_W = computeGameW()

/**
 * Σειρές βάθους (z-order). Στον κόσμο (RPG) τα αντικείμενα ταξινομούνται κατά y
 * (0..~1300), οπότε το HUD μπαίνει πολύ ψηλά για να μένει πάντα από πάνω.
 */
export const DEPTH = {
  bg: 0,
  content: 10,
  worldMarker: 30000,
  hud: 90000,
  overlay: 90100,
  feedback: 90110,
  fx: 90200,
} as const

/** Μετατροπή αριθμητικού χρώματος σε CSS string ("#rrggbb"). */
export function css(color: number): string {
  return '#' + color.toString(16).padStart(6, '0')
}

/** Ανοιχτότερη (amount>0) / σκουρότερη (amount<0) απόχρωση, amount: -1..1. */
export function shade(color: number, amount: number): number {
  const r = (color >> 16) & 0xff
  const g = (color >> 8) & 0xff
  const b = color & 0xff
  const adj = (c: number) =>
    Math.max(
      0,
      Math.min(255, Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount))),
    )
  return (adj(r) << 16) | (adj(g) << 8) | adj(b)
}
