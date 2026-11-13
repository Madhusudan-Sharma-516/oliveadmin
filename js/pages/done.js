/* ==========================================================================
   Page Module: Completed Reports (Reporter / Admin)
   Displays finalized medical test reports with print, export, and edit actions
   ========================================================================== */

function renderDone() {
  const doneTable = $('doneTable');
  if (!doneTable) return;
  const list = receipts.filter(r => r.status === 'done').slice().reverse();
  
  doneTable.innerHTML = list.length ? list.map(r => `
    <tr>
      <td><b>${esc(r.labNo)}</b></td>
      <td>
        <div class="fw-semibold">${esc(r.name)}</div>
        <span class="badge bg-success-subtle text-success border border-success small" style="font-size:0.72rem;"><i class="bi bi-check2-circle me-1"></i>Saved Locally</span>
      </td>
      <td>${r.tests.map(t => `<span class="badge bg-light text-dark border me-1">${esc(t.name)}</span>`).join('')}</td>
      <td>${esc(r.reportedBy || 'Pathologist')}</td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-outline-primary me-1" title="Edit" onclick="openEditor('${esc(r.labNo)}')">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger me-1" title="Download PDF" onclick="downloadPdfRep('${esc(r.labNo)}')">
          <i class="bi bi-file-earmark-pdf"></i>
        </button>
        <button class="btn btn-sm btn-warning me-1" title="Print" onclick="printRep('${esc(r.labNo)}')">
          <i class="bi bi-printer"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" title="Delete Report" onclick="delReport('${esc(r.labNo)}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="text-center text-muted py-4">No completed reports</td></tr>';
}
