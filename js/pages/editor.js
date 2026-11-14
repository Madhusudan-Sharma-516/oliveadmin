/* ==========================================================================
   Page Module: Report Editor
   Detailed investigation parameters entry, auto-calculations, ready phrases,
   keyboard navigation, and status updating
   ========================================================================== */

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
    icon.className = `bi ${isNowHidden ? 'bi-chevron-down' : 'bi-chevron-up'} fs-5 text-white`;
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
      icon.className = `bi ${collapsed ? 'bi-chevron-down' : 'bi-chevron-up'} fs-5 text-white`;
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


window.fillForm21SampleDefaults = idx => {
  snapshotEditorInputs();
  const tmpl = TEST_TEMPLATES.form_21;
  if (!tmpl) return;
  editorState[idx].params = editorState[idx].params || {};
  tmpl.items.forEach(it => {
    if (!it.isHeader) {
      const pKey = it.paramKey || it.name;
      editorState[idx].params[pKey] = {
        value: it.sampleVal || it.defaultVal || '',
        unit: it.unit || '',
        range: it.range || ''
      };
    }
  });
  renderEditorRows();
  toast('Form 21 standard sample values filled');
};

window.clearForm21Values = idx => {
  snapshotEditorInputs();
  const tmpl = TEST_TEMPLATES.form_21;
  if (!tmpl) return;
  editorState[idx].params = {};
  tmpl.items.forEach(it => {
    if (!it.isHeader) {
      const pKey = it.paramKey || it.name;
      editorState[idx].params[pKey] = {
        value: '',
        unit: it.unit || '',
        range: it.range || ''
      };
    }
  });
  renderEditorRows();
  toast('Form 21 values cleared');
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
}

window.toggleTestRemark = idx => {
  const row = $(`testRemarkRow_${idx}`);
  const btn = $(`testRemarkBtn_${idx}`);
  const inp = $(`testRemark_${idx}`);
  if (!row) return;
  const isHidden = row.classList.toggle('d-none');
  if (!isHidden && inp) {
    setTimeout(() => inp.focus(), 50);
  }
  if (btn) {
    const hasVal = Boolean(inp && inp.value && inp.value.trim().length > 0);
    btn.className = `btn btn-sm ${hasVal ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2`;
    btn.innerHTML = `<i class="bi ${hasVal ? 'bi-chat-left-text-fill' : 'bi-chat-left'}"></i>`;
  }
};

window.clearTestRemark = idx => {
  if (editorState[idx]) editorState[idx].remark = '';
  const inp = $(`testRemark_${idx}`);
  if (inp) inp.value = '';
  const row = $(`testRemarkRow_${idx}`);
  if (row) row.classList.add('d-none');
  const btn = $(`testRemarkBtn_${idx}`);
  if (btn) {
    btn.className = 'btn btn-sm btn-outline-secondary py-0 px-2';
    btn.innerHTML = '<i class="bi bi-chat-left"></i>';
  }
};

/* --------------------------------------------------------------------------
   Clear Single Test Values Feature
   Wipes entered result values & remarks for ONE specific test
   -------------------------------------------------------------------------- */
window.clearSingleTestValues = (idx, testName) => {
  const r = find(editing);
  if (!r) return;
  const name = testName || (r.tests && r.tests[idx] ? r.tests[idx].name : 'this test');
  if (!confirm(`Are you sure you want to clear results for "${name}"?`)) {
    return;
  }

  const st = editorState[idx];
  if (st) {
    st.remark = '';
    if (st.isDetailed && st.params) {
      Object.keys(st.params).forEach(paramKey => {
        if (st.params[paramKey]) {
          st.params[paramKey].value = '';
        }
      });
    } else {
      st.value = '';
    }
  }

  renderEditorRows();
  toast(`Cleared results for "${name}"`);
};

/* --------------------------------------------------------------------------
   Clear All Values Feature
   Wipes entered result values & remarks across all tests in current report
   -------------------------------------------------------------------------- */
window.clearAllEditorValues = () => {
  const r = find(editing);
  if (!r) return;
  if (!confirm('Are you sure you want to clear ALL entered test result values and remarks?')) {
    return;
  }

  // Clear state
  Object.keys(editorState).forEach(idx => {
    const st = editorState[idx];
    if (!st) return;
    st.remark = '';
    if (st.isDetailed && st.params) {
      Object.keys(st.params).forEach(paramKey => {
        if (st.params[paramKey]) {
          st.params[paramKey].value = '';
        }
      });
    } else {
      st.value = '';
    }
  });

  // Clear general remarks
  if ($('edRemarks')) $('edRemarks').value = '';
  r.remarks = '';

  // Re-render editor
  renderEditorRows();
  toast('All test values cleared');
};

/* --------------------------------------------------------------------------
   Add More Tests to Existing Report Feature
   Allows appending any test from catalog/templates into the active report
   -------------------------------------------------------------------------- */
window.openAddTestModal = () => {
  const r = find(editing);
  if (!r) {
    toast('No report is currently open in editor');
    return;
  }
  if ($('edAddTestPatientName')) {
    $('edAddTestPatientName').textContent = `${r.name} (#${r.labNo})`;
  }
  if ($('edAddTestSearch')) {
    $('edAddTestSearch').value = '';
  }
  renderEditorAddTestList();
  const modalEl = $('edAddTestModal');
  if (modalEl && window.bootstrap?.Modal) {
    const m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    m.show();
    setTimeout(() => $('edAddTestSearch')?.focus(), 250);
  }
};

window.renderEditorAddTestList = () => {
  const listEl = $('edAddTestList');
  if (!listEl) return;
  const r = find(editing);
  if (!r) return;

  const q = ($('edAddTestSearch')?.value || '').trim().toLowerCase();
  const currentTestNames = new Set((r.tests || []).map(t => (t.name || '').trim().toLowerCase()));

  const allTests = typeof getAllSearchableTests === 'function' ? getAllSearchableTests() : [];
  const filtered = allTests.filter(t => {
    if (!q) return true;
    const nameLower = (t.name || '').toLowerCase();
    if (nameLower.includes(q)) return true;
    const tmpl = typeof findTemplate === 'function' ? findTemplate(t.name) : null;
    if (tmpl && tmpl.match && tmpl.match.some(m => m.includes(q) || q.includes(m))) return true;
    if (t.dept && t.dept.toLowerCase().includes(q)) return true;
    return false;
  });

  const counterEl = $('edAddTestCounter');
  if (counterEl) {
    counterEl.textContent = q ? `Found ${filtered.length} tests matching "${q}"` : `Available Tests (${filtered.length})`;
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
    const isAlreadyInReport = currentTestNames.has(t.name.trim().toLowerCase());
    const tmpl = typeof findTemplate === 'function' ? findTemplate(t.name) : null;
    const deptText = t.dept || tmpl?.subtitle || '';
    const paramCount = tmpl?.items ? tmpl.items.filter(x => !x.isHeader).length : null;

    return `
      <div class="d-flex justify-content-between align-items-center p-2 rounded hover-test-item ${isAlreadyInReport ? 'is-selected' : ''}"
           style="border-bottom: 1px solid #edf4fa;">
        <div class="me-2 text-truncate">
          <div class="d-flex align-items-center gap-2">
            <span class="fw-semibold text-dark text-truncate">${esc(t.name)}</span>
            ${paramCount ? `<span class="badge bg-light text-primary border small" style="font-size:0.7rem;">${paramCount} params</span>` : ''}
          </div>
          <div class="d-flex align-items-center gap-2 small text-muted">
            <span class="fw-bold text-primary">₹${t.price}</span>
            ${deptText ? `<span>&middot;</span><span class="text-truncate">${esc(deptText)}</span>` : ''}
          </div>
        </div>
        ${isAlreadyInReport ? `
          <button type="button" class="btn btn-sm btn-light border text-success text-nowrap px-3 py-1" disabled>
            <i class="bi bi-check2-circle me-1"></i>In Report
          </button>
        ` : `
          <button type="button" class="btn btn-sm btn-primary text-nowrap px-3 py-1" 
                  onclick="addTestToEditor('${esc(t.name)}', ${t.price});">
            <i class="bi bi-plus-lg me-1"></i>Add
          </button>
        `}
      </div>
    `;
  }).join('');
};

window.addTestToEditor = (testName, price) => {
  snapshotEditorInputs();
  const r = find(editing);
  if (!r) return;

  r.tests = r.tests || [];
  const exists = r.tests.some(t => t.name.trim().toLowerCase() === testName.trim().toLowerCase());
  if (exists) {
    toast(`Test "${testName}" is already in this report`);
    return;
  }

  // Add test to report
  r.tests.push({
    name: testName,
    price: Number(price) || 0
  });

  // Re-calculate report total
  r.total = r.tests.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
  if ($('edTotal')) $('edTotal').value = r.total;

  // Initialize editorState for the newly added test
  const newIdx = r.tests.length - 1;
  const tmpl = typeof findTemplate === 'function' ? findTemplate(testName) : null;
  if (tmpl) {
    const defaultParams = {};
    if (tmpl.id === 'form_21') {
      (tmpl.items || []).forEach(it => {
        if (!it.isHeader) {
          defaultParams[it.name] = {
            value: it.defaultVal || '',
            unit: it.unit || '',
            range: it.range || ''
          };
        }
      });
    }
    editorState[newIdx] = {
      isDetailed: true,
      templateId: tmpl.id,
      params: defaultParams,
      method: tmpl.method || '',
      remark: tmpl.remark || '',
      collapsed: false
    };
  } else {
    const paramDef = typeof findTestParameter === 'function' ? findTestParameter(testName) : null;
    editorState[newIdx] = {
      isDetailed: false,
      value: paramDef?.defaultVal || '',
      unit: paramDef?.unit || '',
      range: paramDef?.range || '',
      remark: '',
      collapsed: false
    };
  }

  // Persist updated report structure
  persist();
  renderEditorRows();
  renderEditorAddTestList();
  toast(`Test "${testName}" added to report`);

  // Auto-focus the newly added test
  setTimeout(() => {
    const card = document.getElementById(`testCardBody_${newIdx}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInp = card.querySelector('input.form-control-result:not([readonly]):not([disabled])');
      if (firstInp) firstInp.focus();
    }
  }, 150);
};

window.removeTestFromEditor = idx => {
  snapshotEditorInputs();
  const r = find(editing);
  if (!r || !r.tests || !r.tests[idx]) return;

  const tName = r.tests[idx].name;
  if (!confirm(`Are you sure you want to remove "${tName}" from this report?`)) {
    return;
  }

  r.tests.splice(idx, 1);
  r.total = r.tests.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
  if ($('edTotal')) $('edTotal').value = r.total;

  // Clean saved results for removed test
  if (r.results && r.results[tName]) {
    delete r.results[tName];
  }

  // Re-index editorState
  const newEditorState = {};
  r.tests.forEach((t, i) => {
    const oldIdx = i >= idx ? i + 1 : i;
    if (editorState[oldIdx]) {
      newEditorState[i] = editorState[oldIdx];
    } else {
      const tmpl = typeof findTemplate === 'function' ? findTemplate(t.name) : null;
      if (tmpl) {
        newEditorState[i] = { isDetailed: true, templateId: tmpl.id, params: {}, collapsed: false };
      } else {
        newEditorState[i] = { isDetailed: false, value: '', unit: '', range: '', remark: '', collapsed: false };
      }
    }
  });
  editorState = newEditorState;

  persist();
  renderEditorRows();
  toast(`Removed "${tName}" from report`);
};


/* ==========================================================================
   Widal Test Dilution Matrix Controller & Calculations
   ========================================================================== */

window.initWidalData = function(st) {
  if (!st) return null;
  if (!st.widal || !Array.isArray(st.widal.antigens) || st.widal.antigens.length === 0) {
    const defaultAntigens = [
      { id: 'o', name: "S. Typhi 'O'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' },
      { id: 'h', name: "S. Typhi 'H'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' },
      { id: 'ah', name: "S. Paratyphi 'AH'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' },
      { id: 'bh', name: "S. Paratyphi 'BH'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' }
    ];

    st.widal = {
      antigens: defaultAntigens,
      impression: "Negative / Non-Reactive for Salmonella antibodies (< 1:20)."
    };

    st.params = st.params || {};
    defaultAntigens.forEach(a => {
      st.params[a.name] = { value: a.titre, unit: 'Titre', range: (a.id === 'h' ? '< 1:160' : '< 1:80') };
    });
  }
  return st.widal;
};

window.toggleWidalCell = function(testIdx, agId, dilution) {
  const st = editorState[testIdx];
  if (!st) return;
  const widal = initWidalData(st);
  const ag = widal.antigens.find(a => a.id === agId);
  if (!ag) return;

  const dils = ['1:20', '1:40', '1:80', '1:160', '1:320'];
  const curVal = ag.dilutions[dilution] || '-';
  const newVal = curVal === '+' ? '-' : '+';
  const dIdx = dils.indexOf(dilution);

  if (newVal === '+') {
    for (let j = 0; j <= dIdx; j++) {
      ag.dilutions[dils[j]] = '+';
    }
  } else {
    for (let j = dIdx; j < dils.length; j++) {
      ag.dilutions[dils[j]] = '-';
    }
  }

  let highestPos = null;
  for (let j = dils.length - 1; j >= 0; j--) {
    if (ag.dilutions[dils[j]] === '+') {
      highestPos = dils[j];
      break;
    }
  }

  if (highestPos) {
    if (highestPos === '1:320' || highestPos === '1:160') {
      ag.titre = highestPos + ' (Significant)';
    } else if (highestPos === '1:80') {
      ag.titre = (ag.id === 'h') ? '1:80 (Borderline)' : '1:80 (Significant)';
    } else {
      ag.titre = highestPos + ' (Non-significant)';
    }
  } else {
    ag.titre = 'Negative (< 1:20)';
  }

  st.params = st.params || {};
  st.params[ag.name] = { value: ag.titre, unit: 'Titre', range: (ag.id === 'h' ? '< 1:160' : '< 1:80') };

  updateWidalAutoImpression(testIdx);
  renderEditorRows();
  scheduleEditorAutoSave();
};

window.updateWidalAutoImpression = function(testIdx) {
  const st = editorState[testIdx];
  if (!st || !st.widal) return;
  const widal = st.widal;
  const oAg = widal.antigens.find(a => a.id === 'o');
  const hAg = widal.antigens.find(a => a.id === 'h');

  const oPos160 = oAg?.dilutions['1:160'] === '+' || oAg?.dilutions['1:320'] === '+';
  const oPos80 = oAg?.dilutions['1:80'] === '+';
  const hPos160 = hAg?.dilutions['1:160'] === '+' || hAg?.dilutions['1:320'] === '+';
  const hPos80 = hAg?.dilutions['1:80'] === '+';

  let impression = '';
  if (oPos160 && hPos160) {
    impression = "Titre of S. Typhi 'O' and 'H' antigens (>= 1:160) is clinically significant and suggestive of active Enteric Fever (Typhoid).";
  } else if (oPos80 && hPos160) {
    impression = "Titre of S. Typhi 'O' (1:80) and 'H' (1:160) is clinically significant. Suggestive of active Enteric Fever.";
  } else if (oPos80 && !hPos160) {
    impression = "Titre of S. Typhi 'O' is significant (>= 1:80). Suggestive of acute early Enteric infection.";
  } else if (hPos160 && !oPos80) {
    impression = "Elevated S. Typhi 'H' titre with negative 'O' titre suggests past infection or prior vaccination.";
  } else if (oPos80 || hPos80) {
    impression = "Borderline titre (1:80). A repeat test after 7-10 days is recommended to demonstrate rising titre.";
  } else {
    impression = "Negative / Non-Reactive for Salmonella antibodies (< 1:20).";
  }

  widal.impression = impression;
  st.remark = impression;
};

window.quickFillWidal = function(testIdx, presetType) {
  const st = editorState[testIdx];
  if (!st) return;
  const widal = initWidalData(st);
  const dils = ['1:20', '1:40', '1:80', '1:160', '1:320'];

  const setAg = (agId, maxDil) => {
    const ag = widal.antigens.find(a => a.id === agId);
    if (!ag) return;
    const maxIdx = maxDil ? dils.indexOf(maxDil) : -1;
    dils.forEach((d, j) => {
      ag.dilutions[d] = (j <= maxIdx) ? '+' : '-';
    });
    if (maxDil) {
      if (maxDil === '1:320' || maxDil === '1:160') ag.titre = maxDil + ' (Significant)';
      else if (maxDil === '1:80') ag.titre = (ag.id === 'h' ? '1:80 (Borderline)' : '1:80 (Significant)');
      else ag.titre = maxDil + ' (Non-significant)';
    } else {
      ag.titre = 'Negative (< 1:20)';
    }
    st.params = st.params || {};
    st.params[ag.name] = { value: ag.titre, unit: 'Titre', range: (ag.id === 'h' ? '< 1:160' : '< 1:80') };
  };

  if (presetType === 'all_neg') {
    widal.antigens.forEach(a => setAg(a.id, null));
    widal.impression = 'Negative / Non-Reactive for Salmonella antibodies (< 1:20).';
    st.remark = widal.impression;
    toast('Widal: Set All Negative (-)');
  } else if (presetType === 'typhi_both_160') {
    setAg('o', '1:160');
    setAg('h', '1:160');
    setAg('ah', null);
    setAg('bh', null);
    widal.impression = "Titre of S. Typhi 'O' and 'H' antigens (>= 1:160) is clinically significant and suggestive of active Enteric Fever (Typhoid).";
    st.remark = widal.impression;
    toast('Widal: Set S. Typhi O & H Positive (1:160)');
  } else if (presetType === 'typhi_o_160') {
    setAg('o', '1:160');
    setAg('h', null);
    setAg('ah', null);
    setAg('bh', null);
    widal.impression = "Titre of S. Typhi 'O' is significant (>= 1:80). Suggestive of acute early Enteric infection.";
    st.remark = widal.impression;
    toast('Widal: Set S. Typhi O Positive (1:160)');
  } else if (presetType === 'typhi_h_160') {
    setAg('o', null);
    setAg('h', '1:160');
    setAg('ah', null);
    setAg('bh', null);
    widal.impression = "Elevated S. Typhi 'H' titre with negative 'O' titre suggests past infection or prior vaccination.";
    st.remark = widal.impression;
    toast('Widal: Set S. Typhi H Positive (1:160)');
  } else if (presetType === 'borderline_80') {
    setAg('o', '1:80');
    setAg('h', '1:80');
    setAg('ah', null);
    setAg('bh', null);
    widal.impression = "Borderline titre (1:80). A repeat test after 7-10 days is recommended to demonstrate rising titre.";
    st.remark = widal.impression;
    toast('Widal: Set Borderline (1:80)');
  }

  renderEditorRows();
};

window.onWidalTitreChanged = function(testIdx, agId, val) {
  const st = editorState[testIdx];
  if (!st) return;
  const widal = initWidalData(st);
  const ag = widal.antigens.find(a => a.id === agId);
  if (!ag) return;
  ag.titre = val;
  st.params = st.params || {};
  st.params[ag.name] = { value: val, unit: 'Titre', range: (ag.id === 'h' ? '< 1:160' : '< 1:80') };
};

window.onWidalImpressionChanged = function(testIdx, val) {
  const st = editorState[testIdx];
  if (!st) return;
  const widal = initWidalData(st);
  widal.impression = val;
  st.remark = val;
};

window.setWidalImpressionPhrase = function(testIdx, pIdx) {
  const phrase = (typeof WIDAL_READY_IMPRESSIONS !== 'undefined' ? WIDAL_READY_IMPRESSIONS[pIdx] : '');
  if (!phrase) return;
  const st = editorState[testIdx];
  if (!st) return;
  const widal = initWidalData(st);
  widal.impression = phrase;
  st.remark = phrase;
  const textarea = $('widalImpression_' + testIdx);
  if (textarea) textarea.value = phrase;
};

window.calculateLipidProfile = idx => {
  const st = editorState[idx];
  if (!st) return;
  const tmpl = TEST_TEMPLATES[st.templateId] || findTemplate((find(editing)?.tests?.[idx] || {}).name);
  if (!tmpl || (tmpl.id !== 'lipid' && tmpl.id !== 'form_21')) return;

  st.params = st.params || {};
  const cholStr = (st.params['CHOLESTEROL']?.value ?? '').toString().trim();
  const tgStr = (st.params['TRIGLYCERIDES']?.value ?? '').toString().trim();
  const hdlStr = (st.params['HDL']?.value ?? '').toString().trim();

  const chol = parseFloat(cholStr);
  const tg = parseFloat(tgStr);
  const hdl = parseFloat(hdlStr);

  const cardBody = $('testCardBody_' + idx);
  if (!cardBody) return;

  const updateField = (paramName, val) => {
    st.params[paramName] = st.params[paramName] || {};
    st.params[paramName].value = val;
    const inp = cardBody.querySelector(`input[data-param="${paramName}"][data-f="value"]`);
    if (inp) {
      inp.value = val;
      const row = inp.closest('tr');
      const rngInp = row?.querySelector('[data-f="range"]');
      if (rngInp) {
        const stt = checkValueRange(inp.value, rngInp.value);
        inp.classList.toggle('is-abnormal-input', stt === 'high' || stt === 'low' || stt === 'abnormal');
      }
    }
  };

  // 1. VLDL = Triglycerides / 5
  if (!isNaN(tg) && tg > 0) {
    updateField('VLDL', (tg / 5).toFixed(2));
  } else if (tgStr === '') {
    updateField('VLDL', '');
  }

  // 2. LDL = Cholesterol - (HDL || 0) - (Triglycerides / 5) [Friedewald Equation]
  if (!isNaN(chol) && chol > 0 && !isNaN(tg) && tg > 0) {
    const hdlNum = !isNaN(hdl) && hdl > 0 ? hdl : 0;
    const ldlNum = Math.max(0, chol - hdlNum - (tg / 5));
    updateField('LDL', ldlNum.toFixed(2));
  } else if (cholStr === '' && tgStr === '') {
    updateField('LDL', '');
  }

  // 3. Total Chol. : HDL Ratio = Cholesterol / HDL
  if (!isNaN(chol) && chol > 0 && !isNaN(hdl) && hdl > 0) {
    updateField('Total Chol. : HDL Ratio', (chol / hdl).toFixed(2));
  } else if (isNaN(hdl) || hdl <= 0) {
    updateField('Total Chol. : HDL Ratio', '');
  }
};

window.calculateBiochemistry = idx => {
  const st = editorState[idx];
  if (!st) return;
  const tmpl = TEST_TEMPLATES[st.templateId] || findTemplate((find(editing)?.tests?.[idx] || {}).name);
  if (!tmpl || (tmpl.id !== 'biochemistry' && !tmpl.id.includes('lft') && !tmpl.id.includes('bilirubin') && !tmpl.id.includes('protein'))) return;

  st.params = st.params || {};
  const cardBody = $('testCardBody_' + idx);
  if (!cardBody) return;

  const updateField = (paramName, val) => {
    st.params[paramName] = st.params[paramName] || {};
    st.params[paramName].value = val;
    const inp = cardBody.querySelector(`input[data-param="${paramName}"][data-f="value"]`);
    if (inp) {
      inp.value = val;
      const row = inp.closest('tr');
      const rngInp = row?.querySelector('[data-f="range"]');
      if (rngInp) {
        const stt = checkValueRange(inp.value, rngInp.value);
        inp.classList.toggle('is-abnormal-input', stt === 'high' || stt === 'low' || stt === 'abnormal');
      }
    }
  };

  const totBilVal = st.params['TOTAL']?.value ?? st.params['TOTAL BILIRUBIN']?.value ?? st.params['Total Bilirubin']?.value;
  const dirBilVal = st.params['DIRECT']?.value ?? st.params['DIRECT BILIRUBIN']?.value ?? st.params['Direct Bilirubin']?.value;
  const totBil = parseFloat(totBilVal);
  const dirBil = parseFloat(dirBilVal);
  if (!isNaN(totBil) && !isNaN(dirBil)) {
    const indirectVal = Math.max(0, totBil - dirBil).toFixed(2);
    if (st.params['INDIRECT'] !== undefined || tmpl.id === 'biochemistry') updateField('INDIRECT', indirectVal);
    if (st.params['INDIRECT BILIRUBIN'] !== undefined) updateField('INDIRECT BILIRUBIN', indirectVal);
    if (st.params['Indirect Bilirubin'] !== undefined) updateField('Indirect Bilirubin', indirectVal);
  }

  const totProtVal = st.params['TOTAL PROTEIN']?.value ?? st.params['Total Protein']?.value;
  const albVal = st.params['ALBUMIN']?.value ?? st.params['Albumin']?.value;
  const totProt = parseFloat(totProtVal);
  const alb = parseFloat(albVal);
  if (!isNaN(totProt) && !isNaN(alb)) {
    const glob = Math.max(0, totProt - alb);
    const globVal = glob.toFixed(2);
    if (st.params['GLOBULIN'] !== undefined || tmpl.id === 'biochemistry') updateField('GLOBULIN', globVal);
    if (st.params['Globulin'] !== undefined) updateField('Globulin', globVal);
    if (glob > 0) {
      const agVal = (alb / glob).toFixed(2);
      if (st.params['A/G RATIO'] !== undefined || tmpl.id === 'biochemistry') updateField('A/G RATIO', agVal);
      if (st.params['A/G Ratio'] !== undefined) updateField('A/G Ratio', agVal);
    }
  }
};

function renderEditorRows() {
  const r = find(editing);
  if (!r) return;

  const tests = r.tests || [];
  if (!tests.length) {
    const edRowsEl = $('edRows');
    if (edRowsEl) edRowsEl.innerHTML = '<div class="alert alert-secondary text-center">No tests selected</div>';
    return;
  }

  let html = '';
  let singleGroup = [];

  const flushSingleTests = () => {
    if (!singleGroup.length) return '';
    const rowsHtml = singleGroup.map(({ t, i }) => {
      const st = editorState[i] || {};
      const nonTmplStatus = checkValueRange(st.value || '', st.range || '');
      const isAbnormal = nonTmplStatus === 'high' || nonTmplStatus === 'low' || nonTmplStatus === 'abnormal';
      const hasRemark = Boolean(st.remark && st.remark.trim().length > 0);

      return `
        <tr id="testRow_${i}">
          <td class="text-center text-muted fw-semibold align-middle" style="width:4%">${i + 1}</td>
          <td class="align-middle" style="width:30%">
            <div class="fw-bold text-dark fs-6">${esc(t.name)}</div>
            <div class="small text-muted" style="font-size:0.75rem;">Standard Investigation</div>
          </td>
          <td style="width:25%">
            <input class="form-control form-control-sm form-control-result ${isAbnormal ? 'is-abnormal-input' : ''}" 
                   data-test-idx="${i}" data-simple="true" data-f="value" 
                   value="${esc(st.value || '')}" placeholder="Enter result...">
          </td>
          <td style="width:16%">
            <input class="form-control form-control-sm bg-light" 
                   data-test-idx="${i}" data-simple="true" data-f="unit" 
                   value="${esc(st.unit || '')}" placeholder="Unit">
          </td>
          <td style="width:15%">
            <input class="form-control form-control-sm bg-light" 
                   data-test-idx="${i}" data-simple="true" data-f="range" 
                   value="${esc(st.range || '')}" placeholder="Reference Range">
          </td>
          <td class="text-center align-middle" style="width:10%">
            <div class="d-inline-flex gap-1">
              <button type="button" class="btn btn-sm ${hasRemark ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2" 
                      id="testRemarkBtn_${i}" onclick="toggleTestRemark(${i})" 
                      title="${hasRemark ? 'Edit Remark' : 'Add Remark'}">
                <i class="bi ${hasRemark ? 'bi-chat-left-text-fill' : 'bi-chat-left'}"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" 
                      onclick="clearSingleTestValues(${i}, '${esc(t.name)}')" 
                      title="Clear results for ${esc(t.name)}">
                <i class="bi bi-eraser"></i>
              </button>
              ${tests.length > 1 ? `
                <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2" 
                        onclick="removeTestFromEditor(${i})" 
                        title="Remove ${esc(t.name)} from report">
                  <i class="bi bi-trash"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
        <tr class="test-remark-row ${hasRemark ? '' : 'd-none'}" id="testRemarkRow_${i}">
          <td colspan="6" class="p-2 ps-4">
            <div class="d-flex align-items-center gap-2">
              <span class="small fw-semibold text-secondary text-nowrap">
                <i class="bi bi-chat-left-dots text-primary me-1"></i>${esc(t.name)} Remark:
              </span>
              <input type="text" class="form-control form-control-sm form-control-result" 
                     data-test-idx="${i}" data-f="remark" id="testRemark_${i}" 
                     value="${esc(st.remark || '')}" 
                     placeholder="Optional note / interpretation for ${esc(t.name)}...">
              <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" 
                      onclick="clearTestRemark(${i})" title="Clear Remark">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    const output = `
      <div class="card shadow-sm mb-3 border lab-sheet-card">
        <div class="card-header test-card-header lab-sheet-header py-2 px-3 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-card-checklist text-info fs-5"></i>
            <span class="test-card-title fs-6">Individual Investigations</span>
            <span class="badge bg-white text-primary fw-semibold border-0 px-2 py-1">${singleGroup.length} test${singleGroup.length > 1 ? 's' : ''}</span>
          </div>
          <span class="small text-white-50 d-none d-md-inline">
            <i class="bi bi-keyboard text-info me-1"></i>Press <kbd class="bg-white text-dark border px-1">Enter</kbd> to move to next test
          </span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover table-bordered table-sm align-middle mb-0 lab-table">
            <thead>
              <tr>
                <th class="text-center" style="width:4%">#</th>
                <th style="width:30%">Investigation / Parameter</th>
                <th style="width:25%">Result <span class="badge bg-primary text-white ms-1">Fill here</span></th>
                <th style="width:16%">Unit</th>
                <th style="width:15%">Reference Range</th>
                <th class="text-center" style="width:10%">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
    singleGroup = [];
    return output;
  };

  tests.forEach((t, i) => {
    const st = editorState[i] || {};
    const tmpl = TEST_TEMPLATES[st.templateId] || findTemplate(t.name);
    const hasTmpl = Boolean(tmpl);

    if (!hasTmpl) {
      singleGroup.push({ t, i });
      return;
    }

    // Flush any pending single tests before rendering this template profile
    html += flushSingleTests();

    const isWidal = Boolean(tmpl.id === 't096_widal_test_slide_tube' || tmpl.isWidal || t.name.toLowerCase().includes('widal'));

    if (isWidal) {
      const widal = initWidalData(st);
      const isCollapsed = Boolean(st.collapsed);

      const dils = ['1:20', '1:40', '1:80', '1:160', '1:320'];
      const widalRows = widal.antigens.map(ag => {
        const cells = dils.map(d => {
          const val = (ag.dilutions && ag.dilutions[d]) || '-';
          const isPos = val === '+';
          return `
            <td class="text-center">
              <button type="button" 
                      class="widal-cell-btn ${isPos ? 'is-pos' : 'is-neg'}" 
                      onclick="toggleWidalCell(${i}, '${ag.id}', '${d}')"
                      title="Click to toggle (+ / -)">
                ${isPos ? '+' : '&minus;'}
              </button>
            </td>
          `;
        }).join('');

        const isAgPos = ag.titre && !ag.titre.toLowerCase().includes('negative');

        return `
          <tr>
            <td class="text-start ps-3 fw-bold text-dark" style="font-size: 0.92rem;">
              ${esc(ag.name)}
            </td>
            ${cells}
            <td class="text-end pe-3">
              <input type="text" class="form-control form-control-sm text-end fw-bold ${isAgPos ? 'text-danger' : 'text-dark'}" 
                     value="${esc(ag.titre || '')}" 
                     oninput="onWidalTitreChanged(${i}, '${ag.id}', this.value)"
                     placeholder="Titre">
            </td>
          </tr>
        `;
      }).join('');

      html += `
        <div class="card shadow-sm mb-3 border widal-sheet-card">
          <div class="card-header test-card-header py-2 px-3 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-grid-3x3-gap-fill text-warning fs-5"></i>
              <span class="test-card-title fs-6">${esc(tmpl.title || t.name)}</span>
              <span class="badge bg-white text-primary fw-semibold border-0 px-2 py-1">Agglutination Matrix</span>
            </div>
            <div class="d-flex align-items-center gap-1">
              <button type="button" class="btn btn-sm btn-light text-primary fw-semibold py-0 px-2" onclick="quickFillWidal(${i}, 'all_neg')">
                <i class="bi bi-check2 me-1"></i>All Negative (-)
              </button>
              <button type="button" class="btn btn-sm btn-danger fw-semibold py-0 px-2" onclick="quickFillWidal(${i}, 'typhi_both_160')">
                <i class="bi bi-exclamation-triangle me-1"></i>O &amp; H (1:160)
              </button>
              <button type="button" class="btn btn-sm btn-outline-secondary text-white border-0 py-0 px-2" onclick="toggleTestCollapse(${i})" id="testExpandBtn_${i}" title="Collapse">
                <i class="bi bi-chevron-up fs-5 text-white" id="testChevron_${i}"></i>
              </button>
              ${tests.length > 1 ? `
                <button type="button" class="btn btn-sm btn-outline-secondary text-white border-0 py-0 px-2" onclick="removeTestFromEditor(${i})" title="Remove from report">
                  <i class="bi bi-trash"></i>
                </button>
              ` : ''}
            </div>
          </div>

          <div id="testCardBody_${i}" class="${isCollapsed ? 'd-none' : ''}">
            <!-- Quick Fill Bar -->
            <div class="p-2 bg-light border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div class="small fw-semibold text-secondary">
                <i class="bi bi-lightning-charge-fill text-warning me-1"></i>Quick Result Presets:
              </div>
              <div class="d-flex flex-wrap gap-1">
                <button type="button" class="btn btn-xs btn-outline-success py-1 px-2" style="font-size: 11px;" onclick="quickFillWidal(${i}, 'all_neg')">
                  All Negative (-)
                </button>
                <button type="button" class="btn btn-xs btn-outline-danger py-1 px-2" style="font-size: 11px;" onclick="quickFillWidal(${i}, 'typhi_both_160')">
                  S. Typhi O &amp; H (1:160)
                </button>
                <button type="button" class="btn btn-xs btn-outline-danger py-1 px-2" style="font-size: 11px;" onclick="quickFillWidal(${i}, 'typhi_o_160')">
                  S. Typhi O Only (1:160)
                </button>
                <button type="button" class="btn btn-xs btn-outline-primary py-1 px-2" style="font-size: 11px;" onclick="quickFillWidal(${i}, 'typhi_h_160')">
                  S. Typhi H Only (1:160)
                </button>
                <button type="button" class="btn btn-xs btn-outline-warning text-dark py-1 px-2" style="font-size: 11px;" onclick="quickFillWidal(${i}, 'borderline_80')">
                  Borderline (1:80)
                </button>
              </div>
            </div>

            <!-- Widal Dilution Matrix Table -->
            <div class="table-responsive">
              <table class="table table-bordered align-middle mb-0 text-center widal-grid-table">
                <thead>
                  <tr>
                    <th style="width: 30%; text-align: left;" class="ps-3">ANTIGEN</th>
                    <th style="width: 10%;">1:20</th>
                    <th style="width: 10%;">1:40</th>
                    <th style="width: 10%;">1:80</th>
                    <th style="width: 10%;">1:160</th>
                    <th style="width: 10%;">1:320</th>
                    <th style="width: 20%; text-align: right;" class="pe-3">FINAL TITRE</th>
                  </tr>
                </thead>
                <tbody>
                  ${widalRows}
                </tbody>
              </table>
            </div>

            <!-- Clinical Impression Box -->
            <div class="p-3 border-top bg-light">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small fw-bold text-dark">
                  <i class="bi bi-file-earmark-medical text-primary me-1"></i>CLINICAL IMPRESSION / INTERPRETATION:
                </span>
                <span class="small text-muted" style="font-size: 11px;">Printed directly on report</span>
              </div>
              <textarea id="widalImpression_${i}" class="form-control form-control-sm mb-2" rows="2" 
                        style="font-weight: 600; font-size: 12px;" 
                        oninput="onWidalImpressionChanged(${i}, this.value)" 
                        placeholder="Enter clinical impression...">${esc(widal.impression || '')}</textarea>
              
              <div class="d-flex flex-wrap gap-1">
                ${(typeof WIDAL_READY_IMPRESSIONS !== 'undefined' ? WIDAL_READY_IMPRESSIONS : []).map((phrase, pIdx) => `
                  <button type="button" class="btn btn-xs btn-outline-secondary py-0 px-2 text-start" 
                          style="font-size: 10.5px; border-radius: 12px;" 
                          onclick="setWidalImpressionPhrase(${i}, ${pIdx})">
                    ${esc(phrase.length > 45 ? phrase.substring(0, 45) + '...' : phrase)}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const isCollapsed = Boolean(st.collapsed);
    const rows = tmpl.items.map(item => {
      if (item.isHeader) {
        return `<tr class="param-cat-row"><td colspan="4"><i class="bi bi-folder2 me-1"></i>${esc(item.title)}</td></tr>`;
      }
      const pKey = item.paramKey || item.name;
      const pData = (st.params && (st.params[pKey] !== undefined ? st.params[pKey] : st.params[item.name])) || {};
      const pVal = pData.value !== undefined ? pData.value : (item.defaultVal || '');
      const rangeStatus = checkValueRange(pVal, item.range);
      const isAbnormal = rangeStatus === 'high' || rangeStatus === 'low' || rangeStatus === 'abnormal';
      return `<tr>
        <td class="${item.indent ? 'param-indent fw-medium text-dark' : 'fw-bold text-dark'}" style="font-size:0.94rem;">
          ${item.indent ? '<i class="bi bi-dash text-secondary me-1"></i>' : ''}${esc(item.name)}
        </td>
        <td><input class="form-control form-control-sm form-control-result ${isAbnormal ? 'is-abnormal-input' : ''}" data-test-idx="${i}" data-param="${esc(pKey)}" data-f="value" value="${esc(pVal)}" placeholder="Enter result..."></td>
        <td><input class="form-control form-control-sm bg-light text-dark fw-medium border-0" readonly tabindex="-1" data-test-idx="${i}" data-param="${esc(pKey)}" data-f="unit" value="${esc(item.unit)}"></td>
        <td><input class="form-control form-control-sm bg-light text-dark fw-medium border-0" readonly tabindex="-1" data-test-idx="${i}" data-param="${esc(pKey)}" data-f="range" value="${esc(item.range)}"></td>
      </tr>`;
    }).join('');

    let extraHtml = '';
    if (tmpl.id === 'urine') {
      extraHtml = `
        <div class="p-2 bg-light border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <button type="button" class="btn btn-sm btn-outline-success" onclick="fillUrineDefaults(${i})"><i class="bi bi-magic me-1"></i>Quick Fill Normal Values</button>
            <span class="badge bg-white text-secondary border small"><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Shortcuts: Color: <b>py</b>, <b>b</b>=Brownish, <b>yl</b>, <b>r</b> | Appearance: <b>c</b>=Clear, <b>s/sh</b>=Sl. Hazy, <b>h</b>=Hazy, <b>t</b>=Turbid | Reaction: <b>a</b>=Acidic | <b>z</b>=NIL</span>
          </div>
          <span class="small text-muted d-none d-md-inline"><i class="bi bi-info-circle me-1"></i>Siemens Clinitek Status+ Urine Analyzer</span>
        </div>
        <div class="p-3 border-top urine-remark-box">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold small text-dark"><i class="bi bi-chat-square-text-fill text-primary me-1"></i>REMARK : URINE ANALYSIS</span>
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
          <textarea id="urineRemark_${i}" class="form-control form-control-sm form-control-result mb-2" data-test-idx="${i}" data-f="remark" rows="3" style="font-size: 0.88rem; font-weight: 600; line-height: 1.5; resize: vertical;" placeholder="Urine Analysis remarks...">${esc(st.remark !== undefined ? st.remark : (tmpl.remark || ''))}</textarea>
          <div class="d-flex flex-wrap gap-1" id="urinePhrases_${i}">
            ${URINE_READY_REMARKS.map((line, pIdx) => {
        const curRemark = (st.remark !== undefined ? st.remark : (tmpl.remark || ''));
        const isSel = curRemark.includes(line.trim());
        return `<button type="button" class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2 ready-phrase-btn" style="font-size: 0.74rem; border-radius: 12px; white-space: normal; text-align: left;" onclick="toggleUrineRemarkPhrase(${i}, ${pIdx})">
                ${isSel ? '<i class="bi bi-check2 me-1"></i>' : '<i class="bi bi-plus me-1"></i>'}${esc(line)}
              </button>`;
      }).join('')}
          </div>
        </div>
      `;
    } else if (tmpl.id === 'form_21') {
      extraHtml = `
        <div class="p-2 bg-light border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="badge bg-primary text-white"><i class="bi bi-file-earmark-medical me-1"></i>Form 21 &middot; 4 Pages</span>
            <span class="small text-muted">Page 1: Haematology &middot; Page 2: Biochemistry &amp; Lipid &middot; Page 3: Urine &middot; Page 4: Serology &amp; Stool</span>
            <span class="badge bg-white text-secondary border small"><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Shortcuts: <b>z</b>=NIL &middot; Urine: <b>c</b>=Clear, <b>s</b>=Sl.Hazy, <b>h</b>=Hazy, <b>t</b>=Turbid, <b>a</b>=Acidic, <b>b</b>=Brownish &middot; Stool: <b>ss</b>=Semi solid, <b>y/yl</b>, <b>b/br</b>, <b>p/a</b>, <b>n</b> &middot; RH: <b>p/n</b></span>
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-xs btn-outline-danger py-1 px-2" style="font-size:0.75rem;" onclick="clearForm21Values(${i})"><i class="bi bi-eraser me-1"></i>Clear Values</button>
            <button type="button" class="btn btn-xs btn-outline-success py-1 px-2" style="font-size:0.75rem;" onclick="fillForm21SampleDefaults(${i})"><i class="bi bi-magic me-1"></i>Fill Sample Values</button>
            <button type="button" class="btn btn-xs btn-outline-primary py-1 px-2" style="font-size:0.75rem;" onclick="calculateLipidProfile(${i})"><i class="bi bi-calculator me-1"></i>Calculate Lipid</button>
          </div>
        </div>
      `;
    } else if (tmpl.id === 'stool_examination') {
      extraHtml = `
        <div class="p-2 bg-light border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="badge bg-primary text-white"><i class="bi bi-file-earmark-medical me-1"></i>Stool Examination</span>
            <span class="badge bg-white text-secondary border small"><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Shortcuts: Color: <b>y/yl</b>=Yellowish, <b>b/br</b>=Brownish, <b>py</b>=Pale yellow | Consistency: <b>ss</b>=Semi solid | Mucus: <b>p/a</b> | <b>z</b>=NIL</span>
          </div>
        </div>
        <div class="p-2 border-top bg-light-subtle test-remark-box">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small fw-semibold text-secondary">
              <i class="bi bi-chat-left-dots text-primary me-1"></i>Remark / Interpretation (${esc(tmpl.title || t.name)}):
            </span>
            ${st.remark ? `<button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" style="font-size:0.72rem;" onclick="clearTestRemark(${i})"><i class="bi bi-x me-1"></i>Clear</button>` : ''}
          </div>
          <input type="text" id="testRemark_${i}" class="form-control form-control-sm form-control-result test-remark-input" data-test-idx="${i}" data-f="remark" value="${esc(st.remark || '')}" placeholder="Optional remark / interpretation...">
        </div>
        ${tmpl.method ? `<div class="p-2 bg-light border-top text-muted small"><i class="bi bi-info-circle me-1"></i>${esc(tmpl.method)}</div>` : ''}
      `;
    } else if (tmpl.id === 'lipid') {
      extraHtml = `
        <div class="p-2 bg-light border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span class="small text-muted"><i class="bi bi-calculator text-primary me-1"></i><b>Auto-Calculate:</b> VLDL = TG/5 &middot; LDL = Chol &minus; HDL &minus; VLDL &middot; Ratio = Chol/HDL</span>
          <button type="button" class="btn btn-xs btn-outline-primary py-1 px-2" style="font-size:0.75rem;" onclick="calculateLipidProfile(${i})"><i class="bi bi-arrow-repeat me-1"></i>Recalculate</button>
        </div>
        <div class="p-2 border-top bg-light-subtle test-remark-box">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small fw-semibold text-secondary">
              <i class="bi bi-chat-left-dots text-primary me-1"></i>Remark / Interpretation (${esc(tmpl.title || t.name)}):
            </span>
            ${st.remark ? `<button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" style="font-size:0.72rem;" onclick="clearTestRemark(${i})"><i class="bi bi-x me-1"></i>Clear</button>` : ''}
          </div>
          <input type="text" id="testRemark_${i}" class="form-control form-control-sm form-control-result test-remark-input" data-test-idx="${i}" data-f="remark" value="${esc(st.remark || '')}" placeholder="Optional remark / interpretation...">
        </div>
      `;
    } else {
      extraHtml = `
        <div class="p-2 border-top bg-light-subtle test-remark-box">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small fw-semibold text-secondary">
              <i class="bi bi-chat-left-dots text-primary me-1"></i>Remark / Interpretation (${esc(tmpl.title || t.name)}):
            </span>
            ${st.remark ? `<button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" style="font-size:0.72rem;" onclick="clearTestRemark(${i})"><i class="bi bi-x me-1"></i>Clear</button>` : ''}
          </div>
          <input type="text" id="testRemark_${i}" class="form-control form-control-sm form-control-result test-remark-input" data-test-idx="${i}" data-f="remark" value="${esc(st.remark || '')}" placeholder="Optional remark / interpretation...">
        </div>
        ${tmpl.method ? `<div class="p-2 bg-light border-top text-muted small"><i class="bi bi-info-circle me-1"></i>${esc(tmpl.method)}</div>` : ''}
      `;
    }

    const displayTitle = (t.name && tmpl.title && t.name.toLowerCase() !== tmpl.title.toLowerCase())
      ? `${esc(t.name)} — ${esc(tmpl.title)}`
      : esc(tmpl.title || t.name);

    html += `
      <div class="card shadow-sm mb-3 border test-card">
        <div class="card-header test-card-header py-2 px-3 d-flex justify-content-between align-items-center cursor-pointer" onclick="toggleTestCollapse(${i})">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <i class="bi bi-folder2-open text-info fs-5"></i>
            <span class="test-card-title fs-6">${displayTitle}</span>
            <span class="badge bg-white text-primary fw-semibold border-0 px-2 py-1">${tmpl.items.filter(x => !x.isHeader).length} parameters</span>
            ${tmpl.subtitle ? `<span class="small text-white-50 d-none d-lg-inline">&middot; ${esc(tmpl.subtitle)}</span>` : ''}
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline-light border py-1 px-2 text-white" 
                    title="Clear entered results for ${esc(t.name)}" 
                    onclick="event.stopPropagation(); clearSingleTestValues(${i}, '${esc(t.name)}');">
              <i class="bi bi-eraser me-1"></i><span class="d-none d-md-inline">Clear Test</span>
            </button>
            ${tests.length > 1 ? `<button type="button" class="btn btn-sm btn-outline-light border-0 py-1 px-2 text-white-50 hover-danger" title="Remove this test from report" onclick="event.stopPropagation(); removeTestFromEditor(${i});"><i class="bi bi-trash3 text-white"></i></button>` : ''}
            <span class="badge bg-light bg-opacity-25 text-black border-0 small d-none d-sm-inline" id="testStatusBadge_${i}">${isCollapsed ? 'Collapsed' : 'Open'}</span>
            <button type="button" class="btn btn-sm btn-light bg-opacity-25 border-0 rounded-circle expand-btn text-white" id="testExpandBtn_${i}" title="${isCollapsed ? 'Expand' : 'Collapse'}" onclick="event.stopPropagation(); toggleTestCollapse(${i});">
              <i id="testChevron_${i}" class="bi ${isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'} fs-5 text-black"></i>
            </button>
          </div>
        </div>
        <div class="card-body p-0 ${isCollapsed ? 'd-none' : ''}" id="testCardBody_${i}">
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
          ${extraHtml}
        </div>
      </div>
    `;
  });

  html += flushSingleTests();

  const edRowsEl = $('edRows');
  if (edRowsEl) {
    edRowsEl.innerHTML = html;
  }
}

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
  // Use preventScroll to avoid sudden browser jumps before smooth scroll
  try {
    inp.focus({ preventScroll: true });
  } catch (err) {
    inp.focus();
  }
  try { inp.select(); } catch (err) { }
  // Smoothly center the active input in the viewport row-by-row
  try {
    inp.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
  } catch (err) {
    inp.scrollIntoView(false);
  }
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
        return $('edAdvance') || $('edDoctor') || $('edRemarks') || null;
      } else if (direction === 'up') {
        if (idx > 0) return resultInputs[idx - 1];
        return null;
      }
    }
  }

  const currentTr = currentInput.closest('tr');
  const targetField = currentInput.dataset.f || 'value';
  const allRows = Array.from($('edRows')?.querySelectorAll('tr') || []).filter(tr => tr.offsetParent !== null && !tr.closest('.d-none'));
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
      return $('edAdvance') || $('edDoctor') || $('edRemarks') || null;
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

function initEditorEvents() {
  const edRowsEl = $('edRows');
  if (!edRowsEl) return;

  edRowsEl.oninput = e => {
    const inp = e.target;
    if (!inp || !inp.dataset || inp.dataset.testIdx === undefined) return;
    const idx = parseInt(inp.dataset.testIdx, 10);
    if (!editorState[idx]) return;

    if (inp.dataset.f === 'remark') {
      editorState[idx].remark = inp.value;
      updateUrinePhraseButtons(idx);
      const btn = $(`testRemarkBtn_${idx}`);
      if (btn) {
        const hasVal = Boolean(inp.value && inp.value.trim().length > 0);
        btn.className = `btn btn-sm ${hasVal ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2`;
        btn.innerHTML = `<i class="bi ${hasVal ? 'bi-chat-left-text-fill' : 'bi-chat-left'}"></i>`;
      }
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

      if (f === 'value') {
        const tmpl = TEST_TEMPLATES[editorState[idx].templateId] || findTemplate((find(editing)?.tests?.[idx] || {}).name);
        if (tmpl && (tmpl.id === 'lipid' || tmpl.id.includes('lipid') || tmpl.id === 'form_21')) {
          if (p === 'CHOLESTEROL' || p === 'TRIGLYCERIDES' || p === 'HDL' || p.includes('Cholesterol') || p.includes('Triglycerides')) {
            calculateLipidProfile(idx);
          }
        } else if (tmpl && (tmpl.id === 'biochemistry' || tmpl.id.includes('lft') || tmpl.id.includes('bilirubin') || tmpl.id.includes('protein'))) {
          if (p.toUpperCase().includes('TOTAL') || p.toUpperCase().includes('DIRECT') || p.toUpperCase().includes('PROTEIN') || p.toUpperCase().includes('ALBUMIN')) {
            calculateBiochemistry(idx);
          }
        }
      }
    }
  };

  // Helper to detect if an input field is for Blood RH (Rh Factor / Rh Type)
  function isRhInputField(inp) {
    if (!inp || !inp.dataset) return false;
    const p = (inp.dataset.param || '').trim().toLowerCase();
    if (p === 'rh' || p === 'rh factor' || p === 'rh type' || p === 'rh (d)' || p === 'rh factor (du)' || p.startsWith('rh ')) {
      return true;
    }
    const idx = parseInt(inp.dataset.testIdx, 10);
    const r = typeof editing !== 'undefined' ? find(editing) : null;
    const testName = (r?.tests?.[idx]?.name || '').trim().toLowerCase();
    if (testName === 'rh' || testName === 'rh factor' || testName === 'rh factor (du)') {
      return true;
    }
    const row = inp.closest('tr');
    if (row) {
      const labelTd = row.querySelector('td:first-child');
      const labelText = (labelTd?.textContent || '').trim().toLowerCase();
      if (labelText === 'rh' || labelText === 'rh factor' || labelText === 'rh type') {
        return true;
      }
    }
    return false;
  }

  // Helper to detect if an input field is for Urine Color
  function isUrineColorField(inp) {
    if (!inp || !inp.dataset) return false;
    const p = (inp.dataset.param || '').trim().toLowerCase();
    const isColorParam = (p === 'colour' || p === 'color' || p === 'urine colour' || p === 'urine color');
    if (!isColorParam) return false;

    const idx = parseInt(inp.dataset.testIdx, 10);
    const r = typeof editing !== 'undefined' ? find(editing) : null;
    const testObj = r?.tests?.[idx];
    const testName = (testObj?.name || '').trim().toLowerCase();

    if (testName.includes('urine') || testName.includes('urinary')) return true;

    // Check row context (e.g. in Form 21, distinguish Urine Colour vs Stool Colour)
    const row = inp.closest('tr');
    if (row) {
      let prev = row.previousElementSibling;
      while (prev) {
        if (prev.classList.contains('param-cat-row') || prev.querySelector('th, td[colspan]')) {
          const text = (prev.textContent || '').toLowerCase();
          if (text.includes('urine')) return true;
          if (text.includes('stool')) return false;
        }
        prev = prev.previousElementSibling;
      }
    }

    const st = typeof editorState !== 'undefined' ? editorState[idx] : null;
    const tmplId = (st?.templateId || '').toLowerCase();
    if (tmplId.includes('urine')) return true;

    if (!testName.includes('stool')) return true;
    return false;
  }

  // Quick shortcuts handler:
  // 1. Blood RH: 'p'/'P' -> 'POSITIVE', 'n'/'N' -> 'NEGATIVE'
  // 2. Stool CONSISTANCY: 'ss'/'SS' -> 'SEMI SOLID', 'py'/'PY' -> 'PALE YELLOW'
  // 3. Stool MUCUS: 'p'/'P' -> 'PRESENT', 'a'/'A' -> 'ABSENT'
  // 4. Stool REMARK: 'n'/'N' -> 'NORMAL'
  // 5. COLOR (Stool & Urine): 'yl' -> 'YELLOWISH', 'br' -> 'BROWNISH', 'py' -> 'PALE YELLOW', 'r' -> 'REDDISH', 'n' -> 'NORMAL'
  // 6. ANY field: 'z'/'Z' -> 'NIL'
  function applyQuickTextShortcuts(inp) {
    if (!inp || inp.tagName !== 'INPUT' || inp.readOnly || inp.disabled) return false;
    if (inp.dataset.f !== 'value') return false;

    const raw = (inp.value || '').trim();
    if (!raw) return false;
    const lower = raw.toLowerCase();
    let pName = (inp.dataset.param || '').trim().toLowerCase();
    if (!pName) {
      const row = inp.closest('tr');
      if (row) {
        const firstTd = row.querySelector('td:first-child');
        pName = (firstTd?.textContent || '').trim().toLowerCase();
      }
    }

    let replacement = null;

    // 1. Blood RH field shortcut: 'p'/'P' -> 'POSITIVE', 'n'/'N' -> 'NEGATIVE'
    if (isRhInputField(inp)) {
      if (lower === 'p' || lower === 'pos' || lower === '+') {
        replacement = 'POSITIVE';
      } else if (lower === 'n' || lower === 'neg' || lower === '-') {
        replacement = 'NEGATIVE';
      }
    }

    // 2. Stool Consistency shortcut:
    // ss / SS -> SEMI SOLID, py / PY -> PALE YELLOW
    const isConsistency = (pName === 'consistancy' || pName === 'consistency' || pName === 'consistent' || pName.includes('consist'));
    if (!replacement && isConsistency) {
      if (lower === 'ss' || lower === 'semi solid' || lower === 'semi-solid' || lower === 'semisolid') {
        replacement = 'SEMI SOLID';
      } else if (lower === 'py' || lower === 'pele yellow' || lower === 'pale yellow') {
        replacement = 'PALE YELLOW';
      } else if (lower === 's' || lower === 'solid') {
        replacement = 'SOLID';
      } else if (lower === 'l' || lower === 'loose') {
        replacement = 'LOOSE';
      } else if (lower === 'w' || lower === 'watery') {
        replacement = 'WATERY';
      }
    }

    // 3. Stool Mucus shortcut:
    // p / P -> PRESENT, a / A -> ABSENT
    const isMucus = (pName === 'mucus');
    if (!replacement && isMucus) {
      if (lower === 'p' || lower === 'present' || lower === '+') {
        replacement = 'PRESENT';
      } else if (lower === 'a' || lower === 'absent' || lower === '-') {
        replacement = 'ABSENT';
      }
    }

    // 4. Remark shortcut:
    // n / N -> NORMAL
    const isRemark = (pName === 'remark');
    if (!replacement && isRemark) {
      if (lower === 'n' || lower === 'normal') {
        replacement = 'NORMAL';
      }
    }

    // 5. Color shortcuts (Urine & Stool):
    // Stool: yl / YL -> YELLOWISH, br / BR -> BROWNISH, py -> PALE YELLOW
    // Urine: py / PY -> PALE YELLOW, r / R -> REDDISH, n / N -> NORMAL, yl / YL -> YELLOWISH
    const isColor = (pName === 'colour' || pName === 'color' || pName.includes('colour') || pName.includes('color'));
    if (!replacement && isColor) {
      if (lower === 'br' || lower === 'b' || lower === 'brownish' || lower === 'brown' || lower === 'borownish') {
        replacement = 'BROWNISH';
      } else if (lower === 'yl' || lower === 'y' || lower === 'yellowish' || lower === 'yellowis' || lower === 'yellow') {
        replacement = 'YELLOWISH';
      } else if (lower === 'py' || lower === 'pele yellow' || lower === 'pale yellow') {
        replacement = 'PALE YELLOW';
      } else if (lower === 'r' || lower === 'reddish' || lower === 'red') {
        replacement = 'REDDISH';
      } else if (lower === 'n' || lower === 'normal') {
        replacement = 'NORMAL';
      } else if (lower === 'g' || lower === 'gr' || lower === 'greenish' || lower === 'green') {
        replacement = 'GREENISH';
      }
    }

    // 6. Appearance shortcut (Urine Analysis & other tests):
    // c / cl / clear -> 'CLEAR'
    // s / sh / slight / slightly hazy -> 'SLIGHTLY HAZY'
    // h / hz / hazy -> 'HAZY'
    // t / tb / turbid -> 'TURBID'
    const isAppearance = (pName === 'appearance' || pName.includes('appear'));
    if (!replacement && isAppearance) {
      if (lower === 'c' || lower === 'cl' || lower === 'clear') {
        replacement = 'CLEAR';
      } else if (lower === 's' || lower === 'sh' || lower === 'slight' || lower === 'slightly hazy' || lower === 'slight hazy') {
        replacement = 'SLIGHTLY HAZY';
      } else if (lower === 'h' || lower === 'hz' || lower === 'hazy') {
        replacement = 'HAZY';
      } else if (lower === 't' || lower === 'tb' || lower === 'turbid') {
        replacement = 'TURBID';
      } else if (lower === 'st' || lower === 'slightly turbid') {
        replacement = 'SLIGHTLY TURBID';
      }
    }

    // 7. Reaction shortcut (Urine Analysis & other tests):
    // a / ac / acid / acidic -> 'ACIDIC'
    // al / alk / alkaline -> 'ALKALINE'
    // n / neu / neutral -> 'NEUTRAL'
    const isReaction = (pName === 'reaction' || pName.includes('reaction') || pName === 'ph');
    if (!replacement && isReaction) {
      if (lower === 'a' || lower === 'ac' || lower === 'acid' || lower === 'acidic') {
        replacement = 'ACIDIC';
      } else if (lower === 'al' || lower === 'alk' || lower === 'alkaline' || lower === 'alkali') {
        replacement = 'ALKALINE';
      } else if (lower === 'n' || lower === 'neu' || lower === 'neutral') {
        replacement = 'NEUTRAL';
      }
    }

    // 8. ANY field shortcut: 'z'/'Z' -> 'NIL'
    if (!replacement && lower === 'z') {
      replacement = 'NIL';
    }

    if (replacement !== null && inp.value !== replacement) {
      inp.value = replacement;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }

  edRowsEl.addEventListener('keydown', e => {
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
      applyQuickTextShortcuts(target);
      if (e.shiftKey) {
        const prev = findInputVertical(target, 'up');
        if (prev) focusAndSelectInput(prev);
      } else {
        const next = findInputVertical(target, 'down');
        if (next) focusAndSelectInput(next);
      }
    } else if (e.key === 'Tab') {
      applyQuickTextShortcuts(target);
    } else if (e.key === 'ArrowDown') {
      applyQuickTextShortcuts(target);
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
      applyQuickTextShortcuts(target);
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

  edRowsEl.addEventListener('input', () => {
    scheduleEditorAutoSave();
  });

  edRowsEl.addEventListener('change', e => {
    applyQuickTextShortcuts(e.target);
    scheduleEditorAutoSave();
  });

  edRowsEl.addEventListener('blur', e => {
    applyQuickTextShortcuts(e.target);
    scheduleEditorAutoSave();
  }, true);

  ['edRemarks', 'edAdvance', 'edDoctor', 'edRDate', 'edRTime', 'edSignDoctorName', 'edSignDoctorDegree'].forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener('input', scheduleEditorAutoSave);
      el.addEventListener('change', scheduleEditorAutoSave);
    }
  });

  const edInc = $('edIncludeSign');
  if (edInc) edInc.addEventListener('change', scheduleEditorAutoSave);
}

window.openEditor = labNo => {
  const r = find(labNo);
  if (!r) return;
  editing = labNo;

  if ($('edPatient')) $('edPatient').textContent = `${r.name} — Lab No ${r.labNo}`;
  if ($('edMeta')) $('edMeta').textContent = `${r.age} yrs / ${r.gender}${r.doctor ? ' · Doctor: ' + r.doctor : ''}`;

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
        if (prev.widal) {
          editorState[i].widal = prev.widal;
        }
      } else {
        if (editorState[i].remark === undefined) {
          editorState[i].remark = prev.remark || '';
        }
      }
    } else {
      const tmpl = findTemplate(t.name);
      if (tmpl) {
        const defaultParams = {};
        if (tmpl.id === 'form_21') {
          (tmpl.items || []).forEach(it => {
            if (!it.isHeader) {
              const pKey = it.paramKey || it.name;
              defaultParams[pKey] = {
                value: it.defaultVal || '',
                unit: it.unit || '',
                range: it.range || ''
              };
            }
          });
        }
        editorState[i] = {
          isDetailed: true,
          templateId: tmpl.id,
          params: defaultParams,
          method: tmpl.method || '',
          remark: tmpl.remark || ''
        };
      } else {
        const paramDef = typeof findTestParameter === 'function' ? findTestParameter(t.name) : null;
        editorState[i] = {
          isDetailed: false,
          value: paramDef?.defaultVal || '',
          unit: paramDef?.unit || '',
          range: paramDef?.range || '',
          remark: ''
        };
      }
    }
    editorState[i].collapsed = false;
  });

  renderEditorRows();

  (r.tests || []).forEach((t, i) => {
    const tmpl = TEST_TEMPLATES[editorState[i]?.templateId] || findTemplate(t.name);
    if (tmpl?.id === 'lipid' || tmpl?.id?.includes('lipid')) calculateLipidProfile(i);
    else if (tmpl?.id === 'biochemistry' || tmpl?.id?.includes('lft') || tmpl?.id?.includes('bilirubin') || tmpl?.id?.includes('protein')) calculateBiochemistry(i);
  });

  if ($('edTotal')) $('edTotal').value = r.total;
  if ($('edAdvance')) $('edAdvance').value = r.advance || 0;
  if ($('edDoctor')) $('edDoctor').value = r.doctor || '';
  if ($('edRDate')) $('edRDate').value = r.reportDate || today();
  if ($('edRTime')) $('edRTime').value = r.reportTime || '10:00';
  if ($('edRemarks')) $('edRemarks').value = r.remarks || '';

  // Load doctor signature details into editor
  const defaultSign = typeof getActiveDefaultSignature === 'function' ? getActiveDefaultSignature() : (typeof DEFAULT_DOCTOR_SIGNATURE !== 'undefined' ? DEFAULT_DOCTOR_SIGNATURE : '');
  const defaultDocName = typeof getActiveDefaultDoctorName === 'function' ? getActiveDefaultDoctorName() : (typeof DEFAULT_DOCTOR_NAME !== 'undefined' ? DEFAULT_DOCTOR_NAME : 'Dr. Hanish Kumar Chawda, MBBS, MD');
  const defaultDocDegree = typeof getActiveDefaultDoctorDegree === 'function' ? getActiveDefaultDoctorDegree() : (typeof DEFAULT_DOCTOR_DEGREE !== 'undefined' ? DEFAULT_DOCTOR_DEGREE : 'Pathologist, Olive Diagnostics, Raigarh');

  window._currentEditorSignature = r.signature || null;

  const edSignPreview = $('edSignPreview');
  if (edSignPreview) {
    edSignPreview.src = window._currentEditorSignature || defaultSign;
  }
  const edSignDoctorName = $('edSignDoctorName');
  if (edSignDoctorName) {
    edSignDoctorName.value = r.signDoctorName || defaultDocName;
  }
  const edSignDoctorDegree = $('edSignDoctorDegree');
  if (edSignDoctorDegree) {
    edSignDoctorDegree.value = r.signDoctorDegree || defaultDocDegree;
  }
  const edIncludeSign = $('edIncludeSign');
  if (edIncludeSign) {
    edIncludeSign.checked = !r.hideSignature;
  }
  const edSignStatusBadge = $('edSignStatusBadge');
  if (edSignStatusBadge) {
    const isCustom = Boolean(window._currentEditorSignature && window._currentEditorSignature !== defaultSign);
    edSignStatusBadge.textContent = isCustom ? 'Custom Doctor Signature' : 'Fixed Default Active';
    edSignStatusBadge.className = isCustom
      ? 'badge bg-warning text-dark fw-semibold'
      : 'badge bg-light text-dark fw-semibold';
  }

  show('editor');

  setTimeout(() => {
    const firstResult = $('edRows') ? $('edRows').querySelector('input.form-control-result:not([readonly]):not([disabled])') : null;
    if (firstResult && firstResult.offsetParent !== null) {
      firstResult.focus();
      try { firstResult.select(); } catch (err) { }
    }
  }, 100);

  updateSaveIndicator(r.status === 'done' ? 'Completed & Saved Locally' : (r.results && Object.keys(r.results).length > 0 ? 'Draft Loaded from Storage' : 'Saved Locally'));
};


// ==========================================================================
// LocalStorage Auto-Save & Save Status Indicator
// Ensures pending drafts and complete reports are continuously persisted locally
// ==========================================================================
let _autoSaveTimer = null;

function updateSaveIndicator(text, isSaving = false) {
  const ind = $('edSaveIndicator');
  if (!ind) return;
  if (isSaving) {
    ind.className = 'badge bg-warning-subtle text-dark border border-warning small ms-2 align-middle';
    ind.innerHTML = '<span class="spinner-border spinner-border-sm me-1" style="width:0.65rem;height:0.65rem;" role="status"></span>Saving...';
  } else {
    ind.className = 'badge bg-light text-success border border-success-subtle small ms-2 align-middle';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    ind.innerHTML = `<i class="bi bi-check-circle-fill text-success me-1"></i>${text || 'Saved Locally'} <span class="text-muted fw-normal" style="font-size:0.7rem;">(${timeStr})</span>`;
  }
}

function scheduleEditorAutoSave() {
  if (!editing) return;
  updateSaveIndicator('Saving...', true);
  if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => {
    try {
      saveEditor();
    } catch (e) {
      console.error('Auto-save error:', e);
    }
  }, 600);
}
window.scheduleEditorAutoSave = scheduleEditorAutoSave;
window.updateSaveIndicator = updateSaveIndicator;

function saveEditor(status) {
  snapshotEditorInputs();
  const r = find(editing);
  if (!r) return null;

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
        value: 'Detailed Parameters',
        widal: st.widal || null
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

  r.remarks = $('edRemarks')?.value.trim() || '';
  r.reportedBy = user?.name || '';
  r.advance = Number($('edAdvance')?.value) || 0;
  r.doctor = $('edDoctor')?.value.trim() || '';
  r.reportDate = $('edRDate')?.value || '';
  r.reportTime = $('edRTime')?.value || '';
  if (status) r.status = status;

  // Signatory & Doctor Signature settings
  const sDoc = $('edSignDoctorName')?.value.trim();
  if (sDoc) r.signDoctorName = sDoc;
  else delete r.signDoctorName;

  const sDeg = $('edSignDoctorDegree')?.value.trim();
  if (sDeg) r.signDoctorDegree = sDeg;
  else delete r.signDoctorDegree;

  if ($('edIncludeSign')) {
    r.hideSignature = !$('edIncludeSign').checked;
  }

  if (window._currentEditorSignature !== undefined) {
    if (window._currentEditorSignature) {
      r.signature = window._currentEditorSignature;
    } else {
      delete r.signature;
    }
  }

  persist();
  if (typeof updateBadge === 'function') updateBadge();
  updateSaveIndicator(r.status === 'done' ? 'Completed & Saved Locally' : 'Saved Locally');
  return r;
}

function initEditorButtons() {
  const edComplete = $('edComplete');
  if (edComplete) {
    edComplete.onclick = () => {
      saveEditor('done');
      toast('Report completed');
      show('pending');
    };
  }

  const edPrintRcpt = $('edPrintRcpt');
  if (edPrintRcpt) {
    edPrintRcpt.onclick = () => printReceipt(saveEditor());
  }

  const edDraft = $('edDraft');
  if (edDraft) {
    edDraft.onclick = () => {
      saveEditor();
      toast('Draft saved');
    };
  }

  const edPdf = $('edPdf');
  if (edPdf) {
    edPdf.onclick = () => downloadReportPdf(saveEditor());
  }

  const edPrint = $('edPrint');
  if (edPrint) {
    edPrint.onclick = () => printReport(saveEditor());
  }

  const edDelete = $('edDelete');
  if (edDelete) {
    edDelete.onclick = () => {
      if (editing && typeof delReport === 'function') delReport(editing);
    };
  }

  const edBack = $('edBack');
  if (edBack) {
    edBack.onclick = () => {
      if (editing) {
        try { saveEditor(); } catch (_) { }
      }
      show('pending');
    };
  }

  initSignatureHandlers();
}

function initSignatureHandlers() {
  const uploadInput = $('edSignUpload');
  if (uploadInput) {
    uploadInput.onchange = function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (evt) {
        const dataUrl = evt.target.result;
        window._currentEditorSignature = dataUrl;
        const edSignPreview = $('edSignPreview');
        if (edSignPreview) edSignPreview.src = dataUrl;
        const edSignStatusBadge = $('edSignStatusBadge');
        if (edSignStatusBadge) {
          edSignStatusBadge.textContent = 'Custom Doctor Signature';
          edSignStatusBadge.className = 'badge bg-warning text-dark fw-semibold';
        }
        toast('Doctor signature uploaded for this report');
      };
      reader.readAsDataURL(file);
      uploadInput.value = '';
    };
  }

  const resetBtn = $('edSignResetBtn');
  if (resetBtn) {
    resetBtn.onclick = function () {
      try {
        localStorage.removeItem('olive_default_doctor_signature');
        localStorage.removeItem('olive_default_doctor_name');
        localStorage.removeItem('olive_default_doctor_degree');
      } catch (err) { }
      window._currentEditorSignature = null;
      const defaultSign = typeof DEFAULT_DOCTOR_SIGNATURE !== 'undefined' ? DEFAULT_DOCTOR_SIGNATURE : '';
      const defaultDocName = typeof DEFAULT_DOCTOR_NAME !== 'undefined' ? DEFAULT_DOCTOR_NAME : 'Dr. Hanish Kumar Chawda, MBBS, MD';
      const defaultDocDegree = typeof DEFAULT_DOCTOR_DEGREE !== 'undefined' ? DEFAULT_DOCTOR_DEGREE : 'Pathologist, Olive Diagnostics, Raigarh';

      const edSignPreview = $('edSignPreview');
      if (edSignPreview) edSignPreview.src = defaultSign;
      const edSignDoctorName = $('edSignDoctorName');
      if (edSignDoctorName) edSignDoctorName.value = defaultDocName;
      const edSignDoctorDegree = $('edSignDoctorDegree');
      if (edSignDoctorDegree) edSignDoctorDegree.value = defaultDocDegree;
      const edSignStatusBadge = $('edSignStatusBadge');
      if (edSignStatusBadge) {
        edSignStatusBadge.textContent = 'Fixed Default Active';
        edSignStatusBadge.className = 'badge bg-light text-dark fw-semibold';
      }
      toast('Reset to fixed default signature');
    };
  }

  const setDefaultBtn = $('edSignSetDefaultBtn');
  if (setDefaultBtn) {
    setDefaultBtn.onclick = function () {
      const curSign = window._currentEditorSignature || (typeof getActiveDefaultSignature === 'function' ? getActiveDefaultSignature() : '');
      const curName = $('edSignDoctorName')?.value.trim() || '';
      const curDegree = $('edSignDoctorDegree')?.value.trim() || '';
      try {
        if (curSign) localStorage.setItem('olive_default_doctor_signature', curSign);
        if (curName) localStorage.setItem('olive_default_doctor_name', curName);
        if (curDegree) localStorage.setItem('olive_default_doctor_degree', curDegree);
        toast('Saved as default signature for future reports');
      } catch (err) {
        toast('Could not save default signature');
      }
    };
  }
}

initEditorEvents();
initEditorButtons();
