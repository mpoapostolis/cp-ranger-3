/**
 * Διαδικαστικά ηχητικά εφέ (WebAudio) — χωρίς αρχεία ήχου. Autoplay-safe + mute.
 */

let ctx: AudioContext | null = null
let muted = false

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.2, when = 0, slideTo?: number): void {
  const c = ac()
  if (!c || muted) return
  const t0 = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.03)
}

function noise(dur: number, gain = 0.15): void {
  const c = ac()
  if (!c || muted) return
  const n = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, n, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n)
  const src = c.createBufferSource()
  src.buffer = buf
  const g = c.createGain()
  g.gain.value = gain
  src.connect(g)
  g.connect(c.destination)
  src.start(c.currentTime)
}

export const sfx = {
  /** Κλήση σε πρώτη χειρονομία χρήστη (autoplay policy). */
  unlock(): void {
    const c = ac()
    if (c && c.state === 'suspended') void c.resume()
  },
  get muted(): boolean {
    return muted
  },
  toggle(): boolean {
    muted = !muted
    return muted
  },
  hover(): void {
    tone(520, 0.04, 'sine', 0.04)
  },
  click(): void {
    tone(300, 0.09, 'triangle', 0.14, 0, 200)
  },
  open(): void {
    tone(380, 0.12, 'sine', 0.13, 0, 560)
    tone(560, 0.12, 'sine', 0.09, 0.06, 820)
  },
  step(): void {
    noise(0.05, 0.035)
  },
  correct(): void {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, 'sine', 0.15, i * 0.09))
  },
  wrong(): void {
    tone(180, 0.28, 'sawtooth', 0.16, 0, 90)
    tone(120, 0.3, 'square', 0.09, 0.02)
  },
  win(): void {
    ;[523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.32, 'triangle', 0.16, i * 0.12))
  },
}
