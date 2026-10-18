/* ==========================================================================
   Page Module: All Saved Receipts (Receptionist / Reporter / Admin)
   Searchable history of all receipts, quick reprints, and deletions
   ========================================================================== */

function renderSaved() {
  const savedTable = $('savedTable');
  if (!savedTable) return;
  const q = ($('receiptSearch')?.value || '').toLowerCase();
  
  const list = receipts
    .filter(r => (r.labNo || '').toLowerCase().includes(q) || (r.name || '').toLowerCase().includes(q))
    .slice()
    .reverse();

  savedTable.innerHTML = list.length ? list.map(r => `
    <tr>
      <td>${esc(r.labNo)}</td>
      <td>${fmtDate(r.date)}</td>
      <td>${esc(r.name)}</td>
      <td>${esc(r.doctor)}</td>
      <td class="text-end">₹${r.total}</td>
      <td class="text-end">₹${r.advance}</td>
      <td>
        ${r.status === 'done' 
          ? '<span class="badge bg-success">Ready</span>' 
          : '<span class="badge bg-warning text-dark">Pending</span>'}
      </td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-outline-primary me-1" title="Edit" onclick="openRcpt('${esc(r.labNo)}')">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning me-1" title="Print receipt" onclick="printRcpt('${esc(r.labNo)}')">
          <i class="bi bi-printer"></i>
        </button>
        ${r.status === 'done' ? `
          <button class="btn btn-sm btn-outline-danger me-1" title="Download PDF" onclick="downloadPdfRep('${esc(r.labNo)}')">
            <i class="bi bi-file-earmark-pdf"></i>
          </button>
          <button class="btn btn-sm btn-outline-success me-1" title="Print report" onclick="printRep('${esc(r.labNo)}')">
            <i class="bi bi-file-earmark-medical"></i>
          </button>
        ` : ''}
        <button class="btn btn-sm btn-outline-danger" title="Delete" onclick="delRcpt('${esc(r.labNo)}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" class="text-center text-muted">No receipts</td></tr>';
}

window.openRcpt = labNo => {
  const r = find(labNo);
  if (!r) return;
  ['labNo', 'date', 'name', 'age', 'gender', 'advance', 'doctor', 'reportTime', 'reportDate'].forEach(k => {
    if ($(k)) $(k).value = r[k] || '';
  });
  selected = (r.tests || []).map(t => ({ ...t }));
  if (typeof renderSelected === 'function') renderSelected();
  show('receipt');
};

window.delReport = labNo => {
  const r = find(labNo);
  const patientName = r?.name ? ` for "${r.name}"` : '';
  if (!confirm(`Delete report ${labNo}${patientName}? This action cannot be undone.`)) return;

  receipts = receipts.filter(item => item.labNo !== labNo);
  persist();
  if (typeof renderPending === 'function') renderPending();
  if (typeof renderDone === 'function') renderDone();
  renderSaved();
  if (typeof renderRecent === 'function') renderRecent();
  if (typeof updateBadge === 'function') updateBadge();
  toast(`Report ${labNo} deleted`);

  if (editing === labNo) {
    editing = null;
    show(user?.role === 'technician' ? 'pending' : 'saved');
  }
};

window.delRcpt = window.delReport;

function initSaved() {
  const receiptSearch = $('receiptSearch');
  if (receiptSearch) {
    receiptSearch.oninput = renderSaved;
  }
}

initSaved();
