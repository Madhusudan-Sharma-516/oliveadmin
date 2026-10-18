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
      <td>${esc(r.labNo)}</td>
      <td>${esc(r.name)}</td>
      <td>${r.tests.map(t => esc(t.name)).join(', ')}</td>
      <td>${esc(r.reportedBy)}</td>
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
