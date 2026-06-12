/**
 * Δίγλωσσο σύστημα (Ελληνικά / English).
 * - `Loc` = ένα κείμενο σε 2 γλώσσες.  `loc(el,en)` το φτιάχνει.
 * - `t(loc)` επιστρέφει το κείμενο στην τρέχουσα γλώσσα.
 * - `UI` = όλα τα κείμενα διεπαφής (κουμπιά, ετικέτες) δίγλωσσα.
 */

export type LangCode = 'el' | 'en'

export interface Loc {
  el: string
  en: string
}

export function loc(el: string, en: string): Loc {
  return { el, en }
}

const STORAGE_KEY = 'cp-detective-lang'
let current: LangCode = 'el'

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'el' || saved === 'en') current = saved
} catch {
  /* ignore */
}

export function getLang(): LangCode {
  return current
}

export function setLang(l: LangCode): void {
  current = l
  try {
    localStorage.setItem(STORAGE_KEY, l)
  } catch {
    /* ignore */
  }
}

export function toggleLang(): LangCode {
  setLang(current === 'el' ? 'en' : 'el')
  return current
}

/** Κείμενο στην τρέχουσα γλώσσα. */
export function t(x: Loc): string {
  return x[current]
}

/** Κείμενα διεπαφής. */
export const UI = {
  title: loc('Κλιματικός/ή Ντετέκτιβ', 'Climate Detective'),
  mission: loc('CP TEAM · ΑΠΟΣΤΟΛΗ ΚΛΙΜΑΤΟΣ', 'CP TEAM · CLIMATE MISSION'),
  tagline: loc(
    'Είσαι μέλος της CP TEAM. Εξερεύνησε την πόλη και εξιχνίασε 8 κλιματικές υποθέσεις.',
    'You are a CP TEAM agent. Explore the city and crack 8 climate cases.',
  ),
  start: loc('Ξεκίνα την έρευνα', 'Start the investigation'),
  continueGame: loc('Συνέχισε', 'Continue'),
  reset: loc('Μηδένισε την πρόοδο', 'Reset progress'),
  langName: loc('Ελληνικά', 'English'),

  // Boot loader
  loading: loc('Φόρτωση…', 'Loading…'),
  loadError: loc(
    'Σφάλμα φόρτωσης — έλεγξε τη σύνδεση και δοκίμασε ξανά.',
    'Loading failed — check your connection and try again.',
  ),

  // Κόσμος
  progress: loc('ΛΥΜΕΝΕΣ', 'SOLVED'),
  investigate: loc('Έρευνα', 'Investigate'),
  enter: loc('Είσοδος', 'Enter'),
  approach: loc('Πλησίασε ένα φωτεινό σημείο έρευνας', 'Approach a glowing investigation spot'),
  moveHint: loc('Κίνηση: WASD / βέλη ή το joystick', 'Move: WASD / arrows or the joystick'),
  solvedTag: loc('ΛΥΘΗΚΕ', 'SOLVED'),
  hq: loc('ΑΡΧΗΓΕΙΟ', 'HEADQUARTERS'),
  finalLockedHint: loc('Λύσε και τις 8 υποθέσεις', 'Solve all 8 cases first'),
  finalReady: loc('Τελική δοκιμασία — έτοιμη!', 'Final test — ready!'),
  allSolvedHint: loc('🏆 Όλες λυμένες! Πήγαινε στο Αρχηγείο ⚖️', '🏆 All solved! Head to the HQ ⚖️'),

  // Βήματα υπόθεσης
  stepFolder: loc('ΦΑΚΕΛΟΣ', 'FILE'),
  stepEvidence: loc('ΣΤΟΙΧΕΙΑ', 'EVIDENCE'),
  stepVerdict: loc('ΕΤΥΜΗΓΟΡΙΑ', 'VERDICT'),
  report: loc('ΑΝΑΦΟΡΑ ΚΕΝΤΡΟΥ ΕΛΕΓΧΟΥ', 'CONTROL CENTER REPORT'),
  material: loc('CP TEAM // ΥΛΙΚΟ', 'CP TEAM // FOOTAGE'),
  evidenceTitle: loc('Στοιχεία Ντετέκτιβ', 'Detective Evidence'),
  verdictKicker: loc('CP TEAM · Η ΕΤΥΜΗΓΟΡΙΑ', 'CP TEAM · THE VERDICT'),
  seeEvidence: loc('Δες τα στοιχεία', 'See the evidence'),
  toVerdict: loc('Στην ετυμηγορία', 'To the verdict'),
  backToMap: loc('Χάρτης', 'Map'),
  backFolder: loc('Φάκελος', 'File'),
  backEvidence: loc('Στοιχεία', 'Evidence'),
  scrollHint: loc('↕  κύλισε για περισσότερα', '↕  scroll for more'),
  checkAnswers: loc('Έλεγχος απαντήσεων', 'Check answers'),
  sortTray: loc('Κάρτες προς ταξινόμηση', 'Cards to sort'),

  // Feedback
  correctHead: loc('✓  ΣΩΣΤΟ!', '✓  CORRECT!'),
  retryHead: loc('✗  Δοκίμασε ξανά', '✗  Try again'),
  nextFolder: loc('Επόμενος φάκελος', 'Next case file'),
  toFinalTest: loc('Στην τελική δοκιμασία', 'To the final test'),
  caseMap: loc('Χάρτης υποθέσεων', 'Case map'),
  retry: loc('Προσπάθησε ξανά', 'Try again'),
  otherCase: loc('Άλλη υπόθεση', 'Another case'),

  // Τελική
  finalKicker: loc('CP TEAM · ΤΕΛΙΚΗ ΔΟΚΙΜΑΣΙΑ', 'CP TEAM · FINAL TEST'),
  finalTitle: loc('Τελική Δοκιμασία', 'Final Test'),
  complete: loc('Ολοκλήρωσε', 'Complete'),

  // Τέλος
  endKicker: loc('ΥΠΟΘΕΣΗ ΕΞΙΧΝΙΑΣΜΕΝΗ', 'CASE CLOSED'),
  endTitle: loc('Μπράβο, Ντετέκτιβ!', 'Well done, Detective!'),
  endBody: loc(
    'Έκλεισες όλους τους φακέλους και απάντησες στην τελική δοκιμασία. Η αλλαγή χρειάζεται ατομική δράση, κοινωνία ΚΑΙ πολιτική — μαζί.',
    'You closed every case file and aced the final test. Real change needs individual action, society AND policy — together.',
  ),
  casesLabel: loc('Υποθέσεις', 'Cases'),
  finalDoneLabel: loc('Τελική δοκιμασία: ολοκληρώθηκε', 'Final test: completed'),
  returnRise: loc('Επιστροφή στο Rise', 'Return to Rise'),
  playAgain: loc('Παίξε ξανά', 'Play again'),
  riseToast: loc('Σήμα ολοκλήρωσης στάλθηκε στο Rise ✓', 'Completion signal sent to Rise ✓'),

  rotate: loc(
    'Γύρνα τη συσκευή οριζόντια 📱↻ για καλύτερη εμπειρία',
    'Rotate your device to landscape 📱↻ for the best experience',
  ),
} as const
