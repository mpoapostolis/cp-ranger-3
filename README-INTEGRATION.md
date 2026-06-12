# Ενσωμάτωση — Κλιματικός/ή Ντετέκτιβ

Δίγλωσσο (EL/EN) top-down εκπαιδευτικό παιχνίδι (Phaser 3 + TypeScript). Σχεδιασμένο
να ενσωματώνεται σε LMS / Articulate Rise / SCORM / ιστοσελίδα ΕΣΠΑ έργου.

## Build

```bash
bun install      # ή npm install
bun run build    # παράγει τον φάκελο dist/
```

Το `dist/` είναι **αυτόνομο** και χρησιμοποιεί **σχετικά paths** (`base: './'`), οπότε
δουλεύει είτε στη ρίζα ενός domain είτε μέσα σε υποφάκελο/iframe.

## Ενσωμάτωση στο Articulate Rise

1. Zip τον φάκελο `dist/` (με το `index.html` στη ρίζα του zip).
2. Στο Rise: μπλοκ **«Embed» → «Web object» (Upload file)** και ανέβασε το zip.
3. Πλήρης οθόνη: λειτουργεί και το κουμπί ⛶ μέσα στο παιχνίδι.

## Σήμα ολοκλήρωσης (host integration)

Όταν ο μαθητής τελειώσει την τελική δοκιμασία, το παιχνίδι στέλνει `postMessage`
στο parent window:

```js
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'cp-detective-complete') {
    // e.data.solved === αριθμός λυμένων υποθέσεων (0–8)
    // π.χ. μαρκάρισε το SCORM lesson ως completed:
    // SCORM.set('cmi.core.lesson_status', 'completed')
  }
})
```

## Γλώσσα & πρόοδος

- Εναλλαγή γλώσσας ΕΛ/EN από το κουμπί πάνω-δεξιά (αποθηκεύεται τοπικά).
- Η πρόοδος αποθηκεύεται σε `localStorage` (κλειδί `cp-detective-progress-v1`). Σε
  πλήρως sandboxed iframe χωρίς storage, πέφτει αυτόματα σε in-memory (η πρόοδος
  κρατά μόνο για τη συνεδρία).

## Άδειες

Δες `CREDITS.md` (in-game: μενού → «ⓘ Συντελεστές & άδειες»).
