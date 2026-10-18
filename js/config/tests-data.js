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
 * Ensures critical lab tests exist in the saved tests list.
 * @param {Array} currentTests
 * @returns {boolean} true if changes were made
 */
function ensureDefaultTests(currentTests) {
  const existing = new Set(currentTests.map(t => t.name.toLowerCase()));
  const extra = [
    { name: "CBC (Complete Blood Count)", price: 300 },
    { name: "Haematology", price: 300 },
    { name: "Lipid Profile", price: 600 },
    { name: "Biochemistry", price: 500 },
    { name: "Urine Analysis", price: 100 },
    { name: "Urine Routine", price: 100 }
  ];
  let changed = false;
  extra.forEach(item => {
    if (!existing.has(item.name.toLowerCase())) {
      currentTests.push(item);
      existing.add(item.name.toLowerCase());
      changed = true;
    }
  });
  return changed;
}
