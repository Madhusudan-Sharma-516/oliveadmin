/* ==========================================================================
   Lab Test Templates & Parameter Definitions
   Includes: Haematology (CBC), Lipid Profile, Biochemistry, Urine Analysis
   ========================================================================== */

const TEST_TEMPLATES = {
  haematology: {
    id: 'haematology',
    title: 'HAEMATOLOGY',
    subtitle: 'Sysmex XP-100 Automated Haematology Analyzer',
    method: 'METHOD : Test done by Sysmex XP-100 Automated Haematology Analyzer.',
    match: ['haematology', 'hematology', 'cbc', 'complete blood count', 'hemogram'],
    items: [
      { name: 'HEMOGLOBIN', unit: 'gm/dl', range: '12.0 - 15.0' },
      { isHeader: true, title: 'RBC INDICES' },
      { name: 'RBC COUNT', unit: 'mill/cu.mm', range: '3.8 - 4.8', indent: true },
      { name: 'HAEMATOCRIT', unit: '%', range: '36 - 46', indent: true },
      { name: 'MCV', unit: 'fl', range: '83 - 101', indent: true },
      { name: 'MCH', unit: 'pgm', range: '27 - 32', indent: true },
      { name: 'MCHC', unit: '%', range: '32.0 - 36.0', indent: true },
      { name: 'RDW', unit: '%', range: '11.6 - 14.0', indent: true },
      { name: 'Total W.B.C. Count', unit: 'Cells /Cu.mm', range: '4000 - 10000' },
      { isHeader: true, title: 'Differential Leucocyte Count' },
      { name: 'NEUTROPHILS', unit: '%', range: '40 - 80', indent: true },
      { name: 'LYMPHOCYTE', unit: '%', range: '20-40', indent: true },
      { name: 'MONOCYTE', unit: '%', range: '2-10', indent: true },
      { name: 'EOSINOPHILS', unit: '%', range: '1 - 6', indent: true },
      { name: 'BASOPHILS', unit: '%', range: '< 2', indent: true },
      { name: 'PLATELET COUNT', unit: 'Lacs/cu.mm', range: '1.5 - 4.1' }
    ]
  },
  lipid: {
    id: 'lipid',
    title: 'LIPID PROFILE',
    subtitle: 'Lipid Profile Panel',
    method: '',
    match: ['lipid', 'li pid', 'lipid profile'],
    items: [
      { name: 'CHOLESTEROL', unit: 'mg/dl.', range: 'Upto 200' },
      { name: 'TRIGLYCERIDES', unit: 'mg/dl.', range: '35 - 135' },
      { name: 'HDL', unit: 'mg/dl.', range: '42 - 88' },
      { name: 'LDL', unit: 'mg/dl.', range: '80 to 150' },
      { name: 'VLDL', unit: 'mg/dl.', range: '20 to 50' },
      { name: 'Total Chol. : HDL Ratio', unit: '', range: 'Below 3.5' }
    ]
  },
  biochemistry: {
    id: 'biochemistry',
    title: 'BIOCHEMISTRY',
    subtitle: 'Merilyzer Autoquant 100 Fully Automated Biochemistry Analyzer',
    method: 'METHOD : Test done by Merilyzer Autoquant 100 Fully Automated Biochemistry Analyzer.',
    match: ['biochem', 'biochemistry'],
    items: [
      { name: 'RANDOM BLOOD SUGAR', unit: 'mg/dl', range: '70 - 200' },
      { name: 'BLOOD UREA NITROGEN', unit: 'mg/dl', range: '6 - 21' },
      { name: 'SERUM CREATININE', unit: 'mg/dl', range: '0.6 - 1.2' },
      { isHeader: true, title: 'SERUM BILIRUBIN' },
      { name: 'TOTAL', unit: 'mg/dl', range: '0.10 - 1.20', indent: true },
      { name: 'DIRECT', unit: 'mg/dl', range: 'Upto 0.30', indent: true },
      { name: 'INDIRECT', unit: 'mg/dl', range: 'Upto 1.10', indent: true },
      { name: 'URIC ACID', unit: 'mg/dl', range: '2.5 - 6.8' },
      { name: 'SGOT', unit: 'U/L', range: 'UPTO 45' },
      { name: 'SGPT', unit: 'IU/L', range: 'Upto 45' },
      { name: 'ALKALINE PHOSPHATASE', unit: 'IU/L', range: '35 - 124' },
      { isHeader: true, title: 'SERUM PROTEINS' },
      { name: 'TOTAL PROTEIN', unit: 'gm/dl', range: '6.0 - 8.3', indent: true },
      { name: 'ALBUMIN', unit: 'gm/dl', range: '3.2-5.0', indent: true },
      { name: 'GLOBULIN', unit: 'gm/dl', range: '2.3 - 3.6', indent: true },
      { name: 'A/G RATIO', unit: '', range: '1 - 2.3', indent: true }
    ]
  },
  urine: {
    id: 'urine',
    title: 'URINE ANALYSIS',
    subtitle: 'Siemens Clinitek Status+ Urine Analyzer',
    method: 'METHOD : Test done by Siemens Clinitek Status+ Urine Analyzer.',
    remark: 'NOTE:- MICROSCOPIC EXAMINATION OF URINE IS PERFORMED BY CENTRIFUGED URINARY SEDIMENT.',
    match: ['urine'],
    items: [
      { isHeader: true, title: 'PHYSICAL EXAMINATION' },
      { name: 'QUANTITY', unit: 'ml', range: '', defaultVal: '30', indent: true },
      { name: 'COLOUR', unit: '', range: '', defaultVal: 'PALE YELLOW', indent: true },
      { name: 'APPEARANCE', unit: '', range: '', defaultVal: 'CLEAR', indent: true },
      { name: 'REACTION', unit: '', range: '', defaultVal: 'ACIDIC', indent: true },
      { name: 'SPECIFIC GRAVITY', unit: '', range: '1.003 - 1.030', defaultVal: '1.010', indent: true },
      { isHeader: true, title: 'CHEMICAL EXAMINATION' },
      { name: 'SUGAR', unit: '', range: 'NIL', defaultVal: 'NIL', indent: true },
      { name: 'ALBUMIN', unit: '', range: 'NIL', defaultVal: 'NIL', indent: true },
      { isHeader: true, title: 'MICROSCOPIC EXAMINATION' },
      { name: 'PUS CELLS', unit: '/ hpf', range: '0 - 5', defaultVal: '1-2', indent: true },
      { name: 'EPITHELIAL CELLS', unit: '/ hpf', range: '0 - 5', defaultVal: '0-1', indent: true },
      { name: 'RBCs', unit: '/ hpf', range: 'NIL', defaultVal: 'NIL', indent: true },
      { name: 'CAST', unit: '', range: 'NIL', defaultVal: 'NIL', indent: true },
      { name: 'CRYSTAL', unit: '', range: 'NIL', defaultVal: 'NIL', indent: true },
      { name: 'BACTERIA', unit: '', range: 'NIL', defaultVal: 'NIL', indent: true }
    ]
  }
};

/**
 * Finds a matching template for a given test name.
 * @param {string} testName
 * @returns {object|null}
 */
function findTemplate(testName) {
  if (!testName) return null;
  const n = testName.trim().toLowerCase();
  for (const key of Object.keys(TEST_TEMPLATES)) {
    const tmpl = TEST_TEMPLATES[key];
    if (tmpl.match.some(m => n.includes(m))) return tmpl;
  }
  return null;
}
