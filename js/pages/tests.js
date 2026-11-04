/* ==========================================================================
   Page Module: Manage Tests (Admin / Reporter)
   Test catalog CRUD, category-wise custom test folders with drag & drop,
   pricing configuration, and live search
   ========================================================================== */

function renderTestsTable() {
  const testsTable = $('testsTable');
  if (!testsTable) return;
  const q = ($('testSearch')?.value || '').toLowerCase().trim();

  const totalBadge = $('testsTotalBadge');
  if (totalBadge) {
    const customCount = tests.filter(t => t.customFolderId || (typeof TEST_TEMPLATES === 'object' && TEST_TEMPLATES[t.customFolderId]?.isCustomFolder)).length;
    totalBadge.textContent = `${tests.length} Tests (${customCount} Custom Folders)`;
  }

  testsTable.innerHTML = tests
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => !q || t.name.toLowerCase().includes(q) || (t.customFolderId && t.customFolderId.toLowerCase().includes(q)))
    .map(({ t, i }) => {
      const tmpl = (t.customFolderId && typeof TEST_TEMPLATES === 'object' ? TEST_TEMPLATES[t.customFolderId] : null) || 
                   (typeof findTemplate === 'function' ? findTemplate(t.name) : null);
      const isCustomFolder = Boolean(t.customFolderId || tmpl?.isCustomFolder);
      const paramCount = tmpl?.items ? tmpl.items.filter(it => !it.isHeader).length : 0;

      if (isCustomFolder) {
        return `
          <tr class="table-warning table-opacity-10">
            <td class="text-center fw-semibold text-muted" style="width: 5%;">${i + 1}</td>
            <td style="width: 55%;">
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <span class="fw-bold text-dark fs-6">${esc(t.name)}</span>
                <span class="badge bg-warning text-dark border border-warning-subtle shadow-xs">
                  <i class="bi bi-folder-fill me-1"></i>Custom Folder (${paramCount} parameters)
                </span>
              </div>
              <div class="text-muted small mt-1" style="font-size: 11.5px;">
                ${esc(tmpl?.subtitle || tmpl?.method || 'Custom Multi-Parameter Panel')}
              </div>
            </td>
            <td class="text-end fw-bold fs-6 text-dark" style="width: 20%;">₹${t.price}</td>
            <td class="text-end" style="width: 20%;">
              <button class="btn btn-sm btn-outline-warning text-dark fw-semibold me-1" onclick="editCustomFolder('${esc(t.customFolderId || t.name)}')" title="Edit Folder Parameters">
                <i class="bi bi-folder2-open me-1"></i>Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="delTest(${i})" title="Delete Custom Folder">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }

      return `
        <tr>
          <td class="text-center fw-semibold text-muted" style="width: 5%;">${i + 1}</td>
          <td style="width: 55%;">
            <div class="fw-medium text-dark">${esc(t.name)}</div>
            ${tmpl ? `<div class="text-muted small" style="font-size: 11.5px;">${esc(tmpl.subtitle || 'Standard Test')}</div>` : ''}
          </td>
          <td class="text-end fw-semibold" style="width: 20%;">₹${t.price}</td>
          <td class="text-end" style="width: 20%;">
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editTest(${i})" title="Edit Price / Name">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="delTest(${i})" title="Delete Test">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
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
  const target = tests[i];
  if (!target) return;
  const isFolder = Boolean(target.customFolderId);
  const msg = isFolder 
    ? `Delete custom test folder "${target.name}" and all its parameters?` 
    : `Delete test "${target.name}"?`;

  if (confirm(msg)) {
    if (target.customFolderId) {
      const folderId = target.customFolderId;
      if (typeof TEST_TEMPLATES === 'object' && TEST_TEMPLATES[folderId]) {
        delete TEST_TEMPLATES[folderId];
      }
      const customTemplates = load('olive_custom_templates', {}) || {};
      if (customTemplates[folderId]) {
        delete customTemplates[folderId];
        store('olive_custom_templates', customTemplates);
      }
    }

    tests.splice(i, 1);
    store('tests', tests);
    renderTestsTable();
    if (typeof renderTestSelect === 'function') renderTestSelect();
    toast(isFolder ? 'Custom test folder deleted' : 'Test deleted');
  }
};

/* ==========================================================================
   Category-Wise Parameters Master & Drag & Drop Custom Folder Builder
   ========================================================================== */

const PARAM_CATEGORIES = [
  { id: 'haematology', name: 'Haematology & Blood (CBC)', icon: 'bi-droplet-half', badgeColor: 'text-danger', keywords: ['haematology', 'blood', 'cbc', 'hemoglobin', 'tlc', 'rbc', 'wbc', 'platelet', 'esr', 'leucocyte', 'indices'] },
  { id: 'electrolytes', name: 'Electrolytes & Minerals', icon: 'bi-lightning-charge', badgeColor: 'text-warning', keywords: ['electrolyte', 'sodium', 'potassium', 'chloride', 'calcium', 'phosphorus', 'magnesium', 'na k cl'] },
  { id: 'vitamins', name: 'Vitamins & Iron Studies', icon: 'bi-sun', badgeColor: 'text-warning', keywords: ['vitamin', 'b12', 'iron', 'ferritin', 'tibc', 'transferrin'] },
  { id: 'coagulation', name: 'Coagulation & Bleeding', icon: 'bi-hourglass-split', badgeColor: 'text-primary', keywords: ['coagulation', 'pt inr', 'prothrombin', 'aptt', 'bleeding time', 'clotting time', 'bt ct', 'd-dimer'] },
  { id: 'thyroid', name: 'Thyroid & Hormones', icon: 'bi-soundwave', badgeColor: 'text-warning', keywords: ['thyroid', 't3', 't4', 'tsh', 'ft3', 'ft4', 'hormone', 'prolactin', 'testosterone', 'cortisol', 'hcg'] },
  { id: 'lipid', name: 'Lipid Profile (Heart)', icon: 'bi-heart-pulse', badgeColor: 'text-danger', keywords: ['lipid', 'cholesterol', 'triglyceride', 'hdl', 'ldl', 'vldl'] },
  { id: 'lft', name: 'Liver Function (LFT)', icon: 'bi-activity', badgeColor: 'text-success', keywords: ['lft', 'liver function', 'bilirubin', 'sgot', 'sgpt', 'alkaline phosphatase', 'ast', 'alt'] },
  { id: 'kft', name: 'Kidney Function (KFT / RFT)', icon: 'bi-shield-plus', badgeColor: 'text-primary', keywords: ['kft', 'rft', 'kidney function', 'creatinine', 'blood urea', 'bun', 'uric acid', 'renal'] },
  { id: 'urine', name: 'Urine Analysis', icon: 'bi-eyedropper', badgeColor: 'text-secondary', keywords: ['urine', 'pus cells', 'epithelial', 'crystals', 'casts', 'urobilinogen'] },
  { id: 'serology', name: 'Serology & Infections', icon: 'bi-virus', badgeColor: 'text-danger', keywords: ['serology', 'widal', 'dengue', 'malaria', 'crp', 'ra factor', 'aso', 'hiv', 'hbsag', 'hcv', 'vdrl', 'typhoid'] },
  { id: 'biochem', name: 'Biochemistry & Diabetes', icon: 'bi-clipboard-data', badgeColor: 'text-info', keywords: ['biochem', 'sugar', 'glucose', 'hba1c', 'amylase', 'lipase'] }
];

let openCategoriesState = { haematology: true }; // First category open by default

/**
 * Extracts and categorizes all standard parameters available in the diagnostic system.
 */
function getCategoryParametersPool() {
  const result = PARAM_CATEGORIES.map(cat => ({ ...cat, params: [] }));
  const otherCat = { id: 'other', name: 'Other Diagnostic Tests', icon: 'bi-folder2', badgeColor: 'text-secondary', params: [] };

  if (typeof TEST_TEMPLATES !== 'object' || TEST_TEMPLATES === null) {
    return result;
  }

  Object.values(TEST_TEMPLATES).forEach(tmpl => {
    // Skip custom folders when building standard pool to avoid recursion
    if (tmpl.isCustomFolder || !tmpl.items || !tmpl.items.length) return;

    const titleAndMatch = ((tmpl.title || '') + ' ' + (tmpl.match || []).join(' ')).toLowerCase();
    const hay = (titleAndMatch + ' ' + (tmpl.subtitle || '')).toLowerCase();

    let matchedCat = result.find(c => c.keywords.some(kw => titleAndMatch.includes(kw)));
    if (!matchedCat) {
      matchedCat = result.find(c => c.keywords.some(kw => hay.includes(kw)));
    }
    if (!matchedCat) matchedCat = otherCat;

    tmpl.items.forEach(it => {
      if (it.isHeader || !it.name) return;
      const cleanName = it.name.trim();
      if (!matchedCat.params.some(p => p.name.toLowerCase() === cleanName.toLowerCase())) {
        matchedCat.params.push({
          name: cleanName,
          unit: it.unit || '',
          range: it.range || '',
          defaultVal: it.defaultVal || '',
          sourceTemplate: tmpl.title
        });
      }
    });
  });

  return [...result, otherCat].filter(c => c.params.length > 0);
}

/**
 * Returns a set of currently added parameter names in the folder drop zone table.
 */
function getCurrentlyAddedParamNames() {
  const tbody = $('cfParamsBody');
  if (!tbody) return new Set();
  const names = new Set();
  tbody.querySelectorAll('.cf-p-name').forEach(inp => {
    const val = (inp.value || '').trim().toLowerCase();
    if (val) names.add(val);
  });
  return names;
}

/**
 * Renders the category accordion in the left column.
 */
function renderCategoryAccordion(filterText = '') {
  const container = $('cfCategoriesContainer');
  if (!container) return;

  const q = (filterText || ($('cfCatSearch')?.value || '')).toLowerCase().trim();
  const pool = getCategoryParametersPool();
  const addedNames = getCurrentlyAddedParamNames();

  let totalParamsCount = 0;
  let matchingCategoriesCount = 0;

  const html = pool.map(cat => {
    const filteredParams = cat.params.filter(p => {
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || 
             (p.unit && p.unit.toLowerCase().includes(q)) || 
             (p.range && p.range.toLowerCase().includes(q)) || 
             cat.name.toLowerCase().includes(q);
    });

    if (filteredParams.length === 0) return '';

    totalParamsCount += filteredParams.length;
    matchingCategoriesCount++;

    const isOpen = Boolean(q) || Boolean(openCategoriesState[cat.id]);

    const paramsListHtml = filteredParams.map(param => {
      const isAdded = addedNames.has(param.name.toLowerCase());
      const paramJson = JSON.stringify(param).replace(/"/g, '&quot;');

      return `
        <div class="cf-param-item ${isAdded ? 'already-added' : ''}" 
             draggable="true" 
             ondragstart="onParamDragStart(event, ${paramJson})"
             ondragend="onParamDragEnd(event)">
          <div class="d-flex align-items-center gap-2 overflow-hidden flex-grow-1 me-2">
            <i class="bi bi-grip-vertical text-muted fs-6" title="Drag to right folder"></i>
            <div class="overflow-hidden">
              <div class="fw-bold text-dark small text-truncate cf-param-title" title="${esc(param.name)}">
                ${esc(param.name)}
              </div>
              <div class="text-muted" style="font-size: 11px;">
                ${param.unit ? `<span class="fw-semibold text-secondary">${esc(param.unit)}</span>` : '<span class="text-muted">No unit</span>'} 
                &middot; 
                <span>${esc(param.range || 'Standard range')}</span>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1 flex-shrink-0">
            ${isAdded ? `
              <span class="cf-added-badge me-1" title="Already added to folder">
                <i class="bi bi-check2 me-1"></i>Added
              </span>
            ` : ''}
            <button type="button" class="btn btn-xs ${isAdded ? 'btn-outline-secondary' : 'cf-add-btn'} py-0 px-2 fw-semibold" 
                    onclick="addParamFromCategory(${paramJson})"
                    title="${isAdded ? 'Add another row' : 'Add to custom folder'}">
              <i class="bi bi-plus"></i>Add
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="cf-cat-card shadow-xs">
        <div class="cf-cat-header ${isOpen ? 'is-open' : ''}" onclick="toggleCategoryOpen('${cat.id}')">
          <div class="d-flex align-items-center gap-2">
            <i class="bi ${cat.icon} ${cat.badgeColor} fs-6"></i>
            <span class="fw-bold small text-dark">${esc(cat.name)}</span>
            <span class="badge cf-pill-badge px-2 py-0" style="font-size: 10px;">${filteredParams.length}</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-xs btn-outline-primary py-0 px-2 fw-semibold" 
                    style="font-size: 10.5px;" 
                    onclick="addAllFromCategory('${cat.id}', event)" 
                    title="Add all ${filteredParams.length} parameters to this folder">
              + Add All
            </button>
            <i class="bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} text-muted small"></i>
          </div>
        </div>
        <div class="p-2 ${isOpen ? '' : 'd-none'}" id="cat_body_${cat.id}">
          ${paramsListHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html || `
    <div class="text-center p-4 text-muted">
      <i class="bi bi-search fs-2 mb-2 d-block opacity-50"></i>
      <div class="small fw-semibold">No parameters found for "${esc(q)}"</div>
      <div class="small text-muted">Try another keyword or clear search</div>
    </div>
  `;

  const availableBadge = $('cfAvailableCatCount');
  if (availableBadge) {
    availableBadge.textContent = `${matchingCategoriesCount} Categories`;
  }

  const poolBadge = $('cfTotalParamPoolBadge');
  if (poolBadge) {
    poolBadge.textContent = `${totalParamsCount} Parameters`;
  }
}

window.toggleCategoryOpen = function(catId) {
  openCategoriesState[catId] = !openCategoriesState[catId];
  renderCategoryAccordion();
};

window.filterCategoryParameters = function() {
  const q = ($('cfCatSearch')?.value || '').trim();
  renderCategoryAccordion(q);
};

/* ==========================================================================
   HTML5 Drag & Drop Interactions
   ========================================================================== */

window.onParamDragStart = function(event, param) {
  try {
    event.dataTransfer.setData('text/plain', JSON.stringify(param));
    event.dataTransfer.effectAllowed = 'copy';
    if (event.currentTarget) {
      event.currentTarget.classList.add('is-dragging');
    }
  } catch (err) {
    console.error('Drag start error:', err);
  }
};

window.onParamDragEnd = function(event) {
  if (event.currentTarget) {
    event.currentTarget.classList.remove('is-dragging');
  }
  $('cfDropZone')?.classList.remove('cf-drop-target-active');
};

window.onCfDropZoneOver = function(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  $('cfDropZone')?.classList.add('cf-drop-target-active');
};

window.onCfDropZoneLeave = function(event) {
  $('cfDropZone')?.classList.remove('cf-drop-target-active');
};

window.onCfDropZoneDrop = function(event) {
  event.preventDefault();
  $('cfDropZone')?.classList.remove('cf-drop-target-active');

  try {
    const rawData = event.dataTransfer.getData('text/plain');
    if (!rawData) return;
    const param = JSON.parse(rawData);
    if (param && param.name) {
      addCustomFolderParamRow(param);
      toast(`Added "${param.name}" to folder`);
    }
  } catch (err) {
    console.error('Drop error:', err);
  }
};

window.addParamFromCategory = function(param) {
  if (!param || !param.name) return;
  addCustomFolderParamRow(param);
  toast(`Added "${param.name}" to folder`);
};

window.addAllFromCategory = function(catId, event) {
  if (event) event.stopPropagation();
  const pool = getCategoryParametersPool();
  const cat = pool.find(c => c.id === catId);
  if (!cat || !cat.params.length) return;

  const addedNames = getCurrentlyAddedParamNames();
  let addedCount = 0;

  cat.params.forEach(p => {
    // Add if not already present
    if (!addedNames.has(p.name.toLowerCase())) {
      addCustomFolderParamRow(p, false); // false = batch add without re-rendering every row
      addedCount++;
    }
  });

  syncFolderDropZoneState();
  toast(`Added ${addedCount} parameters from ${cat.name}`);
};

/* ==========================================================================
   Folder Parameters Table (Right Column Drop Zone)
   ========================================================================== */

function syncFolderDropZoneState() {
  const tbody = $('cfParamsBody');
  const emptyTarget = $('cfEmptyDropTarget');
  const tableContainer = $('cfTableContainer');
  const countBadge = $('cfParamCount');

  if (!tbody) return;
  const rows = tbody.querySelectorAll('tr');
  const count = rows.length;

  if (count === 0) {
    if (emptyTarget) emptyTarget.classList.remove('d-none');
    if (tableContainer) tableContainer.classList.add('d-none');
    if (countBadge) countBadge.textContent = '0 Parameters';
  } else {
    if (emptyTarget) emptyTarget.classList.add('d-none');
    if (tableContainer) tableContainer.classList.remove('d-none');
    if (countBadge) countBadge.textContent = `${count} Parameter${count === 1 ? '' : 's'}`;

    // Update row numbers
    rows.forEach((tr, index) => {
      const numCell = tr.querySelector('.cf-row-num');
      if (numCell) numCell.textContent = index + 1;
    });
  }

  // Synchronize category list checkmarks
  renderCategoryAccordion();
}

window.addCustomFolderParamRow = function(param = {}, triggerSync = true) {
  const tbody = $('cfParamsBody');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="text-center text-muted small cf-row-num align-middle">1</td>
    <td>
      <input type="text" class="form-control form-control-sm cf-p-name fw-medium" list="allParametersDatalist" 
             value="${esc(param.name || '')}" placeholder="Parameter name (e.g. S. Creatinine)" 
             required oninput="onParamNameChanged(this)" onchange="onParamNameChanged(this)">
    </td>
    <td>
      <input type="text" class="form-control form-control-sm cf-p-unit" 
             value="${esc(param.unit || '')}" placeholder="Unit (e.g. mg/dl)">
    </td>
    <td>
      <input type="text" class="form-control form-control-sm cf-p-range" 
             value="${esc(param.range || '')}" placeholder="Range (e.g. 0.6 - 1.2)">
    </td>
    <td>
      <input type="text" class="form-control form-control-sm cf-p-default" 
             value="${esc(param.defaultVal || '')}" placeholder="Sample value">
    </td>
    <td class="text-center align-middle">
      <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeCustomFolderParamRow(this)" title="Delete Parameter">
        <i class="bi bi-trash"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);

  if (triggerSync) {
    syncFolderDropZoneState();
  }
};

window.removeCustomFolderParamRow = function(btn) {
  const tr = btn?.closest('tr');
  if (!tr) return;
  tr.remove();
  syncFolderDropZoneState();
};

window.clearAllFolderParams = function() {
  const tbody = $('cfParamsBody');
  if (!tbody || tbody.children.length === 0) return;

  if (confirm('Are you sure you want to clear all parameters from this custom folder?')) {
    tbody.innerHTML = '';
    syncFolderDropZoneState();
    toast('Cleared all folder parameters');
  }
};

window.onParamNameChanged = function(input) {
  if (!input) return;
  const val = (input.value || '').trim();
  if (!val) return;

  const tr = input.closest('tr');
  if (!tr) return;

  const unitInp = tr.querySelector('.cf-p-unit');
  const rangeInp = tr.querySelector('.cf-p-range');

  const match = typeof findTestParameter === 'function' ? findTestParameter(val) : null;
  if (match) {
    if (unitInp && (!unitInp.value || unitInp.value.trim() === '')) {
      unitInp.value = match.unit || '';
    }
    if (rangeInp && (!rangeInp.value || rangeInp.value.trim() === '')) {
      rangeInp.value = match.range || '';
    }
  } else if (typeof TEST_TEMPLATES === 'object' && TEST_TEMPLATES !== null) {
    for (const tmpl of Object.values(TEST_TEMPLATES)) {
      if (!tmpl.items) continue;
      const found = tmpl.items.find(it => !it.isHeader && it.name && it.name.toLowerCase() === val.toLowerCase());
      if (found) {
        if (unitInp && (!unitInp.value || unitInp.value.trim() === '')) {
          unitInp.value = found.unit || '';
        }
        if (rangeInp && (!rangeInp.value || rangeInp.value.trim() === '')) {
          rangeInp.value = found.range || '';
        }
        break;
      }
    }
  }

  // Refresh category list checkmarks
  renderCategoryAccordion();
};

/* ==========================================================================
   Modal Open & Save Custom Folder
   ========================================================================== */

function populateParametersDatalist() {
  const dl = $('allParametersDatalist');
  if (!dl) return;
  if (dl.children.length > 0) return;

  const namesSet = new Set();
  if (typeof TEST_PARAMETERS_MASTER === 'object' && Array.isArray(TEST_PARAMETERS_MASTER)) {
    TEST_PARAMETERS_MASTER.forEach(p => {
      if (p.name) namesSet.add(p.name);
      if (p.testName) namesSet.add(p.testName);
    });
  }
  if (typeof TEST_TEMPLATES === 'object' && TEST_TEMPLATES !== null) {
    Object.values(TEST_TEMPLATES).forEach(tmpl => {
      if (tmpl.items && Array.isArray(tmpl.items)) {
        tmpl.items.forEach(it => {
          if (!it.isHeader && it.name) namesSet.add(it.name);
        });
      }
    });
  }

  dl.innerHTML = Array.from(namesSet)
    .sort((a, b) => a.localeCompare(b))
    .map(name => `<option value="${esc(name)}">`)
    .join('');
}

window.openCustomFolderModal = function(customId = null) {
  populateParametersDatalist();

  const modalEl = $('customFolderModal');
  if (!modalEl) return;

  const cfEditId = $('cfEditId');
  const cfName = $('cfName');
  const cfPrice = $('cfPrice');
  const cfMethod = $('cfMethod');
  const cfModalTitle = $('cfModalTitle');
  const cfParamsBody = $('cfParamsBody');
  const cfCatSearch = $('cfCatSearch');

  if (cfParamsBody) cfParamsBody.innerHTML = '';
  if (cfCatSearch) cfCatSearch.value = '';

  if (customId) {
    // Edit existing custom folder
    let tmpl = (typeof TEST_TEMPLATES === 'object' ? TEST_TEMPLATES[customId] : null) || 
               (typeof findTemplate === 'function' ? findTemplate(customId) : null);
    const existingTest = tests.find(t => t.customFolderId === customId || t.name.toLowerCase() === customId.toLowerCase());

    if (cfModalTitle) cfModalTitle.textContent = 'Edit Custom Test Folder';
    if (cfEditId) cfEditId.value = tmpl?.id || customId;
    if (cfName) cfName.value = existingTest?.name || tmpl?.title || customId;
    if (cfPrice) cfPrice.value = existingTest?.price !== undefined ? existingTest.price : 500;
    if (cfMethod) cfMethod.value = (tmpl?.method || '').replace(/^METHOD\s*:\s*/i, '') || (tmpl?.subtitle || '');

    if (tmpl && tmpl.items && tmpl.items.length) {
      tmpl.items.forEach(it => {
        if (!it.isHeader) {
          addCustomFolderParamRow(it, false);
        }
      });
    }
  } else {
    // Create brand new custom folder
    if (cfModalTitle) cfModalTitle.textContent = 'Create Custom Test Folder';
    if (cfEditId) cfEditId.value = '';
    if (cfName) cfName.value = '';
    if (cfPrice) cfPrice.value = '500';
    if (cfMethod) cfMethod.value = '';
  }

  syncFolderDropZoneState();

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
  setTimeout(() => $('cfName')?.focus(), 300);
};

window.editCustomFolder = function(customId) {
  window.openCustomFolderModal(customId);
};

window.saveCustomFolderTest = function() {
  const name = ($('cfName')?.value || '').trim();
  const price = Number($('cfPrice')?.value) || 0;
  const method = ($('cfMethod')?.value || '').trim();
  const editId = ($('cfEditId')?.value || '').trim();

  if (!name) {
    alert('Please enter a name for the custom test folder.');
    $('cfName')?.focus();
    return;
  }

  const tbody = $('cfParamsBody');
  const rows = tbody ? tbody.querySelectorAll('tr') : [];
  const items = [];

  rows.forEach(tr => {
    const pName = (tr.querySelector('.cf-p-name')?.value || '').trim();
    const pUnit = (tr.querySelector('.cf-p-unit')?.value || '').trim();
    const pRange = (tr.querySelector('.cf-p-range')?.value || '').trim();
    const pDefault = (tr.querySelector('.cf-p-default')?.value || '').trim();

    if (pName) {
      items.push({
        name: pName,
        unit: pUnit,
        range: pRange,
        defaultVal: pDefault
      });
    }
  });

  if (items.length === 0) {
    alert('Please add at least one parameter to this custom folder (drag and drop from the left categories or add a row).');
    return;
  }

  // Generate unique folder ID or retain existing
  const folderId = editId || ('cf_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4));

  // Build the template object
  const folderTemplate = {
    id: folderId,
    title: name.toUpperCase(),
    subtitle: method || (name + ' Panel'),
    method: method ? (`METHOD : ${method}`) : 'METHOD : Automated Analyzer Method.',
    match: [name.toLowerCase(), folderId],
    isCustomFolder: true,
    items: items
  };

  // 1. Register in in-memory TEST_TEMPLATES
  if (typeof TEST_TEMPLATES === 'object' && TEST_TEMPLATES !== null) {
    TEST_TEMPLATES[folderId] = folderTemplate;
  }

  // 2. Persist in localStorage olive_custom_templates
  const customTemplates = load('olive_custom_templates', {}) || {};
  customTemplates[folderId] = folderTemplate;
  store('olive_custom_templates', customTemplates);

  // 3. Add or update in tests catalog
  const existingIndex = tests.findIndex(t => 
    t.customFolderId === folderId || 
    (editId && (t.customFolderId === editId || t.name.toLowerCase() === name.toLowerCase()))
  );

  const testCatalogEntry = {
    name: name,
    price: price,
    customFolderId: folderId
  };

  if (existingIndex >= 0) {
    tests[existingIndex] = testCatalogEntry;
  } else {
    tests.unshift(testCatalogEntry);
  }

  store('tests', tests);

  // 4. Update UI
  renderTestsTable();
  if (typeof renderTestSelect === 'function') renderTestSelect();

  // Close modal
  const modalEl = $('customFolderModal');
  if (modalEl) {
    bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  toast(`Custom test folder "${name}" saved!`);
};

/* ==========================================================================
   Page Initializer
   ========================================================================== */

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
        if (tests[idx]?.customFolderId) {
          item.customFolderId = tests[idx].customFolderId;
        }
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

  populateParametersDatalist();
}

initTestsManager();
