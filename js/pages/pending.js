/* ==========================================================================
   Page Module: Pending Reports Queue (Reporter / Admin)
   Displays outstanding lab tests awaiting completion
   ========================================================================== */

function renderPending() {
  const pendingTable = $('pendingTable');
  if (!pendingTable) return;
  const list = receipts.filter(r => r.status !== 'done');
  
  pendingTable.innerHTML = list.length ? list.map(r => {
    const hasDraft = r.results && Object.keys(r.results).length > 0;
    return `
    <tr>
      <td><b>${esc(r.labNo)}</b></td>
      <td>${fmtDate(r.date)}</td>
      <td>
        <div class="fw-semibold">${esc(r.name)}</div>
        ${hasDraft 
          ? '<span class="badge bg-warning-subtle text-dark border border-warning small" style="font-size:0.72rem;"><i class="bi bi-clock-history me-1 text-warning"></i>Draft Saved Locally</span>' 
          : '<span class="badge bg-light text-muted border small" style="font-size:0.72rem;">Pending</span>'}
      </td>
      <td>${esc(r.age)} / ${esc(r.gender)}</td>
      <td>
        ${r.tests.map(t => `<span class="badge text-bg-light border me-1">${esc(t.name)}</span>`).join('')}
      </td>
      <td class="text-nowrap">${fmtDate(r.reportDate)} ${fmtTime(r.reportTime)}</td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm ${hasDraft ? 'btn-primary' : 'btn-outline-primary'} me-1" onclick="openEditor('${esc(r.labNo)}')">
          <i class="bi bi-pencil-square me-1"></i>${hasDraft ? 'Resume Report' : 'Make Report'}
        </button>
        <button class="btn btn-sm btn-outline-danger" title="Delete Report" onclick="delReport('${esc(r.labNo)}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `;
  }).join('') : '<tr><td colspan="7" class="text-center text-muted py-4">No pending reports 🎉</td></tr>';
}
