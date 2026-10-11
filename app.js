const $ = id => document.getElementById(id);
const load = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const store = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const CLINIC = 'Olive Diagnostic Raigarh';

const DEFAULT_USERS = [
  { name: 'admin', pass: '123456', role: 'admin' },
  { name: 'receptionist', pass: '123456', role: 'receptionist' },
  { name: 'reporter', pass: '123456', role: 'reporter' }
];
let users = load('users', null) || DEFAULT_USERS;
const MENUS = {
  register: ['Add Patient', 'bi-person-plus', ['receptionist']],
  receipt: ['New Custom Report', 'bi-plus-square', ['admin', 'reporter']],
  pending: ['Pending Reports', 'bi-hourglass-split', ['admin', 'reporter']],
  done: ['Completed Reports', 'bi-patch-check', ['admin', 'reporter']],
  saved: ['All Receipts', 'bi-folder2-open', ['admin', 'reporter']],
  tests: ['Manage Tests', 'bi-list-check', ['admin', 'reporter']],
  users: ['Users & Logins', 'bi-people', ['admin']]
};

const DEFAULT_TESTS = [
  ["CBC (Complete Blood Count)", 300], ["Haematology", 300], ["Hemoglobin", 100], ["Blood Sugar Fasting", 80],
  ["Blood Sugar PP", 80], ["HbA1c", 500], ["Lipid Profile", 600], ["Biochemistry", 500],
  ["Liver Function Test (LFT)", 700], ["Kidney Function Test (KFT)", 700], ["Thyroid Profile (T3 T4 TSH)", 550], ["TSH", 250],
  ["Urine Analysis", 100], ["Urine Routine", 100], ["Widal Test", 150], ["Malaria Antigen", 250], ["Dengue NS1", 600],
  ["Vitamin D", 1100], ["Vitamin B12", 800], ["Serum Creatinine", 150], ["Uric Acid", 150],
  ["ESR", 80], ["CRP", 400], ["X-Ray Chest", 300], ["ECG", 200], ["USG Abdomen", 800]
].map(([name, price]) => ({ name, price }));

let tests = load('tests', null) || DEFAULT_TESTS;
function ensureDefaultTests() {
  const existing = new Set(tests.map(t => t.name.toLowerCase()));
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
      tests.push(item);
      existing.add(item.name.toLowerCase());
      changed = true;
    }
  });
  if (changed) store('tests', tests);
}
ensureDefaultTests();

const URINE_READY_REMARKS = [
  "NOTE:- MICROSCOPIC EXAMINATION OF URINE IS PERFORMED BY CENTRIFUGED URINARY SEDIMENT.",
  "NOTE : URINE PROTEIN CONFIRMED MANUALLY BY SULPHOSALICYLIC ACID.",
  "NOTE: URINE GLUCOSE RECHECKED AND CONFIRMED BY BENEDICT TEST.",
  "MYCOBACTERIUM LEPRAE",
  "AFB NOT SEEN.",
  "MUCUS THREAD SEEN.",
  "BUDDING YEAST CELL SEEN.",
  "CALCIUM OXALATE SEEN.",
  "AMORPHOUS PHOSPHATES SEEN.",
  "AMORPHOUS URATES SEEN.",
  "HB ELECTROPHORESIS / HPLC."
];

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
    match: ['lipid'],
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

function findTemplate(testName) {
  if (!testName) return null;
  const n = testName.trim().toLowerCase();
  for (const key of Object.keys(TEST_TEMPLATES)) {
    const tmpl = TEST_TEMPLATES[key];
    if (tmpl.match.some(m => n.includes(m))) return tmpl;
  }
  return null;
}
let receipts = load('receipts', []);
let selected = [];
let user = null;
let editing = null; // labNo in report editor

const today = () => new Date().toISOString().slice(0, 10);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = d => d ? d.split('-').reverse().join('-') : '';
const fmtTime = t => { if (!t) return ''; let [h, m] = t.split(':'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; };
const persist = () => store('receipts', receipts);
const find = l => receipts.find(r => r.labNo === l);

function toast(msg) { $('toastMsg').textContent = msg; bootstrap.Toast.getOrCreateInstance($('toast'), { delay: 2200 }).show(); }

/* ---------- AUTH / NAV ---------- */
$('loginForm').onsubmit = e => {
  e.preventDefault();
  const name = $('loginUser').value.trim().toLowerCase(), u = users.find(x => x.name.toLowerCase() === name);
  if (!u || u.pass !== $('loginPass').value) return $('loginErr').classList.remove('d-none');
  user = { name: u.name, role: u.role };
  sessionStorage.setItem('user', JSON.stringify(user));
  startApp();
};
$('logoutBtn').onclick = () => { sessionStorage.removeItem('user'); location.reload(); };
$('menuBtn').onclick = () => $('sidebar').classList.toggle('open');

function startApp() {
  $('loginScreen').classList.add('d-none');
  $('appShell').classList.remove('d-none');
  $('whoami').textContent = `${user.name} (${user.role})`;
  const keys = Object.keys(MENUS).filter(k => MENUS[k][2].includes(user.role));
  $('sideNav').innerHTML = keys.map(k => `<a class="nav-link" data-view="${k}" id="nav-${k}"><i class="bi ${MENUS[k][1]}"></i>${MENUS[k][0]}<span class="badge bg-warning text-dark ms-2 d-none" id="badge-${k}"></span></a>`).join('');
  $('sideNav').querySelectorAll('a').forEach(a => a.onclick = () => show(a.dataset.view));
  show(keys[0]);
}

function show(v) {
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('show', s.id === 'view-' + v));
  document.querySelectorAll('#sideNav a').forEach(a => a.classList.toggle('active', a.dataset.view === v));
  $('pageTitle').textContent = v === 'editor' ? 'Prepare Report' : MENUS[v][0];
  $('sidebar').classList.remove('open');
  if (v === 'pending') renderPending(); if (v === 'done') renderDone(); if (v === 'saved') renderSaved();
  if (v === 'users') renderUsers(); if (v === 'register') { renderRegTests(); renderRecent(); }
  updateBadge();
}
function updateBadge() {
  const n = receipts.filter(r => r.status !== 'done').length, b = $('badge-pending');
  if (b) { b.textContent = n; b.classList.toggle('d-none', !n); }
}

/* ---------- RECEIPT FORM ---------- */
function nextLab() {
  const nums = receipts.map(r => parseInt(r.labNo)).filter(n => !isNaN(n));
  return String((nums.length ? Math.max(...nums) : 1000) + 1);
}
function renderTestSelect() {
  if ($('testSelect')) {
    $('testSelect').innerHTML = '<option value="">-- Select Test --</option>' +
      tests.map((t, i) => `<option value="${i}">${esc(t.name)} — ₹${t.price}</option>`).join('');
  }
  renderTestDropdownList();
}

function renderTestDropdownList() {
  const listEl = $('testDropdownList');
  if (!listEl) return;
  const q = ($('testDropdownSearch')?.value || '').trim().toLowerCase();
  const selNames = new Set(selected.map(s => s.name.toLowerCase()));

  const filtered = tests.map((t, i) => ({ t, i })).filter(({ t }) => t.name.toLowerCase().includes(q));

  if (!filtered.length) {
    listEl.innerHTML = '<div class="text-center text-muted py-3 small">No matching tests found</div>';
    return;
  }

  listEl.innerHTML = filtered.map(({ t, i }) => {
    const isSel = selNames.has(t.name.toLowerCase());
    return `
      <div class="d-flex justify-content-between align-items-center p-2 rounded hover-test-item border-bottom">
        <div class="me-2 text-truncate">
          <div class="fw-semibold text-dark text-truncate">${esc(t.name)}</div>
          <div class="text-muted small">₹${t.price}</div>
        </div>
        <button type="button" class="btn btn-sm ${isSel ? 'btn-success' : 'btn-outline-primary'} text-nowrap px-3 py-1" onclick="toggleSelectTest(${i}); event.stopPropagation();">
          ${isSel ? '<i class="bi bi-check-lg me-1"></i>Added' : '<i class="bi bi-plus-lg me-1"></i>Add'}
        </button>
      </div>
    `;
  }).join('');

  if ($('testDropdownBadge')) {
    $('testDropdownBadge').textContent = `${selected.length} selected`;
  }
}

window.toggleSelectTest = i => {
  const item = tests[i];
  if (!item) return;
  const existingIdx = selected.findIndex(s => s.name.toLowerCase() === item.name.toLowerCase());
  if (existingIdx >= 0) {
    selected.splice(existingIdx, 1);
  } else {
    selected.push({ ...item });
  }
  renderSelected();
};

function renderSelected() {
  $('selectedTests').innerHTML = selected.length ? selected.map((t, i) =>
    `<tr><td>${esc(t.name)}</td><td class="text-end">${t.price}</td>
     <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="removeSel(${i})"><i class="bi bi-x-lg"></i></button></td></tr>`).join('')
    : '<tr><td colspan="3" class="text-center text-muted">No tests added</td></tr>';
  updateTotals();
  renderTestDropdownList();
}
const total = () => selected.reduce((s, t) => s + Number(t.price), 0);
function updateTotals() {
  $('total').textContent = total();
  $('balance').value = total() - (Number($('advance').value) || 0);
}
window.removeSel = i => { selected.splice(i, 1); renderSelected(); };
$('addTestBtn').onclick = () => {
  const i = $('testSelect').value;
  if (i === '') return toast('Select a test first');
  selected.push({ ...tests[i] }); $('testSelect').value = ''; renderSelected();
};
$('advance').oninput = updateTotals;
if ($('testDropdownSearch')) $('testDropdownSearch').oninput = renderTestDropdownList;

function collect() {
  return {
    labNo: $('labNo').value.trim(), date: $('date').value, name: $('name').value.trim(),
    age: $('age').value, gender: $('gender').value, refBy: $('refBy') ? $('refBy').value.trim() : '',
    tests: selected.map(t => ({ ...t })), total: total(), advance: Number($('advance').value) || 0,
    doctor: $('doctor').value.trim(), reportTime: $('reportTime').value, reportDate: $('reportDate').value
  };
}
function save() {
  const r = collect();
  if (!r.labNo || !r.name) { toast('Lab No and Name are required'); return null; }
  if (!r.tests.length) { toast('Add at least one test'); return null; }
  const old = find(r.labNo);
  Object.assign(r, { status: old?.status || 'pending', results: old?.results || {}, remarks: old?.remarks || '',
    reportedBy: old?.reportedBy || '', createdBy: old?.createdBy || user.name });
  if (old) receipts[receipts.indexOf(old)] = r; else receipts.push(r);
  persist(); updateDoctors(); updateBadge();
  toast('Saved');
  return r;
}
function clearForm() {
  ['name', 'age', 'gender', 'doctor'].forEach(k => { if ($(k)) $(k).value = ''; });
  $('advance').value = 0; $('reportTime').value = '10:00';
  $('labNo').value = nextLab(); $('date').value = today(); $('reportDate').value = today();
  selected = []; renderSelected();
}
$('saveBtn').onclick = () => { const r = save(); if (r) { clearForm(); openEditor(r.labNo); } };
$('printBtn').onclick = () => { const r = save(); if (r) { printReceipt(r); clearForm(); } };
$('clearBtn').onclick = clearForm;

/* ---------- PRINT ---------- */
function printHtml(html) { $('printArea').innerHTML = html; setTimeout(() => window.print(), 100); }

function printReceipt(r) {
  const rows = r.tests.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(t.name)}</td><td class="num">${t.price}</td></tr>`).join('');
  printHtml(`<div class="rcpt">
    <h2>${CLINIC.toUpperCase()}</h2><div class="sub">Pathology &amp; Imaging — Receipt</div><hr>
    <table class="info">
      <tr><td><b>Lab No:</b> ${esc(r.labNo)}</td><td class="num"><b>Date:</b> ${fmtDate(r.date)}</td></tr>
      <tr><td><b>Name:</b> ${esc(r.name)}</td><td class="num"><b>Age/Gender:</b> ${esc(r.age)} / ${esc(r.gender)}</td></tr>
      <tr><td colspan="2"><b>Ref By:</b> ${esc(r.refBy)}</td></tr>
    </table><hr>
    <table class="tests"><thead><tr><th style="width:40px">#</th><th>Test Name</th><th class="num" style="width:100px">Price (₹)</th></tr></thead>
    <tbody>${rows}
      <tr><td colspan="2" class="num"><b>Total</b></td><td class="num"><b>${r.total}</b></td></tr>
      <tr><td colspan="2" class="num">Advance</td><td class="num">${r.advance}</td></tr>
      <tr><td colspan="2" class="num"><b>Balance</b></td><td class="num"><b>${r.total - r.advance}</b></td></tr>
    </tbody></table><hr>
    <table class="info"><tr><td><b>Report Time:</b> ${fmtDate(r.reportDate)} ${fmtTime(r.reportTime)}</td><td class="num"><b>Doctor:</b> ${esc(r.doctor)}</td></tr></table>
    <div class="sign"><span>Patient Signature</span><span>Authorised Signatory</span></div>
  </div>`);
}

function checkValueRange(valStr, rangeStr) {
  if (valStr === undefined || valStr === null || rangeStr === undefined || rangeStr === null) return 'normal';
  const rawVal = String(valStr).trim();
  const rawRng = String(rangeStr).trim();
  if (!rawVal || !rawRng) return 'normal';

  const v = parseFloat(rawVal.replace(/,/g, ''));
  if (isNaN(v)) {
    const uVal = rawVal.toUpperCase();
    const uRng = rawRng.toUpperCase();
    if (uRng === 'NIL' || uRng === 'NEGATIVE') {
      const normalTokens = ['NIL', 'NEGATIVE', 'NEG', '0', '-', 'CLEAR', 'ACIDIC', 'PALE YELLOW', 'NORMAL'];
      if (!normalTokens.includes(uVal)) {
        return 'abnormal';
      }
    }
    return 'normal';
  }

  const rangeMatch = rawRng.match(/^([0-9.]+)\s*(?:-|to)\s*([0-9.]+)$/i);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (!isNaN(min) && v < min) return 'low';
    if (!isNaN(max) && v > max) return 'high';
    return 'normal';
  }

  const maxMatch = rawRng.match(/^(?:upto|below|<|<=)\s*([0-9.]+)/i);
  if (maxMatch) {
    const max = parseFloat(maxMatch[1]);
    if (!isNaN(max) && v > max) return 'high';
    return 'normal';
  }

  const minMatch = rawRng.match(/^(?:above|>|>=)\s*([0-9.]+)/i);
  if (minMatch) {
    const min = parseFloat(minMatch[1]);
    if (!isNaN(min) && v < min) return 'low';
    return 'normal';
  }

  return 'normal';
}

function getReportHtml(r) {
  const testsList = r.tests || [];
  if (!testsList.length) return '';

  return testsList.map((t, pageIdx) => {
    const pageNum = pageIdx + 1;
    const x = (r.results || {})[t.name] || {};
    const tmpl = TEST_TEMPLATES[x.templateId] || findTemplate(t.name);
    const isDetailed = Boolean(tmpl);

    let rowsHtml = '';
    let testTitle = (tmpl ? tmpl.title : t.name).toUpperCase();
    let methodText = x.method || tmpl?.method || '';
    let remarkText = x.remark || tmpl?.remark || '';

    if (isDetailed && tmpl) {
      rowsHtml = tmpl.items.map(item => {
        if (item.isHeader) {
          return `<tr><td colspan="4" style="font-weight: bold; text-decoration: underline; padding-top: 6px; padding-bottom: 2px; font-size: 12px;">${esc(item.title)}</td></tr>`;
        }
        const p = (x.params && x.params[item.name]) || {};
        const val = p.value !== undefined && p.value !== '' ? p.value : (item.defaultVal || '');
        const u = p.unit !== undefined && p.unit !== '' ? p.unit : item.unit;
        const rng = p.range !== undefined && p.range !== '' ? p.range : item.range;
        const rangeStatus = checkValueRange(val, rng);
        const isAbnormal = rangeStatus === 'high' || rangeStatus === 'low' || rangeStatus === 'abnormal';
        const indentStyle = item.indent ? 'padding-left: 16px;' : '';
        const valDisplay = isAbnormal ? `
          <span style="font-weight: 900; color: #b91c1c; border-bottom: 1.5px solid #b91c1c; padding-bottom: 1px; display: inline-block;">
            ${esc(val)} <span style="font-size: 9.5px; font-weight: 800; color: #b91c1c; border: 1px solid #b91c1c; padding: 0 2px; border-radius: 2px; margin-left: 2px; vertical-align: middle;">${rangeStatus === 'high' ? 'H' : rangeStatus === 'low' ? 'L' : '*'}</span>
          </span>` : `<span>${esc(val)}</span>`;
        return `
          <tr style="line-height: 1.45; border-bottom: 1px solid #f1f5f9;">
            <td style="width: 44%; padding: 2px 0; ${indentStyle}">${esc(item.name)}</td>
            <td style="width: 18%; padding: 2px 0; font-weight: bold;">${valDisplay}</td>
            <td style="width: 16%; padding: 2px 0;">${esc(u)}</td>
            <td style="width: 22%; padding: 2px 0;">${esc(rng)}</td>
          </tr>
        `;
      }).join('');
    } else {
      const val = x.value || '';
      const u = x.unit || '';
      const rng = x.range || '';
      const rangeStatus = checkValueRange(val, rng);
      const isAbnormal = rangeStatus === 'high' || rangeStatus === 'low' || rangeStatus === 'abnormal';
      const valDisplay = isAbnormal ? `
        <span style="font-weight: 900; color: #b91c1c; border-bottom: 1.5px solid #b91c1c; padding-bottom: 1px; display: inline-block;">
          ${esc(val)} <span style="font-size: 9.5px; font-weight: 800; color: #b91c1c; border: 1px solid #b91c1c; padding: 0 2px; border-radius: 2px; margin-left: 2px; vertical-align: middle;">${rangeStatus === 'high' ? 'H' : rangeStatus === 'low' ? 'L' : '*'}</span>
        </span>` : `<span>${esc(val)}</span>`;
      rowsHtml = `
        <tr style="line-height: 1.5; border-bottom: 1px solid #f1f5f9;">
          <td style="width: 44%; padding: 3px 0; font-weight: 500;">${esc(t.name)}</td>
          <td style="width: 18%; padding: 3px 0; font-weight: bold;">${valDisplay}</td>
          <td style="width: 16%; padding: 3px 0;">${esc(u)}</td>
          <td style="width: 22%; padding: 3px 0;">${esc(rng)}</td>
        </tr>
      `;
    }

    const isLipid = (tmpl?.id === 'lipid') || t.name.toLowerCase().includes('lipid');

    return `
      <div class="report-page">
        <div class="report-top-content">
          <div style="text-align: center; margin-bottom: 4px; font-size: 11.5px;">
            <span style="font-weight: bold; text-decoration: underline;">Page : ${pageNum}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 12px; line-height: 1.45; margin-bottom: 6px;">
            <table style="border-collapse: collapse; font-size: 12px; line-height: 1.45;">
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Lab No.</td>
                <td style="padding: 1px 16px 1px 0;">: <b>${esc(r.labNo)}</b></td>
              </tr>
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">NAME</td>
                <td style="padding: 1px 16px 1px 0;">: <b>${esc((r.name || '').toUpperCase())}</b>&nbsp;&nbsp;&nbsp;&nbsp;<b>Age :</b>&nbsp;&nbsp;${esc(r.age)} Years, ${esc(r.gender)}</td>
              </tr>
              ${r.doctor ? `
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Doctor</td>
                <td style="padding: 1px 16px 1px 0;">: ${esc(r.doctor)}</td>
              </tr>` : ''}
            </table>
            <table style="border-collapse: collapse; font-size: 12px; line-height: 1.45; margin-left: auto;">
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Reporting Date</td>
                <td style="padding: 1px 0; white-space: nowrap;">:&nbsp;&nbsp;${fmtDate(r.reportDate || r.date)}</td>
              </tr>
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Sampling Date</td>
                <td style="padding: 1px 0; white-space: nowrap;">:&nbsp;&nbsp;${fmtDate(r.date)}</td>
              </tr>
            </table>
          </div>

          <div style="border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 3px 0; margin-bottom: 8px; font-weight: bold; font-size: 12px; display: flex;">
            <div style="width: 44%;">Investigation</div>
            <div style="width: 18%;">Result</div>
            <div style="width: 16%;">Unit</div>
            <div style="width: 22%;">Reference range</div>
          </div>

          <div style="text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 8px; text-decoration: underline; letter-spacing: 0.5px;">
            ${esc(testTitle)}
          </div>

          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          ${isLipid ? `
            <div style="margin-top: 10px; font-size: 11px;">
              <div style="font-weight: bold; text-decoration: underline; margin-bottom: 3px;">Reference Range :-</div>
              <table style="width: 95%; border-collapse: collapse; font-size: 10.5px; margin-left: 4px; line-height: 1.4;">
                <tr style="border-bottom: 1px dashed #777;">
                  <th style="text-align: left; padding: 1px 4px;"></th>
                  <th style="text-align: left; padding: 1px 4px; text-decoration: underline;">Cholesterol</th>
                  <th style="text-align: left; padding: 1px 4px; text-decoration: underline;">Triglyceride</th>
                  <th style="text-align: left; padding: 1px 4px; text-decoration: underline;">Total : HDL Ratio</th>
                </tr>
                <tr><td style="padding: 1px 4px;">Desirable</td><td style="padding: 1px 4px;">Below 200</td><td style="padding: 1px 4px;">Below 200</td><td style="padding: 1px 4px;">Below 3.5</td></tr>
                <tr><td style="padding: 1px 4px;">Borderline</td><td style="padding: 1px 4px;">200 to 250</td><td style="padding: 1px 4px;">200 to 400 with normal Cholesterol</td><td style="padding: 1px 4px;">3.5 to 5.5</td></tr>
                <tr><td style="padding: 1px 4px;">High</td><td style="padding: 1px 4px;">250 to 300</td><td style="padding: 1px 4px;">200 to 400 with high Cholesterol</td><td style="padding: 1px 4px;">Above 5.5</td></tr>
                <tr><td style="padding: 1px 4px;">Very High</td><td style="padding: 1px 4px;">Above 300</td><td style="padding: 1px 4px;">Above 400</td><td style="padding: 1px 4px;"></td></tr>
              </table>
            </div>
          ` : ''}

          ${remarkText ? `
            <div style="margin-top: 10px; border: 1.5px solid #000; padding: 5px 8px; font-size: 10.5px; border-radius: 3px; background: #fff;">
              <div style="font-weight: bold; font-size: 10.5px; text-decoration: underline; margin-bottom: 2px; letter-spacing: 0.5px;">REMARK : ${esc(testTitle)}</div>
              <div style="white-space: pre-line; line-height: 1.45; font-weight: bold; font-size: 10px;">${esc(remarkText)}</div>
            </div>` : ''}
          ${methodText ? `<div style="margin-top: 8px; font-size: 11px;">${esc(methodText)}</div>` : ''}
          ${r.remarks ? `<div style="margin-top: 8px; font-size: 11.5px;"><b>Remarks:</b> ${esc(r.remarks)}</div>` : ''}
        </div>

        <div class="report-bottom-content" style="margin-top: auto; padding-top: 8px; page-break-inside: avoid; break-inside: avoid;">
          <div style="border-top: 1.5px solid #000; padding-top: 6px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px;">
            <div style="font-weight: bold; font-style: italic;">Checked By</div>
            <div style="text-align: right; line-height: 1.25;">
              <b>Dr. Hanish Kumar Chawda, MBBS, MD</b><br>
              <span style="font-size: 11px; color: #222;">Pathologist, Olive Diagnostics, Raigarh</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('\n');
}

function printReport(r) {
  if (!r) return toast('No report to print');
  const html = getReportHtml(r);
  if (!html) return toast('No tests to print');
  printHtml(html);
}

function downloadReportPdf(r) {
  if (!r) r = saveEditor();
  if (!r) return;
  const html = getReportHtml(r);
  if (!html) return toast('No tests to print');

  // Loading overlay
  const overlay = document.createElement('div');
  overlay.id = 'pdfOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999999;display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML = `
    <div style="background:#fff;padding:20px 32px;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,0.3);display:flex;align-items:center;gap:14px;font-weight:600;font-size:15px;color:#1e293b;">
      <div class="spinner-border text-danger" role="status" style="width:1.75rem;height:1.75rem;"></div>
      <span>Generating PDF, please wait...</span>
    </div>
  `;
  document.body.appendChild(overlay);

  // Render container at top: 0, left: 0
  const container = document.createElement('div');
  container.id = 'pdfRenderWrap';
  container.className = 'pdf-render-wrap';
  container.innerHTML = html;
  document.body.appendChild(container);

  const prevScrollY = window.scrollY;
  const prevScrollX = window.scrollX;
  window.scrollTo(0, 0);

  const opt = {
    margin: [0, 0, 0, 0],
    filename: `Report_${r.labNo}_${(r.name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 794
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  const cleanup = () => {
    if (container.parentNode) container.parentNode.removeChild(container);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    window.scrollTo(prevScrollX, prevScrollY);
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(container).save().then(() => {
      cleanup();
      toast('PDF downloaded successfully');
    }).catch(err => {
      console.error('PDF generation error:', err);
      cleanup();
      toast('PDF error: opened print window');
      printReport(r);
    });
  } else {
    cleanup();
    toast('PDF library not ready, opening print window');
    printReport(r);
  }
}
window.downloadPdfRep = l => { const r = find(l); if (r) downloadReportPdf(r); };

/* ---------- SAVED (receptionist) ---------- */
function renderSaved() {
  const q = $('receiptSearch').value.toLowerCase();
  const list = receipts.filter(r => r.labNo.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)).slice().reverse();
  $('savedTable').innerHTML = list.length ? list.map(r => `<tr><td>${esc(r.labNo)}</td><td>${fmtDate(r.date)}</td><td>${esc(r.name)}</td>
    <td>${esc(r.doctor)}</td><td class="text-end">₹${r.total}</td><td class="text-end">₹${r.advance}</td>
    <td>${r.status === 'done' ? '<span class="badge bg-success">Ready</span>' : '<span class="badge bg-warning text-dark">Pending</span>'}</td>
    <td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-primary me-1" title="Edit" onclick="openRcpt('${esc(r.labNo)}')"><i class="bi bi-pencil"></i></button>
    <button class="btn btn-sm btn-outline-warning me-1" title="Print receipt" onclick="printRcpt('${esc(r.labNo)}')"><i class="bi bi-printer"></i></button>
    ${r.status === 'done' ? `
      <button class="btn btn-sm btn-outline-danger me-1" title="Download PDF" onclick="downloadPdfRep('${esc(r.labNo)}')"><i class="bi bi-file-earmark-pdf"></i></button>
      <button class="btn btn-sm btn-outline-success me-1" title="Print report" onclick="printRep('${esc(r.labNo)}')"><i class="bi bi-file-earmark-medical"></i></button>` : ''}
    <button class="btn btn-sm btn-outline-danger" onclick="delRcpt('${esc(r.labNo)}')"><i class="bi bi-trash"></i></button></td></tr>`).join('')
    : '<tr><td colspan="8" class="text-center text-muted">No receipts</td></tr>';
}
$('receiptSearch').oninput = renderSaved;
window.printRcpt = l => printReceipt(find(l));
window.printRep = l => printReport(find(l));
window.delRcpt = l => { if (confirm('Delete receipt ' + l + '?')) { receipts = receipts.filter(r => r.labNo !== l); persist(); renderSaved(); updateBadge(); } };
window.openRcpt = l => {
  const r = find(l);
  ['labNo', 'date', 'name', 'age', 'gender', 'advance', 'doctor', 'reportTime', 'reportDate'].forEach(k => { if ($(k)) $(k).value = r[k] || ''; });
  selected = r.tests.map(t => ({ ...t })); renderSelected(); show('receipt');
};

/* ---------- TESTS MANAGER ---------- */
function renderTestsTable() {
  const q = $('testSearch').value.toLowerCase();
  $('testsTable').innerHTML = tests.map((t, i) => ({ t, i })).filter(({ t }) => t.name.toLowerCase().includes(q))
    .map(({ t, i }) => `<tr><td>${i + 1}</td><td>${esc(t.name)}</td><td class="text-end">${t.price}</td>
      <td class="text-end"><button class="btn btn-sm btn-outline-primary me-1" onclick="editTest(${i})"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-sm btn-outline-danger" onclick="delTest(${i})"><i class="bi bi-trash"></i></button></td></tr>`).join('');
}
$('testSearch').oninput = renderTestsTable;
$('testForm').onsubmit = e => {
  e.preventDefault();
  const item = { name: $('testName').value.trim(), price: Number($('testPrice').value) };
  const idx = Number($('editIndex').value);
  if (idx >= 0) tests[idx] = item; else tests.push(item);
  store('tests', tests);
  $('testForm').reset(); $('editIndex').value = -1; $('testSubmit').textContent = 'Add Test';
  renderTestsTable(); renderTestSelect(); toast('Test saved');
};
window.editTest = i => {
  $('testName').value = tests[i].name; $('testPrice').value = tests[i].price;
  $('editIndex').value = i; $('testSubmit').textContent = 'Update Test'; $('testName').focus();
};
window.delTest = i => { if (confirm('Delete this test?')) { tests.splice(i, 1); store('tests', tests); renderTestsTable(); renderTestSelect(); } };

/* ---------- REPORTER ---------- */
function renderPending() {
  const list = receipts.filter(r => r.status !== 'done');
  $('pendingTable').innerHTML = list.length ? list.map(r => `<tr><td>${esc(r.labNo)}</td><td>${fmtDate(r.date)}</td><td>${esc(r.name)}</td>
    <td>${esc(r.age)} / ${esc(r.gender)}</td><td>${r.tests.map(t => `<span class="badge text-bg-light border me-1">${esc(t.name)}</span>`).join('')}</td>
    <td class="text-nowrap">${fmtDate(r.reportDate)} ${fmtTime(r.reportTime)}</td>
    <td class="text-end"><button class="btn btn-sm btn-primary" onclick="openEditor('${esc(r.labNo)}')"><i class="bi bi-pencil-square me-1"></i>Make Report</button></td></tr>`).join('')
    : '<tr><td colspan="7" class="text-center text-muted py-4">No pending reports 🎉</td></tr>';
}
function renderDone() {
  const list = receipts.filter(r => r.status === 'done').slice().reverse();
  $('doneTable').innerHTML = list.length ? list.map(r => `<tr><td>${esc(r.labNo)}</td><td>${esc(r.name)}</td>
    <td>${r.tests.map(t => esc(t.name)).join(', ')}</td><td>${esc(r.reportedBy)}</td>
    <td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-primary me-1" title="Edit" onclick="openEditor('${esc(r.labNo)}')"><i class="bi bi-pencil"></i></button>
    <button class="btn btn-sm btn-danger me-1" title="Download PDF" onclick="downloadPdfRep('${esc(r.labNo)}')"><i class="bi bi-file-earmark-pdf"></i></button>
    <button class="btn btn-sm btn-warning" title="Print" onclick="printRep('${esc(r.labNo)}')"><i class="bi bi-printer"></i></button></td></tr>`).join('')
    : '<tr><td colspan="5" class="text-center text-muted py-4">No completed reports</td></tr>';
}
let editorState = {};

function snapshotEditorInputs() {
  document.querySelectorAll('[data-test-idx]').forEach(inp => {
    const idx = parseInt(inp.dataset.testIdx, 10);
    if (!editorState[idx]) return;
    if (inp.dataset.f === 'remark') {
      editorState[idx].remark = inp.value;
    } else if (inp.dataset.simple === 'true') {
      editorState[idx][inp.dataset.f] = inp.value;
    } else {
      const p = inp.dataset.param;
      const f = inp.dataset.f;
      editorState[idx].params = editorState[idx].params || {};
      editorState[idx].params[p] = editorState[idx].params[p] || {};
      editorState[idx].params[p][f] = inp.value;
    }
  });
}

window.toggleTestCollapse = (idx, ev) => {
  if (ev) ev.stopPropagation();
  const body = $(`testCardBody_${idx}`);
  const icon = $(`testChevron_${idx}`);
  const btn = $(`testExpandBtn_${idx}`);
  const statusBadge = $(`testStatusBadge_${idx}`);
  if (!body) return;
  const isNowHidden = body.classList.toggle('d-none');
  if (editorState[idx]) {
    editorState[idx].collapsed = isNowHidden;
  }
  if (icon) {
    icon.className = `bi ${isNowHidden ? 'bi-chevron-down' : 'bi-chevron-up'} fs-5 text-secondary`;
  }
  if (btn) {
    btn.title = isNowHidden ? 'Expand' : 'Collapse';
  }
  if (statusBadge) {
    statusBadge.textContent = isNowHidden ? 'Collapsed' : 'Open';
  }
};
window.toggleTestDetail = window.toggleTestCollapse;

window.toggleAllTests = collapsed => {
  const r = find(editing);
  if (!r || !r.tests) return;
  r.tests.forEach((t, i) => {
    const body = $(`testCardBody_${i}`);
    const icon = $(`testChevron_${i}`);
    const btn = $(`testExpandBtn_${i}`);
    const statusBadge = $(`testStatusBadge_${i}`);
    if (body) {
      if (collapsed) body.classList.add('d-none');
      else body.classList.remove('d-none');
    }
    if (editorState[i]) {
      editorState[i].collapsed = collapsed;
    }
    if (icon) {
      icon.className = `bi ${collapsed ? 'bi-chevron-down' : 'bi-chevron-up'} fs-5 text-secondary`;
    }
    if (btn) {
      btn.title = collapsed ? 'Expand' : 'Collapse';
    }
    if (statusBadge) {
      statusBadge.textContent = collapsed ? 'Collapsed' : 'Open';
    }
  });
};

window.changeTestTemplate = (idx, val) => {
  snapshotEditorInputs();
  if (!editorState[idx]) return;
  if (!val || val === 'none') {
    editorState[idx].templateId = null;
    editorState[idx].isDetailed = false;
  } else {
    editorState[idx].templateId = val;
    editorState[idx].isDetailed = true;
    editorState[idx].params = editorState[idx].params || {};
  }
  renderEditorRows();
};

window.fillUrineDefaults = idx => {
  snapshotEditorInputs();
  const tmpl = TEST_TEMPLATES.urine;
  editorState[idx].params = editorState[idx].params || {};
  tmpl.items.forEach(it => {
    if (!it.isHeader) {
      editorState[idx].params[it.name] = {
        value: it.defaultVal || '',
        unit: it.unit,
        range: it.range
      };
    }
  });
  if (!editorState[idx].remark) {
    editorState[idx].remark = tmpl.remark || 'NOTE:- MICROSCOPIC EXAMINATION OF URINE IS PERFORMED BY CENTRIFUGED URINARY SEDIMENT.';
  }
  renderEditorRows();
  toast('Normal urine values filled');
};

window.toggleUrineRemarkPhrase = (idx, phraseIdx) => {
  snapshotEditorInputs();
  const phrase = URINE_READY_REMARKS[phraseIdx];
  if (!phrase) return;
  const textarea = $(`urineRemark_${idx}`);
  let current = (editorState[idx]?.remark ?? (textarea ? textarea.value : ''));
  let lines = current.split('\n').map(l => l.trim()).filter(Boolean);
  const foundIdx = lines.indexOf(phrase.trim());
  if (foundIdx >= 0) {
    lines.splice(foundIdx, 1);
  } else {
    lines.push(phrase.trim());
  }
  const updated = lines.join('\n');
  if (editorState[idx]) editorState[idx].remark = updated;
  if (textarea) textarea.value = updated;
  updateUrinePhraseButtons(idx);
};

window.resetUrineRemark = idx => {
  const tmpl = TEST_TEMPLATES.urine;
  const def = tmpl?.remark || 'NOTE:- MICROSCOPIC EXAMINATION OF URINE IS PERFORMED BY CENTRIFUGED URINARY SEDIMENT.';
  if (editorState[idx]) editorState[idx].remark = def;
  const textarea = $(`urineRemark_${idx}`);
  if (textarea) textarea.value = def;
  updateUrinePhraseButtons(idx);
};

window.clearUrineRemark = idx => {
  if (editorState[idx]) editorState[idx].remark = '';
  const textarea = $(`urineRemark_${idx}`);
  if (textarea) textarea.value = '';
  updateUrinePhraseButtons(idx);
};

function updateUrinePhraseButtons(idx) {
  const container = $(`urinePhrases_${idx}`);
  if (!container) return;
  const current = (editorState[idx]?.remark || $(`urineRemark_${idx}`)?.value || '');
  container.querySelectorAll('.ready-phrase-btn').forEach((btn, pIdx) => {
    const phrase = URINE_READY_REMARKS[pIdx];
    const isPresent = phrase && current.includes(phrase.trim());
    btn.className = `btn btn-sm ${isPresent ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2 ready-phrase-btn`;
    btn.innerHTML = `${isPresent ? '<i class="bi bi-check2 me-1"></i>' : '<i class="bi bi-plus me-1"></i>'}${esc(phrase)}`;
  });
};

window.clearTestRemark = idx => {
  if (editorState[idx]) editorState[idx].remark = '';
  const textarea = $(`testRemark_${idx}`);
  if (textarea) textarea.value = '';
};

function renderEditorRows() {
  const r = find(editing);
  if (!r) return;

  const html = r.tests.map((t, i) => {
    const st = editorState[i] || {};
    const tmpl = TEST_TEMPLATES[st.templateId] || findTemplate(t.name);
    const hasTmpl = Boolean(tmpl);
    const isCollapsed = Boolean(st.collapsed);

    let bodyHtml = '';
    if (hasTmpl) {
      const rows = tmpl.items.map(item => {
        if (item.isHeader) {
          return `<tr class="param-cat-row"><td colspan="4"><i class="bi bi-folder2 me-1"></i>${esc(item.title)}</td></tr>`;
        }
        const pData = (st.params && st.params[item.name]) || {};
        const pVal = pData.value !== undefined ? pData.value : (item.defaultVal || '');
        const rangeStatus = checkValueRange(pVal, item.range);
        const isAbnormal = rangeStatus === 'high' || rangeStatus === 'low' || rangeStatus === 'abnormal';
        return `<tr>
          <td class="${item.indent ? 'param-indent' : 'fw-semibold'}">${esc(item.name)}</td>
          <td><input class="form-control form-control-sm form-control-result ${isAbnormal ? 'is-abnormal-input' : ''}" data-test-idx="${i}" data-param="${esc(item.name)}" data-f="value" value="${esc(pVal)}" placeholder="Enter result..."></td>
          <td><input class="form-control form-control-sm bg-light text-muted border-0" readonly tabindex="-1" data-test-idx="${i}" data-param="${esc(item.name)}" data-f="unit" value="${esc(item.unit)}"></td>
          <td><input class="form-control form-control-sm bg-light text-muted border-0" readonly tabindex="-1" data-test-idx="${i}" data-param="${esc(item.name)}" data-f="range" value="${esc(item.range)}"></td>
        </tr>`;
      }).join('');

      bodyHtml = `
        <div class="table-responsive">
          <table class="table table-bordered table-sm align-middle mb-0 param-table">
            <thead>
              <tr>
                <th style="width:36%">Investigation / Parameter</th>
                <th style="width:24%">Result <span class="badge bg-primary text-white ms-1">Fill here</span></th>
                <th style="width:20%">Unit <span class="badge bg-secondary ms-1">Fixed</span></th>
                <th style="width:20%">Reference Range <span class="badge bg-secondary ms-1">Fixed</span></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${tmpl.id === 'urine' ? `
          <div class="p-2 bg-light border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button type="button" class="btn btn-sm btn-outline-success" onclick="fillUrineDefaults(${i})"><i class="bi bi-magic me-1"></i>Quick Fill Normal Values</button>
            <span class="small text-muted"><i class="bi bi-info-circle me-1"></i>Siemens Clinitek Status+ Urine Analyzer</span>
          </div>
          <div class="p-3 border-top urine-remark-box">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <div class="d-flex align-items-center gap-2">
                <span class="fw-bold small text-dark"><i class="bi bi-chat-square-text-fill text-primary me-1"></i>REMARK : URINE ANALYSIS</span>
                <span class="badge bg-secondary-subtle text-secondary border small">Default Fixed Note &middot; Extra Addable</span>
              </div>
              <div class="d-flex gap-1">
                <button type="button" class="btn btn-xs btn-outline-secondary py-1 px-2" style="font-size:0.75rem;" onclick="resetUrineRemark(${i})" title="Reset to standard fixed note">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Reset Default
                </button>
                <button type="button" class="btn btn-xs btn-outline-danger py-1 px-2" style="font-size:0.75rem;" onclick="clearUrineRemark(${i})" title="Clear remarks">
                  <i class="bi bi-trash me-1"></i>Clear
                </button>
              </div>
            </div>
            <textarea id="urineRemark_${i}" class="form-control form-control-sm form-control-result mb-2" data-test-idx="${i}" data-f="remark" rows="3" style="font-size: 0.88rem; font-weight: 600; line-height: 1.5; resize: vertical;" placeholder="Urine Analysis remarks (type freely, press Shift+Enter for new line)...">${esc(st.remark !== undefined ? st.remark : (tmpl.remark || ''))}</textarea>
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="small text-muted fw-semibold" style="font-size:0.76rem;">
                <i class="bi bi-list-check me-1"></i>Readymade Lines (Phrases) — Click to add / remove:
              </span>
              <span class="small text-muted d-none d-sm-inline" style="font-size:0.72rem;"><kbd class="bg-white text-dark border px-1">Shift+Enter</kbd> new line &middot; <kbd class="bg-white text-dark border px-1">Enter</kbd> next test</span>
            </div>
            <div id="urinePhrases_${i}" class="d-flex flex-wrap gap-1">
              ${URINE_READY_REMARKS.map((line, pIdx) => {
                const curRemark = (st.remark !== undefined ? st.remark : (tmpl.remark || ''));
                const isSel = curRemark.includes(line.trim());
                return `<button type="button" class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2 ready-phrase-btn" style="font-size: 0.74rem; border-radius: 12px; white-space: normal; text-align: left;" onclick="toggleUrineRemarkPhrase(${i}, ${pIdx})">
                  ${isSel ? '<i class="bi bi-check2 me-1"></i>' : '<i class="bi bi-plus me-1"></i>'}${esc(line)}
                </button>`;
              }).join('')}
            </div>
          </div>` : `
          <div class="p-2 border-top bg-light-subtle test-remark-box">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="small fw-semibold text-secondary">
                <i class="bi bi-chat-left-dots text-primary me-1"></i>Remark / Interpretation (${esc(tmpl.title || t.name)}):
              </span>
              ${st.remark ? `<button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" style="font-size:0.72rem;" onclick="clearTestRemark(${i})"><i class="bi bi-x me-1"></i>Clear</button>` : ''}
            </div>
            <textarea id="testRemark_${i}" class="form-control form-control-sm form-control-result test-remark-input" data-test-idx="${i}" data-f="remark" rows="2" style="font-size: 0.85rem; resize: vertical;" placeholder="Add remark / interpretation for this test (optional, press Shift+Enter for new line)...">${esc(st.remark || '')}</textarea>
          </div>
          ${tmpl.method ? `<div class="p-2 bg-light border-top text-muted small"><i class="bi bi-info-circle me-1"></i>${esc(tmpl.method)}</div>` : ''}
          `}
      `;
    } else {
      const nonTmplStatus = checkValueRange(st.value || '', st.range || '');
      const isAbnormalNonTmpl = nonTmplStatus === 'high' || nonTmplStatus === 'low' || nonTmplStatus === 'abnormal';
      bodyHtml = `
        <div class="table-responsive">
          <table class="table table-bordered table-sm align-middle mb-0">
            <thead>
              <tr>
                <th style="width:36%">Test Name</th>
                <th style="width:24%">Result</th>
                <th style="width:20%">Unit</th>
                <th style="width:20%">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fw-semibold">${esc(t.name)}</td>
                <td><input class="form-control form-control-sm form-control-result ${isAbnormalNonTmpl ? 'is-abnormal-input' : ''}" data-test-idx="${i}" data-simple="true" data-f="value" value="${esc(st.value || '')}" placeholder="Enter result..."></td>
                <td><input class="form-control form-control-sm" data-test-idx="${i}" data-simple="true" data-f="unit" value="${esc(st.unit || '')}" placeholder="Unit"></td>
                <td><input class="form-control form-control-sm" data-test-idx="${i}" data-simple="true" data-f="range" value="${esc(st.range || '')}" placeholder="Reference Range"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-2 border-top bg-light-subtle test-remark-box">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small fw-semibold text-secondary">
              <i class="bi bi-chat-left-dots text-primary me-1"></i>Remark / Interpretation (${esc(t.name)}):
            </span>
            ${st.remark ? `<button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" style="font-size:0.72rem;" onclick="clearTestRemark(${i})"><i class="bi bi-x me-1"></i>Clear</button>` : ''}
          </div>
          <textarea id="testRemark_${i}" class="form-control form-control-sm form-control-result test-remark-input" data-test-idx="${i}" data-f="remark" rows="2" style="font-size: 0.85rem; resize: vertical;" placeholder="Add remark / interpretation for this test (optional, press Shift+Enter for new line)...">${esc(st.remark || '')}</textarea>
        </div>
      `;
    }

    return `
      <div class="card shadow-sm mb-3 test-card">
        <div class="test-card-header d-flex justify-content-between align-items-center gap-2 cursor-pointer" onclick="toggleTestCollapse(${i})">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="fw-bold fs-6 text-dark">${esc(t.name)}</span>
            ${hasTmpl ? `<span class="badge bg-primary-subtle text-primary border border-primary-subtle small fw-normal">${tmpl.items.filter(x => !x.isHeader).length} parameters</span>` : ''}
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-light text-muted border small d-none d-sm-inline" id="testStatusBadge_${i}">${isCollapsed ? 'Collapsed' : 'Open'}</span>
            <button type="button" class="btn btn-sm btn-light border-0 rounded-circle expand-btn" id="testExpandBtn_${i}" title="${isCollapsed ? 'Expand' : 'Collapse'}" onclick="event.stopPropagation(); toggleTestCollapse(${i});">
              <i id="testChevron_${i}" class="bi ${isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'} fs-5 text-secondary"></i>
            </button>
          </div>
        </div>
        <div class="card-body p-0 ${isCollapsed ? 'd-none' : ''}" id="testCardBody_${i}">${bodyHtml}</div>
      </div>
    `;
  }).join('');

  $('edRows').innerHTML = html || '<div class="alert alert-secondary text-center">No tests selected</div>';
}

if ($('edRows')) {
  $('edRows').oninput = e => {
    const inp = e.target;
    if (!inp || !inp.dataset || inp.dataset.testIdx === undefined) return;
    const idx = parseInt(inp.dataset.testIdx, 10);
    if (!editorState[idx]) return;
    if (inp.dataset.f === 'remark') {
      editorState[idx].remark = inp.value;
      updateUrinePhraseButtons(idx);
    } else if (inp.dataset.simple === 'true') {
      editorState[idx][inp.dataset.f] = inp.value;
      const row = inp.closest('tr');
      if (row) {
        const valInp = row.querySelector('[data-f="value"]');
        const rngInp = row.querySelector('[data-f="range"]');
        if (valInp && rngInp) {
          const stt = checkValueRange(valInp.value, rngInp.value);
          valInp.classList.toggle('is-abnormal-input', stt === 'high' || stt === 'low' || stt === 'abnormal');
        }
      }
    } else {
      const p = inp.dataset.param;
      const f = inp.dataset.f;
      editorState[idx].params = editorState[idx].params || {};
      editorState[idx].params[p] = editorState[idx].params[p] || {};
      editorState[idx].params[p][f] = inp.value;
      const row = inp.closest('tr');
      if (row) {
        const valInp = row.querySelector('[data-f="value"]');
        const rngInp = row.querySelector('[data-f="range"]');
        if (valInp && rngInp) {
          const stt = checkValueRange(valInp.value, rngInp.value);
          valInp.classList.toggle('is-abnormal-input', stt === 'high' || stt === 'low' || stt === 'abnormal');
        }
      }
    }
  };

  function getVisibleReportInputs() {
    const container = $('edRows');
    if (!container) return [];
    return Array.from(container.querySelectorAll('input:not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled])'))
      .filter(inp => inp.offsetParent !== null && !inp.closest('.d-none'));
  }

  function getVisibleResultInputs() {
    const container = $('edRows');
    if (!container) return [];
    return Array.from(container.querySelectorAll('input.form-control-result:not([readonly]):not([disabled]), textarea.form-control-result:not([readonly]):not([disabled])'))
      .filter(inp => inp.offsetParent !== null && !inp.closest('.d-none'));
  }

  function focusAndSelectInput(inp) {
    if (!inp) return;
    inp.focus();
    try {
      inp.select();
    } catch (err) {}
    inp.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function getCaretPositions(inp) {
    try {
      return {
        start: inp.selectionStart ?? 0,
        end: inp.selectionEnd ?? 0
      };
    } catch (e) {
      return { start: 0, end: 0 };
    }
  }

  function findInputVertical(currentInput, direction) {
    const resultInputs = getVisibleResultInputs();
    const isResult = currentInput.classList.contains('form-control-result') || currentInput.dataset.f === 'value' || currentInput.dataset.f === 'remark';

    if (isResult) {
      const idx = resultInputs.indexOf(currentInput);
      if (idx !== -1) {
        if (direction === 'down') {
          if (idx < resultInputs.length - 1) return resultInputs[idx + 1];
          return $('edRemarks') || null;
        } else if (direction === 'up') {
          if (idx > 0) return resultInputs[idx - 1];
          return null;
        }
      }
    }

    const currentTr = currentInput.closest('tr');
    const targetField = currentInput.dataset.f || 'value';
    const allRows = Array.from($('edRows').querySelectorAll('tr')).filter(tr => tr.offsetParent !== null && !tr.closest('.d-none'));
    const trIdx = allRows.indexOf(currentTr);

    if (trIdx !== -1) {
      const step = direction === 'down' ? 1 : -1;
      let nextTrIdx = trIdx + step;
      while (nextTrIdx >= 0 && nextTrIdx < allRows.length) {
        const candidateTr = allRows[nextTrIdx];
        const matchInput = candidateTr.querySelector(`input[data-f="${targetField}"]:not([readonly]):not([disabled])`);
        if (matchInput && matchInput.offsetParent !== null) return matchInput;
        const fallbackInput = candidateTr.querySelector(`input.form-control-result:not([readonly]):not([disabled]), textarea.form-control-result:not([readonly]):not([disabled])`);
        if (fallbackInput && fallbackInput.offsetParent !== null) return fallbackInput;
        nextTrIdx += step;
      }
    }

    const allInputs = getVisibleReportInputs();
    const inpIdx = allInputs.indexOf(currentInput);
    if (inpIdx !== -1) {
      if (direction === 'down') {
        if (inpIdx < allInputs.length - 1) return allInputs[inpIdx + 1];
        return $('edRemarks') || null;
      }
      if (direction === 'up' && inpIdx > 0) return allInputs[inpIdx - 1];
    }
    return null;
  }

  function findInputHorizontal(currentInput, direction) {
    const allInputs = getVisibleReportInputs();
    const idx = allInputs.indexOf(currentInput);
    if (idx === -1) return null;
    if (direction === 'right') {
      if (idx < allInputs.length - 1) return allInputs[idx + 1];
    } else if (direction === 'left') {
      if (idx > 0) return allInputs[idx - 1];
    }
    return null;
  }

  $('edRows').addEventListener('keydown', e => {
    const target = e.target;
    if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) return;

    if (e.key === 'Enter') {
      if (target.tagName === 'TEXTAREA') {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
          e.preventDefault();
          const start = target.selectionStart ?? target.value.length;
          const end = target.selectionEnd ?? target.value.length;
          const val = target.value;
          target.value = val.substring(0, start) + '\n' + val.substring(end);
          target.selectionStart = target.selectionEnd = start + 1;
          target.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
        e.preventDefault();
        const next = findInputVertical(target, 'down');
        if (next) focusAndSelectInput(next);
        return;
      }
      e.preventDefault();
      if (e.shiftKey) {
        const prev = findInputVertical(target, 'up');
        if (prev) focusAndSelectInput(prev);
      } else {
        const next = findInputVertical(target, 'down');
        if (next) focusAndSelectInput(next);
      }
    } else if (e.key === 'ArrowDown') {
      if (target.tagName === 'TEXTAREA') {
        const { start, end } = getCaretPositions(target);
        const valLen = (target.value || '').length;
        const lastLineStart = target.value.lastIndexOf('\n') + 1;
        const isAtLastLine = start >= lastLineStart;
        const isAllSelected = start === 0 && end === valLen;
        if (isAtLastLine || isAllSelected) {
          e.preventDefault();
          const next = findInputVertical(target, 'down');
          if (next) focusAndSelectInput(next);
        }
      } else {
        e.preventDefault();
        const next = findInputVertical(target, 'down');
        if (next) focusAndSelectInput(next);
      }
    } else if (e.key === 'ArrowUp') {
      if (target.tagName === 'TEXTAREA') {
        const { start, end } = getCaretPositions(target);
        const valLen = (target.value || '').length;
        const firstLineEnd = target.value.indexOf('\n') === -1 ? valLen : target.value.indexOf('\n');
        const isAtFirstLine = start <= firstLineEnd;
        const isAllSelected = start === 0 && end === valLen;
        if (isAtFirstLine || isAllSelected) {
          e.preventDefault();
          const prev = findInputVertical(target, 'up');
          if (prev) focusAndSelectInput(prev);
        }
      } else {
        e.preventDefault();
        const prev = findInputVertical(target, 'up');
        if (prev) focusAndSelectInput(prev);
      }
    } else if (e.key === 'ArrowRight') {
      const { start, end } = getCaretPositions(target);
      const valLen = (target.value || '').length;
      const isAtEnd = start === valLen && end === valLen;
      const isAllSelected = start === 0 && end === valLen;
      if (isAtEnd || isAllSelected) {
        const next = findInputHorizontal(target, 'right');
        if (next) {
          e.preventDefault();
          focusAndSelectInput(next);
        }
      }
    } else if (e.key === 'ArrowLeft') {
      const { start, end } = getCaretPositions(target);
      const valLen = (target.value || '').length;
      const isAtStart = start === 0 && end === 0;
      const isAllSelected = start === 0 && end === valLen;
      if (isAtStart || isAllSelected) {
        const prev = findInputHorizontal(target, 'left');
        if (prev) {
          e.preventDefault();
          focusAndSelectInput(prev);
        }
      }
    }
  });
}

window.openEditor = l => {
  const r = find(l);
  editing = l;
  $('edPatient').textContent = `${r.name} — Lab No ${r.labNo}`;
  $('edMeta').textContent = `${r.age} yrs / ${r.gender}${r.doctor ? ' · Doctor: ' + r.doctor : ''}`;
  
  editorState = {};
  (r.tests || []).forEach((t, i) => {
    const prev = (r.results || {})[t.name];
    if (prev) {
      editorState[i] = JSON.parse(JSON.stringify(prev));
      const tmpl = TEST_TEMPLATES[editorState[i].templateId] || findTemplate(t.name);
      if (tmpl) {
        editorState[i].isDetailed = true;
        editorState[i].templateId = tmpl.id;
        editorState[i].params = editorState[i].params || {};
        if (editorState[i].remark === undefined) {
          editorState[i].remark = prev.remark !== undefined ? prev.remark : (tmpl.remark || '');
        }
      } else {
        if (editorState[i].remark === undefined) {
          editorState[i].remark = prev.remark || '';
        }
      }
    } else {
      const tmpl = findTemplate(t.name);
      if (tmpl) {
        editorState[i] = {
          isDetailed: true,
          templateId: tmpl.id,
          params: {},
          method: tmpl.method || '',
          remark: tmpl.remark || ''
        };
      } else {
        editorState[i] = {
          isDetailed: false,
          value: '',
          unit: '',
          range: '',
          remark: ''
        };
      }
    }
    editorState[i].collapsed = false;
  });

  renderEditorRows();
  $('edTotal').value = r.total;
  $('edAdvance').value = r.advance || 0;
  $('edDoctor').value = r.doctor || '';
  $('edRDate').value = r.reportDate || today();
  $('edRTime').value = r.reportTime || '10:00';
  $('edRemarks').value = r.remarks || '';
  show('editor');

  setTimeout(() => {
    const firstResult = $('edRows') ? $('edRows').querySelector('input.form-control-result:not([readonly]):not([disabled])') : null;
    if (firstResult && firstResult.offsetParent !== null) {
      firstResult.focus();
      try { firstResult.select(); } catch (err) {}
    }
  }, 100);
};

function saveEditor(status) {
  snapshotEditorInputs();
  const r = find(editing);
  r.results = {};
  (r.tests || []).forEach((t, i) => {
    const st = editorState[i] || {};
    const tmpl = TEST_TEMPLATES[st.templateId] || findTemplate(t.name);
    if (tmpl) {
      r.results[t.name] = {
        isDetailed: true,
        templateId: tmpl.id,
        params: st.params || {},
        method: tmpl.method || '',
        remark: st.remark !== undefined ? st.remark.trim() : (tmpl.remark || ''),
        value: 'Detailed Parameters'
      };
    } else {
      r.results[t.name] = {
        isDetailed: false,
        value: (st.value || '').trim(),
        unit: (st.unit || '').trim(),
        range: (st.range || '').trim(),
        remark: (st.remark || '').trim()
      };
    }
  });
  r.remarks = $('edRemarks').value.trim();
  r.reportedBy = user.name;
  r.advance = Number($('edAdvance').value) || 0;
  r.doctor = $('edDoctor').value.trim();
  r.reportDate = $('edRDate').value;
  r.reportTime = $('edRTime').value;
  if (status) r.status = status;
  persist();
  updateBadge();
  return r;
}
$('edComplete').onclick = () => { saveEditor('done'); toast('Report completed'); show('pending'); };
$('edPrintRcpt').onclick = () => printReceipt(saveEditor());
$('edDraft').onclick = () => { saveEditor(); toast('Draft saved'); };
if ($('edPdf')) $('edPdf').onclick = () => downloadReportPdf(saveEditor());
$('edPrint').onclick = () => printReport(saveEditor());
$('edBack').onclick = () => show('pending');

/* ---------- RECEPTIONIST ---------- */
function renderRegTests() {
  const q = $('rgSearch').value.toLowerCase();
  const checked = new Set([...document.querySelectorAll('#rgTests input:checked')].map(i => i.value));
  $('rgTests').innerHTML = tests.filter(t => t.name.toLowerCase().includes(q)).map(t =>
    `<label><input type="checkbox" value="${esc(t.name)}" ${checked.has(t.name) ? 'checked' : ''}>${esc(t.name)}</label>`).join('');
  document.querySelectorAll('#rgTests input').forEach(i => i.onchange = rgCount);
  rgCount();
}
const rgPicked = new Set();
function rgCount() {
  document.querySelectorAll('#rgTests input').forEach(i => i.checked ? rgPicked.add(i.value) : rgPicked.delete(i.value));
  $('rgCount').textContent = rgPicked.size + ' selected';
}
function renderRecent() {
  const list = receipts.filter(r => r.createdBy === user?.name).slice(-6).reverse();
  $('rgRecent').innerHTML = list.length ? list.map(r => `<li class="list-group-item d-flex justify-content-between"><span><b>${esc(r.labNo)}</b> ${esc(r.name)}<br><small class="text-muted">${r.tests.length} test(s)</small></span>
    <span class="badge align-self-center ${r.status === 'done' ? 'bg-success' : 'bg-warning text-dark'}">${r.status === 'done' ? 'Report ready' : 'With reporter'}</span></li>`).join('')
    : '<li class="list-group-item text-muted">Nothing added yet</li>';
}
$('rgSearch').oninput = renderRegTests;
$('regForm').onsubmit = e => {
  e.preventDefault(); rgCount();
  if (!rgPicked.size) return toast('Select at least one test');
  const list = tests.filter(t => rgPicked.has(t.name)).map(t => ({ ...t }));
  const lab = $('rgLab').value.trim();
  if (find(lab)) return toast('Lab No already exists');
  receipts.push({ labNo: lab, date: $('rgDate').value, name: $('rgName').value.trim(), age: $('rgAge').value,
    gender: $('rgGender').value, phone: $('rgPhone').value.trim(), refBy: $('rgRef').value.trim(), tests: list,
    total: list.reduce((s, t) => s + Number(t.price), 0), advance: 0, doctor: '', reportTime: '10:00', reportDate: $('rgDate').value,
    status: 'pending', results: {}, remarks: '', reportedBy: '', createdBy: user.name });
  persist(); updateDoctors(); toast('Sent to reporter');
  $('regForm').reset(); rgPicked.clear(); resetReg(); renderRegTests(); renderRecent();
};
function resetReg() { $('rgLab').value = nextLab(); $('rgDate').value = today(); }

/* ---------- ADMIN: USERS ---------- */
function renderUsers() {
  $('usersTable').innerHTML = users.map((u, i) => `<tr><td><code class="fs-6">${esc(u.name)}</code></td><td><code class="fs-6">${esc(u.pass)}</code></td>
    <td><span class="badge bg-secondary text-capitalize">${u.role}</span></td>
    <td class="text-end">${u.name === 'admin' ? '' : `<button class="btn btn-sm btn-outline-danger" onclick="delUser(${i})"><i class="bi bi-trash"></i></button>`}</td></tr>`).join('');
}
$('userForm').onsubmit = e => {
  e.preventDefault();
  const name = $('uName').value.trim();
  if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) return toast('Username already exists');
  users.push({ name, pass: $('uPass').value.trim(), role: $('uRole').value });
  store('users', users); $('userForm').reset(); renderUsers(); toast('User added');
};
window.delUser = i => { if (confirm('Delete user ' + users[i].name + '?')) { users.splice(i, 1); store('users', users); renderUsers(); } };

function updateDoctors() {
  const names = [...new Set(receipts.flatMap(r => [r.doctor, r.refBy]).filter(Boolean))];
  $('doctorList').innerHTML = names.map(n => `<option value="${esc(n)}">`).join('');
}

renderTestSelect(); renderTestsTable(); updateDoctors(); clearForm(); resetReg();
const saved = sessionStorage.getItem('user');
if (saved) { user = JSON.parse(saved); startApp(); }
