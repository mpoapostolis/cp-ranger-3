/**
 * Κατάσταση προόδου του παίκτη (ποιες υποθέσεις λύθηκαν), με αποθήκευση σε
 * localStorage ώστε να επιβιώνει σε refresh. Σε sandboxed iframe (π.χ. Rise)
 * που μπλοκάρει το storage, πέφτει σιωπηλά σε in-memory λειτουργία.
 */

const STORAGE_KEY = 'cp-detective-progress-v1'

interface Progress {
  solved: number[] // ids υποθέσεων που λύθηκαν
  finalDone: boolean
}

let mem: Progress = { solved: [], finalDone: false }

function read(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Progress>
      mem = {
        solved: Array.isArray(parsed.solved) ? parsed.solved.filter((n) => typeof n === 'number') : [],
        finalDone: Boolean(parsed.finalDone),
      }
    }
  } catch {
    /* αγνόησε — μένουμε στη μνήμη */
  }
  return mem
}

function write(p: Progress): void {
  mem = p
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    /* αγνόησε */
  }
}

export const Progress = {
  isSolved(id: number): boolean {
    return read().solved.includes(id)
  },

  markSolved(id: number): void {
    const p = read()
    if (!p.solved.includes(id)) p.solved.push(id)
    write(p)
  },

  solvedCount(): number {
    return read().solved.length
  },

  /** Όλες οι υποθέσεις λύθηκαν → ξεκλειδώνει η τελική δοκιμασία. */
  allSolved(total: number): boolean {
    return read().solved.length >= total
  },

  isFinalDone(): boolean {
    return read().finalDone
  },

  markFinalDone(): void {
    const p = read()
    p.finalDone = true
    write(p)
  },

  reset(): void {
    write({ solved: [], finalDone: false })
  },
}
