/* ==========================================================================
   Page Module: New Custom Report & Receipt Billing (Reporter / Admin)
   Handles custom patient entry, interactive test selection, and billing
   ========================================================================== */

function nextLab() {
  const nums = receipts.map(r => parseInt(r.labNo)).filter(n => !isNaN(n));
  return String((nums.length ? Math.max(...nums) : 1000) + 1);
}

window.getAllSearchableTests = function() {
  const map = new Map();
  // 1. Current tests catalog
  (tests || []).forEach(t => {
    if (t && t.name) {
      map.set(t.name.toLowerCase().trim(), {
        name: t.name.trim(),
        price: Number(t.price) || 0,
        dept: ''
      });
    }
  });

  // 2. Tests from TEST_TEMPLATES master (if not in catalog, include with sensible price)
  if (typeof TEST_TEMPLATES === 'object' && TEST_TEMPLATES !== null) {
    Object.keys(TEST_TEMPLATES).forEach(key => {
      const tmpl = TEST_TEMPLATES[key];
      if (tmpl && tmpl.title) {
        const titleClean = tmpl.title.trim();
        const lower = titleClean.toLowerCase();
        if (!map.has(lower)) {
          const hasMatch = Array.from(map.keys()).some(k => tmpl.match?.includes(k));
          if (!hasMatch) {
            map.set(lower, {
              name: titleClean,
              price: 300,
              dept: tmpl.subtitle || 'Investigation'
            });
          }
        }
      }
    });
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

window.openTestDropdown = () => {
  const dd = $('testSelectionDropdown');
  if (dd) {
    dd.classList.remove('d-none');
    const ch = $('toggleTestsChevron');
    if (ch) ch.className = 'bi bi-chevron-up';
    renderTestDropdownList();
  }
};

window.closeTestDropdown = () => {
  const dd = $('testSelectionDropdown');
  if (dd) {
    dd.classList.add('d-none');
    const ch = $('toggleTestsChevron');
    if (ch) ch.className = 'bi bi-chevron-down';
  }
};

window.toggleTestDropdown = () => {
  const dd = $('testSelectionDropdown');
  if (dd && dd.classList.contains('d-none')) {
    openTestDropdown();
    $('testSearchInput')?.focus();
  } else {
    closeTestDropdown();
  }
};

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
  const searchInput = $('testSearchInput') || $('testDropdownSearch');
  const q = (searchInput?.value || '').trim().toLowerCase();
  const selNames = new Set(selected.map(s => s.name.toLowerCase().trim()));

  const allTests = getAllSearchableTests();
  const filtered = allTests.filter(t => {
    if (!q) return true;
    const nameLower = t.name.toLowerCase();
    if (nameLower.includes(q)) return true;
    const tmpl = typeof findTemplate === 'function' ? findTemplate(t.name) : null;
    if (tmpl && tmpl.match && tmpl.match.some(m => m.includes(q) || q.includes(m))) return true;
    if (t.dept && t.dept.toLowerCase().includes(q)) return true;
    return false;
  });

  const counterEl = $('testListCounter');
  if (counterEl) {
    counterEl.textContent = q ? `Found ${filtered.length} tests matching "${q}"` : `All Available Tests (${filtered.length})`;
  }

  if (!filtered.length) {
    listEl.innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="bi bi-search fs-3 text-secondary d-block mb-1"></i>
        <div class="fw-semibold">No tests matching "${esc(q)}"</div>
        <div class="small mt-1 text-muted">Try searching "CBC", "KFT", "LFT", "Lipid", "Sugar", "Urine", etc.</div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(t => {
    const isSel = selNames.has(t.name.toLowerCase().trim());
    const tmpl = typeof findTemplate === 'function' ? findTemplate(t.name) : null;
    const deptText = t.dept || tmpl?.subtitle || '';
    const paramCount = tmpl?.items ? tmpl.items.filter(x => !x.isHeader).length : null;

    return `
      <div class="d-flex justify-content-between align-items-center p-2 rounded hover-test-item ${isSel ? 'is-selected' : ''}" 
           onclick="toggleSelectTest('${esc(t.name)}', ${t.price});" 
           title="${isSel ? 'Click to remove test' : 'Click to add test'}">
        <div class="me-2 text-truncate">
          <div class="d-flex align-items-center gap-2">
            <span class="fw-semibold text-dark text-truncate">${esc(t.name)}</span>
            ${paramCount ? `<span class="badge bg-light text-secondary border small" style="font-size:0.7rem;">${paramCount} params</span>` : ''}
          </div>
          <div class="d-flex align-items-center gap-2 small text-muted">
            <span class="fw-bold text-primary">₹${t.price}</span>
            ${deptText ? `<span>&middot;</span><span class="text-truncate">${esc(deptText)}</span>` : ''}
          </div>
        </div>
        <button type="button" class="btn btn-sm ${isSel ? 'btn-success' : 'btn-outline-primary'} text-nowrap px-3 py-1" 
                onclick="toggleSelectTest('${esc(t.name)}', ${t.price}); event.stopPropagation();">
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

window.toggleSelectTest = (target, price) => {
  let name = '';
  let itemPrice = 0;
  if (typeof target === 'number') {
    const item = tests[target];
    if (!item) return;
    name = item.name;
    itemPrice = Number(item.price) || 0;
  } else if (typeof target === 'string') {
    name = target.trim();
    itemPrice = Number(price) || 0;
  }
  if (!name) return;

  const existingIdx = selected.findIndex(s => s.name.toLowerCase().trim() === name.toLowerCase());
  if (existingIdx >= 0) {
    selected.splice(existingIdx, 1);
  } else {
    selected.push({ name, price: itemPrice });
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
  if ($('testSearchInput')) $('testSearchInput').value = '';
  if ($('clearTestSearchBtn')) $('clearTestSearchBtn').style.display = 'none';
  closeTestDropdown();
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

  const testSearchInput = $('testSearchInput') || $('testDropdownSearch');
  const clearTestSearchBtn = $('clearTestSearchBtn');
  const toggleAllTestsBtn = $('toggleAllTestsBtn');

  if (testSearchInput) {
    // When clicking or focusing the search box, show all tests in the bottom dropdown
    testSearchInput.addEventListener('focus', () => {
      openTestDropdown();
    });
    testSearchInput.addEventListener('click', () => {
      openTestDropdown();
    });

    testSearchInput.addEventListener('input', () => {
      const val = testSearchInput.value.trim();
      if (clearTestSearchBtn) {
        clearTestSearchBtn.style.display = val.length > 0 ? 'inline-block' : 'none';
      }
      openTestDropdown();
      renderTestDropdownList();
    });

    testSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstBtn = $('testDropdownList')?.querySelector('.hover-test-item');
        if (firstBtn && testSearchInput.value.trim().length > 0) {
          firstBtn.click();
          testSearchInput.value = '';
          if (clearTestSearchBtn) clearTestSearchBtn.style.display = 'none';
          renderTestDropdownList();
        } else {
          closeTestDropdown();
          focusElement($('advance'));
        }
      } else if (e.key === 'Escape') {
        closeTestDropdown();
      }
    });
  }

  if (clearTestSearchBtn) {
    clearTestSearchBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (testSearchInput) {
        testSearchInput.value = '';
        clearTestSearchBtn.style.display = 'none';
        testSearchInput.focus();
        openTestDropdown();
        renderTestDropdownList();
      }
    });
  }

  if (toggleAllTestsBtn) {
    toggleAllTestsBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleTestDropdown();
    });
  }

  // Click outside to automatically close the bottom dropdown
  document.addEventListener('click', e => {
    const container = $('testSearchContainer');
    if (container && !container.contains(e.target)) {
      closeTestDropdown();
    }
  });

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
