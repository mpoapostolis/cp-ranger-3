import { defineConfig } from 'vite'

// base: './' → σχετικά paths στο build, ώστε να τρέχει μέσα σε iframe / υποφάκελο
// (π.χ. Articulate Rise web object, SCORM πακέτο, ή οποιοδήποτε LMS/ΕΣΠΑ host).
export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
