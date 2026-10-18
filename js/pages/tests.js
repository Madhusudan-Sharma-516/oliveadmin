/* ==========================================================================
   Page Module: Manage Tests (Admin / Reporter)
   Test catalog CRUD, pricing configuration, and live search
   ========================================================================== */

function renderTestsTable() {
  const testsTable = $('testsTable');
  if (!testsTable) return;
  const q = ($('testSearch')?.value || '').toLowerCase();

  testsTable.innerHTML = tests
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.name.toLowerCase().includes(q))
    .map(({ t, i }) => `
      <tr>
        <td>${i + 1}</td>
        <td>${esc(t.name)}</td>
        <td class="text-end">₹${t.price}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editTest(${i})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="delTest(${i})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
}

window.editTest = i => {
  const item = tests[i];
  if (!item) return;
  if ($('testName')) $('testName').value = item.name;
  if ($('testPrice')) $('testPrice').value = item.price;
  if ($('editIndex')) $('editIndex').value = i;
  if ($('testSubmit')) $('testSubmit').textContent = 'Update Test';
  $('testName')?.focus();
};

window.delTest = i => {
  if (confirm(`Delete test "${tests[i]?.name}"?`)) {
    tests.splice(i, 1);
    store('tests', tests);
    renderTestsTable();
    if (typeof renderTestSelect === 'function') renderTestSelect();
    toast('Test deleted');
  }
};

function initTestsManager() {
  const testSearch = $('testSearch');
  if (testSearch) {
    testSearch.oninput = renderTestsTable;
  }

  const testForm = $('testForm');
  if (testForm) {
    testForm.onsubmit = e => {
      e.preventDefault();
      const testNameEl = $('testName');
      const testPriceEl = $('testPrice');
      const editIndexEl = $('editIndex');
      const testSubmitEl = $('testSubmit');

      const name = (testNameEl?.value || '').trim();
      const price = Number(testPriceEl?.value) || 0;
      const idx = Number(editIndexEl?.value);

      const item = { name, price };
      if (idx >= 0) {
        tests[idx] = item;
      } else {
        tests.push(item);
      }

      store('tests', tests);
      testForm.reset();
      if (editIndexEl) editIndexEl.value = -1;
      if (testSubmitEl) testSubmitEl.textContent = 'Add Test';

      renderTestsTable();
      if (typeof renderTestSelect === 'function') renderTestSelect();
      toast('Test saved');
    };
  }
}

initTestsManager();
