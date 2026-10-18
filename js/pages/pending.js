/* ==========================================================================
   Page Module: Pending Reports Queue (Reporter / Admin)
   Displays outstanding lab tests awaiting completion
   ========================================================================== */

function renderPending() {
  const pendingTable = $('pendingTable');
  if (!pendingTable) return;
  const list = receipts.filter(r => r.status !== 'done');
  
  pendingTable.innerHTML = list.length ? list.map(r => `
    <tr>
      <td>${esc(r.labNo)}</td>
      <td>${fmtDate(r.date)}</td>
      <td>${esc(r.name)}</td>
      <td>${esc(r.age)} / ${esc(r.gender)}</td>
      <td>
        ${r.tests.map(t => `<span class="badge text-bg-light border me-1">${esc(t.name)}</span>`).join('')}
      </td>
      <td class="text-nowrap">${fmtDate(r.reportDate)} ${fmtTime(r.reportTime)}</td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-primary me-1" onclick="openEditor('${esc(r.labNo)}')">
          <i class="bi bi-pencil-square me-1"></i>Make Report
        </button>
        <button class="btn btn-sm btn-outline-danger" title="Delete Report" onclick="delReport('${esc(r.labNo)}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="7" class="text-center text-muted py-4">No pending reports 🎉</td></tr>';
}
