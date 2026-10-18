/* ==========================================================================
   Print Service
   Handles thermal/A5 receipts and pre-printed letterhead A4 medical reports
   ========================================================================== */

function printHtml(html) {
  const printArea = $('printArea');
  if (!printArea) return;
  printArea.innerHTML = html;
  setTimeout(() => window.print(), 100);
}

function printReceipt(r) {
  if (!r) return toast('No receipt data to print');
  const rows = (r.tests || []).map((t, i) =>
    `<tr><td>${i + 1}</td><td>${esc(t.name)}</td><td class="num">${t.price}</td></tr>`
  ).join('');

  printHtml(`
    <div class="rcpt">
      <h2>${CLINIC.toUpperCase()}</h2>
      <div class="sub">Pathology &amp; Imaging — Receipt</div>
      <hr>
      <table class="info">
        <tr>
          <td><b>Lab No:</b> ${esc(r.labNo)}</td>
          <td class="num"><b>Date:</b> ${fmtDate(r.date)}</td>
        </tr>
        <tr>
          <td><b>Name:</b> ${esc(r.name)}</td>
          <td class="num"><b>Age/Gender:</b> ${esc(r.age)} / ${esc(r.gender)}</td>
        </tr>
        <tr>
          <td colspan="2"><b>Ref By:</b> ${esc(r.refBy || 'Self')}</td>
        </tr>
      </table>
      <hr>
      <table class="tests">
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th>Test Name</th>
            <th class="num" style="width:100px">Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr><td colspan="2" class="num"><b>Total</b></td><td class="num"><b>${r.total}</b></td></tr>
          <tr><td colspan="2" class="num">Advance</td><td class="num">${r.advance}</td></tr>
          <tr><td colspan="2" class="num"><b>Balance</b></td><td class="num"><b>${r.total - r.advance}</b></td></tr>
        </tbody>
      </table>
      <hr>
      <table class="info">
        <tr>
          <td><b>Report Time:</b> ${fmtDate(r.reportDate)} ${fmtTime(r.reportTime)}</td>
          <td class="num"><b>Doctor:</b> ${esc(r.doctor)}</td>
        </tr>
      </table>
      <div class="sign">
        <span>Patient Signature</span>
        <span>Authorised Signatory</span>
      </div>
    </div>
  `);
}

function getReportHtml(r) {
  const testsList = r.tests || [];
  if (!testsList.length) return '';

  return testsList.map((t, pageIdx) => {
    const pageNum = pageIdx + 1;
    const x = (r.results || {})[t.name] || {};
    const tmpl = TEST_TEMPLATES[x.templateId] || findTemplate(t.name);
    const isDetailed = Boolean(tmpl);

    let rowsHtml = '';
    let testTitle = (tmpl ? tmpl.title : t.name).toUpperCase();
    let methodText = x.method || tmpl?.method || '';
    let remarkText = x.remark || tmpl?.remark || '';

    if (isDetailed && tmpl) {
      rowsHtml = tmpl.items.map(item => {
        if (item.isHeader) {
          return `<tr><td colspan="4" style="font-weight: bold; text-decoration: underline; padding-top: 6px; padding-bottom: 2px; font-size: 12px;">${esc(item.title)}</td></tr>`;
        }
        const p = (x.params && x.params[item.name]) || {};
        const val = p.value !== undefined && p.value !== '' ? p.value : (item.defaultVal || '');
        const u = p.unit !== undefined && p.unit !== '' ? p.unit : item.unit;
        const rng = p.range !== undefined && p.range !== '' ? p.range : item.range;
        const rangeStatus = checkValueRange(val, rng);
        const isAbnormal = rangeStatus === 'high' || rangeStatus === 'low' || rangeStatus === 'abnormal';
        const indentStyle = item.indent ? 'padding-left: 16px;' : '';
        const valDisplay = isAbnormal ? `
          <span style="font-weight: 900; color: #b91c1c; border-bottom: 1.5px solid #b91c1c; padding-bottom: 1px; display: inline-block;">
            ${esc(val)} <span style="font-size: 9.5px; font-weight: 800; color: #b91c1c; border: 1px solid #b91c1c; padding: 0 2px; border-radius: 2px; margin-left: 2px; vertical-align: middle;">${rangeStatus === 'high' ? 'H' : rangeStatus === 'low' ? 'L' : '*'}</span>
          </span>` : `<span>${esc(val)}</span>`;
        return `
          <tr style="line-height: 1.45; border-bottom: 1px solid #f1f5f9;">
            <td style="width: 44%; padding: 2px 0; ${indentStyle}">${esc(item.name)}</td>
            <td style="width: 18%; padding: 2px 0; font-weight: bold;">${valDisplay}</td>
            <td style="width: 16%; padding: 2px 0;">${esc(u)}</td>
            <td style="width: 22%; padding: 2px 0;">${esc(rng)}</td>
          </tr>
        `;
      }).join('');
    } else {
      const val = x.value || '';
      const u = x.unit || '';
      const rng = x.range || '';
      const rangeStatus = checkValueRange(val, rng);
      const isAbnormal = rangeStatus === 'high' || rangeStatus === 'low' || rangeStatus === 'abnormal';
      const valDisplay = isAbnormal ? `
        <span style="font-weight: 900; color: #b91c1c; border-bottom: 1.5px solid #b91c1c; padding-bottom: 1px; display: inline-block;">
          ${esc(val)} <span style="font-size: 9.5px; font-weight: 800; color: #b91c1c; border: 1px solid #b91c1c; padding: 0 2px; border-radius: 2px; margin-left: 2px; vertical-align: middle;">${rangeStatus === 'high' ? 'H' : rangeStatus === 'low' ? 'L' : '*'}</span>
        </span>` : `<span>${esc(val)}</span>`;
      rowsHtml = `
        <tr style="line-height: 1.5; border-bottom: 1px solid #f1f5f9;">
          <td style="width: 44%; padding: 3px 0; font-weight: 500;">${esc(t.name)}</td>
          <td style="width: 18%; padding: 3px 0; font-weight: bold;">${valDisplay}</td>
          <td style="width: 16%; padding: 3px 0;">${esc(u)}</td>
          <td style="width: 22%; padding: 3px 0;">${esc(rng)}</td>
        </tr>
      `;
    }

    const isLipid = (tmpl?.id === 'lipid') || t.name.toLowerCase().includes('lipid');

    return `
      <div class="report-page">
        <div class="report-top-content">
          <div style="text-align: center; margin-bottom: 4px; font-size: 11.5px;">
            <span style="font-weight: bold; text-decoration: underline;">Page : ${pageNum}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 12px; line-height: 1.45; margin-bottom: 6px;">
            <table style="border-collapse: collapse; font-size: 12px; line-height: 1.45;">
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Lab No.</td>
                <td style="padding: 1px 16px 1px 0;">: <b>${esc(r.labNo)}</b></td>
              </tr>
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">NAME</td>
                <td style="padding: 1px 16px 1px 0;">: <b>${esc((r.name || '').toUpperCase())}</b>&nbsp;&nbsp;&nbsp;&nbsp;<b>Age :</b>&nbsp;&nbsp;${esc(r.age)} Years, ${esc(r.gender)}</td>
              </tr>
              ${r.doctor ? `
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Doctor</td>
                <td style="padding: 1px 16px 1px 0;">: ${esc(r.doctor)}</td>
              </tr>` : ''}
            </table>
            <table style="border-collapse: collapse; font-size: 12px; line-height: 1.45; margin-left: auto;">
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Reporting Date</td>
                <td style="padding: 1px 0; white-space: nowrap;">:&nbsp;&nbsp;${fmtDate(r.reportDate || r.date)}</td>
              </tr>
              <tr>
                <td style="padding: 1px 6px 1px 0; font-weight: bold; white-space: nowrap;">Sampling Date</td>
                <td style="padding: 1px 0; white-space: nowrap;">:&nbsp;&nbsp;${fmtDate(r.date)}</td>
              </tr>
            </table>
          </div>

          <div style="border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 3px 0; margin-bottom: 8px; font-weight: bold; font-size: 12px; display: flex;">
            <div style="width: 44%;">Investigation</div>
            <div style="width: 18%;">Result</div>
            <div style="width: 16%;">Unit</div>
            <div style="width: 22%;">Reference range</div>
          </div>

          <div style="text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 8px; text-decoration: underline; letter-spacing: 0.5px;">
            ${esc(testTitle)}
          </div>

          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          ${isLipid ? `
            <div style="margin-top: 10px; font-size: 11px;">
              <div style="font-weight: bold; text-decoration: underline; margin-bottom: 3px;">Reference Range :-</div>
              <table style="width: 95%; border-collapse: collapse; font-size: 10.5px; margin-left: 4px; line-height: 1.4;">
                <tr style="border-bottom: 1px dashed #777;">
                  <th style="text-align: left; padding: 1px 4px;"></th>
                  <th style="text-align: left; padding: 1px 4px; text-decoration: underline;">Cholesterol</th>
                  <th style="text-align: left; padding: 1px 4px; text-decoration: underline;">Triglyceride</th>
                  <th style="text-align: left; padding: 1px 4px; text-decoration: underline;">Total : HDL Ratio</th>
                </tr>
                <tr><td style="padding: 1px 4px;">Desirable</td><td style="padding: 1px 4px;">Below 200</td><td style="padding: 1px 4px;">Below 200</td><td style="padding: 1px 4px;">Below 3.5</td></tr>
                <tr><td style="padding: 1px 4px;">Borderline</td><td style="padding: 1px 4px;">200 to 250</td><td style="padding: 1px 4px;">200 to 400 with normal Cholesterol</td><td style="padding: 1px 4px;">3.5 to 5.5</td></tr>
                <tr><td style="padding: 1px 4px;">High</td><td style="padding: 1px 4px;">250 to 300</td><td style="padding: 1px 4px;">200 to 400 with high Cholesterol</td><td style="padding: 1px 4px;">Above 5.5</td></tr>
                <tr><td style="padding: 1px 4px;">Very High</td><td style="padding: 1px 4px;">Above 300</td><td style="padding: 1px 4px;">Above 400</td><td style="padding: 1px 4px;"></td></tr>
              </table>
            </div>
          ` : ''}

          ${remarkText ? `
            <div style="margin-top: 10px; border: 1.5px solid #000; padding: 5px 8px; font-size: 10.5px; border-radius: 3px; background: #fff;">
              <div style="font-weight: bold; font-size: 10.5px; text-decoration: underline; margin-bottom: 2px; letter-spacing: 0.5px;">REMARK : ${esc(testTitle)}</div>
              <div style="white-space: pre-line; line-height: 1.45; font-weight: bold; font-size: 10px;">${esc(remarkText)}</div>
            </div>` : ''}
          ${methodText ? `<div style="margin-top: 8px; font-size: 11px;">${esc(methodText)}</div>` : ''}
          ${r.remarks ? `<div style="margin-top: 8px; font-size: 11.5px;"><b>Remarks:</b> ${esc(r.remarks)}</div>` : ''}
        </div>

        <div class="report-bottom-content" style="margin-top: auto; padding-top: 8px; page-break-inside: avoid; break-inside: avoid;">
          <div style="border-top: 1.5px solid #000; padding-top: 6px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px;">
            <div style="font-weight: bold; font-style: italic;">Checked By</div>
            <div style="text-align: right; line-height: 1.25;">
              <b>Dr. Hanish Kumar Chawda, MBBS, MD</b><br>
              <span style="font-size: 11px; color: #222;">Pathologist, Olive Diagnostics, Raigarh</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('\n');
}

function printReport(r) {
  if (!r) return toast('No report to print');
  const html = getReportHtml(r);
  if (!html) return toast('No tests to print');
  printHtml(html);
}

// Global exposure for inline onclick handlers
window.printRcpt = labNo => printReceipt(find(labNo));
window.printRep = labNo => printReport(find(labNo));
