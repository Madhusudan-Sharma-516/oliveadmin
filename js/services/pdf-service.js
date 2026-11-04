/* ==========================================================================
   PDF Service
   Generates downloadable multi-page A4 PDF lab reports via html2pdf.js
   ========================================================================== */

async function downloadReportPdf(r) {
  if (!r && typeof saveEditor === 'function') {
    r = saveEditor();
  }
  if (!r) return;
  const html = getReportHtml(r);
  if (!html) return toast('No tests to print');

  // Loading overlay
  const overlay = document.createElement('div');
  overlay.id = 'pdfOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999999;display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML = `
    <div style="background:#fff;padding:20px 32px;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,0.3);display:flex;align-items:center;gap:14px;font-weight:600;font-size:15px;color:#1e293b;">
      <div class="spinner-border text-danger" role="status" style="width:1.75rem;height:1.75rem;"></div>
      <span>Generating PDF, please wait...</span>
    </div>
  `;
  document.body.appendChild(overlay);

  // Render container
  const container = document.createElement('div');
  container.id = 'pdfRenderWrap';
  container.className = 'pdf-render-wrap';
  container.style.position = 'static';
  container.innerHTML = html;
  document.body.appendChild(container);

  const cleanup = () => {
    container.remove();
    overlay.remove();
  };

  const opt = {
    margin: 0,
    filename: `Report_${r.labNo}_${(r.name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: '#ffffff'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    if (!window.html2pdf) throw new Error('html2pdf not loaded');

    // Fonts और images ready होने का wait
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all(
      Array.from(container.querySelectorAll('img')).map(img =>
        img.complete ? Promise.resolve() :
          new Promise(res => { img.onload = img.onerror = res; })
      )
    );
    await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));

    await window.html2pdf().set(opt).from(container).save();
    cleanup();
    toast('PDF downloaded successfully');
  } catch (err) {
    console.error('PDF generation error:', err);
    cleanup();
    toast('PDF error: opened print window');
    printReport(r);
  }
}

window.downloadPdfRep = labNo => {
  const r = find(labNo);
  if (r) downloadReportPdf(r);
};
