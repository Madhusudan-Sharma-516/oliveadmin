/* ==========================================================================
   Page Module: Patient Registration (Receptionist)
   Handles patient intake, test selection checklist, and recently added list
   ========================================================================== */

const rgPicked = new Set();

function renderRegTests() {
  const rgTestsEl = $('rgTests');
  if (!rgTestsEl) return;
  const q = ($('rgSearch')?.value || '').toLowerCase();
  const checked = new Set([...rgTestsEl.querySelectorAll('input:checked')].map(i => i.value));
  
  rgTestsEl.innerHTML = tests
    .filter(t => t.name.toLowerCase().includes(q))
    .map(t => `
      <label>
        <input type="checkbox" value="${esc(t.name)}" ${checked.has(t.name) ? 'checked' : ''}>
        ${esc(t.name)}
      </label>
    `).join('');

  rgTestsEl.querySelectorAll('input').forEach(i => {
    i.onchange = rgCount;
  });
  rgCount();
}

function rgCount() {
  const rgTestsEl = $('rgTests');
  if (rgTestsEl) {
    rgTestsEl.querySelectorAll('input').forEach(i => {
      if (i.checked) rgPicked.add(i.value);
      else rgPicked.delete(i.value);
    });
  }
  const rgCountBadge = $('rgCount');
  if (rgCountBadge) {
    rgCountBadge.textContent = `${rgPicked.size} selected`;
  }
}

function renderRecent() {
  const rgRecentEl = $('rgRecent');
  if (!rgRecentEl) return;
  const list = receipts.filter(r => r.createdBy === user?.name).slice(-6).reverse();
  rgRecentEl.innerHTML = list.length ? list.map(r => `
    <li class="list-group-item d-flex justify-content-between">
      <span>
        <b>${esc(r.labNo)}</b> ${esc(r.name)}<br>
        <small class="text-muted">${r.tests.length} test(s)</small>
      </span>
      <span class="badge align-self-center ${r.status === 'done' ? 'bg-success' : 'bg-warning text-dark'}">
        ${r.status === 'done' ? 'Report ready' : 'With reporter'}
      </span>
    </li>
  `).join('') : '<li class="list-group-item text-muted">Nothing added yet</li>';
}

function resetReg() {
  if ($('rgLab')) $('rgLab').value = nextLab();
  if ($('rgDate')) $('rgDate').value = today();
}

function initRegister() {
  const rgSearchEl = $('rgSearch');
  if (rgSearchEl) {
    rgSearchEl.oninput = renderRegTests;
  }

  const regForm = $('regForm');
  if (regForm) {
    regForm.onsubmit = e => {
      e.preventDefault();
      rgCount();
      if (!rgPicked.size) return toast('Select at least one test');
      
      const list = tests.filter(t => rgPicked.has(t.name)).map(t => ({ ...t }));
      const lab = $('rgLab').value.trim();
      if (find(lab)) return toast('Lab No already exists');

      receipts.push({
        labNo: lab,
        date: $('rgDate').value,
        name: $('rgName').value.trim(),
        age: $('rgAge').value,
        gender: $('rgGender').value,
        phone: $('rgPhone') ? $('rgPhone').value.trim() : '',
        refBy: $('rgRef') ? $('rgRef').value.trim() : '',
        tests: list,
        total: list.reduce((s, t) => s + Number(t.price), 0),
        advance: 0,
        doctor: '',
        reportTime: '10:00',
        reportDate: $('rgDate').value,
        status: 'pending',
        results: {},
        remarks: '',
        reportedBy: '',
        createdBy: user?.name || ''
      });

      persist();
      updateDoctors();
      toast('Sent to reporter');
      regForm.reset();
      rgPicked.clear();
      resetReg();
      renderRegTests();
      renderRecent();
      if (typeof updateBadge === 'function') updateBadge();
    };
  }
}

initRegister();
