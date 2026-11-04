/* ==========================================================================
   Default Tests Catalog & Auto-migration
   ========================================================================== */

const DEFAULT_TESTS = [
  ["CBC (Complete Blood Count)", 300],
  ["Haematology", 300],
  ["Hemoglobin", 100],
  ["Blood Sugar Fasting", 80],
  ["Blood Sugar PP", 80],
  ["HbA1c", 500],
  ["Lipid Profile", 600],
  ["Biochemistry", 500],
  ["Liver Function Test (LFT)", 700],
  ["Kidney Function Test (KFT)", 700],
  ["Thyroid Profile (T3 T4 TSH)", 550],
  ["TSH", 250],
  ["Urine Analysis", 100],
  ["Urine Routine", 100],
  ["Widal Test", 150],
  ["Malaria Antigen", 250],
  ["Dengue NS1", 600],
  ["Vitamin D", 1100],
  ["Vitamin B12", 800],
  ["Serum Creatinine", 150],
  ["Uric Acid", 150],
  ["ESR", 80],
  ["CRP", 400],
  ["X-Ray Chest", 300],
  ["ECG", 200],
  ["USG Abdomen", 800]
].map(([name, price]) => ({ name, price }));

/**
 * Ensures all diagnostic lab tests and templates exist in the saved tests catalog.
 * Synchronizes default tests and all standard diagnostic panels from TEST_TEMPLATES.
 * @param {Array} currentTests
 * @returns {boolean} true if changes were made
 */
function ensureDefaultTests(currentTests) {
  if (!Array.isArray(currentTests)) return false;
  const existing = new Set(currentTests.map(t => (t && t.name ? t.name.toLowerCase().trim() : '')));
  let changed = false;

  // 1. Ensure basic default tests exist
  DEFAULT_TESTS.forEach(item => {
    const lower = item.name.toLowerCase().trim();
    if (!existing.has(lower)) {
      currentTests.push({ name: item.name, price: item.price });
      existing.add(lower);
      changed = true;
    }
  });

  // 2. Ensure all standard test templates from TEST_TEMPLATES are in catalog
  if (typeof TEST_TEMPLATES === 'object' && TEST_TEMPLATES !== null) {
    Object.keys(TEST_TEMPLATES).forEach(key => {
      const tmpl = TEST_TEMPLATES[key];
      if (!tmpl || !tmpl.title || tmpl.isCustomFolder) return;

      const title = tmpl.title.trim();
      const titleLower = title.toLowerCase();

      // Check if already in catalog by exact title or match aliases
      const alreadyExists = existing.has(titleLower) || 
        (tmpl.match && tmpl.match.some(m => existing.has(m.toLowerCase())));

      if (!alreadyExists) {
        // Assign standard realistic diagnostic price based on panel depth
        const paramCount = (tmpl.items || []).filter(i => !i.isHeader).length;
        let price = 250;
        if (paramCount >= 10) price = 700;
        else if (paramCount >= 5) price = 500;
        else if (paramCount >= 3) price = 350;

        currentTests.push({
          name: title,
          price: price
        });
        existing.add(titleLower);
        changed = true;
      }
    });
  }

  return changed;
}
