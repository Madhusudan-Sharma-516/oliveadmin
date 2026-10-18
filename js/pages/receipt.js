/* ==========================================================================
   Page Module: New Custom Report & Receipt Billing (Reporter / Admin)
   Handles custom patient entry, interactive test selection, and billing
   ========================================================================== */

function nextLab() {
  const nums = receipts.map(r => parseInt(r.labNo)).filter(n => !isNaN(n));
  return String((nums.length ? Math.max(...nums) : 1000) + 1);
}

function renderTestSelect() {
  const testSelectEl = $('testSelect');
  if (testSelectEl) {
    testSelectEl.innerHTML = '<option value="">-- Select Test --</option>' +
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

  const testDropdownBadge = $('testDropdownBadge');
  if (testDropdownBadge) {
    testDropdownBadge.textContent = `${selected.length} selected`;
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
  const selectedTestsEl = $('selectedTests');
  if (selectedTestsEl) {
    selectedTestsEl.innerHTML = selected.length ? selected.map((t, i) =>
      `<tr>
        <td>${esc(t.name)}</td>
        <td class="text-end">${t.price}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" onclick="removeSel(${i})">
            <i class="bi bi-x-lg"></i>
          </button>
        </td>
      </tr>`
    ).join('') : '<tr><td colspan="3" class="text-center text-muted">No tests added</td></tr>';
  }
  updateTotals();
  renderTestDropdownList();
}

const total = () => selected.reduce((s, t) => s + Number(t.price), 0);

function updateTotals() {
  if ($('total')) $('total').textContent = total();
  if ($('balance')) $('balance').value = total() - (Number($('advance')?.value) || 0);
}

window.removeSel = i => {
  selected.splice(i, 1);
  renderSelected();
};

function collect() {
  return {
    labNo: $('labNo')?.value.trim() || '',
    date: $('date')?.value || '',
    name: $('name')?.value.trim() || '',
    age: $('age')?.value || '',
    gender: $('gender')?.value || '',
    refBy: $('refBy') ? $('refBy').value.trim() : '',
    tests: selected.map(t => ({ ...t })),
    total: total(),
    advance: Number($('advance')?.value) || 0,
    doctor: $('doctor')?.value.trim() || '',
    reportTime: $('reportTime')?.value || '10:00',
    reportDate: $('reportDate')?.value || ''
  };
}

function save() {
  const r = collect();
  if (!r.labNo || !r.name) {
    toast('Lab No and Name are required');
    return null;
  }
  if (!r.tests.length) {
    toast('Add at least one test');
    return null;
  }
  const old = find(r.labNo);
  Object.assign(r, {
    status: old?.status || 'pending',
    results: old?.results || {},
    remarks: old?.remarks || '',
    reportedBy: old?.reportedBy || '',
    createdBy: old?.createdBy || user?.name || ''
  });
  if (old) {
    receipts[receipts.indexOf(old)] = r;
  } else {
    receipts.push(r);
  }
  persist();
  updateDoctors();
  if (typeof updateBadge === 'function') updateBadge();
  toast('Saved');
  return r;
}

function clearForm() {
  ['name', 'age', 'gender', 'doctor'].forEach(k => {
    if ($(k)) $(k).value = '';
  });
  if ($('advance')) $('advance').value = 0;
  if ($('reportTime')) $('reportTime').value = '10:00';
  if ($('labNo')) $('labNo').value = nextLab();
  if ($('date')) $('date').value = today();
  if ($('reportDate')) $('reportDate').value = today();
  selected = [];
  renderSelected();
}

function initReceipt() {
  const addTestBtn = $('addTestBtn');
  if (addTestBtn) {
    addTestBtn.onclick = () => {
      const i = $('testSelect')?.value;
      if (i === '' || i === undefined) return toast('Select a test first');
      selected.push({ ...tests[i] });
      if ($('testSelect')) $('testSelect').value = '';
      renderSelected();
    };
  }

  const advanceEl = $('advance');
  if (advanceEl) {
    advanceEl.oninput = updateTotals;
  }

  const testDropdownSearch = $('testDropdownSearch');
  if (testDropdownSearch) {
    testDropdownSearch.oninput = renderTestDropdownList;
  }

  const saveBtn = $('saveBtn');
  if (saveBtn) {
    saveBtn.onclick = () => {
      const r = save();
      if (r) {
        clearForm();
        if (typeof openEditor === 'function') openEditor(r.labNo);
      }
    };
  }

  const printBtn = $('printBtn');
  if (printBtn) {
    printBtn.onclick = () => {
      const r = save();
      if (r) {
        printReceipt(r);
        clearForm();
      }
    };
  }

  const clearBtn = $('clearBtn');
  if (clearBtn) {
    clearBtn.onclick = clearForm;
  }
}

initReceipt();
