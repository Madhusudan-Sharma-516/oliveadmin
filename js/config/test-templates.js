/* ==========================================================================
   Lab Test Templates & Parameter Definitions Master Catalog
   Derived from National/Indian Diagnostic Lab Standards (Master Blood & Pathology Catalog)
   Includes 113+ Test Panels & Individual Investigations with Standard Reference Ranges & Units
   ========================================================================== */

const TEST_TEMPLATES = {
  haematology: {
    id: 'haematology',
    title: 'HAEMATOLOGY',
    subtitle: 'Sysmex XP-100 Automated Haematology Analyzer',
    method: 'METHOD : Test done by Sysmex XP-100 Automated Haematology Analyzer.',
    match: ['haematology', 'hematology', 'cbc', 'complete blood count', 'hemogram', 't001'],
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
    method: 'METHOD : Enzymatic / Spectrophotometric Analyzer Method.',
    match: ['lipid', 'li pid', 'lipid profile', 'lipid panel', 't009'],
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
    match: ['urine', 'urine analysis', 'urine routine', 'urine routine & microscopy', 'routine urine', 't020'],
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
  },
  t010_kft_rft_kidney_function_test: {
    id: 't010_kft_rft_kidney_function_test',
    testId: 'T010',
    title: 'KFT / RFT (KIDNEY FUNCTION TEST)',
    subtitle: 'Biochemistry',
    match: ['kft', 'rft', 'kidney function test', 'renal function test'],
    items: [
      { name: 'Urea', unit: 'mg/dL', range: '15-45' },
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-21' },
      { name: 'Creatinine', unit: 'mg/dL', range: 'M: 0.7-1.3 | F: 0.6-1.1' },
      { name: 'eGFR', unit: 'mL/min/1.73 m2', range: '>=90 Normal' },
      { name: 'Uric Acid', unit: 'mg/dL', range: 'M: 3.5-7.2 | F: 2.6-6.0' },
      { name: 'Calcium', unit: 'mg/dL', range: '8.6-10.2' },
      { name: 'Phosphorus', unit: 'mg/dL', range: '2.5-4.5' },
      { name: 'Sodium', unit: 'mmol/L', range: '135-145' },
      { name: 'Potassium', unit: 'mmol/L', range: '3.5-5.1' },
      { name: 'Chloride', unit: 'mmol/L', range: '98-107' }
    ]
  },
  t013_lft_liver_function_test: {
    id: 't013_lft_liver_function_test',
    testId: 'T013',
    title: 'LFT (LIVER FUNCTION TEST)',
    subtitle: 'Biochemistry',
    match: ['lft', 'liver function test', 'hepatic function test'],
    items: [
      { name: 'Bilirubin - Total', unit: 'mg/dL', range: '0.2-1.2' },
      { name: 'Bilirubin - Direct', unit: 'mg/dL', range: '0.0-0.3' },
      { name: 'Bilirubin - Indirect', unit: 'mg/dL', range: '0.2-0.9' },
      { name: 'SGOT / AST', unit: 'U/L', range: '5-40' },
      { name: 'SGPT / ALT', unit: 'U/L', range: '5-40' },
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '44-147' },
      { name: 'GGT', unit: 'U/L', range: 'M: 10-71 | F: 6-42' },
      { name: 'Total Protein', unit: 'g/dL', range: '6.0-8.3' },
      { name: 'Albumin', unit: 'g/dL', range: '3.5-5.2' },
      { name: 'Globulin', unit: 'g/dL', range: '2.0-3.5' },
      { name: 'A/G Ratio', unit: 'ratio', range: '1.1-2.5' }
    ]
  },
  t014_thyroid_profile_t3_t4_tsh: {
    id: 't014_thyroid_profile_t3_t4_tsh',
    testId: 'T014',
    title: 'THYROID PROFILE (T3, T4, TSH)',
    subtitle: 'Immunoassay / Hormones',
    match: ['thyroid profile (t3, t4, tsh)', 'thyroid profile', 'thyroid', 't3 t4 tsh', 'tft'],
    items: [
      { name: 'Total T3', unit: 'ng/dL', range: '80-200' },
      { name: 'Total T4', unit: 'ug/dL', range: '5.0-12.0' },
      { name: 'TSH (3rd Generation)', unit: 'uIU/mL', range: '0.4-4.0' }
    ]
  },
  t083_thyroid_profile_free_ft3_ft4_tsh: {
    id: 't083_thyroid_profile_free_ft3_ft4_tsh',
    testId: 'T083',
    title: 'THYROID PROFILE - FREE (FT3, FT4, TSH)',
    subtitle: 'Immunoassay / Hormones',
    match: ['thyroid profile - free', 'free tft', 'ft3 ft4 tsh', 'thyroid free'],
    items: [
      { name: 'Free T3', unit: 'pg/mL', range: '2.0-4.4' },
      { name: 'Free T4', unit: 'ng/dL', range: '0.8-1.8' },
      { name: 'TSH (3rd Generation)', unit: 'uIU/mL', range: '0.4-4.0' }
    ]
  },
  t019_serum_electrolytes_na_k_cl: {
    id: 't019_serum_electrolytes_na_k_cl',
    testId: 'T019',
    title: 'SERUM ELECTROLYTES (NA, K, CL)',
    subtitle: 'Biochemistry',
    match: ['serum electrolytes', 'electrolytes', 'na k cl'],
    items: [
      { name: 'Sodium', unit: 'mmol/L', range: '135-145' },
      { name: 'Potassium', unit: 'mmol/L', range: '3.5-5.1' },
      { name: 'Chloride', unit: 'mmol/L', range: '98-107' }
    ]
  },
  t096_widal_test_slide_tube: {
    id: 't096_widal_test_slide_tube',
    testId: 'T096',
    title: 'WIDAL TEST (SLIDE / TUBE)',
    subtitle: 'Serology',
    match: ['widal test (slide / tube)', 'widal test', 'widal'],
    items: [
      { name: 'S. Typhi O', unit: 'titre', range: '<1:80' },
      { name: 'S. Typhi H', unit: 'titre', range: '<1:80' },
      { name: 'S. Paratyphi AH', unit: 'titre', range: '<1:80' },
      { name: 'S. Paratyphi BH', unit: 'titre', range: '<1:80' }
    ]
  },
  t008_hba1c_glycosylated_hemoglobin: {
    id: 't008_hba1c_glycosylated_hemoglobin',
    testId: 'T008',
    title: 'HBA1C (GLYCOSYLATED HEMOGLOBIN)',
    subtitle: 'Biochemistry',
    match: ['hba1c', 'glycosylated hemoglobin', 'glycated hemoglobin'],
    items: [
      { name: 'HbA1c', unit: '%', range: '<5.7 Normal | 5.7-6.4 Prediabetes | >=6.5 Diabetes' },
      { name: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', range: '-' }
    ]
  },
  t004_blood_group_rh_factor: {
    id: 't004_blood_group_rh_factor',
    testId: 'T004',
    title: 'BLOOD GROUP & RH FACTOR',
    subtitle: 'Hematology',
    match: ['blood group & rh factor', 'blood group', 'rh factor', 'abo group'],
    items: [
      { name: 'ABO Group', unit: '-', range: '-' },
      { name: 'Rh Factor', unit: '-', range: '-', defaultVal: 'Negative' }
    ]
  },
  t062_iron_studies_iron_tibc_uibc_transferrin_saturation: {
    id: 't062_iron_studies_iron_tibc_uibc_transferrin_saturation',
    testId: 'T062',
    title: 'IRON STUDIES (IRON, TIBC, UIBC, TRANSFERRIN SATURATION)',
    subtitle: 'Biochemistry',
    match: ['iron studies', 'iron profile', 'iron tibc uibc'],
    items: [
      { name: 'Serum Iron', unit: 'ug/dL', range: 'M: 65-175 | F: 50-170' },
      { name: 'TIBC', unit: 'ug/dL', range: '250-450' },
      { name: 'UIBC', unit: 'ug/dL', range: '110-370' },
      { name: 'Transferrin Saturation', unit: '%', range: '20-50' }
    ]
  },
  t028_tlc_dlc: {
    id: 't028_tlc_dlc',
    testId: 'T028',
    title: 'TLC / DLC',
    subtitle: 'Hematology',
    match: ['tlc / dlc', 'tlc dlc', 'total and differential leucocyte count'],
    items: [
      { name: 'Total Leucocyte Count (TLC)', unit: 'cells/cu.mm', range: '4000-10000' },
      { name: 'Neutrophils', unit: '%', range: '40-80' },
      { name: 'Lymphocytes', unit: '%', range: '20-40' },
      { name: 'Eosinophils', unit: '%', range: '1-6' },
      { name: 'Monocytes', unit: '%', range: '2-10' },
      { name: 'Basophils', unit: '%', range: '0-2' }
    ]
  },
  t038_serum_bilirubin_total_direct_indirect: {
    id: 't038_serum_bilirubin_total_direct_indirect',
    testId: 'T038',
    title: 'SERUM BILIRUBIN (TOTAL, DIRECT, INDIRECT)',
    subtitle: 'Biochemistry',
    match: ['serum bilirubin', 'bilirubin total direct indirect', 'bilirubin'],
    items: [
      { name: 'Bilirubin - Total', unit: 'mg/dL', range: '0.2-1.2' },
      { name: 'Bilirubin - Direct', unit: 'mg/dL', range: '0.0-0.3' },
      { name: 'Bilirubin - Indirect', unit: 'mg/dL', range: '0.2-0.9' }
    ]
  },
  t045_serum_protein_profile_tp_albumin_globulin_a_g: {
    id: 't045_serum_protein_profile_tp_albumin_globulin_a_g',
    testId: 'T045',
    title: 'SERUM PROTEIN PROFILE (TP, ALBUMIN, GLOBULIN, A/G)',
    subtitle: 'Biochemistry',
    match: ['serum protein profile', 'tp albumin globulin a/g'],
    items: [
      { name: 'Total Protein', unit: 'g/dL', range: '6.0-8.3' },
      { name: 'Albumin', unit: 'g/dL', range: '3.5-5.2' },
      { name: 'Globulin', unit: 'g/dL', range: '2.0-3.5' },
      { name: 'A/G Ratio', unit: 'ratio', range: '1.1-2.5' }
    ]
  },
  t051_pt_inr_prothrombin_time: {
    id: 't051_pt_inr_prothrombin_time',
    testId: 'T051',
    title: 'PT / INR (PROTHROMBIN TIME)',
    subtitle: 'Hematology / Coagulation',
    match: ['pt / inr', 'prothrombin time', 'pt inr'],
    items: [
      { name: 'PT - Patient', unit: 'sec', range: '11.0-13.5 (kit-specific)' },
      { name: 'PT - Control', unit: 'sec', range: '-' },
      { name: 'INR', unit: 'ratio', range: '0.8-1.2 (non-anticoagulated); 2.0-3.0 therapeutic on warfarin (most indications)' }
    ]
  },
  t052_aptt: {
    id: 't052_aptt',
    testId: 'T052',
    title: 'APTT',
    subtitle: 'Hematology / Coagulation',
    match: ['aptt', 'activated partial thromboplastin time'],
    items: [
      { name: 'aPTT - Patient', unit: 'sec', range: '25-35 (kit-specific)' },
      { name: 'aPTT - Control', unit: 'sec', range: '-' }
    ]
  },
  t053_bleeding_time_clotting_time_bt_ct: {
    id: 't053_bleeding_time_clotting_time_bt_ct',
    testId: 'T053',
    title: 'BLEEDING TIME & CLOTTING TIME (BT / CT)',
    subtitle: 'Hematology / Coagulation',
    match: ['bleeding time & clotting time', 'bt / ct', 'bt ct'],
    items: [
      { name: 'Bleeding Time', unit: 'min', range: '1-5 (Duke method)' },
      { name: 'Clotting Time', unit: 'min', range: '4-9 (Lee-White method)' }
    ]
  },
  t056_hb_electrophoresis_hplc: {
    id: 't056_hb_electrophoresis_hplc',
    testId: 'T056',
    title: 'HB ELECTROPHORESIS / HPLC',
    subtitle: 'Hematology',
    match: ['hb electrophoresis / hplc', 'hb electrophoresis', 'hplc'],
    items: [
      { name: 'HbA', unit: '%', range: '95-98' },
      { name: 'HbA2', unit: '%', range: '2.0-3.5' },
      { name: 'HbF', unit: '%', range: '<1.0 (adults)' },
      { name: 'HbS / Other variants', unit: '-', range: 'Not detected' }
    ]
  },
  t075_insulin_fasting_homa_ir: {
    id: 't075_insulin_fasting_homa_ir',
    testId: 'T075',
    title: 'INSULIN FASTING & HOMA-IR',
    subtitle: 'Immunoassay / Hormones',
    match: ['insulin fasting & homa-ir', 'insulin fasting', 'homa-ir'],
    items: [
      { name: 'Glucose - Fasting', unit: 'mg/dL', range: '70-99' },
      { name: 'Insulin - Fasting', unit: 'uIU/mL', range: '2.6-24.9' },
      { name: 'HOMA-IR', unit: '-', range: '<2.5 (cut-off varies by population)' }
    ]
  },
  t078_gtt_75_g_oral_glucose_tolerance_test: {
    id: 't078_gtt_75_g_oral_glucose_tolerance_test',
    testId: 'T078',
    title: 'GTT (75 G ORAL GLUCOSE TOLERANCE TEST)',
    subtitle: 'Biochemistry',
    match: ['gtt (75 g oral glucose tolerance test)', 'gtt', 'glucose tolerance test'],
    items: [
      { name: 'Glucose - Fasting', unit: 'mg/dL', range: '70-99' },
      { name: 'Glucose - 1 Hour', unit: 'mg/dL', range: 'Optional; <180 (non-pregnant)' },
      { name: 'Glucose - 2 Hour', unit: 'mg/dL', range: '<140 Normal | 140-199 Impaired glucose tolerance | >=200 Diabetes' }
    ]
  },
  t098_dengue_antibodies_igm_igg: {
    id: 't098_dengue_antibodies_igm_igg',
    testId: 'T098',
    title: 'DENGUE ANTIBODIES (IGM / IGG)',
    subtitle: 'Serology',
    match: ['dengue antibodies (igm / igg)', 'dengue antibodies', 'dengue igm igg', 'dengue serology'],
    items: [
      { name: 'Dengue IgM', unit: '-', range: 'Negative', defaultVal: 'Negative' },
      { name: 'Dengue IgG', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t097_typhidot_igm_igg: {
    id: 't097_typhidot_igm_igg',
    testId: 'T097',
    title: 'TYPHIDOT (IGM / IGG)',
    subtitle: 'Serology',
    match: ['typhidot (igm / igg)', 'typhidot'],
    items: [
      { name: 'Typhidot IgM', unit: '-', range: 'Negative', defaultVal: 'Negative' },
      { name: 'Typhidot IgG', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t110_ana_antinuclear_antibody_ifa: {
    id: 't110_ana_antinuclear_antibody_ifa',
    testId: 'T110',
    title: 'ANA (ANTINUCLEAR ANTIBODY, IFA)',
    subtitle: 'Serology',
    match: ['ana (antinuclear antibody, ifa)', 'ana ifa', 'antinuclear antibody', 'ana'],
    items: [
      { name: 'ANA', unit: '-', range: 'Negative', defaultVal: 'Negative' },
      { name: 'ANA Titre', unit: 'titre', range: '<1:80' },
      { name: 'ANA Pattern', unit: '-', range: '-' }
    ]
  },
  t112_psa_total_free_free_total_ratio: {
    id: 't112_psa_total_free_free_total_ratio',
    testId: 'T112',
    title: 'PSA TOTAL & FREE (FREE/TOTAL RATIO)',
    subtitle: 'Tumor markers',
    match: ['psa total & free (free/total ratio)', 'psa total & free', 'free psa'],
    items: [
      { name: 'PSA Total', unit: 'ng/mL', range: '0-4.0' },
      { name: 'PSA Free', unit: 'ng/mL', range: '-' },
      { name: 'Free / Total PSA Ratio', unit: '%', range: '>25 favours benign | <10 higher suspicion' }
    ]
  },
  t022_ecg_12_lead: {
    id: 't022_ecg_12_lead',
    testId: 'T022',
    title: 'ECG (12-LEAD)',
    subtitle: 'Cardiology',
    match: ['ecg (12-lead)', 'ecg', 'electrocardiogram'],
    items: [
      { name: 'Heart Rate', unit: 'beats/min', range: '60-100' },
      { name: 'Rhythm', unit: '-', range: 'Normal sinus rhythm' },
      { name: 'PR Interval', unit: 'ms', range: '120-200' },
      { name: 'QRS Duration', unit: 'ms', range: '80-120' },
      { name: 'QT Interval', unit: 'ms', range: '350-440' },
      { name: 'QTc (corrected)', unit: 'ms', range: 'M: <450 | F: <460' },
      { name: 'QRS Axis', unit: 'degrees', range: '-30 to +90' },
      { name: 'ST-T Changes', unit: '-', range: 'None' },
      { name: 'Interpretation', unit: '-', range: 'Normal ECG' }
    ]
  },
  t021_blood_pressure_bp_vitals: {
    id: 't021_blood_pressure_bp_vitals',
    testId: 'T021',
    title: 'BLOOD PRESSURE (BP) & VITALS',
    subtitle: 'Vitals / Bedside',
    match: ['blood pressure & vitals', 'bp & vitals', 'vitals'],
    items: [
      { name: 'Systolic BP', unit: 'mmHg', range: '<120 Normal | 120-139 Pre-hypertension | >=140 Hypertension' },
      { name: 'Diastolic BP', unit: 'mmHg', range: '<80 Normal | 80-89 Pre-hypertension | >=90 Hypertension' },
      { name: 'Pulse Rate', unit: 'beats/min', range: '60-100' },
      { name: 'Position / Arm', unit: '-', range: '-' }
    ]
  },
  t002_hemoglobin_hb: {
    id: 't002_hemoglobin_hb',
    testId: 'T002',
    title: 'HEMOGLOBIN (HB)',
    subtitle: 'Hematology',
    match: ['hemoglobin', 'hb'],
    items: [
      { name: 'Hemoglobin', unit: 'g/dL', range: 'M: 13.0-17.0 | F: 12.0-15.0' }
    ]
  },
  t003_esr_westergren: {
    id: 't003_esr_westergren',
    testId: 'T003',
    title: 'ESR (WESTERGREN)',
    subtitle: 'Hematology',
    match: ['esr', 'erythrocyte sedimentation rate', 'westergren'],
    items: [
      { name: 'ESR (1st hour)', unit: 'mm/hr', range: 'M: 0-15 | F: 0-20' }
    ]
  },
  t005_blood_sugar_fasting_fbs: {
    id: 't005_blood_sugar_fasting_fbs',
    testId: 'T005',
    title: 'BLOOD SUGAR FASTING (FBS)',
    subtitle: 'Biochemistry',
    match: ['blood sugar fasting', 'fasting blood sugar', 'fbs', 'sugar fasting', 'glucose fasting'],
    items: [
      { name: 'Glucose - Fasting', unit: 'mg/dL', range: '70-99 Normal | 100-125 Impaired fasting glucose | >=126 Diabetes range' }
    ]
  },
  t006_blood_sugar_post_prandial_ppbs: {
    id: 't006_blood_sugar_post_prandial_ppbs',
    testId: 'T006',
    title: 'BLOOD SUGAR POST PRANDIAL (PPBS)',
    subtitle: 'Biochemistry',
    match: ['blood sugar post prandial', 'blood sugar pp', 'ppbs', 'sugar pp', 'glucose post prandial'],
    items: [
      { name: 'Glucose - Post Prandial (2 hr)', unit: 'mg/dL', range: '<140 Normal | 140-199 Impaired glucose tolerance | >=200 Diabetes range' }
    ]
  },
  t007_blood_sugar_random_rbs: {
    id: 't007_blood_sugar_random_rbs',
    testId: 'T007',
    title: 'BLOOD SUGAR RANDOM (RBS)',
    subtitle: 'Biochemistry',
    match: ['blood sugar random', 'rbs', 'random blood sugar', 'sugar random', 'glucose random'],
    items: [
      { name: 'Glucose - Random', unit: 'mg/dL', range: 'Generally <140; >=200 with symptoms suggests diabetes' }
    ]
  },
  t011_serum_creatinine: {
    id: 't011_serum_creatinine',
    testId: 'T011',
    title: 'SERUM CREATININE',
    subtitle: 'Biochemistry',
    match: ['serum creatinine', 'creatinine'],
    items: [
      { name: 'Creatinine', unit: 'mg/dL', range: 'M: 0.7-1.3 | F: 0.6-1.1' }
    ]
  },
  t012_serum_uric_acid: {
    id: 't012_serum_uric_acid',
    testId: 'T012',
    title: 'SERUM URIC ACID',
    subtitle: 'Biochemistry',
    match: ['serum uric acid', 'uric acid'],
    items: [
      { name: 'Uric Acid', unit: 'mg/dL', range: 'M: 3.5-7.2 | F: 2.6-6.0' }
    ]
  },
  t015_vitamin_d_25_oh: {
    id: 't015_vitamin_d_25_oh',
    testId: 'T015',
    title: 'VITAMIN D (25-OH)',
    subtitle: 'Immunoassay / Hormones',
    match: ['vitamin d', 'vit d', '25-oh vitamin d', '25-hydroxy vitamin d'],
    items: [
      { name: '25-OH Vitamin D', unit: 'ng/mL', range: '<20 Deficient | 20-29 Insufficient | 30-100 Sufficient | >100 Possible toxicity' }
    ]
  },
  t016_vitamin_b12: {
    id: 't016_vitamin_b12',
    testId: 'T016',
    title: 'VITAMIN B12',
    subtitle: 'Immunoassay / Hormones',
    match: ['vitamin b12', 'vit b12', 'b12', 'cobalamin'],
    items: [
      { name: 'Vitamin B12', unit: 'pg/mL', range: '<200 Deficient | 200-300 Borderline | 300-900 Normal' }
    ]
  },
  t017_crp_c_reactive_protein_quantitative: {
    id: 't017_crp_c_reactive_protein_quantitative',
    testId: 'T017',
    title: 'CRP (C-REACTIVE PROTEIN) QUANTITATIVE',
    subtitle: 'Biochemistry',
    match: ['crp (c-reactive protein) quantitative', 'crp quantitative', 'c-reactive protein', 'crp'],
    items: [
      { name: 'C-Reactive Protein (CRP)', unit: 'mg/L', range: '<5 (some kits <6)' }
    ]
  },
  t018_serum_calcium: {
    id: 't018_serum_calcium',
    testId: 'T018',
    title: 'SERUM CALCIUM',
    subtitle: 'Biochemistry',
    match: ['serum calcium', 'calcium'],
    items: [
      { name: 'Calcium', unit: 'mg/dL', range: '8.6-10.2' }
    ]
  },
  t025_malaria_antigen_rapid: {
    id: 't025_malaria_antigen_rapid',
    testId: 'T025',
    title: 'MALARIA ANTIGEN (RAPID)',
    subtitle: 'Serology / Rapid tests',
    match: ['malaria antigen (rapid)', 'malaria antigen', 'malaria rapid'],
    items: [
      { name: 'Malaria Antigen (P. falciparum / P. vivax)', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t026_dengue_ns1_antigen_rapid: {
    id: 't026_dengue_ns1_antigen_rapid',
    testId: 'T026',
    title: 'DENGUE NS1 ANTIGEN (RAPID)',
    subtitle: 'Serology / Rapid tests',
    match: ['dengue ns1 antigen (rapid)', 'dengue ns1', 'dengue antigen'],
    items: [
      { name: 'Dengue NS1 Antigen', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t027_platelet_count: {
    id: 't027_platelet_count',
    testId: 'T027',
    title: 'PLATELET COUNT',
    subtitle: 'Hematology',
    match: ['platelet count', 'platelets'],
    items: [
      { name: 'Platelet Count', unit: 'cells/cu.mm', range: '150000-410000' }
    ]
  },
  t029_total_cholesterol: {
    id: 't029_total_cholesterol',
    testId: 'T029',
    title: 'TOTAL CHOLESTEROL',
    subtitle: 'Biochemistry',
    match: ['total cholesterol', 'serum cholesterol', 'cholesterol'],
    items: [
      { name: 'Total Cholesterol', unit: 'mg/dL', range: '<200 Desirable | 200-239 Borderline high | >=240 High' }
    ]
  },
  t030_triglycerides: {
    id: 't030_triglycerides',
    testId: 'T030',
    title: 'TRIGLYCERIDES',
    subtitle: 'Biochemistry',
    match: ['triglycerides', 'serum triglycerides'],
    items: [
      { name: 'Triglycerides', unit: 'mg/dL', range: '<150 Normal | 150-199 Borderline | 200-499 High | >=500 Very high' }
    ]
  },
  t031_hdl_cholesterol: {
    id: 't031_hdl_cholesterol',
    testId: 'T031',
    title: 'HDL CHOLESTEROL',
    subtitle: 'Biochemistry',
    match: ['hdl cholesterol', 'serum hdl'],
    items: [
      { name: 'HDL Cholesterol', unit: 'mg/dL', range: 'M: >40 | F: >50 (>60 protective)' }
    ]
  },
  t032_ldl_cholesterol: {
    id: 't032_ldl_cholesterol',
    testId: 'T032',
    title: 'LDL CHOLESTEROL',
    subtitle: 'Biochemistry',
    match: ['ldl cholesterol', 'serum ldl'],
    items: [
      { name: 'LDL Cholesterol', unit: 'mg/dL', range: '<100 Optimal | 100-129 Near optimal | 130-159 Borderline | 160-189 High | >=190 Very high' }
    ]
  },
  t033_serum_urea_bun: {
    id: 't033_serum_urea_bun',
    testId: 'T033',
    title: 'SERUM UREA / BUN',
    subtitle: 'Biochemistry',
    match: ['serum urea / bun', 'serum urea', 'urea / bun', 'urea', 'bun'],
    items: [
      { name: 'Urea', unit: 'mg/dL', range: '15-45' },
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-21' }
    ]
  },
  t034_serum_phosphorus: {
    id: 't034_serum_phosphorus',
    testId: 'T034',
    title: 'SERUM PHOSPHORUS',
    subtitle: 'Biochemistry',
    match: ['serum phosphorus', 'phosphorus'],
    items: [
      { name: 'Phosphorus', unit: 'mg/dL', range: '2.5-4.5' }
    ]
  },
  t035_serum_sodium: {
    id: 't035_serum_sodium',
    testId: 'T035',
    title: 'SERUM SODIUM',
    subtitle: 'Biochemistry',
    match: ['serum sodium', 'sodium'],
    items: [
      { name: 'Sodium', unit: 'mmol/L', range: '135-145' }
    ]
  },
  t036_serum_potassium: {
    id: 't036_serum_potassium',
    testId: 'T036',
    title: 'SERUM POTASSIUM',
    subtitle: 'Biochemistry',
    match: ['serum potassium', 'potassium'],
    items: [
      { name: 'Potassium', unit: 'mmol/L', range: '3.5-5.1' }
    ]
  },
  t037_serum_chloride: {
    id: 't037_serum_chloride',
    testId: 'T037',
    title: 'SERUM CHLORIDE',
    subtitle: 'Biochemistry',
    match: ['serum chloride', 'chloride'],
    items: [
      { name: 'Chloride', unit: 'mmol/L', range: '98-107' }
    ]
  },
  t039_sgot_ast: {
    id: 't039_sgot_ast',
    testId: 'T039',
    title: 'SGOT / AST',
    subtitle: 'Biochemistry',
    match: ['sgot / ast', 'sgot', 'ast'],
    items: [
      { name: 'SGOT / AST', unit: 'U/L', range: '5-40' }
    ]
  },
  t040_sgpt_alt: {
    id: 't040_sgpt_alt',
    testId: 'T040',
    title: 'SGPT / ALT',
    subtitle: 'Biochemistry',
    match: ['sgpt / alt', 'sgpt', 'alt'],
    items: [
      { name: 'SGPT / ALT', unit: 'U/L', range: '5-40' }
    ]
  },
  t041_alkaline_phosphatase_alp: {
    id: 't041_alkaline_phosphatase_alp',
    testId: 'T041',
    title: 'ALKALINE PHOSPHATASE (ALP)',
    subtitle: 'Biochemistry',
    match: ['alkaline phosphatase', 'alp'],
    items: [
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '44-147' }
    ]
  },
  t042_ggt: {
    id: 't042_ggt',
    testId: 'T042',
    title: 'GGT',
    subtitle: 'Biochemistry',
    match: ['ggt', 'gamma glutamyl transferase'],
    items: [
      { name: 'GGT', unit: 'U/L', range: 'M: 10-71 | F: 6-42' }
    ]
  },
  t043_serum_total_protein: {
    id: 't043_serum_total_protein',
    testId: 'T043',
    title: 'SERUM TOTAL PROTEIN',
    subtitle: 'Biochemistry',
    match: ['serum total protein', 'total protein'],
    items: [
      { name: 'Total Protein', unit: 'g/dL', range: '6.0-8.3' }
    ]
  },
  t044_serum_albumin: {
    id: 't044_serum_albumin',
    testId: 'T044',
    title: 'SERUM ALBUMIN',
    subtitle: 'Biochemistry',
    match: ['serum albumin', 'albumin'],
    items: [
      { name: 'Albumin', unit: 'g/dL', range: '3.5-5.2' }
    ]
  },
  t046_tsh: {
    id: 't046_tsh',
    testId: 'T046',
    title: 'TSH',
    subtitle: 'Immunoassay / Hormones',
    match: ['tsh', 'thyroid stimulating hormone'],
    items: [
      { name: 'TSH (3rd Generation)', unit: 'uIU/mL', range: '0.4-4.0' }
    ]
  },
  t047_total_t3: {
    id: 't047_total_t3',
    testId: 'T047',
    title: 'TOTAL T3',
    subtitle: 'Immunoassay / Hormones',
    match: ['total t3', 't3 total'],
    items: [
      { name: 'Total T3', unit: 'ng/dL', range: '80-200' }
    ]
  },
  t048_total_t4: {
    id: 't048_total_t4',
    testId: 'T048',
    title: 'TOTAL T4',
    subtitle: 'Immunoassay / Hormones',
    match: ['total t4', 't4 total'],
    items: [
      { name: 'Total T4', unit: 'ug/dL', range: '5.0-12.0' }
    ]
  },
  t049_reticulocyte_count: {
    id: 't049_reticulocyte_count',
    testId: 'T049',
    title: 'RETICULOCYTE COUNT',
    subtitle: 'Hematology',
    match: ['reticulocyte count', 'retic count'],
    items: [
      { name: 'Reticulocyte Count', unit: '%', range: '0.5-2.5 (adults)' }
    ]
  },
  t050_absolute_eosinophil_count_aec: {
    id: 't050_absolute_eosinophil_count_aec',
    testId: 'T050',
    title: 'ABSOLUTE EOSINOPHIL COUNT (AEC)',
    subtitle: 'Hematology',
    match: ['absolute eosinophil count', 'aec'],
    items: [
      { name: 'Absolute Eosinophil Count', unit: 'cells/cu.mm', range: '40-440' }
    ]
  },
  t054_d_dimer: {
    id: 't054_d_dimer',
    testId: 'T054',
    title: 'D-DIMER',
    subtitle: 'Hematology / Coagulation',
    match: ['d-dimer', 'd dimer'],
    items: [
      { name: 'D-Dimer', unit: 'ng/mL FEU', range: '<500' }
    ]
  },
  t055_fibrinogen: {
    id: 't055_fibrinogen',
    testId: 'T055',
    title: 'FIBRINOGEN',
    subtitle: 'Hematology / Coagulation',
    match: ['fibrinogen'],
    items: [
      { name: 'Fibrinogen', unit: 'mg/dL', range: '200-400' }
    ]
  },
  t057_g6pd_quantitative: {
    id: 't057_g6pd_quantitative',
    testId: 'T057',
    title: 'G6PD (QUANTITATIVE)',
    subtitle: 'Hematology',
    match: ['g6pd (quantitative)', 'g6pd'],
    items: [
      { name: 'G6PD Activity', unit: 'U/g Hb', range: '4.6-13.5' }
    ]
  },
  t058_sickling_test: {
    id: 't058_sickling_test',
    testId: 'T058',
    title: 'SICKLING TEST',
    subtitle: 'Hematology',
    match: ['sickling test', 'sickle cell'],
    items: [
      { name: 'Sickling Test', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t060_malaria_parasite_mp_smear: {
    id: 't060_malaria_parasite_mp_smear',
    testId: 'T060',
    title: 'MALARIA PARASITE (MP) SMEAR',
    subtitle: 'Hematology',
    match: ['malaria parasite (mp) smear', 'mp smear', 'malaria smear'],
    items: [
      { name: 'Malaria Parasite', unit: '-', range: 'Not seen' }
    ]
  },
  t063_serum_ferritin: {
    id: 't063_serum_ferritin',
    testId: 'T063',
    title: 'SERUM FERRITIN',
    subtitle: 'Immunoassay / Hormones',
    match: ['serum ferritin', 'ferritin'],
    items: [
      { name: 'Ferritin', unit: 'ng/mL', range: 'M: 30-400 | F: 13-150' }
    ]
  },
  t064_serum_magnesium: {
    id: 't064_serum_magnesium',
    testId: 'T064',
    title: 'SERUM MAGNESIUM',
    subtitle: 'Biochemistry',
    match: ['serum magnesium', 'magnesium'],
    items: [
      { name: 'Magnesium', unit: 'mg/dL', range: '1.6-2.6' }
    ]
  },
  t065_serum_amylase: {
    id: 't065_serum_amylase',
    testId: 'T065',
    title: 'SERUM AMYLASE',
    subtitle: 'Biochemistry',
    match: ['serum amylase', 'amylase'],
    items: [
      { name: 'Amylase', unit: 'U/L', range: '28-100' }
    ]
  },
  t066_serum_lipase: {
    id: 't066_serum_lipase',
    testId: 'T066',
    title: 'SERUM LIPASE',
    subtitle: 'Biochemistry',
    match: ['serum lipase', 'lipase'],
    items: [
      { name: 'Lipase', unit: 'U/L', range: '13-60' }
    ]
  },
  t067_ldh_lactate_dehydrogenase: {
    id: 't067_ldh_lactate_dehydrogenase',
    testId: 'T067',
    title: 'LDH (LACTATE DEHYDROGENASE)',
    subtitle: 'Biochemistry',
    match: ['ldh (lactate dehydrogenase)', 'ldh'],
    items: [
      { name: 'LDH', unit: 'U/L', range: '140-280' }
    ]
  },
  t068_cpk_total_creatine_kinase: {
    id: 't068_cpk_total_creatine_kinase',
    testId: 'T068',
    title: 'CPK (TOTAL CREATINE KINASE)',
    subtitle: 'Biochemistry',
    match: ['cpk (total creatine kinase)', 'cpk total', 'cpk'],
    items: [
      { name: 'CPK Total', unit: 'U/L', range: 'M: 39-308 | F: 26-192' }
    ]
  },
  t069_ck_mb: {
    id: 't069_ck_mb',
    testId: 'T069',
    title: 'CK-MB',
    subtitle: 'Biochemistry',
    match: ['ck-mb', 'ck mb'],
    items: [
      { name: 'CK-MB', unit: 'U/L', range: '<25' }
    ]
  },
  t070_troponin_i_quantitative: {
    id: 't070_troponin_i_quantitative',
    testId: 'T070',
    title: 'TROPONIN I (QUANTITATIVE)',
    subtitle: 'Cardiac markers',
    match: ['troponin i (quantitative)', 'troponin i', 'trop i'],
    items: [
      { name: 'Troponin I', unit: 'ng/mL', range: '<0.04 (conventional assay)' }
    ]
  },
  t071_nt_probnp: {
    id: 't071_nt_probnp',
    testId: 'T071',
    title: 'NT-PROBNP',
    subtitle: 'Cardiac markers',
    match: ['nt-probnp', 'probnp'],
    items: [
      { name: 'NT-proBNP', unit: 'pg/mL', range: '<125 (age <75 yrs); age-dependent cut-offs for heart failure' }
    ]
  },
  t072_homocysteine: {
    id: 't072_homocysteine',
    testId: 'T072',
    title: 'HOMOCYSTEINE',
    subtitle: 'Biochemistry',
    match: ['homocysteine', 'serum homocysteine'],
    items: [
      { name: 'Homocysteine', unit: 'umol/L', range: '5-15' }
    ]
  },
  t073_hs_crp_high_sensitivity_crp: {
    id: 't073_hs_crp_high_sensitivity_crp',
    testId: 'T073',
    title: 'HS-CRP (HIGH SENSITIVITY CRP)',
    subtitle: 'Cardiac markers',
    match: ['hs-crp (high sensitivity crp)', 'hs-crp', 'hs crp'],
    items: [
      { name: 'hs-CRP', unit: 'mg/L', range: '<1.0 Low risk | 1.0-3.0 Average risk | >3.0 High risk (cardiovascular)' }
    ]
  },
  t074_lipoprotein_a: {
    id: 't074_lipoprotein_a',
    testId: 'T074',
    title: 'LIPOPROTEIN (A)',
    subtitle: 'Cardiac markers',
    match: ['lipoprotein (a)', 'lipoprotein a', 'lp(a)'],
    items: [
      { name: 'Lipoprotein (a)', unit: 'mg/dL', range: '<30' }
    ]
  },
  t076_c_peptide_fasting: {
    id: 't076_c_peptide_fasting',
    testId: 'T076',
    title: 'C-PEPTIDE (FASTING)',
    subtitle: 'Immunoassay / Hormones',
    match: ['c-peptide (fasting)', 'c-peptide', 'c peptide'],
    items: [
      { name: 'C-Peptide', unit: 'ng/mL', range: '1.1-4.4' }
    ]
  },
  t077_fructosamine: {
    id: 't077_fructosamine',
    testId: 'T077',
    title: 'FRUCTOSAMINE',
    subtitle: 'Biochemistry',
    match: ['fructosamine'],
    items: [
      { name: 'Fructosamine', unit: 'umol/L', range: '205-285' }
    ]
  },
  t079_serum_zinc: {
    id: 't079_serum_zinc',
    testId: 'T079',
    title: 'SERUM ZINC',
    subtitle: 'Biochemistry',
    match: ['serum zinc', 'zinc'],
    items: [
      { name: 'Zinc', unit: 'ug/dL', range: '70-120' }
    ]
  },
  t080_procalcitonin_pct: {
    id: 't080_procalcitonin_pct',
    testId: 'T080',
    title: 'PROCALCITONIN (PCT)',
    subtitle: 'Biochemistry',
    match: ['procalcitonin (pct)', 'procalcitonin', 'pct'],
    items: [
      { name: 'Procalcitonin', unit: 'ng/mL', range: '<0.5 Low risk of sepsis | 0.5-2.0 Moderate | >2.0 High risk' }
    ]
  },
  t081_serum_lactate_venous: {
    id: 't081_serum_lactate_venous',
    testId: 'T081',
    title: 'SERUM LACTATE (VENOUS)',
    subtitle: 'Biochemistry',
    match: ['serum lactate (venous)', 'serum lactate', 'lactate'],
    items: [
      { name: 'Lactate', unit: 'mmol/L', range: '0.5-2.2' }
    ]
  },
  t082_total_ige: {
    id: 't082_total_ige',
    testId: 'T082',
    title: 'TOTAL IGE',
    subtitle: 'Immunoassay / Hormones',
    match: ['total ige', 'ige'],
    items: [
      { name: 'Total IgE', unit: 'IU/mL', range: '<100 (adults)' }
    ]
  },
  t084_anti_tpo_thyroid_peroxidase_antibody: {
    id: 't084_anti_tpo_thyroid_peroxidase_antibody',
    testId: 'T084',
    title: 'ANTI-TPO (THYROID PEROXIDASE ANTIBODY)',
    subtitle: 'Immunoassay / Hormones',
    match: ['anti-tpo', 'anti thyroid peroxidase', 'anti tpo'],
    items: [
      { name: 'Anti-TPO', unit: 'IU/mL', range: '<35' }
    ]
  },
  t085_prolactin: {
    id: 't085_prolactin',
    testId: 'T085',
    title: 'PROLACTIN',
    subtitle: 'Immunoassay / Hormones',
    match: ['prolactin', 'serum prolactin'],
    items: [
      { name: 'Prolactin', unit: 'ng/mL', range: 'M: 4.0-15.2 | F (non-pregnant): 4.8-23.3' }
    ]
  },
  t086_fsh: {
    id: 't086_fsh',
    testId: 'T086',
    title: 'FSH',
    subtitle: 'Immunoassay / Hormones',
    match: ['fsh', 'follicle stimulating hormone'],
    items: [
      { name: 'FSH', unit: 'mIU/mL', range: 'M: 1.5-12.4 | F: Follicular 3.5-12.5, Mid-cycle 4.7-21.5, Luteal 1.7-7.7, Post-menopause 25.8-134.8' }
    ]
  },
  t087_lh: {
    id: 't087_lh',
    testId: 'T087',
    title: 'LH',
    subtitle: 'Immunoassay / Hormones',
    match: ['lh', 'luteinizing hormone'],
    items: [
      { name: 'LH', unit: 'mIU/mL', range: 'M: 1.7-8.6 | F: Follicular 2.4-12.6, Mid-cycle 14.0-95.6, Luteal 1.0-11.4, Post-menopause 7.7-58.5' }
    ]
  },
  t088_testosterone_total: {
    id: 't088_testosterone_total',
    testId: 'T088',
    title: 'TESTOSTERONE (TOTAL)',
    subtitle: 'Immunoassay / Hormones',
    match: ['testosterone (total)', 'testosterone total', 'testosterone'],
    items: [
      { name: 'Testosterone Total', unit: 'ng/dL', range: 'M: 249-836 | F: 8-48' }
    ]
  },
  t089_estradiol_e2: {
    id: 't089_estradiol_e2',
    testId: 'T089',
    title: 'ESTRADIOL (E2)',
    subtitle: 'Immunoassay / Hormones',
    match: ['estradiol (e2)', 'estradiol', 'e2'],
    items: [
      { name: 'Estradiol', unit: 'pg/mL', range: 'M: 11-44 | F: Follicular 12.5-166, Mid-cycle 85.8-498, Luteal 43.8-211, Post-menopause <54.7' }
    ]
  },
  t090_progesterone: {
    id: 't090_progesterone',
    testId: 'T090',
    title: 'PROGESTERONE',
    subtitle: 'Immunoassay / Hormones',
    match: ['progesterone'],
    items: [
      { name: 'Progesterone', unit: 'ng/mL', range: 'M: 0.2-1.4 | F: Follicular 0.2-1.5, Ovulation 0.8-3.0, Luteal 1.7-27.0, Post-menopause 0.1-0.8' }
    ]
  },
  t091_cortisol_morning: {
    id: 't091_cortisol_morning',
    testId: 'T091',
    title: 'CORTISOL (MORNING)',
    subtitle: 'Immunoassay / Hormones',
    match: ['cortisol (morning)', 'cortisol morning', 'cortisol'],
    items: [
      { name: 'Cortisol', unit: 'ug/dL', range: 'Morning: 6.2-19.4 | Evening: 2.3-11.9' }
    ]
  },
  t092_pth_intact_parathyroid_hormone: {
    id: 't092_pth_intact_parathyroid_hormone',
    testId: 'T092',
    title: 'PTH (INTACT PARATHYROID HORMONE)',
    subtitle: 'Immunoassay / Hormones',
    match: ['pth (intact parathyroid hormone)', 'pth intact', 'parathyroid hormone', 'pth'],
    items: [
      { name: 'Intact PTH', unit: 'pg/mL', range: '15-65' }
    ]
  },
  t093_beta_hcg_quantitative: {
    id: 't093_beta_hcg_quantitative',
    testId: 'T093',
    title: 'BETA HCG (QUANTITATIVE)',
    subtitle: 'Immunoassay / Hormones',
    match: ['beta hcg (quantitative)', 'beta hcg', 'b-hcg'],
    items: [
      { name: 'Beta hCG', unit: 'mIU/mL', range: 'Non-pregnant: <5 | >25 suggests pregnancy; rises with gestational age' }
    ]
  },
  t094_amh_anti_mullerian_hormone: {
    id: 't094_amh_anti_mullerian_hormone',
    testId: 'T094',
    title: 'AMH (ANTI-MULLERIAN HORMONE)',
    subtitle: 'Immunoassay / Hormones',
    match: ['amh (anti-mullerian hormone)', 'anti mullerian hormone', 'amh'],
    items: [
      { name: 'AMH', unit: 'ng/mL', range: 'Age-dependent. About 1.0-3.5 (age 20-35 yrs) | <1.0 Low ovarian reserve' }
    ]
  },
  t095_serum_folate_folic_acid: {
    id: 't095_serum_folate_folic_acid',
    testId: 'T095',
    title: 'SERUM FOLATE (FOLIC ACID)',
    subtitle: 'Immunoassay / Hormones',
    match: ['serum folate (folic acid)', 'folic acid', 'serum folate'],
    items: [
      { name: 'Folate', unit: 'ng/mL', range: '4.6-18.7' }
    ]
  },
  t099_chikungunya_igm: {
    id: 't099_chikungunya_igm',
    testId: 'T099',
    title: 'CHIKUNGUNYA IGM',
    subtitle: 'Serology',
    match: ['chikungunya igm', 'chikungunya'],
    items: [
      { name: 'Chikungunya IgM', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t100_scrub_typhus_igm: {
    id: 't100_scrub_typhus_igm',
    testId: 'T100',
    title: 'SCRUB TYPHUS IGM',
    subtitle: 'Serology',
    match: ['scrub typhus igm', 'scrub typhus'],
    items: [
      { name: 'Scrub Typhus IgM', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t101_leptospira_igm: {
    id: 't101_leptospira_igm',
    testId: 'T101',
    title: 'LEPTOSPIRA IGM',
    subtitle: 'Serology',
    match: ['leptospira igm', 'leptospira'],
    items: [
      { name: 'Leptospira IgM', unit: '-', range: 'Negative', defaultVal: 'Negative' }
    ]
  },
  t102_hiv_1_2_antibodies_screening: {
    id: 't102_hiv_1_2_antibodies_screening',
    testId: 'T102',
    title: 'HIV 1 & 2 ANTIBODIES (SCREENING)',
    subtitle: 'Serology',
    match: ['hiv 1 & 2 antibodies (screening)', 'hiv 1 & 2', 'hiv rapid', 'hiv'],
    items: [
      { name: 'HIV 1 & 2', unit: '-', range: 'Non-reactive', defaultVal: 'Non-reactive' }
    ]
  },
  t103_hbsag_hepatitis_b_surface_antigen: {
    id: 't103_hbsag_hepatitis_b_surface_antigen',
    testId: 'T103',
    title: 'HBSAG (HEPATITIS B SURFACE ANTIGEN)',
    subtitle: 'Serology',
    match: ['hbsag (hepatitis b surface antigen)', 'hbsag', 'hepatitis b'],
    items: [
      { name: 'HBsAg', unit: '-', range: 'Non-reactive', defaultVal: 'Non-reactive' }
    ]
  },
  t104_anti_hcv_hepatitis_c_antibody: {
    id: 't104_anti_hcv_hepatitis_c_antibody',
    testId: 'T104',
    title: 'ANTI-HCV (HEPATITIS C ANTIBODY)',
    subtitle: 'Serology',
    match: ['anti-hcv (hepatitis c antibody)', 'anti-hcv', 'hcv'],
    items: [
      { name: 'Anti-HCV', unit: '-', range: 'Non-reactive', defaultVal: 'Non-reactive' }
    ]
  },
  t105_vdrl_rpr_syphilis: {
    id: 't105_vdrl_rpr_syphilis',
    testId: 'T105',
    title: 'VDRL / RPR (SYPHILIS)',
    subtitle: 'Serology',
    match: ['vdrl / rpr (syphilis)', 'vdrl', 'rpr', 'syphilis'],
    items: [
      { name: 'VDRL / RPR', unit: '-', range: 'Non-reactive', defaultVal: 'Non-reactive' }
    ]
  },
  t106_anti_hbs_hepatitis_b_surface_antibody: {
    id: 't106_anti_hbs_hepatitis_b_surface_antibody',
    testId: 'T106',
    title: 'ANTI-HBS (HEPATITIS B SURFACE ANTIBODY)',
    subtitle: 'Serology',
    match: ['anti-hbs (hepatitis b surface antibody)', 'anti-hbs'],
    items: [
      { name: 'Anti-HBs', unit: 'mIU/mL', range: '>10 Immune / protected | <10 Non-immune' }
    ]
  },
  t107_ra_factor_rheumatoid_factor: {
    id: 't107_ra_factor_rheumatoid_factor',
    testId: 'T107',
    title: 'RA FACTOR (RHEUMATOID FACTOR)',
    subtitle: 'Serology',
    match: ['ra factor (rheumatoid factor)', 'ra factor', 'rheumatoid factor'],
    items: [
      { name: 'RA Factor', unit: 'IU/mL', range: '<14' }
    ]
  },
  t108_aso_titre: {
    id: 't108_aso_titre',
    testId: 'T108',
    title: 'ASO TITRE',
    subtitle: 'Serology',
    match: ['aso titre', 'aso'],
    items: [
      { name: 'ASO', unit: 'IU/mL', range: '<200 (adults) | <250 (children)' }
    ]
  },
  t109_anti_ccp: {
    id: 't109_anti_ccp',
    testId: 'T109',
    title: 'ANTI-CCP',
    subtitle: 'Serology',
    match: ['anti-ccp', 'anti ccp'],
    items: [
      { name: 'Anti-CCP', unit: 'U/mL', range: '<20 Negative (kit-specific)' }
    ]
  },
  t111_psa_total: {
    id: 't111_psa_total',
    testId: 'T111',
    title: 'PSA TOTAL',
    subtitle: 'Tumor markers',
    match: ['psa total', 'prostate specific antigen'],
    items: [
      { name: 'PSA Total', unit: 'ng/mL', range: '0-4.0 (age-specific limits are also used)' }
    ]
  },
  t113_cea: {
    id: 't113_cea',
    testId: 'T113',
    title: 'CEA',
    subtitle: 'Tumor markers',
    match: ['cea', 'carcinoembryonic antigen'],
    items: [
      { name: 'CEA', unit: 'ng/mL', range: 'Non-smoker <3.0 | Smoker <5.0' }
    ]
  },
  t114_ca_125: {
    id: 't114_ca_125',
    testId: 'T114',
    title: 'CA-125',
    subtitle: 'Tumor markers',
    match: ['ca-125', 'ca 125', 'ovarian cancer marker'],
    items: [
      { name: 'CA-125', unit: 'U/mL', range: '<35' }
    ]
  },
  t115_ca_19_9: {
    id: 't115_ca_19_9',
    testId: 'T115',
    title: 'CA 19-9',
    subtitle: 'Tumor markers',
    match: ['ca 19-9', 'ca 19.9', 'pancreatic marker'],
    items: [
      { name: 'CA 19-9', unit: 'U/mL', range: '<37' }
    ]
  },
  t116_afp_alpha_fetoprotein: {
    id: 't116_afp_alpha_fetoprotein',
    testId: 'T116',
    title: 'AFP (ALPHA-FETOPROTEIN)',
    subtitle: 'Tumor markers',
    match: ['afp (alpha-fetoprotein)', 'alpha fetoprotein', 'afp'],
    items: [
      { name: 'AFP', unit: 'ng/mL', range: '<10 (non-pregnant adults)' }
    ]
  },
  t117_ca_15_3: {
    id: 't117_ca_15_3',
    testId: 'T117',
    title: 'CA 15-3',
    subtitle: 'Tumor markers',
    match: ['ca 15-3', 'ca 15.3', 'breast cancer marker'],
    items: [
      { name: 'CA 15-3', unit: 'U/mL', range: '<30' }
    ]
  },
};

/**
 * Master parameter dictionary of all 224 laboratory test parameters
 */
const TEST_PARAMETERS_MASTER = [
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Hemoglobin', unit: 'g/dL', range: 'M: 13.0-17.0 | F: 12.0-15.0' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Total RBC Count', unit: 'million/cu.mm', range: 'M: 4.5-5.5 | F: 3.8-4.8' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'PCV / Hematocrit (HCT)', unit: '%', range: 'M: 40-50 | F: 36-46' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'MCV', unit: 'fL', range: '83-101' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'MCH', unit: 'pg', range: '27-32' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'MCHC', unit: 'g/dL', range: '31.5-34.5' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'RDW-CV', unit: '%', range: '11.6-14.0' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Total Leucocyte Count (TLC)', unit: 'cells/cu.mm', range: '4000-10000' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Neutrophils', unit: '%', range: '40-80' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Lymphocytes', unit: '%', range: '20-40' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Eosinophils', unit: '%', range: '1-6' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Monocytes', unit: '%', range: '2-10' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Basophils', unit: '%', range: '0-2' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'Platelet Count', unit: 'cells/cu.mm', range: '150000-410000' },
  { testId: 'T001', testName: 'CBC (Complete Blood Count)', name: 'MPV', unit: 'fL', range: '7.5-11.5' },
  { testId: 'T002', testName: 'Hemoglobin (Hb)', name: 'Hemoglobin', unit: 'g/dL', range: 'M: 13.0-17.0 | F: 12.0-15.0' },
  { testId: 'T003', testName: 'ESR (Westergren)', name: 'ESR (1st hour)', unit: 'mm/hr', range: 'M: 0-15 | F: 0-20' },
  { testId: 'T004', testName: 'Blood Group & Rh Factor', name: 'ABO Group', unit: '-', range: '-' },
  { testId: 'T004', testName: 'Blood Group & Rh Factor', name: 'Rh Factor', unit: '-', range: '-' },
  { testId: 'T005', testName: 'Blood Sugar Fasting (FBS)', name: 'Glucose - Fasting', unit: 'mg/dL', range: '70-99 Normal | 100-125 Impaired fasting glucose | >=126 Diabetes range' },
  { testId: 'T006', testName: 'Blood Sugar Post Prandial (PPBS)', name: 'Glucose - Post Prandial (2 hr)', unit: 'mg/dL', range: '<140 Normal | 140-199 Impaired glucose tolerance | >=200 Diabetes range' },
  { testId: 'T007', testName: 'Blood Sugar Random (RBS)', name: 'Glucose - Random', unit: 'mg/dL', range: 'Generally <140; >=200 with symptoms suggests diabetes' },
  { testId: 'T008', testName: 'HbA1c (Glycosylated Hemoglobin)', name: 'HbA1c', unit: '%', range: '<5.7 Normal | 5.7-6.4 Prediabetes | >=6.5 Diabetes' },
  { testId: 'T008', testName: 'HbA1c (Glycosylated Hemoglobin)', name: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', range: '-' },
  { testId: 'T009', testName: 'Lipid Profile', name: 'Total Cholesterol', unit: 'mg/dL', range: '<200 Desirable | 200-239 Borderline high | >=240 High' },
  { testId: 'T009', testName: 'Lipid Profile', name: 'Triglycerides', unit: 'mg/dL', range: '<150 Normal | 150-199 Borderline | 200-499 High | >=500 Very high' },
  { testId: 'T009', testName: 'Lipid Profile', name: 'HDL Cholesterol', unit: 'mg/dL', range: 'M: >40 | F: >50 (>60 protective)' },
  { testId: 'T009', testName: 'Lipid Profile', name: 'LDL Cholesterol', unit: 'mg/dL', range: '<100 Optimal | 100-129 Near optimal | 130-159 Borderline | 160-189 High | >=190 Very high' },
  { testId: 'T009', testName: 'Lipid Profile', name: 'VLDL Cholesterol', unit: 'mg/dL', range: '5-40' },
  { testId: 'T009', testName: 'Lipid Profile', name: 'Non-HDL Cholesterol', unit: 'mg/dL', range: '<130 Desirable' },
  { testId: 'T009', testName: 'Lipid Profile', name: 'Total Chol / HDL Ratio', unit: 'ratio', range: '<5.0' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Urea', unit: 'mg/dL', range: '15-45' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-21' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Creatinine', unit: 'mg/dL', range: 'M: 0.7-1.3 | F: 0.6-1.1' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'eGFR', unit: 'mL/min/1.73 m2', range: '>=90 Normal' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Uric Acid', unit: 'mg/dL', range: 'M: 3.5-7.2 | F: 2.6-6.0' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Calcium', unit: 'mg/dL', range: '8.6-10.2' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Phosphorus', unit: 'mg/dL', range: '2.5-4.5' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Sodium', unit: 'mmol/L', range: '135-145' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Potassium', unit: 'mmol/L', range: '3.5-5.1' },
  { testId: 'T010', testName: 'KFT / RFT (Kidney Function Test)', name: 'Chloride', unit: 'mmol/L', range: '98-107' },
  { testId: 'T011', testName: 'Serum Creatinine', name: 'Creatinine', unit: 'mg/dL', range: 'M: 0.7-1.3 | F: 0.6-1.1' },
  { testId: 'T012', testName: 'Serum Uric Acid', name: 'Uric Acid', unit: 'mg/dL', range: 'M: 3.5-7.2 | F: 2.6-6.0' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'Bilirubin - Total', unit: 'mg/dL', range: '0.2-1.2' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'Bilirubin - Direct', unit: 'mg/dL', range: '0.0-0.3' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'Bilirubin - Indirect', unit: 'mg/dL', range: '0.2-0.9' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'SGOT / AST', unit: 'U/L', range: '5-40' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'SGPT / ALT', unit: 'U/L', range: '5-40' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '44-147' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'GGT', unit: 'U/L', range: 'M: 10-71 | F: 6-42' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'Total Protein', unit: 'g/dL', range: '6.0-8.3' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'Albumin', unit: 'g/dL', range: '3.5-5.2' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'Globulin', unit: 'g/dL', range: '2.0-3.5' },
  { testId: 'T013', testName: 'LFT (Liver Function Test)', name: 'A/G Ratio', unit: 'ratio', range: '1.1-2.5' },
  { testId: 'T014', testName: 'Thyroid Profile (T3, T4, TSH)', name: 'Total T3', unit: 'ng/dL', range: '80-200' },
  { testId: 'T014', testName: 'Thyroid Profile (T3, T4, TSH)', name: 'Total T4', unit: 'ug/dL', range: '5.0-12.0' },
  { testId: 'T014', testName: 'Thyroid Profile (T3, T4, TSH)', name: 'TSH (3rd Generation)', unit: 'uIU/mL', range: '0.4-4.0' },
  { testId: 'T015', testName: 'Vitamin D (25-OH)', name: '25-OH Vitamin D', unit: 'ng/mL', range: '<20 Deficient | 20-29 Insufficient | 30-100 Sufficient | >100 Possible toxicity' },
  { testId: 'T016', testName: 'Vitamin B12', name: 'Vitamin B12', unit: 'pg/mL', range: '<200 Deficient | 200-300 Borderline | 300-900 Normal' },
  { testId: 'T017', testName: 'CRP (C-Reactive Protein) Quantitative', name: 'C-Reactive Protein (CRP)', unit: 'mg/L', range: '<5 (some kits <6)' },
  { testId: 'T018', testName: 'Serum Calcium', name: 'Calcium', unit: 'mg/dL', range: '8.6-10.2' },
  { testId: 'T019', testName: 'Serum Electrolytes (Na, K, Cl)', name: 'Sodium', unit: 'mmol/L', range: '135-145' },
  { testId: 'T019', testName: 'Serum Electrolytes (Na, K, Cl)', name: 'Potassium', unit: 'mmol/L', range: '3.5-5.1' },
  { testId: 'T019', testName: 'Serum Electrolytes (Na, K, Cl)', name: 'Chloride', unit: 'mmol/L', range: '98-107' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Volume', unit: 'mL', range: '-' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Colour', unit: '-', range: 'Pale yellow' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Appearance', unit: '-', range: 'Clear' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Specific Gravity', unit: '-', range: '1.005-1.030' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'pH', unit: '-', range: '4.6-8.0' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Protein (Albumin)', unit: '-', range: 'Nil' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Glucose (Sugar)', unit: '-', range: 'Nil' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Ketones', unit: '-', range: 'Negative' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Bilirubin', unit: '-', range: 'Negative' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Urobilinogen', unit: '-', range: 'Normal' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Blood', unit: '-', range: 'Negative' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Nitrite', unit: '-', range: 'Negative' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Leucocyte Esterase', unit: '-', range: 'Negative' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Pus Cells', unit: '/HPF', range: '0-5' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'RBCs', unit: '/HPF', range: 'Nil (0-2)' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Epithelial Cells', unit: '/HPF', range: 'Occasional / 0-5' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Casts', unit: '-', range: 'Nil' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Crystals', unit: '-', range: 'Nil' },
  { testId: 'T020', testName: 'Urine Routine & Microscopy', name: 'Bacteria / Yeast', unit: '-', range: 'Nil' },
  { testId: 'T021', testName: 'Blood Pressure (BP) & Vitals', name: 'Systolic BP', unit: 'mmHg', range: '<120 Normal | 120-139 Pre-hypertension | >=140 Hypertension' },
  { testId: 'T021', testName: 'Blood Pressure (BP) & Vitals', name: 'Diastolic BP', unit: 'mmHg', range: '<80 Normal | 80-89 Pre-hypertension | >=90 Hypertension' },
  { testId: 'T021', testName: 'Blood Pressure (BP) & Vitals', name: 'Pulse Rate', unit: 'beats/min', range: '60-100' },
  { testId: 'T021', testName: 'Blood Pressure (BP) & Vitals', name: 'Position / Arm', unit: '-', range: '-' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'Heart Rate', unit: 'beats/min', range: '60-100' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'Rhythm', unit: '-', range: 'Normal sinus rhythm' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'PR Interval', unit: 'ms', range: '120-200' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'QRS Duration', unit: 'ms', range: '80-120' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'QT Interval', unit: 'ms', range: '350-440' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'QTc (corrected)', unit: 'ms', range: 'M: <450 | F: <460' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'QRS Axis', unit: 'degrees', range: '-30 to +90' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'ST-T Changes', unit: '-', range: 'None' },
  { testId: 'T022', testName: 'ECG (12-lead)', name: 'Interpretation', unit: '-', range: 'Normal ECG' },
  { testId: 'T025', testName: 'Malaria Antigen (Rapid)', name: 'Malaria Antigen (P. falciparum / P. vivax)', unit: '-', range: 'Negative' },
  { testId: 'T026', testName: 'Dengue NS1 Antigen (Rapid)', name: 'Dengue NS1 Antigen', unit: '-', range: 'Negative' },
  { testId: 'T027', testName: 'Platelet Count', name: 'Platelet Count', unit: 'cells/cu.mm', range: '150000-410000' },
  { testId: 'T028', testName: 'TLC / DLC', name: 'Total Leucocyte Count (TLC)', unit: 'cells/cu.mm', range: '4000-10000' },
  { testId: 'T028', testName: 'TLC / DLC', name: 'Neutrophils', unit: '%', range: '40-80' },
  { testId: 'T028', testName: 'TLC / DLC', name: 'Lymphocytes', unit: '%', range: '20-40' },
  { testId: 'T028', testName: 'TLC / DLC', name: 'Eosinophils', unit: '%', range: '1-6' },
  { testId: 'T028', testName: 'TLC / DLC', name: 'Monocytes', unit: '%', range: '2-10' },
  { testId: 'T028', testName: 'TLC / DLC', name: 'Basophils', unit: '%', range: '0-2' },
  { testId: 'T029', testName: 'Total Cholesterol', name: 'Total Cholesterol', unit: 'mg/dL', range: '<200 Desirable | 200-239 Borderline high | >=240 High' },
  { testId: 'T030', testName: 'Triglycerides', name: 'Triglycerides', unit: 'mg/dL', range: '<150 Normal | 150-199 Borderline | 200-499 High | >=500 Very high' },
  { testId: 'T031', testName: 'HDL Cholesterol', name: 'HDL Cholesterol', unit: 'mg/dL', range: 'M: >40 | F: >50 (>60 protective)' },
  { testId: 'T032', testName: 'LDL Cholesterol', name: 'LDL Cholesterol', unit: 'mg/dL', range: '<100 Optimal | 100-129 Near optimal | 130-159 Borderline | 160-189 High | >=190 Very high' },
  { testId: 'T033', testName: 'Serum Urea / BUN', name: 'Urea', unit: 'mg/dL', range: '15-45' },
  { testId: 'T033', testName: 'Serum Urea / BUN', name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-21' },
  { testId: 'T034', testName: 'Serum Phosphorus', name: 'Phosphorus', unit: 'mg/dL', range: '2.5-4.5' },
  { testId: 'T035', testName: 'Serum Sodium', name: 'Sodium', unit: 'mmol/L', range: '135-145' },
  { testId: 'T036', testName: 'Serum Potassium', name: 'Potassium', unit: 'mmol/L', range: '3.5-5.1' },
  { testId: 'T037', testName: 'Serum Chloride', name: 'Chloride', unit: 'mmol/L', range: '98-107' },
  { testId: 'T038', testName: 'Serum Bilirubin (Total, Direct, Indirect)', name: 'Bilirubin - Total', unit: 'mg/dL', range: '0.2-1.2' },
  { testId: 'T038', testName: 'Serum Bilirubin (Total, Direct, Indirect)', name: 'Bilirubin - Direct', unit: 'mg/dL', range: '0.0-0.3' },
  { testId: 'T038', testName: 'Serum Bilirubin (Total, Direct, Indirect)', name: 'Bilirubin - Indirect', unit: 'mg/dL', range: '0.2-0.9' },
  { testId: 'T039', testName: 'SGOT / AST', name: 'SGOT / AST', unit: 'U/L', range: '5-40' },
  { testId: 'T040', testName: 'SGPT / ALT', name: 'SGPT / ALT', unit: 'U/L', range: '5-40' },
  { testId: 'T041', testName: 'Alkaline Phosphatase (ALP)', name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '44-147' },
  { testId: 'T042', testName: 'GGT', name: 'GGT', unit: 'U/L', range: 'M: 10-71 | F: 6-42' },
  { testId: 'T043', testName: 'Serum Total Protein', name: 'Total Protein', unit: 'g/dL', range: '6.0-8.3' },
  { testId: 'T044', testName: 'Serum Albumin', name: 'Albumin', unit: 'g/dL', range: '3.5-5.2' },
  { testId: 'T045', testName: 'Serum Protein Profile (TP, Albumin, Globulin, A/G)', name: 'Total Protein', unit: 'g/dL', range: '6.0-8.3' },
  { testId: 'T045', testName: 'Serum Protein Profile (TP, Albumin, Globulin, A/G)', name: 'Albumin', unit: 'g/dL', range: '3.5-5.2' },
  { testId: 'T045', testName: 'Serum Protein Profile (TP, Albumin, Globulin, A/G)', name: 'Globulin', unit: 'g/dL', range: '2.0-3.5' },
  { testId: 'T045', testName: 'Serum Protein Profile (TP, Albumin, Globulin, A/G)', name: 'A/G Ratio', unit: 'ratio', range: '1.1-2.5' },
  { testId: 'T046', testName: 'TSH', name: 'TSH (3rd Generation)', unit: 'uIU/mL', range: '0.4-4.0' },
  { testId: 'T047', testName: 'Total T3', name: 'Total T3', unit: 'ng/dL', range: '80-200' },
  { testId: 'T048', testName: 'Total T4', name: 'Total T4', unit: 'ug/dL', range: '5.0-12.0' },
  { testId: 'T049', testName: 'Reticulocyte Count', name: 'Reticulocyte Count', unit: '%', range: '0.5-2.5 (adults)' },
  { testId: 'T050', testName: 'Absolute Eosinophil Count (AEC)', name: 'Absolute Eosinophil Count', unit: 'cells/cu.mm', range: '40-440' },
  { testId: 'T051', testName: 'PT / INR (Prothrombin Time)', name: 'PT - Patient', unit: 'sec', range: '11.0-13.5 (kit-specific)' },
  { testId: 'T051', testName: 'PT / INR (Prothrombin Time)', name: 'PT - Control', unit: 'sec', range: '-' },
  { testId: 'T051', testName: 'PT / INR (Prothrombin Time)', name: 'INR', unit: 'ratio', range: '0.8-1.2 (non-anticoagulated); 2.0-3.0 therapeutic on warfarin (most indications)' },
  { testId: 'T052', testName: 'aPTT', name: 'aPTT - Patient', unit: 'sec', range: '25-35 (kit-specific)' },
  { testId: 'T052', testName: 'aPTT', name: 'aPTT - Control', unit: 'sec', range: '-' },
  { testId: 'T053', testName: 'Bleeding Time & Clotting Time (BT / CT)', name: 'Bleeding Time', unit: 'min', range: '1-5 (Duke method)' },
  { testId: 'T053', testName: 'Bleeding Time & Clotting Time (BT / CT)', name: 'Clotting Time', unit: 'min', range: '4-9 (Lee-White method)' },
  { testId: 'T054', testName: 'D-Dimer', name: 'D-Dimer', unit: 'ng/mL FEU', range: '<500' },
  { testId: 'T055', testName: 'Fibrinogen', name: 'Fibrinogen', unit: 'mg/dL', range: '200-400' },
  { testId: 'T056', testName: 'Hb Electrophoresis / HPLC', name: 'HbA', unit: '%', range: '95-98' },
  { testId: 'T056', testName: 'Hb Electrophoresis / HPLC', name: 'HbA2', unit: '%', range: '2.0-3.5' },
  { testId: 'T056', testName: 'Hb Electrophoresis / HPLC', name: 'HbF', unit: '%', range: '<1.0 (adults)' },
  { testId: 'T056', testName: 'Hb Electrophoresis / HPLC', name: 'HbS / Other variants', unit: '-', range: 'Not detected' },
  { testId: 'T057', testName: 'G6PD (Quantitative)', name: 'G6PD Activity', unit: 'U/g Hb', range: '4.6-13.5' },
  { testId: 'T058', testName: 'Sickling Test', name: 'Sickling Test', unit: '-', range: 'Negative' },
  { testId: 'T060', testName: 'Malaria Parasite (MP) Smear', name: 'Malaria Parasite', unit: '-', range: 'Not seen' },
  { testId: 'T062', testName: 'Iron Studies (Iron, TIBC, UIBC, Transferrin Saturation)', name: 'Serum Iron', unit: 'ug/dL', range: 'M: 65-175 | F: 50-170' },
  { testId: 'T062', testName: 'Iron Studies (Iron, TIBC, UIBC, Transferrin Saturation)', name: 'TIBC', unit: 'ug/dL', range: '250-450' },
  { testId: 'T062', testName: 'Iron Studies (Iron, TIBC, UIBC, Transferrin Saturation)', name: 'UIBC', unit: 'ug/dL', range: '110-370' },
  { testId: 'T062', testName: 'Iron Studies (Iron, TIBC, UIBC, Transferrin Saturation)', name: 'Transferrin Saturation', unit: '%', range: '20-50' },
  { testId: 'T063', testName: 'Serum Ferritin', name: 'Ferritin', unit: 'ng/mL', range: 'M: 30-400 | F: 13-150' },
  { testId: 'T064', testName: 'Serum Magnesium', name: 'Magnesium', unit: 'mg/dL', range: '1.6-2.6' },
  { testId: 'T065', testName: 'Serum Amylase', name: 'Amylase', unit: 'U/L', range: '28-100' },
  { testId: 'T066', testName: 'Serum Lipase', name: 'Lipase', unit: 'U/L', range: '13-60' },
  { testId: 'T067', testName: 'LDH (Lactate Dehydrogenase)', name: 'LDH', unit: 'U/L', range: '140-280' },
  { testId: 'T068', testName: 'CPK (Total Creatine Kinase)', name: 'CPK Total', unit: 'U/L', range: 'M: 39-308 | F: 26-192' },
  { testId: 'T069', testName: 'CK-MB', name: 'CK-MB', unit: 'U/L', range: '<25' },
  { testId: 'T070', testName: 'Troponin I (Quantitative)', name: 'Troponin I', unit: 'ng/mL', range: '<0.04 (conventional assay)' },
  { testId: 'T071', testName: 'NT-proBNP', name: 'NT-proBNP', unit: 'pg/mL', range: '<125 (age <75 yrs); age-dependent cut-offs for heart failure' },
  { testId: 'T072', testName: 'Homocysteine', name: 'Homocysteine', unit: 'umol/L', range: '5-15' },
  { testId: 'T073', testName: 'hs-CRP (High Sensitivity CRP)', name: 'hs-CRP', unit: 'mg/L', range: '<1.0 Low risk | 1.0-3.0 Average risk | >3.0 High risk (cardiovascular)' },
  { testId: 'T074', testName: 'Lipoprotein (a)', name: 'Lipoprotein (a)', unit: 'mg/dL', range: '<30' },
  { testId: 'T075', testName: 'Insulin Fasting & HOMA-IR', name: 'Glucose - Fasting', unit: 'mg/dL', range: '70-99' },
  { testId: 'T075', testName: 'Insulin Fasting & HOMA-IR', name: 'Insulin - Fasting', unit: 'uIU/mL', range: '2.6-24.9' },
  { testId: 'T075', testName: 'Insulin Fasting & HOMA-IR', name: 'HOMA-IR', unit: '-', range: '<2.5 (cut-off varies by population)' },
  { testId: 'T076', testName: 'C-Peptide (Fasting)', name: 'C-Peptide', unit: 'ng/mL', range: '1.1-4.4' },
  { testId: 'T077', testName: 'Fructosamine', name: 'Fructosamine', unit: 'umol/L', range: '205-285' },
  { testId: 'T078', testName: 'GTT (75 g Oral Glucose Tolerance Test)', name: 'Glucose - Fasting', unit: 'mg/dL', range: '70-99' },
  { testId: 'T078', testName: 'GTT (75 g Oral Glucose Tolerance Test)', name: 'Glucose - 1 Hour', unit: 'mg/dL', range: 'Optional; <180 (non-pregnant)' },
  { testId: 'T078', testName: 'GTT (75 g Oral Glucose Tolerance Test)', name: 'Glucose - 2 Hour', unit: 'mg/dL', range: '<140 Normal | 140-199 Impaired glucose tolerance | >=200 Diabetes' },
  { testId: 'T079', testName: 'Serum Zinc', name: 'Zinc', unit: 'ug/dL', range: '70-120' },
  { testId: 'T080', testName: 'Procalcitonin (PCT)', name: 'Procalcitonin', unit: 'ng/mL', range: '<0.5 Low risk of sepsis | 0.5-2.0 Moderate | >2.0 High risk' },
  { testId: 'T081', testName: 'Serum Lactate (Venous)', name: 'Lactate', unit: 'mmol/L', range: '0.5-2.2' },
  { testId: 'T082', testName: 'Total IgE', name: 'Total IgE', unit: 'IU/mL', range: '<100 (adults)' },
  { testId: 'T083', testName: 'Thyroid Profile - Free (FT3, FT4, TSH)', name: 'Free T3', unit: 'pg/mL', range: '2.0-4.4' },
  { testId: 'T083', testName: 'Thyroid Profile - Free (FT3, FT4, TSH)', name: 'Free T4', unit: 'ng/dL', range: '0.8-1.8' },
  { testId: 'T083', testName: 'Thyroid Profile - Free (FT3, FT4, TSH)', name: 'TSH (3rd Generation)', unit: 'uIU/mL', range: '0.4-4.0' },
  { testId: 'T084', testName: 'Anti-TPO (Thyroid Peroxidase Antibody)', name: 'Anti-TPO', unit: 'IU/mL', range: '<35' },
  { testId: 'T085', testName: 'Prolactin', name: 'Prolactin', unit: 'ng/mL', range: 'M: 4.0-15.2 | F (non-pregnant): 4.8-23.3' },
  { testId: 'T086', testName: 'FSH', name: 'FSH', unit: 'mIU/mL', range: 'M: 1.5-12.4 | F: Follicular 3.5-12.5, Mid-cycle 4.7-21.5, Luteal 1.7-7.7, Post-menopause 25.8-134.8' },
  { testId: 'T087', testName: 'LH', name: 'LH', unit: 'mIU/mL', range: 'M: 1.7-8.6 | F: Follicular 2.4-12.6, Mid-cycle 14.0-95.6, Luteal 1.0-11.4, Post-menopause 7.7-58.5' },
  { testId: 'T088', testName: 'Testosterone (Total)', name: 'Testosterone Total', unit: 'ng/dL', range: 'M: 249-836 | F: 8-48' },
  { testId: 'T089', testName: 'Estradiol (E2)', name: 'Estradiol', unit: 'pg/mL', range: 'M: 11-44 | F: Follicular 12.5-166, Mid-cycle 85.8-498, Luteal 43.8-211, Post-menopause <54.7' },
  { testId: 'T090', testName: 'Progesterone', name: 'Progesterone', unit: 'ng/mL', range: 'M: 0.2-1.4 | F: Follicular 0.2-1.5, Ovulation 0.8-3.0, Luteal 1.7-27.0, Post-menopause 0.1-0.8' },
  { testId: 'T091', testName: 'Cortisol (Morning)', name: 'Cortisol', unit: 'ug/dL', range: 'Morning: 6.2-19.4 | Evening: 2.3-11.9' },
  { testId: 'T092', testName: 'PTH (Intact Parathyroid Hormone)', name: 'Intact PTH', unit: 'pg/mL', range: '15-65' },
  { testId: 'T093', testName: 'Beta hCG (Quantitative)', name: 'Beta hCG', unit: 'mIU/mL', range: 'Non-pregnant: <5 | >25 suggests pregnancy; rises with gestational age' },
  { testId: 'T094', testName: 'AMH (Anti-Mullerian Hormone)', name: 'AMH', unit: 'ng/mL', range: 'Age-dependent. About 1.0-3.5 (age 20-35 yrs) | <1.0 Low ovarian reserve' },
  { testId: 'T095', testName: 'Serum Folate (Folic Acid)', name: 'Folate', unit: 'ng/mL', range: '4.6-18.7' },
  { testId: 'T096', testName: 'Widal Test (Slide / Tube)', name: 'S. Typhi O', unit: 'titre', range: '<1:80' },
  { testId: 'T096', testName: 'Widal Test (Slide / Tube)', name: 'S. Typhi H', unit: 'titre', range: '<1:80' },
  { testId: 'T096', testName: 'Widal Test (Slide / Tube)', name: 'S. Paratyphi AH', unit: 'titre', range: '<1:80' },
  { testId: 'T096', testName: 'Widal Test (Slide / Tube)', name: 'S. Paratyphi BH', unit: 'titre', range: '<1:80' },
  { testId: 'T097', testName: 'Typhidot (IgM / IgG)', name: 'Typhidot IgM', unit: '-', range: 'Negative' },
  { testId: 'T097', testName: 'Typhidot (IgM / IgG)', name: 'Typhidot IgG', unit: '-', range: 'Negative' },
  { testId: 'T098', testName: 'Dengue Antibodies (IgM / IgG)', name: 'Dengue IgM', unit: '-', range: 'Negative' },
  { testId: 'T098', testName: 'Dengue Antibodies (IgM / IgG)', name: 'Dengue IgG', unit: '-', range: 'Negative' },
  { testId: 'T099', testName: 'Chikungunya IgM', name: 'Chikungunya IgM', unit: '-', range: 'Negative' },
  { testId: 'T100', testName: 'Scrub Typhus IgM', name: 'Scrub Typhus IgM', unit: '-', range: 'Negative' },
  { testId: 'T101', testName: 'Leptospira IgM', name: 'Leptospira IgM', unit: '-', range: 'Negative' },
  { testId: 'T102', testName: 'HIV 1 & 2 Antibodies (Screening)', name: 'HIV 1 & 2', unit: '-', range: 'Non-reactive' },
  { testId: 'T103', testName: 'HBsAg (Hepatitis B Surface Antigen)', name: 'HBsAg', unit: '-', range: 'Non-reactive' },
  { testId: 'T104', testName: 'Anti-HCV (Hepatitis C Antibody)', name: 'Anti-HCV', unit: '-', range: 'Non-reactive' },
  { testId: 'T105', testName: 'VDRL / RPR (Syphilis)', name: 'VDRL / RPR', unit: '-', range: 'Non-reactive' },
  { testId: 'T106', testName: 'Anti-HBs (Hepatitis B Surface Antibody)', name: 'Anti-HBs', unit: 'mIU/mL', range: '>10 Immune / protected | <10 Non-immune' },
  { testId: 'T107', testName: 'RA Factor (Rheumatoid Factor)', name: 'RA Factor', unit: 'IU/mL', range: '<14' },
  { testId: 'T108', testName: 'ASO Titre', name: 'ASO', unit: 'IU/mL', range: '<200 (adults) | <250 (children)' },
  { testId: 'T109', testName: 'Anti-CCP', name: 'Anti-CCP', unit: 'U/mL', range: '<20 Negative (kit-specific)' },
  { testId: 'T110', testName: 'ANA (Antinuclear Antibody, IFA)', name: 'ANA', unit: '-', range: 'Negative' },
  { testId: 'T110', testName: 'ANA (Antinuclear Antibody, IFA)', name: 'ANA Titre', unit: 'titre', range: '<1:80' },
  { testId: 'T110', testName: 'ANA (Antinuclear Antibody, IFA)', name: 'ANA Pattern', unit: '-', range: '-' },
  { testId: 'T111', testName: 'PSA Total', name: 'PSA Total', unit: 'ng/mL', range: '0-4.0 (age-specific limits are also used)' },
  { testId: 'T112', testName: 'PSA Total & Free (Free/Total Ratio)', name: 'PSA Total', unit: 'ng/mL', range: '0-4.0' },
  { testId: 'T112', testName: 'PSA Total & Free (Free/Total Ratio)', name: 'PSA Free', unit: 'ng/mL', range: '-' },
  { testId: 'T112', testName: 'PSA Total & Free (Free/Total Ratio)', name: 'Free / Total PSA Ratio', unit: '%', range: '>25 favours benign | <10 higher suspicion' },
  { testId: 'T113', testName: 'CEA', name: 'CEA', unit: 'ng/mL', range: 'Non-smoker <3.0 | Smoker <5.0' },
  { testId: 'T114', testName: 'CA-125', name: 'CA-125', unit: 'U/mL', range: '<35' },
  { testId: 'T115', testName: 'CA 19-9', name: 'CA 19-9', unit: 'U/mL', range: '<37' },
  { testId: 'T116', testName: 'AFP (Alpha-Fetoprotein)', name: 'AFP', unit: 'ng/mL', range: '<10 (non-pregnant adults)' },
  { testId: 'T117', testName: 'CA 15-3', name: 'CA 15-3', unit: 'U/mL', range: '<30' },
];

/**
 * Finds a matching template for a given test name.
 * Prioritizes exact matches, panels, and known clinical keywords.
 * @param {string} testName
 * @returns {object|null}
 */
function findTemplate(testName) {
  if (!testName) return null;
  const n = testName.trim().toLowerCase();
  
  // 1. Direct key lookup or exact match check against any item in match array
  for (const key of Object.keys(TEST_TEMPLATES)) {
    const tmpl = TEST_TEMPLATES[key];
    if (tmpl.title && tmpl.title.trim().toLowerCase() === n) return tmpl;
    if (tmpl.match && tmpl.match.some(m => n === m.toLowerCase())) return tmpl;
  }
  
  // 2. Keyword substring matching (prioritize longer / more specific matches)
  const allTemplates = Object.values(TEST_TEMPLATES);
  let bestMatch = null;
  let bestMatchLen = 0;

  for (const tmpl of allTemplates) {
    if (!tmpl.match) continue;
    for (const m of tmpl.match) {
      const mLower = m.toLowerCase();
      if (mLower.length >= 3 && n.includes(mLower)) {
        if (mLower.length > bestMatchLen) {
          bestMatch = tmpl;
          bestMatchLen = mLower.length;
        }
      }
    }
  }
  
  return bestMatch;
}

/**
 * Finds parameter definition for any test name or parameter name.
 * @param {string} name
 * @returns {object|null}
 */
function findTestParameter(name) {
  if (!name) return null;
  const n = name.trim().toLowerCase();
  
  // Exact match
  const exact = TEST_PARAMETERS_MASTER.find(p => p.testName.toLowerCase() === n || p.name.toLowerCase() === n);
  if (exact) return exact;
  
  // Substring match
  const sub = TEST_PARAMETERS_MASTER.find(p => n.includes(p.testName.toLowerCase()) || n.includes(p.name.toLowerCase()) || p.testName.toLowerCase().includes(n));
  if (sub) return sub;
  
  return null;
}
