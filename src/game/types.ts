/**
 * Τύποι περιεχομένου (data-driven). Κάθε κείμενο είναι `Loc` (EL + EN).
 */

import type { Loc } from './lang'

export interface BulletBlock {
  kind: 'bullets'
  title?: Loc
  items: Loc[]
  /** Πράσινα ✓ αντί για ουδέτερες κουκκίδες. */
  positive?: boolean
}

export interface TableBlock {
  kind: 'table'
  title?: Loc
  headers: Loc[]
  rows: Loc[][]
  /** Σχετικά πλάτη στηλών. */
  weights?: number[]
  note?: Loc
}

export interface NoteBlock {
  kind: 'note'
  text: Loc
}

export type EvidenceBlock = BulletBlock | TableBlock | NoteBlock

export interface Choice {
  id: string
  text: Loc
}

export interface ChoiceVerdict {
  type: 'choice'
  prompt: Loc
  choices: Choice[]
  correctId: string
  positive: Loc
  negative: Loc
}

export interface SortCard {
  id: string
  text: Loc
  category: string
}

export interface SortCategory {
  id: string
  label: Loc
  color: number
}

export interface SortVerdict {
  type: 'sort'
  prompt: Loc
  instruction: Loc
  categories: SortCategory[]
  cards: SortCard[]
  positive: Loc
  negative: Loc
}

export type Verdict = ChoiceVerdict | SortVerdict

export type CaseVisual = 'icon' | 'chart'

export interface CaseData {
  id: number
  title: Loc
  folderHeader: Loc
  glyph: string
  caption?: Loc
  intro: Loc
  visual?: CaseVisual
  evidence: EvidenceBlock[]
  verdict: Verdict
  /** Θέση του σημείου έρευνας στον κόσμο (world coords). */
  spot: { x: number; y: number }
  /** Χρώμα-θέμα του σημείου/κτηρίου. */
  themeColor: number
}
