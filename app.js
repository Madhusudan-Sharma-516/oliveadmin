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
      { name: 'PLATELET COUNT', unit: 'Lacs/cu.mm', range: '1.5 - 4.1' },
      { name: 'ESR', unit: 'mm. after 1 hr.', range: 'Upto 35' }
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
  $('testSelect').innerHTML = '<option value="">-- Select Test --</option>' +
    tests.map((t, i) => `<option value="${i}">${esc(t.name)} — ₹${t.price}</option>`).join('');
}
function renderSelected() {
  $('selectedTests').innerHTML = selected.length ? selected.map((t, i) =>
    `<tr><td>${esc(t.name)}</td><td class="text-end">${t.price}</td>
     <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="removeSel(${i})"><i class="bi bi-x-lg"></i></button></td></tr>`).join('')
    : '<tr><td colspan="3" class="text-center text-muted">No tests added</td></tr>';
  updateTotals();
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

function collect() {
  return {
    labNo: $('labNo').value.trim(), date: $('date').value, name: $('name').value.trim(),
    age: $('age').value, gender: $('gender').value, refBy: $('refBy').value.trim(),
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
  ['name', 'age', 'gender', 'refBy', 'doctor'].forEach(k => $(k).value = '');
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

function printReport(r) {
  let rows = '';
  (r.tests || []).forEach(t => {
    const x = (r.results || {})[t.name] || {};
    if (x.isDetailed && x.params) {
      const tmpl = TEST_TEMPLATES[x.templateId] || findTemplate(t.name);
      rows += `<tr style="background:#eaf4f2; font-weight:bold;"><td colspan="4" style="padding:6px 8px; text-transform:uppercase;">${esc(t.name)}</td></tr>`;
      if (tmpl) {
        tmpl.items.forEach(item => {
          if (item.isHeader) {
            rows += `<tr style="background:#f8fafc; font-weight:600; font-size:12px;"><td colspan="4" style="padding:4px 8px; text-decoration:underline;">${esc(item.title)}</td></tr>`;
          } else {
            const p = x.params[item.name] || {};
            const val = p.value !== undefined ? p.value : '';
            const u = p.unit !== undefined ? p.unit : item.unit;
            const rng = p.range !== undefined ? p.range : item.range;
            rows += `<tr><td style="padding-left:18px;">${esc(item.name)}</td><td><b>${esc(val)}</b></td><td>${esc(u)}</td><td>${esc(rng)}</td></tr>`;
          }
        });
      } else {
        Object.keys(x.params).forEach(pName => {
          const p = x.params[pName] || {};
          rows += `<tr><td style="padding-left:18px;">${esc(pName)}</td><td><b>${esc(p.value || '')}</b></td><td>${esc(p.unit || '')}</td><td>${esc(p.range || '')}</td></tr>`;
        });
      }
      if (x.remark || tmpl?.remark) {
        rows += `<tr><td colspan="4" style="font-size:11px; font-style:italic; padding:4px 8px; color:#444;">${esc(x.remark || tmpl.remark)}</td></tr>`;
      }
    } else {
      rows += `<tr><td>${esc(t.name)}</td><td><b>${esc(x.value || '')}</b></td><td>${esc(x.unit || '')}</td><td>${esc(x.range || '')}</td></tr>`;
    }
  });

  printHtml(`<div class="rcpt">
    <h2>${CLINIC.toUpperCase()}</h2><div class="sub">Laboratory Report</div><hr>
    <table class="info">
      <tr><td><b>Lab No:</b> ${esc(r.labNo)}</td><td class="num"><b>Date:</b> ${fmtDate(r.date)}</td></tr>
      <tr><td><b>Name:</b> ${esc(r.name)}</td><td class="num"><b>Age/Gender:</b> ${esc(r.age)} / ${esc(r.gender)}</td></tr>
      <tr><td><b>Ref By:</b> ${esc(r.refBy)}</td><td class="num"><b>Doctor:</b> ${esc(r.doctor)}</td></tr>
    </table><hr>
    <table class="tests"><thead><tr><th>Test / Investigation</th><th>Result</th><th>Unit</th><th>Reference Range</th></tr></thead><tbody>${rows}</tbody></table>
    ${r.remarks ? `<p style="margin-top:10px"><b>Remarks:</b> ${esc(r.remarks)}</p>` : ''}
    <div class="sign"><span>Reported by: ${esc(r.reportedBy)}</span><span>Authorised Signatory</span></div>
  </div>`);
}

/* ---------- SAVED (receptionist) ---------- */
function renderSaved() {
  const q = $('receiptSearch').value.toLowerCase();
  const list = receipts.filter(r => r.labNo.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)).slice().reverse();
  $('savedTable').innerHTML = list.length ? list.map(r => `<tr><td>${esc(r.labNo)}</td><td>${fmtDate(r.date)}</td><td>${esc(r.name)}</td>
    <td>${esc(r.doctor)}</td><td class="text-end">₹${r.total}</td><td class="text-end">₹${r.advance}</td>
    <td>${r.status === 'done' ? '<span class="badge bg-success">Ready</span>' : '<span class="badge bg-warning text-dark">Pending</span>'}</td>
    <td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-primary me-1" title="Edit" onclick="openRcpt('${esc(r.labNo)}')"><i class="bi bi-pencil"></i></button>
    <button class="btn btn-sm btn-outline-warning me-1" title="Print receipt" onclick="printRcpt('${esc(r.labNo)}')"><i class="bi bi-printer"></i></button>
    ${r.status === 'done' ? `<button class="btn btn-sm btn-outline-success me-1" title="Print report" onclick="printRep('${esc(r.labNo)}')"><i class="bi bi-file-earmark-medical"></i></button>` : ''}
    <button class="btn btn-sm btn-outline-danger" onclick="delRcpt('${esc(r.labNo)}')"><i class="bi bi-trash"></i></button></td></tr>`).join('')
    : '<tr><td colspan="8" class="text-center text-muted">No receipts</td></tr>';
}
$('receiptSearch').oninput = renderSaved;
window.printRcpt = l => printReceipt(find(l));
window.printRep = l => printReport(find(l));
window.delRcpt = l => { if (confirm('Delete receipt ' + l + '?')) { receipts = receipts.filter(r => r.labNo !== l); persist(); renderSaved(); updateBadge(); } };
window.openRcpt = l => {
  const r = find(l);
  ['labNo', 'date', 'name', 'age', 'gender', 'refBy', 'advance', 'doctor', 'reportTime', 'reportDate'].forEach(k => $(k).value = r[k]);
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
    <td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-primary me-1" onclick="openEditor('${esc(r.labNo)}')"><i class="bi bi-pencil"></i></button>
    <button class="btn btn-sm btn-warning" onclick="printRep('${esc(r.labNo)}')"><i class="bi bi-printer"></i></button></td></tr>`).join('')
    : '<tr><td colspan="5" class="text-center text-muted py-4">No completed reports</td></tr>';
}
let editorState = {};

function snapshotEditorInputs() {
  document.querySelectorAll('[data-test-idx]').forEach(inp => {
    const idx = parseInt(inp.dataset.testIdx, 10);
    if (!editorState[idx]) return;
    if (inp.dataset.simple === 'true') {
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

window.toggleTestDetail = idx => {
  snapshotEditorInputs();
  if (!editorState[idx]) return;
  editorState[idx].isDetailed = !editorState[idx].isDetailed;
  renderEditorRows();
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
  renderEditorRows();
  toast('Normal urine values filled');
};

function renderEditorRows() {
  const r = find(editing);
  if (!r) return;

  const html = r.tests.map((t, i) => {
    const st = editorState[i] || {};
    const tmpl = TEST_TEMPLATES[st.templateId] || findTemplate(t.name);
    const hasTmpl = Boolean(tmpl);
    const isDetailed = Boolean(st.isDetailed && tmpl);

    let bodyHtml = '';
    if (isDetailed) {
      const rows = tmpl.items.map(item => {
        if (item.isHeader) {
          return `<tr class="param-cat-row"><td colspan="4"><i class="bi bi-folder2 me-1"></i>${esc(item.title)}</td></tr>`;
        }
        const pData = (st.params && st.params[item.name]) || {};
        const pVal = pData.value !== undefined ? pData.value : (item.defaultVal || '');
        return `<tr>
          <td class="${item.indent ? 'param-indent' : 'fw-semibold'}">${esc(item.name)}</td>
          <td><input class="form-control form-control-sm form-control-result" data-test-idx="${i}" data-param="${esc(item.name)}" data-f="value" value="${esc(pVal)}" placeholder="Enter result..."></td>
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
            <span class="small text-muted fst-italic">${esc(tmpl.remark || '')}</span>
          </div>` : (tmpl.method ? `
          <div class="p-2 bg-light border-top text-muted small"><i class="bi bi-info-circle me-1"></i>${esc(tmpl.method)}</div>` : '')}
      `;
    } else {
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
                <td><input class="form-control form-control-sm form-control-result" data-test-idx="${i}" data-simple="true" data-f="value" value="${esc(st.value || '')}" placeholder="Enter result..."></td>
                <td><input class="form-control form-control-sm" data-test-idx="${i}" data-simple="true" data-f="unit" value="${esc(st.unit || '')}" placeholder="Unit"></td>
                <td><input class="form-control form-control-sm" data-test-idx="${i}" data-simple="true" data-f="range" value="${esc(st.range || '')}" placeholder="Reference Range"></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="card shadow-sm mb-3 test-card">
        <div class="test-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="fw-bold fs-6 text-dark"><i class="bi bi-clipboard2-pulse text-primary me-1"></i>${esc(t.name)}</span>
            ${hasTmpl ? `<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-layers me-1"></i>${tmpl.title} (${tmpl.items.filter(x => !x.isHeader).length} Params)</span>` : ''}
          </div>
          <div class="d-flex align-items-center gap-3">
            ${hasTmpl ? `
              <div class="form-check form-switch m-0 d-inline-flex align-items-center gap-2">
                <input class="form-check-input" type="checkbox" role="switch" id="toggle_${i}" ${isDetailed ? 'checked' : ''} onchange="toggleTestDetail(${i})">
                <label class="form-check-label small fw-semibold cursor-pointer user-select-none" for="toggle_${i}">
                  ${isDetailed ? '<span class="text-success"><i class="bi bi-toggle2-on me-1"></i>Detailed Parameters</span>' : '<span class="text-secondary"><i class="bi bi-toggle2-off me-1"></i>Simple Mode</span>'}
                </label>
              </div>` : `
              <select class="form-select form-select-sm" style="width:auto" onchange="changeTestTemplate(${i}, this.value)">
                <option value="none">-- Single Value --</option>
                <option value="haematology">Haematology (CBC)</option>
                <option value="lipid">Lipid Profile</option>
                <option value="biochemistry">Biochemistry</option>
                <option value="urine">Urine Analysis</option>
              </select>`}
          </div>
        </div>
        <div class="card-body p-0">${bodyHtml}</div>
      </div>
    `;
  }).join('');

  $('edRows').innerHTML = html || '<div class="alert alert-secondary text-center">No tests selected</div>';
}

window.openEditor = l => {
  const r = find(l);
  editing = l;
  $('edPatient').textContent = `${r.name} — Lab No ${r.labNo}`;
  $('edMeta').textContent = `${r.age} yrs / ${r.gender} · Ref: ${r.refBy || '-'} · Doctor: ${r.doctor || '-'}`;
  
  editorState = {};
  (r.tests || []).forEach((t, i) => {
    const prev = (r.results || {})[t.name];
    if (prev) {
      editorState[i] = JSON.parse(JSON.stringify(prev));
      if (editorState[i].isDetailed === undefined) {
        const tmpl = findTemplate(t.name);
        editorState[i].isDetailed = Boolean(tmpl);
        if (tmpl) editorState[i].templateId = tmpl.id;
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
          range: ''
        };
      }
    }
  });

  renderEditorRows();
  $('edTotal').value = r.total;
  $('edAdvance').value = r.advance || 0;
  $('edDoctor').value = r.doctor || '';
  $('edRDate').value = r.reportDate || today();
  $('edRTime').value = r.reportTime || '10:00';
  $('edRemarks').value = r.remarks || '';
  show('editor');
};

function saveEditor(status) {
  snapshotEditorInputs();
  const r = find(editing);
  r.results = {};
  (r.tests || []).forEach((t, i) => {
    const st = editorState[i] || {};
    const tmpl = TEST_TEMPLATES[st.templateId] || findTemplate(t.name);
    if (st.isDetailed && tmpl) {
      r.results[t.name] = {
        isDetailed: true,
        templateId: tmpl.id,
        params: st.params || {},
        method: tmpl.method || '',
        remark: tmpl.remark || '',
        value: 'Detailed Parameters'
      };
    } else {
      r.results[t.name] = {
        isDetailed: false,
        value: (st.value || '').trim(),
        unit: (st.unit || '').trim(),
        range: (st.range || '').trim()
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
