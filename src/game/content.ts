/**
 * ΠΕΡΙΕΧΟΜΕΝΟ — Κλιματικός/ή Ντετέκτιβ (δίγλωσσο EL/EN).
 * Πιστή μεταφορά των 8 υποθέσεων + τελικής δοκιμασίας. Για αλλαγές κειμένων → μόνο εδώ.
 */

import { loc } from './lang'
import type { CaseData, ChoiceVerdict } from './types'

const RETRY = loc(
  'Ξαναδιάβασε τον φάκελο της υπόθεσης, συνδύασε τα στοιχεία και προσπάθησε ξανά!',
  'Re-read the case file, connect the evidence and try again!',
)

export const WORLD_W = 1920
export const WORLD_H = 1280

export const CASES: CaseData[] = [
  // ───────────────────────── Υπόθεση 1 ─────────────────────────
  {
    id: 1,
    glyph: '🌾',
    spot: { x: 300, y: 320 },
    themeColor: 0xd9b25a,
    title: loc('Το Αγρόκτημα που Αδειάζει', 'The Emptying Farm'),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Αφρική, 2023', '📂 Case File: Africa, 2023'),
    caption: loc(
      'Ξηρασία και αποτυχημένη σοδειά σε αγροτική περιοχή.',
      'Drought and failed harvest in a rural region.',
    ),
    intro: loc(
      'Οι κάτοικοι μιας αγροτικής περιοχής αναφέρουν ότι οι βροχές έρχονται αργότερα, οι θερμοκρασίες αυξάνονται, οι σοδειές μειώνονται και όλο και περισσότεροι νέοι φεύγουν προς τις πόλεις.\n🛰️ Το Κέντρο Ελέγχου ζητά ανάλυση των στοιχείων.',
      'Residents of a rural region report that the rains arrive later, temperatures are rising, harvests are shrinking and more and more young people are leaving for the cities.\n🛰️ Control Center requests an analysis of the evidence.',
    ),
    evidence: [
      {
        kind: 'bullets',
        items: [
          loc(
            '🌧️ Η εποχή βροχής ξεκινά ~3 εβδομάδες αργότερα σε σχέση με πριν 20 χρόνια',
            '🌧️ The rainy season starts ~3 weeks later than 20 years ago',
          ),
          loc('🌡️ Θερμοκρασία καλοκαιριού: +2,3°C', '🌡️ Summer temperature: +2.3°C'),
          loc('🌽 Παραγωγή καλαμποκιού: −34% σε 10 χρόνια', '🌽 Maize production: −34% over 10 years'),
          loc('🏙️ Πληθυσμός περιοχής: −18% λόγω μετανάστευσης', '🏙️ Regional population: −18% due to migration'),
          loc(
            '🌍 Εκπομπές CO₂ χώρας: μόλις 0,08 τόνοι ανά άτομο/έτος',
            '🌍 Country CO₂ emissions: only 0.08 tons per person per year',
          ),
        ],
      },
    ],
    verdict: {
      type: 'choice',
      prompt: loc(
        'Συνδύασε τα στοιχεία. Ποιες έννοιες εξηγούν καλύτερα μαζί αυτή την κατάσταση;',
        'Connect the evidence. Which concepts together best explain this situation?',
      ),
      choices: [
        { id: 'A', text: loc('Μόνο λανθασμένες αγροτικές πρακτικές.', 'Only poor farming practices.') },
        {
          id: 'B',
          text: loc(
            'Κλιματική αλλαγή (αλλαγή μοτίβων βροχόπτωσης, αύξηση θερμοκρασίας) και κλιματική αδικία.',
            'Climate change (shifting rainfall patterns, rising temperature) and climate injustice.',
          ),
        },
        {
          id: 'C',
          text: loc(
            'Κλιματική μεταβλητότητα και τυχαίες αλλαγές του καιρού.',
            'Climate variability and random weather changes.',
          ),
        },
        { id: 'D', text: loc('Υπερβολικά μεγάλη αύξηση του πληθυσμού.', 'Excessive population growth.') },
      ],
      correctId: 'B',
      positive: loc(
        'Τα στοιχεία δείχνουν ότι το κλίμα της περιοχής αλλάζει: οι βροχές μετατοπίζονται μέσα στο έτος και οι καλλιέργειες επηρεάζονται. Ταυτόχρονα, η χώρα εκπέμπει ελάχιστο CO₂ αλλά υφίσταται σοβαρές επιπτώσεις. Αυτό ονομάζεται κλιματική αδικία.',
        'The evidence shows the region\'s climate is changing: the rains shift within the year and crops suffer. At the same time, the country emits very little CO₂ yet faces severe impacts. This is called climate injustice.',
      ),
      negative: RETRY,
    },
  },

  // ───────────────────────── Υπόθεση 2 ─────────────────────────
  {
    id: 2,
    glyph: '🌡️',
    spot: { x: 980, y: 250 },
    themeColor: 0xe05a4f,
    title: loc('Η Πόλη που Καίγεται', 'The City on Fire'),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Μεσογειακή πόλη, Αύγουστος', '📂 Case File: Mediterranean city, August'),
    caption: loc('Θερμόμετρο σε κοκκινισμένη άσφαλτο — η πόλη «βράζει».', 'A thermometer on scorching asphalt — the city is boiling.'),
    intro: loc(
      'Οι αισθητήρες της CP TEAM κατέγραψαν ακραία ζέστη στην πόλη. Οι δρόμοι «καίνε», τα νοσοκομεία γεμίζουν και οι πυρκαγιές αυξάνονται.\n🛰️ Γιατί όμως το πάρκο είναι τόσο πιο δροσερό από την άσφαλτο;',
      'CP TEAM sensors recorded extreme heat in the city. The streets are "burning", hospitals are filling up, and wildfires are on the rise.\n🛰️ But why is the park so much cooler than the asphalt?',
    ),
    evidence: [
      {
        kind: 'bullets',
        items: [
          loc('🌡️ Θερμοκρασία αέρα: 43°C', '🌡️ Air temperature: 43°C'),
          loc('🛣️ Θερμοκρασία δρόμου: 65°C', '🛣️ Road temperature: 65°C'),
          loc('🌳 Θερμοκρασία πάρκου: 31°C', '🌳 Park temperature: 31°C'),
          loc('💧 Σχετική υγρασία: 12%', '💧 Relative humidity: 12%'),
          loc('🏥 Αυξημένες εισαγωγές λόγω θερμοπληξίας', '🏥 Rising hospital admissions for heatstroke'),
          loc('🔥 Καμένες εκτάσεις: +340% σε σχέση με το 2000–2010', '🔥 Burned area: +340% vs. 2000–2010'),
        ],
      },
    ],
    verdict: {
      type: 'choice',
      prompt: loc(
        'Ποιο φαινόμενο εξηγεί τη μεγάλη διαφορά θερμοκρασίας ανάμεσα στον δρόμο και το πάρκο;',
        'Which phenomenon explains the big temperature gap between the road and the park?',
      ),
      choices: [
        { id: 'A', text: loc('Οξίνιση ωκεανών', 'Ocean acidification') },
        { id: 'B', text: loc('Αποψίλωση δασών', 'Deforestation') },
        { id: 'C', text: loc('Φαινόμενο θερμοκηπίου μόνο', 'The greenhouse effect only') },
        { id: 'D', text: loc('Αστική θερμική νησίδα', 'Urban heat island') },
      ],
      correctId: 'D',
      positive: loc(
        'Σωστά! Η άσφαλτος απορροφά και επανεκπέμπει θερμότητα, δημιουργώντας την αστική θερμική νησίδα — που εντείνεται από την κλιματική αλλαγή — και οι καύσωνες γίνονται πιο επικίνδυνοι στις πόλεις. Λύση: πράσινες στέγες, δέντρα, ανακλαστικές επιφάνειες.',
        'Correct! Asphalt absorbs and re-radiates heat, so cities form an urban heat island intensified by climate change, making heatwaves more dangerous downtown. Solutions: green roofs, trees, reflective surfaces.',
      ),
      negative: RETRY,
    },
  },

  // ───────────────────────── Υπόθεση 3 ─────────────────────────
  {
    id: 3,
    glyph: '📉',
    spot: { x: 1620, y: 330 },
    themeColor: 0xf2b347,
    visual: 'chart',
    title: loc('Το Γράφημα που Παραπλανά', 'The Misleading Graph'),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Ένα ύποπτο γράφημα στο διαδίκτυο', '📂 Case File: A suspicious online graph'),
    caption: loc('«Η ΥΠΕΡΘΕΡΜΑΝΣΗ ΣΤΑΜΑΤΗΣΕ!» — ένας ύποπτος τίτλος.', '"GLOBAL WARMING HAS STOPPED!" — a suspicious headline.'),
    intro: loc(
      'Βλέπεις σε μια ιστοσελίδα ένα γράφημα με τίτλο: «Η "ΥΠΕΡΘΕΡΜΑΝΣΗ" ΣΤΑΜΑΤΗΣΕ! 2014–2022: Μηδενική άνοδος θερμοκρασίας. Οι επιστήμονες έκαναν λάθος!»',
      'On a website you see a graph titled: "GLOBAL \'WARMING\' HAS STOPPED! 2014–2022: Zero temperature rise. The scientists were wrong!"',
    ),
    evidence: [
      {
        kind: 'bullets',
        title: loc('Το γράφημα δείχνει:', 'The graph shows:'),
        items: [
          loc('Άξονας X: Σεπτέμβριος 2014 – Ιούνιος 2022 (94 μήνες)', 'X axis: September 2014 – June 2022 (94 months)'),
          loc(
            'Άξονας Y: Μεταβολή μέσης θερμοκρασίας σε °C (ξεκινά από 0,0)',
            'Y axis: change in mean temperature in °C (starts at 0.0)',
          ),
          loc('Δεδομένα: έντονα κυματιστή γραμμή με οριζόντια τάση (~−0,01°C)', 'Data: a strongly wavy line with a flat trend (~−0.01°C)'),
          loc(
            'Πηγή: UAH / NSSTC (University of Alabama in Huntsville) — πραγματική πηγή',
            'Source: UAH / NSSTC (University of Alabama in Huntsville) — a real source',
          ),
        ],
      },
    ],
    verdict: {
      type: 'choice',
      prompt: loc(
        'Πόσα τεχνάσματα παραπληροφόρησης εντοπίζεις σε αυτό το γράφημα;',
        'How many disinformation tricks can you spot in this graph?',
      ),
      choices: [
        {
          id: 'A',
          text: loc(
            'Κανένα. Η πηγή είναι αξιόπιστη, άρα τα δεδομένα αποδεικνύουν ότι η υπερθέρμανση σταμάτησε.',
            'None. The source is credible, so the data proves warming has stopped.',
          ),
        },
        {
          id: 'B',
          text: loc(
            'Ένα. Η βαθμονόμηση του άξονα Υ διαστρεβλώνει τις διακυμάνσεις της θερμοκρασίας.',
            'One. The Y-axis scaling distorts the temperature fluctuations.',
          ),
        },
        {
          id: 'C',
          text: loc(
            'Δύο. Βολικά επιλεγμένη χρονική περίοδος και παραπλανητικός τίτλος.',
            'Two. A cherry-picked time period and a misleading headline.',
          ),
        },
        {
          id: 'D',
          text: loc(
            'Τρία. Βαθμονόμηση άξονα Υ, ψεύτικη πηγή, λάθος μονάδα μέτρησης.',
            'Three. Y-axis scaling, a fake source, and the wrong unit.',
          ),
        },
      ],
      correctId: 'C',
      positive: loc(
        'Σωστά! Δύο τεχνάσματα (FLICC):\n• Cherry-picking χρονικής περιόδου — 8 χρόνια είναι κλιματολογικά ανεπαρκή· η κλιματική επιστήμη απαιτεί τουλάχιστον 30 χρόνια. Η επιλογή 2014–2022 αποκρύπτει τη μακροχρόνια αύξηση.\n• Παραπλανητική παρουσίαση — η τάση −0,01°C παρουσιάζεται ως «μηδενική άνοδος». Η πηγή (UAH) είναι πραγματική, άρα το τέχνασμα δεν είναι στα δεδομένα αλλά στον τρόπο που επιλέγονται και τιτλοφορούνται.',
        'Correct! Two tricks (FLICC):\n• Cherry-picking the period — 8 years is climatologically too short; climate science needs at least 30 years. Choosing 2014–2022 hides the long-term rise.\n• Misleading framing — a −0.01°C trend is presented as "zero rise". The source (UAH) is real, so the trick is not in the data but in how it is selected and titled.',
      ),
      negative: RETRY,
    },
  },

  // ───────────────────────── Υπόθεση 4 (ταξινόμηση) ─────────────────────────
  {
    id: 4,
    glyph: '🏠',
    spot: { x: 320, y: 720 },
    themeColor: 0x00f3ff,
    title: loc('Το Δίλημμα μιας Οικογένειας', "A Family's Dilemma"),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Η οικογένεια Παπαδόπουλου', '📂 Case File: The Papadopoulos family'),
    caption: loc(
      'Μικρές αλλαγές ή μεγάλες αποφάσεις; Τι μειώνει περισσότερο τις εκπομπές;',
      'Small changes or big decisions? What cuts emissions the most?',
    ),
    intro: loc(
      'Η οικογένεια Παπαδόπουλου θέλει να μειώσει το ανθρακικό αποτύπωμά της. Τι μειώνει όμως πραγματικά περισσότερο τις εκπομπές — οι μικρές καθημερινές αλλαγές ή οι μεγάλες αποφάσεις;',
      'The Papadopoulos family wants to cut its carbon footprint. But what really reduces emissions the most — small daily changes or big decisions?',
    ),
    evidence: [
      {
        kind: 'bullets',
        positive: true,
        title: loc('Καρτέλα Α — Έχουν ήδη κάνει «πράσινες» αλλαγές', 'Card A — They have already made "green" changes'),
        items: [
          loc('Άλλαξαν όλους τους λαμπτήρες σε LED', 'Switched all bulbs to LED'),
          loc('Ανακυκλώνουν συστηματικά', 'Recycle consistently'),
          loc('Αγοράζουν τοπικά λαχανικά', 'Buy local vegetables'),
          loc('Κάνουν σύντομα ντους', 'Take short showers'),
          loc('Χρησιμοποιούν υφασμάτινες τσάντες', 'Use cloth bags'),
        ],
      },
      {
        kind: 'bullets',
        title: loc('Όμως οι αισθητήρες κατέγραψαν επίσης:', 'But the sensors also recorded:'),
        items: [
          loc('🚗 Δύο βενζινοκίνητα ΙΧ', '🚗 Two petrol cars'),
          loc('✈️ Τρία αεροπορικά ταξίδια τον χρόνο', '✈️ Three flights per year'),
          loc('🥩 Βοδινό κρέας 5 φορές την εβδομάδα', '🥩 Beef 5 times a week'),
          loc('🔥 Θέρμανση με παλιό λέβητα πετρελαίου', '🔥 Heating with an old oil boiler'),
        ],
      },
      {
        kind: 'table',
        title: loc('Καρτέλα Β — Το αποτύπωμα της οικογένειας', 'Card B — The family\'s footprint'),
        headers: [
          loc('Δραστηριότητα', 'Activity'),
          loc('Εκπομπές CO₂/έτος', 'CO₂ emissions/year'),
          loc('Πόσο εύκολα αλλάζει;', 'How easy to change?'),
        ],
        weights: [2, 1.1, 1.3],
        rows: [
          [loc('🔥 Θέρμανση με πετρέλαιο', '🔥 Oil heating'), loc('~3,5 τόνοι', '~3.5 tons'), loc('Μέτρια δυσκολία', 'Moderate')],
          [loc('🚗 Δύο βενζινοκίνητα ΙΧ', '🚗 Two petrol cars'), loc('~4,5 τόνοι', '~4.5 tons'), loc('Μέτρια δυσκολία', 'Moderate')],
          [loc('✈️ Ταξίδι στην Ευρώπη', '✈️ Flight within Europe'), loc('~1,5–2 τόνοι', '~1.5–2 tons'), loc('Σχετικά εύκολο', 'Fairly easy')],
          [loc('🥩 Βοδινό 5×/εβδομάδα', '🥩 Beef 5×/week'), loc('~2,5 τόνοι', '~2.5 tons'), loc('Σχετικά εύκολο', 'Fairly easy')],
          [loc('✈️ Εσωτερικές πτήσεις', '✈️ Domestic flights'), loc('~0,4 τόνοι', '~0.4 tons'), loc('Σχετικά εύκολο', 'Fairly easy')],
          [loc('💡 LED λαμπτήρες', '💡 LED bulbs'), loc('~0,05 τόνοι', '~0.05 tons'), loc('✅ Έχει ήδη γίνει', '✅ Already done')],
          [loc('🛍️ Υφασμάτινες τσάντες', '🛍️ Cloth bags'), loc('~0,01 τόνοι', '~0.01 tons'), loc('✅ Έχει ήδη γίνει', '✅ Already done')],
        ],
      },
      {
        kind: 'note',
        text: loc(
          '🧠 Πού πιστεύεις ότι βρίσκεται το μεγαλύτερο μέρος του ανθρακικού αποτυπώματος αυτής της οικογένειας;',
          '🧠 Where do you think most of this family\'s carbon footprint lies?',
        ),
      },
    ],
    verdict: {
      type: 'sort',
      prompt: loc(
        'Ιεράρχησε τις δράσεις ανάλογα με το πραγματικό τους αποτέλεσμα.',
        'Rank the actions by their real impact.',
      ),
      instruction: loc('Σύρε κάθε δράση στη σωστή κατηγορία.', 'Drag each action into the correct category.'),
      categories: [
        { id: 'A', color: 0xe05a4f, label: loc('🔴 Μεγάλος αντίκτυπος\n(> 1 τόνος CO₂/έτος)', '🔴 High impact\n(> 1 ton CO₂/yr)') },
        { id: 'B', color: 0xf2b347, label: loc('🟡 Μεσαίος αντίκτυπος\n(0,1–1 τόνος/έτος)', '🟡 Medium impact\n(0.1–1 tons CO₂/yr)') },
        { id: 'C', color: 0x49d18a, label: loc('🟢 Μικρός αντίκτυπος\n(< 0,1 τόνος/έτος)', '🟢 Low impact\n(< 0.1 tons CO₂/yr)') },
      ],
      cards: [
        { id: 'c1', category: 'A', text: loc('Τρένο αντί για πτήση στην Ευρώπη', 'Train instead of a flight within Europe') },
        { id: 'c2', category: 'A', text: loc('Λιγότερο βοδινό, περισσότερα όσπρια', 'Less beef, more legumes') },
        { id: 'c3', category: 'A', text: loc('Αντλία θερμότητας αντί για πετρέλαιο', 'Heat pump instead of oil') },
        { id: 'c4', category: 'A', text: loc('Λιγότερο ΙΧ ή χρήση ΜΜΜ', 'Drive less or use public transport') },
        { id: 'c5', category: 'B', text: loc('Αντί για εσωτερική πτήση: τρένο ή λεωφορείο', 'Instead of a domestic flight: train or bus') },
        { id: 'c6', category: 'B', text: loc('Μείωση θερμοστάτη κατά 1°C', 'Lower the thermostat by 1°C') },
        { id: 'c7', category: 'C', text: loc('Υφασμάτινη τσάντα στα ψώνια', 'Cloth bag when shopping') },
        { id: 'c8', category: 'C', text: loc('LED λαμπτήρες', 'LED bulbs') },
      ],
      positive: loc(
        'Η οικογένεια έκανε ήδη πολλές θετικές κινήσεις. Όμως οι μεγαλύτερες μειώσεις συνδέονται κυρίως με: θέρμανση, αυτοκίνητα, διατροφή και αεροπορικά ταξίδια. Αυτό που παρατηρείται συχνά είναι ένα χάσμα δράσης: εστιάζουμε στις εύκολες αλλαγές κι όχι σε εκείνες με τον μεγαλύτερο αντίκτυπο.',
        'The family already made many positive moves. But the biggest reductions come mainly from: heating, cars, diet and air travel. What we often see is an "action gap": we focus on the easy changes, not the ones with the biggest impact.',
      ),
      negative: RETRY,
    },
  },

  // ───────────────────────── Υπόθεση 5 ─────────────────────────
  {
    id: 5,
    glyph: '🏙️',
    spot: { x: 1640, y: 760 },
    themeColor: 0x5b8cff,
    title: loc('Η Πόλη που Αλλάζει', 'The Changing City'),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Μεσογειακή πόλη, καλοκαίρι 2025', '📂 Case File: Mediterranean city, summer 2025'),
    caption: loc('Πυκνοδομημένη πόλη με πλατεία και ελάχιστο πράσινο.', 'A dense city with a square and very little greenery.'),
    intro: loc(
      'Νέος δήμαρχος εκλέγεται με υπόσχεση για πιο ανθεκτική και «πράσινη» πόλη. Ο δήμος έχει 2 εκατομμύρια ευρώ για έργα κλιματικής δράσης. Όμως τα προβλήματα είναι πολλά!',
      'A new mayor is elected promising a more resilient, "green" city. The municipality has €2 million for climate-action projects. But there are many problems!',
    ),
    evidence: [
      {
        kind: 'bullets',
        title: loc('Καρτέλα Α — Τα προβλήματα της πόλης', 'Card A — The city\'s problems'),
        items: [
          loc('🌧️ Το παλιό αποχετευτικό δίκτυο πλημμυρίζει σε κάθε δυνατή βροχή.', '🌧️ The old sewer network floods with every heavy downpour.'),
          loc('🏚️ Πολλά δημόσια κτήρια δεν έχουν μόνωση.', '🏚️ Many public buildings have no insulation.'),
          loc('🚗 Δεν υπάρχουν ποδηλατόδρομοι ή ασφαλείς διαδρομές πεζών.', '🚗 There are no bike lanes or safe pedestrian routes.'),
          loc('🟫 Δύο εγκαταλελειμμένα οικόπεδα μένουν άδεια στο κέντρο.', '🟫 Two abandoned plots sit empty in the center.'),
          loc('🌡️ Οι καύσωνες γίνονται όλο και πιο έντονοι.', '🌡️ Heatwaves are getting more intense.'),
        ],
      },
      {
        kind: 'table',
        title: loc('Καρτέλα Β — Τι μπορεί να κάνει ο δήμος;', 'Card B — What can the municipality do?'),
        headers: [
          loc('Επένδυση', 'Investment'),
          loc('Κόστος', 'Cost'),
          loc('Εκπομπές;', 'Emissions?'),
          loc('Καύσωνας;', 'Heatwave?'),
          loc('Πλημμύρες;', 'Floods?'),
        ],
        weights: [2.4, 1, 1, 1.2, 1.2],
        rows: [
          [loc('☀️ Φωτοβολταϊκά σε δημόσια κτήρια', '☀️ Solar PV on public buildings'), loc('~800.000€', '~€800,000'), loc('✅', '✅'), loc('❌', '❌'), loc('❌', '❌')],
          [loc('🏢 Μόνωση δημόσιων κτηρίων', '🏢 Insulating public buildings'), loc('~600.000€', '~€600,000'), loc('✅', '✅'), loc('✅ Μερικώς', '✅ Partly'), loc('❌', '❌')],
          [loc('🚰 Αναβάθμιση αποχέτευσης', '🚰 Sewer upgrade'), loc('~1.500.000€', '~€1,500,000'), loc('❌', '❌'), loc('❌', '❌'), loc('✅', '✅')],
          [loc('🌳 Δημιουργία πράσινων χώρων', '🌳 Creating green spaces'), loc('~400.000€', '~€400,000'), loc('✅ Μερικώς', '✅ Partly'), loc('✅', '✅'), loc('✅', '✅')],
          [loc('🚲 Ποδηλατόδρομος 3 km', '🚲 3 km bike lane'), loc('~300.000€', '~€300,000'), loc('✅', '✅'), loc('✅ Μερικώς', '✅ Partly'), loc('❌', '❌')],
          [loc('⚡ Ηλεκτρικά οχήματα δήμου', '⚡ Municipal electric vehicles'), loc('~600.000€', '~€600,000'), loc('✅', '✅'), loc('❌', '❌'), loc('❌', '❌')],
        ],
        note: loc(
          '🔎 Καμία λύση δεν λύνει όλα τα προβλήματα μόνη της. Οι έξυπνες πόλεις συνδυάζουν: προστασία από καύσωνα, ανθεκτικότητα σε πλημμύρες και μείωση εκπομπών.',
          '🔎 No single solution fixes everything. Smart cities combine: heat protection, flood resilience and emission cuts.',
        ),
      },
    ],
    verdict: {
      type: 'choice',
      prompt: loc(
        'Πού θα επενδυθούν τα 2 εκατομμύρια ευρώ; Ποια στρατηγική βοηθά περισσότερο την πόλη συνολικά;',
        'Where should the €2 million go? Which strategy helps the city most overall?',
      ),
      choices: [
        { id: 'A', text: loc('Όλα τα χρήματα σε φωτοβολταϊκά.', 'All the money on solar PV.') },
        { id: 'B', text: loc('Όλα τα χρήματα στο αποχετευτικό δίκτυο.', 'All the money on the sewer network.') },
        {
          id: 'C',
          text: loc(
            'Συνδυασμός έργων: μόνωση, πράσινοι χώροι, ποδηλατόδρομος και μερική αναβάθμιση αποχέτευσης.',
            'A mix of projects: insulation, green spaces, bike lane and a partial sewer upgrade.',
          ),
        },
        { id: 'D', text: loc('Όλα τα χρήματα σε ηλεκτρικά οχήματα και φωτοβολταϊκά μόνο.', 'All the money on electric vehicles and solar PV only.') },
      ],
      correctId: 'C',
      positive: loc(
        'Η επιλογή Γ αντιμετωπίζει ταυτόχρονα πολλά προβλήματα: 🏢 η μόνωση μειώνει θέρμανση/ψύξη, 🌳 οι πράσινοι χώροι δροσίζουν και απορροφούν νερό, 🚲 ο ποδηλατόδρομος μειώνει εκπομπές και κίνηση, 🚰 η αποχέτευση μειώνει τον κίνδυνο πλημμυρών. Αυτό λέγεται κλιματική ανθεκτικότητα: λύσεις που βοηθούν την πόλη σήμερα αλλά και στο μέλλον.',
        'Option C tackles several problems at once: 🏢 insulation cuts heating/cooling, 🌳 green spaces cool the city and absorb water, 🚲 the bike lane cuts emissions and traffic, 🚰 the sewer reduces flood risk. This is climate resilience: solutions that help the city today and in the future.',
      ),
      negative: RETRY,
    },
  },

  // ───────────────────────── Υπόθεση 6 ─────────────────────────
  {
    id: 6,
    glyph: '🧳',
    spot: { x: 360, y: 1080 },
    themeColor: 0x49d18a,
    title: loc('Το Ταξίδι της Οικογένειας', "The Family's Trip"),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Κεντρική Ευρώπη, Καλοκαίρι 2030', '📂 Case File: Central Europe, Summer 2030'),
    caption: loc('Μια οικογένεια 4 ατόμων οργανώνει τις καλοκαιρινές διακοπές της.', 'A family of four is planning its summer holiday.'),
    intro: loc(
      'Όλες οι επιλογές χωρούν στον προϋπολογισμό της οικογένειας, όμως διαφέρουν σε χρόνο, άνεση και κλιματικό αποτύπωμα.\n🛰️ Ποια επιλογή θα προτείνεις ως μέλος της CP TEAM;',
      'All options fit the family budget, but they differ in time, comfort and climate footprint.\n🛰️ Which option would you recommend as a CP TEAM member?',
    ),
    evidence: [
      {
        kind: 'table',
        title: loc('Στοιχεία — Επιλογές μεταφοράς', 'Evidence — Transport options'),
        headers: [
          loc('Μέσο μεταφοράς', 'Transport'),
          loc('CO₂ ανά άτομο', 'CO₂ per person'),
          loc('Συνολικό κόστος', 'Total cost'),
          loc('Χρόνος ταξιδιού', 'Travel time'),
        ],
        weights: [1.6, 1.1, 1.1, 1.1],
        rows: [
          [loc('✈️ Αεροπλάνο', '✈️ Plane'), loc('320 kg', '320 kg'), loc('600€', '€600'), loc('3 ώρες', '3 hours')],
          [loc('🚗 Αυτοκίνητο βενζίνης', '🚗 Petrol car'), loc('210 kg', '210 kg'), loc('540€', '€540'), loc('14 ώρες', '14 hours')],
          [loc('🚆 Τρένο', '🚆 Train'), loc('98 kg', '98 kg'), loc('700€', '€700'), loc('8 ώρες', '8 hours')],
        ],
      },
    ],
    verdict: {
      type: 'choice',
      prompt: loc(
        'Ποια επιλογή φαίνεται πιο βιώσιμη συνολικά, αν λάβουμε υπόψη CO₂, κόστος και χρόνο ταξιδιού;',
        'Which option seems most sustainable overall, considering CO₂, cost and travel time?',
      ),
      choices: [
        { id: 'A', text: loc('Το αεροπλάνο, γιατί είναι η πιο γρήγορη επιλογή.', 'The plane, because it is the fastest option.') },
        { id: 'B', text: loc('Το αυτοκίνητο, γιατί είναι η πιο οικονομική επιλογή.', 'The car, because it is the cheapest option.') },
        {
          id: 'C',
          text: loc(
            'Το τρένο, γιατί παραμένει μέσα στον προϋπολογισμό και έχει σημαντικά χαμηλότερο αποτύπωμα CO₂.',
            'The train, because it stays within budget and has a significantly lower CO₂ footprint.',
          ),
        },
        { id: 'D', text: loc('Όλες οι επιλογές είναι ίδιες για το κλίμα.', 'All options are the same for the climate.') },
      ],
      correctId: 'C',
      positive: loc(
        'Στην πραγματική ζωή οι αποφάσεις δεν είναι πάντα απλές: το τρένο έχει το μικρότερο αποτύπωμα, το αεροπλάνο είναι το πιο γρήγορο και το αυτοκίνητο το πιο οικονομικό. Οι οικογένειες συχνά πρέπει να ισορροπήσουν κόστος, χρόνο, άνεση και περιβαλλοντικές επιπτώσεις. Το τρένο έχει πολύ μικρότερο αποτύπωμα ανά άτομο.',
        'In real life decisions are not always simple: the train has the smallest footprint, the plane is fastest and the car is cheapest. Families often have to balance cost, time, comfort and environmental impact — and here the train wins on climate, with a far smaller footprint per person (98 kg vs 320 kg by plane).',
      ),
      negative: RETRY,
    },
  },

  // ───────────────────────── Υπόθεση 7 ─────────────────────────
  {
    id: 7,
    glyph: '🍽️',
    spot: { x: 1000, y: 1120 },
    themeColor: 0xff9f43,
    title: loc('Τι θα Φάμε Σήμερα;', 'What Shall We Eat Today?'),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Οικογενειακό τραπέζι, Σαββατόβραδο', '📂 Case File: Family dinner, Saturday night'),
    caption: loc('Ένα γεύμα την εβδομάδα αλλάζει — ισορροπία κόστους, γεύσης και κλίματος.', 'Changing one weekly meal — balancing cost, taste and climate.'),
    intro: loc(
      'Μια οικογένεια αποφασίζει να αλλάξει ένα μόνο εβδομαδιαίο γεύμα ώστε να μειώσει το κλιματικό της αποτύπωμα. Όμως πρέπει να ισορροπήσει κόστος, γεύση και το ότι τα παιδιά δεν αγαπούν ιδιαίτερα τα λαχανικά.\n🛰️ Τι θα πρότεινε η CP TEAM;',
      'A family decides to change just one weekly meal to cut its climate footprint. But it must balance cost, taste and the fact that the kids don\'t love vegetables.\n🛰️ What would CP TEAM suggest?',
    ),
    evidence: [
      {
        kind: 'table',
        title: loc('Στοιχεία — Επιλογές γεύματος', 'Evidence — Meal options'),
        headers: [
          loc('Γεύμα', 'Meal'),
          loc('CO₂ ανά γεύμα', 'CO₂ per meal'),
          loc('Κόστος (4 άτομα)', 'Cost (4 people)'),
          loc('Αντίδραση παιδιών', 'Kids\' reaction'),
        ],
        weights: [1.6, 1.1, 1.2, 1.3],
        rows: [
          [loc('🥩 Βοδινά μπιφτέκια', '🥩 Beef burgers'), loc('20 kg', '20 kg'), loc('18€', '€18'), loc('😀 Πολύ θετική', '😀 Very positive')],
          [loc('🍗 Κοτόπουλο με πατάτες', '🍗 Chicken & potatoes'), loc('8 kg', '8 kg'), loc('14€', '€14'), loc('🙂 Θετική', '🙂 Positive')],
          [loc('🧆 Μπιφτέκια από φακές', '🧆 Lentil burgers'), loc('4 kg', '4 kg'), loc('10€', '€10'), loc('🙂 Σχετικά θετική', '🙂 Fairly positive')],
        ],
      },
    ],
    verdict: {
      type: 'choice',
      prompt: loc(
        'Ποια επιλογή είναι πιο ισορροπημένη για μια οικογένεια που θέλει να μειώσει το αποτύπωμα χωρίς μεγάλες δυσκολίες;',
        'Which option is most balanced for a family that wants to cut its footprint without much difficulty?',
      ),
      choices: [
        { id: 'A', text: loc('Βοδινά μπιφτέκια, γιατί αρέσουν περισσότερο στα παιδιά.', 'Beef burgers, because the kids like them most.') },
        {
          id: 'B',
          text: loc(
            'Κοτόπουλο με πατάτες, γιατί μειώνει αρκετά τις εκπομπές χωρίς μεγάλη αλλαγή στο μενού.',
            'Chicken & potatoes, because it cuts emissions significantly with little change to the menu.',
          ),
        },
        {
          id: 'C',
          text: loc(
            'Μπιφτέκια από φακές, γιατί έχουν χαμηλότερο αποτύπωμα και μοιάζουν με γνώριμο γεύμα.',
            'Lentil burgers, because they have a lower footprint and feel like a familiar meal.',
          ),
        },
        { id: 'D', text: loc('Να μην αλλάξει τίποτα στο εβδομαδιαίο μενού.', 'Change nothing in the weekly menu.') },
      ],
      correctId: 'C',
      positive: loc(
        'Σωστά! Τα μπιφτέκια από φακές έχουν πολύ χαμηλότερο αποτύπωμα CO₂ και μικρότερο κόστος από το βοδινό. Κι επειδή μοιάζουν με γνώριμο φαγητό, είναι πιο εύκολο για τα παιδιά να τα δοκιμάσουν. Οι βιώσιμες αλλαγές πετυχαίνουν καλύτερα όταν γίνονται σταδιακά και ρεαλιστικά.',
        'Correct! Lentil burgers have a much lower CO₂ footprint and cost less than beef. And because they resemble a familiar dish, it\'s easier for the kids to try them. Sustainable changes work best when they are gradual and realistic.',
      ),
      negative: RETRY,
    },
  },

  // ───────────────────────── Υπόθεση 8 ─────────────────────────
  {
    id: 8,
    glyph: '👕',
    spot: { x: 1600, y: 1120 },
    themeColor: 0xb98cff,
    title: loc('Η Ντουλάπα των Επιλογών', 'The Wardrobe of Choices'),
    folderHeader: loc('📂 Φάκελος Υπόθεσης: Αγορές ρούχων με περιορισμένο προϋπολογισμό', '📂 Case File: Clothes shopping on a tight budget'),
    caption: loc('Προϋπολογισμός 40€ για τη νέα σχολική χρονιά — με το μικρότερο δυνατό αποτύπωμα.', '€40 for the new school year — with the smallest possible footprint.'),
    intro: loc(
      'Ένας μαθητής έχει budget 40€ για να αγοράσει ρούχα για τη νέα σχολική χρονιά. Θέλει όμως να μειώσει όσο γίνεται το περιβαλλοντικό αποτύπωμα των αγορών του, χωρίς να καταλήξει με ρούχα που θα χαλάσουν γρήγορα.\n🛰️ Τι θα πρότεινε η CP TEAM;',
      'A student has a €40 budget to buy clothes for the new school year. But he wants to cut the environmental footprint of his purchases as much as possible, without ending up with clothes that wear out fast.\n🛰️ What would CP TEAM suggest?',
    ),
    evidence: [
      {
        kind: 'table',
        title: loc('Στοιχεία — Επιλογές αγοράς', 'Evidence — Buying options'),
        headers: [
          loc('Επιλογή', 'Option'),
          loc('Κόστος', 'Cost'),
          loc('CO₂', 'CO₂'),
          loc('Αντοχή', 'Durability'),
          loc('Στυλ', 'Style'),
        ],
        weights: [2.4, 0.9, 0.9, 1, 1.4],
        rows: [
          [loc('🛍️ 5 fast fashion μπλούζες', '🛍️ 5 fast-fashion tops'), loc('40€', '€40'), loc('30 kg', '30 kg'), loc('Χαμηλή', 'Low'), loc('😀 Πολύ μοντέρνες', '😀 Very trendy')],
          [loc('♻️ 2 μεταχειρισμένες μπλούζες καλής ποιότητας', '♻️ 2 good-quality second-hand tops'), loc('32€', '€32'), loc('6 kg', '6 kg'), loc('Υψηλή', 'High'), loc('🙂 Vintage στυλ', '🙂 Vintage style')],
          [loc('👕 1 πιστοποιημένο βιώσιμο φούτερ', '👕 1 certified sustainable hoodie'), loc('38€', '€38'), loc('10 kg', '10 kg'), loc('Υψηλή', 'High'), loc('🙂 Μοντέρνο, 1 τεμάχιο', '🙂 Trendy, 1 item')],
        ],
      },
    ],
    verdict: {
      type: 'choice',
      prompt: loc(
        'Ποια επιλογή είναι πιο ισορροπημένη για μαθητή που θέλει χαμηλότερο αποτύπωμα χωρίς να ξεφύγει από το budget;',
        'Which option is most balanced for a student who wants a lower footprint without breaking the budget?',
      ),
      choices: [
        {
          id: 'A',
          text: loc(
            'Fast fashion ρούχα, γιατί προσφέρουν περισσότερες επιλογές και μοντέρνο στυλ.',
            'Fast-fashion clothes, because they offer more variety and trendy style.',
          ),
        },
        {
          id: 'B',
          text: loc(
            'Μεταχειρισμένα ρούχα καλής ποιότητας, γιατί έχουν πολύ μικρότερο αποτύπωμα και μεγάλη αντοχή.',
            'Good-quality second-hand clothes, because they have a much lower footprint and last long.',
          ),
        },
        {
          id: 'C',
          text: loc(
            'Πιστοποιημένο βιώσιμο φούτερ, γιατί είναι πιο βιώσιμο από τα fast fashion.',
            'The certified sustainable hoodie, because it is more sustainable than fast fashion.',
          ),
        },
        { id: 'D', text: loc('Συχνές νέες αγορές, ώστε να αλλάζει συνεχώς το στυλ.', 'Frequent new purchases, to keep changing the style.') },
      ],
      correctId: 'B',
      positive: loc(
        'Σωστά! Τα μεταχειρισμένα ρούχα έχουν πολύ μικρότερες εκπομπές CO₂, κοστίζουν λιγότερο και συχνά διαρκούν περισσότερο. Παρότι πολλοί έφηβοι προτιμούν τα fast fashion λόγω μόδας και ποικιλίας, η επαναχρησιμοποίηση είναι μια πιο βιώσιμη και οικονομική επιλογή χωρίς μεγάλη θυσία στην εμφάνιση.',
        'Correct! Second-hand clothes have far lower CO₂ emissions, cost less and often last longer. Although many teens prefer fast fashion for the trends and variety, reuse is a more sustainable and economical choice without much compromise on style.',
      ),
      negative: RETRY,
    },
  },
]

/** Τελική δοκιμασία (μετά την ολοκλήρωση και των 8 υποθέσεων). */
export const FINAL: {
  intro: import('./lang').Loc
  quote: import('./lang').Loc
  verdict: ChoiceVerdict
} = {
  intro: loc(
    'Μπράβο Ντετέκτιβ! Πάμε σε μια πραγματικά πολύπλοκη ερώτηση που συνδυάζει επιστήμη, κοινωνική δράση και πολιτική αλλαγή.',
    'Well done, Detective! Now for a genuinely complex question that combines science, social action and political change.',
  ),
  quote: loc(
    '«Δεν έχει νόημα να κάνω κάτι. Οι μεγάλες χώρες και οι εταιρείες εκπέμπουν τα περισσότερα αέρια του θερμοκηπίου, άρα η ατομική δράση δεν έχει αξία.»',
    '"There\'s no point in me doing anything. Big countries and corporations emit most of the greenhouse gases, so individual action is worthless."',
  ),
  verdict: {
    type: 'choice',
    prompt: loc(
      'Ποια είναι η πιο πλήρης και τεκμηριωμένη απάντηση σε αυτόν τον φίλο σου;',
      'What is the most complete, well-founded answer to this friend?',
    ),
    choices: [
      { id: 'A', text: loc('«Έχεις δίκιο. Άρα δεν μπορούμε να κάνουμε τίποτα.»', '"You\'re right. So we can\'t do anything."') },
      { id: 'B', text: loc('«Μόνο οι κυβερνήσεις μπορούν να λύσουν το πρόβλημα.»', '"Only governments can solve the problem."') },
      {
        id: 'C',
        text: loc(
          '«Η ατομική δράση μειώνει εκπομπές, επηρεάζει άλλους ανθρώπους και δείχνει ότι η κοινωνία ζητά αλλαγή. Αλλά χρειάζεται και συλλογική δράση για μεγαλύτερες αλλαγές!»',
          '"Individual action cuts emissions, influences other people and shows society demands change. But we also need collective action for bigger changes!"',
        ),
      },
      {
        id: 'D',
        text: loc(
          '«Μόνο η ατομική δράση μετράει. Αρκεί να αλλάξουμε όλοι προσωπικές συνήθειες.»',
          '"Only individual action matters. We just all need to change personal habits."',
        ),
      },
    ],
    correctId: 'C',
    positive: loc(
      'Σωστά! Η πλήρης απάντηση συνδέει τρία επίπεδα: ατομική δράση, κοινωνική μετάδοση αξιών και πολιτική πίεση για συστημική αλλαγή. Κανένα από τα τρία δεν αρκεί μόνο του — όλα μαζί δημιουργούν την αλλαγή.',
      'Correct! The complete answer links three levels: individual action, social transmission of values, and political pressure for systemic change. None of the three is enough on its own — together they create change.',
    ),
    negative: loc('Προσπάθησε ξανά!', 'Try again!'),
  },
}

// ──────────────────────── DEV integrity guard ────────────────────────
// Πιάνει την παγίδα U+0391(Α) vs U+0041(A): κάθε verdict.correctId ΠΡΕΠΕΙ να
// αντιστοιχεί σε ένα choices[].id. Αφαιρείται (tree-shaken) από το production.
if (import.meta.env.DEV) {
  const GREEK_LOOKALIKES = /[Α-Ω]/
  const checkChoice = (where: string, v: ChoiceVerdict): void => {
    const ids = v.choices.map((c) => c.id)
    if (!ids.includes(v.correctId)) {
      throw new Error(`[content] ${where}: correctId ${JSON.stringify(v.correctId)} not in choice ids ${JSON.stringify(ids)}.`)
    }
    for (const id of [...ids, v.correctId]) {
      if (GREEK_LOOKALIKES.test(id)) {
        throw new Error(`[content] ${where}: id ${JSON.stringify(id)} uses a Greek capital — use ASCII A/B/C/D.`)
      }
    }
  }
  for (const c of CASES as CaseData[]) {
    if (c.verdict.type === 'choice') checkChoice(`case ${c.id}`, c.verdict)
  }
  checkChoice('FINAL', FINAL.verdict)
}
