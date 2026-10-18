/* ==========================================================================
   State Management & Data Persistence
   Maintains in-memory lists, active user session, and localStorage synchronization
   ========================================================================== */

// Users list
let users = load('users', null) || DEFAULT_USERS;

// Tests catalog
let tests = load('tests', null) || DEFAULT_TESTS;
if (ensureDefaultTests(tests)) {
  store('tests', tests);
}

// Receipts / Lab Reports
let receipts = load('receipts', []);

// Current active session & UI selection states
let user = null;            // Currently logged in user: { name, role }
let selected = [];        // Tests selected in "New Custom Report" billing
let editing = null;         // Lab No currently open in Report Editor
let editorState = {};       // Per-test parameter values & collapse states in editor

// Storage helper for receipts
const persist = () => store('receipts', receipts);

// Lookup receipt by Lab No
const find = labNo => receipts.find(r => r.labNo === labNo);

// Auto-populate doctor datalist suggestions from existing receipts
function updateDoctors() {
  const doctorList = $('doctorList');
  if (!doctorList) return;
  const names = [...new Set(receipts.flatMap(r => [r.doctor, r.refBy]).filter(Boolean))];
  doctorList.innerHTML = names.map(n => `<option value="${esc(n)}">`).join('');
}
