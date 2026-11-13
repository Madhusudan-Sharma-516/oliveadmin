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

function renderReportPage({
  r,
  pageNum,
  testTitle,
  rowsHtml,
  isLipid,
  isWidal,
  widalData,
  remarkText,
  methodText,
  printDoctorRemarks,
  showSignature,
  signImg,
  docName,
  docDegree
}) {
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

        ${isWidal ? `
          <div style="border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 3px 0; margin-bottom: 8px; font-weight: bold; font-size: 12px; display: flex; justify-content: space-between;">
            <div>INVESTIGATION : WIDAL TEST (SEROLOGY)</div>
            <div>METHOD : SLIDE / TUBE AGGLUTINATION</div>
          </div>

          <div style="text-align: center; font-size: 13.5px; font-weight: bold; margin-bottom: 8px; text-decoration: underline; letter-spacing: 0.5px;">
            WIDAL TEST (SLIDE / TUBE AGGLUTINATION)
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1.5px solid #111; margin-bottom: 10px;">
            <thead>
              <tr style="background-color: #f1f5f9; border-bottom: 1.5px solid #111; text-align: center;">
                <th style="padding: 5px 8px; text-align: left; width: 30%; border-right: 1px solid #777;">ANTIGEN</th>
                <th style="padding: 5px 4px; width: 10%; border-right: 1px solid #777;">1:20</th>
                <th style="padding: 5px 4px; width: 10%; border-right: 1px solid #777;">1:40</th>
                <th style="padding: 5px 4px; width: 10%; border-right: 1px solid #777;">1:80</th>
                <th style="padding: 5px 4px; width: 10%; border-right: 1px solid #777;">1:160</th>
                <th style="padding: 5px 4px; width: 10%; border-right: 1px solid #777;">1:320</th>
                <th style="padding: 5px 8px; text-align: right; width: 20%;">FINAL TITRE</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                const widal = widalData || {
                  antigens: [
                    { name: "S. Typhi 'O'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' },
                    { name: "S. Typhi 'H'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' },
                    { name: "S. Paratyphi 'AH'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' },
                    { name: "S. Paratyphi 'BH'", dilutions: { '1:20': '-', '1:40': '-', '1:80': '-', '1:160': '-', '1:320': '-' }, titre: 'Negative (< 1:20)' }
                  ]
                };
                return (widal.antigens || []).map(ag => {
                  const dils = ['1:20', '1:40', '1:80', '1:160', '1:320'];
                  const cells = dils.map(d => {
                    const val = (ag.dilutions && ag.dilutions[d]) || '-';
                    const isPos = val === '+';
                    return `
                      <td style="padding: 4px 4px; text-align: center; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">
                        ${isPos ? '<span style="font-weight: 900; color: #b91c1c; font-size: 13.5px;">+</span>' : '<span style="color: #475569; font-size: 13.5px;">&minus;</span>'}
                      </td>
                    `;
                  }).join('');
                  const isPosTitre = ag.titre && !ag.titre.toLowerCase().includes('negative');
                  return `
                    <tr>
                      <td style="padding: 5px 8px; font-weight: bold; text-align: left; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; font-size: 11.5px;">
                        ${esc(ag.name)}
                      </td>
                      ${cells}
                      <td style="padding: 5px 8px; text-align: right; border-bottom: 1px solid #cbd5e1; font-weight: bold; font-size: 11.5px; ${isPosTitre ? 'color: #b91c1c;' : ''}">
                        ${esc(ag.titre || 'Negative (< 1:20)')}
                      </td>
                    </tr>
                  `;
                }).join('');
              })()}
            </tbody>
          </table>

          <div style="margin-top: 8px; border: 1.5px solid #000; padding: 5px 8px; font-size: 11px; border-radius: 3px; background: #fff;">
            <div style="font-weight: bold; font-size: 11px; text-decoration: underline; margin-bottom: 2px; letter-spacing: 0.5px;">CLINICAL IMPRESSION / INTERPRETATION :</div>
            <div style="font-weight: bold; font-size: 10.5px; line-height: 1.4;">${esc((widalData && widalData.impression) || remarkText || 'Negative / Non-Reactive for Salmonella antibodies (< 1:20).')}</div>
          </div>

          <div style="margin-top: 10px; font-size: 10px; line-height: 1.45; color: #222;">
            <div style="font-weight: bold; text-decoration: underline; margin-bottom: 2px;">DIAGNOSTIC GUIDELINES &amp; INTERPRETATION :</div>
            <ul style="margin: 2px 0 0 16px; padding: 0;">
              <li>A single Widal test is of limited diagnostic value. A <b>four-fold or greater rise in titre</b> in paired sera taken 7 to 10 days apart confirms acute active infection.</li>
              <li>In non-vaccinated individuals, a titre of <b>&ge; 1:80</b> for 'O' antigen and <b>&ge; 1:160</b> for 'H' antigen is clinically significant for Enteric Fever (Typhoid).</li>
              <li>Isolated rise in 'H' antigen titre usually indicates past infection, anamnestic response, or prior TAB vaccination.</li>
            </ul>
          </div>

          <div style="margin-top: 6px; font-size: 10.5px;">
            <b>METHOD :</b> Qualitative and Semi-Quantitative Slide / Tube Agglutination Method.
          </div>
        ` : `
          <div style="border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 4px 0; margin-bottom: 8px; font-weight: bold; font-size: 13px; display: flex;">
            <div style="width: 44%;">Investigation</div>
            <div style="width: 18%;">Result</div>
            <div style="width: 16%;">Unit</div>
            <div style="width: 22%;">Reference range</div>
          </div>

          <div style="text-align: center; font-size: 14.5px; font-weight: bold; margin-bottom: 8px; text-decoration: underline; letter-spacing: 0.5px;">
            ${esc(testTitle)}
          </div>

          <table style="width: 100%; table-layout: fixed; font-size: 13px; border-collapse: collapse;">
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        `}

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

        ${(remarkText && !isWidal) ? `
          <div style="margin-top: 10px; border: 1.5px solid #000; padding: 5px 8px; font-size: 10.5px; border-radius: 3px; background: #fff;">
            <div style="font-weight: bold; font-size: 10.5px; text-decoration: underline; margin-bottom: 2px; letter-spacing: 0.5px;">REMARK : ${esc(testTitle)}</div>
            <div style="white-space: pre-line; line-height: 1.45; font-weight: bold; font-size: 10px;">${esc(remarkText)}</div>
          </div>` : ''}
        ${(methodText && !isWidal) ? `<div style="margin-top: 8px; font-size: 11.5px;">${esc(methodText)}</div>` : ''}
        ${printDoctorRemarks && r.remarks ? `<div style="margin-top: 8px; font-size: 11.5px;"><b>Remarks:</b> ${esc(r.remarks)}</div>` : ''}
      </div>

      <div class="report-bottom-content" style="margin-top: auto; padding-top: 8px; page-break-inside: avoid; break-inside: avoid;">
        <div style="border-top: 1.5px solid #000; padding-top: 6px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px;">
          <div style="font-weight: bold; font-style: italic; padding-bottom: 4px;">Checked By</div>
          <div style="text-align: right; line-height: 1.25;">
            ${showSignature && signImg ? `
              <div style="min-height: 48px; max-height: 48px; display: flex; justify-content: flex-end; align-items: flex-end; margin-bottom: 2px;">
                <img src="${signImg}" alt="Doctor Signature" style="max-height: 46px; max-width: 140px; object-fit: contain; mix-blend-mode: multiply;" />
              </div>
            ` : `
              <div style="height: 48px;"></div>
            `}
            <b>${esc(docName)}</b><br>
            <span style="font-size: 11px; color: #222;">${esc(docDegree)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getReportHtml(r) {
  const testsList = r.tests || [];
  if (!testsList.length) return '';

  const signImg = r.signature || (typeof getActiveDefaultSignature === 'function' ? getActiveDefaultSignature() : (typeof DEFAULT_DOCTOR_SIGNATURE !== 'undefined' ? DEFAULT_DOCTOR_SIGNATURE : ''));
  const docName = r.signDoctorName || (typeof getActiveDefaultDoctorName === 'function' ? getActiveDefaultDoctorName() : (typeof DEFAULT_DOCTOR_NAME !== 'undefined' ? DEFAULT_DOCTOR_NAME : 'Dr. Hanish Kumar Chawda, MBBS, MD'));
  const docDegree = r.signDoctorDegree || (typeof getActiveDefaultDoctorDegree === 'function' ? getActiveDefaultDoctorDegree() : (typeof DEFAULT_DOCTOR_DEGREE !== 'undefined' ? DEFAULT_DOCTOR_DEGREE : 'Pathologist, Olive Diagnostics, Raigarh'));
  const showSignature = !r.hideSignature;

  let pageCounter = 1;
  const pagesHtml = [];

  testsList.forEach((t, tIdx) => {
    const x = (r.results || {})[t.name] || {};
    const tmpl = (x.templateId && typeof TEST_TEMPLATES === 'object' ? TEST_TEMPLATES[x.templateId] : null) || findTemplate(t.name);
    const isLastTest = tIdx === testsList.length - 1;

    // 1. Multi-Page Panels (e.g. Form 21: 4 separate printed pages)
    if (tmpl && tmpl.isMultiPage && Array.isArray(tmpl.pages) && tmpl.pages.length > 0) {
      tmpl.pages.forEach((pDef, pIdx) => {
        const pageNum = pageCounter++;
        const pageTitle = (pDef.pageTitle || tmpl.title).toUpperCase();
        const methodText = pDef.method || tmpl.method || '';
        const remarkText = pDef.remark || '';
        const isLipid = Boolean(pDef.isLipid);
        const isLastPageOfReport = isLastTest && (pIdx === tmpl.pages.length - 1);

        const rowsHtml = (pDef.items || []).map(item => {
          if (item.isHeader) {
            return `<tr><td colspan="4" style="font-weight: bold; text-decoration: underline; padding-top: 6px; padding-bottom: 2px; font-size: 13px;">${esc(item.title)}</td></tr>`;
          }
          const p = (x.params && x.params[item.name]) || {};
          const val = p.value !== undefined && p.value !== '' ? p.value : (item.defaultVal || '');
          const u = p.unit !== undefined && p.unit !== '' ? p.unit : item.unit;
          const rng = p.range !== undefined && p.range !== '' ? p.range : item.range;
          const rangeStatus = checkValueRange(val, rng);
          const indentStyle = item.indent ? 'padding-left: 16px;' : '';
          const flag = (val !== '' && rangeStatus === 'high') ? ' H' : (val !== '' && rangeStatus === 'low') ? ' L' : '';
          const valDisplay = flag ? `
            <span style="font-weight: 900; color: #b91c1c;">${esc(val)}${flag}</span>
          ` : `<span>${esc(val)}</span>`;
          return `
            <tr style="line-height: 1.48; border-bottom: 1px solid #f1f5f9;">
              <td style="width: 44%; padding: 2.8px 0; ${indentStyle}">${esc(item.name)}</td>
              <td style="width: 18%; padding: 2.8px 0; font-weight: bold;">${valDisplay}</td>
              <td style="width: 16%; padding: 2.8px 0;">${esc(u)}</td>
              <td style="width: 22%; padding: 2.8px 0;">${esc(rng)}</td>
            </tr>
          `;
        }).join('');

        pagesHtml.push(renderReportPage({
          r,
          pageNum,
          testTitle: pageTitle,
          rowsHtml,
          isLipid,
          isWidal: false,
          widalData: null,
          remarkText,
          methodText,
          printDoctorRemarks: isLastPageOfReport,
          showSignature,
          signImg,
          docName,
          docDegree
        }));
      });
      return;
    }

    // 2. Standard Single-Page Test
    const pageNum = pageCounter++;
    const isDetailed = Boolean(tmpl);
    let rowsHtml = '';
    let testTitle = (tmpl ? tmpl.title : t.name).toUpperCase();
    let methodText = x.method || tmpl?.method || '';
    let remarkText = x.remark || tmpl?.remark || '';

    if (isDetailed && tmpl) {
      rowsHtml = tmpl.items.map(item => {
        if (item.isHeader) {
          return `<tr><td colspan="4" style="font-weight: bold; text-decoration: underline; padding-top: 6px; padding-bottom: 2px; font-size: 13px;">${esc(item.title)}</td></tr>`;
        }
        const p = (x.params && x.params[item.name]) || {};
        const val = p.value !== undefined && p.value !== '' ? p.value : (item.defaultVal || '');
        const u = p.unit !== undefined && p.unit !== '' ? p.unit : item.unit;
        const rng = p.range !== undefined && p.range !== '' ? p.range : item.range;
        const rangeStatus = checkValueRange(val, rng);
        const indentStyle = item.indent ? 'padding-left: 16px;' : '';
        const flag = (val !== '' && rangeStatus === 'high') ? ' H' : (val !== '' && rangeStatus === 'low') ? ' L' : '';
        const valDisplay = flag ? `
          <span style="font-weight: 900; color: #b91c1c;">${esc(val)}${flag}</span>
        ` : `<span>${esc(val)}</span>`;
        return `
          <tr style="line-height: 1.48; border-bottom: 1px solid #f1f5f9;">
            <td style="width: 44%; padding: 2.8px 0; ${indentStyle}">${esc(item.name)}</td>
            <td style="width: 18%; padding: 2.8px 0; font-weight: bold;">${valDisplay}</td>
            <td style="width: 16%; padding: 2.8px 0;">${esc(u)}</td>
            <td style="width: 22%; padding: 2.8px 0;">${esc(rng)}</td>
          </tr>
        `;
      }).join('');
    } else {
      const val = x.value || '';
      const u = x.unit || '';
      const rng = x.range || '';
      const rangeStatus = checkValueRange(val, rng);
      const flag = (val !== '' && rangeStatus === 'high') ? ' H' : (val !== '' && rangeStatus === 'low') ? ' L' : '';
      const valDisplay = flag ? `
        <span style="font-weight: 900; color: #b91c1c;">${esc(val)}${flag}</span>
      ` : `<span>${esc(val)}</span>`;
      rowsHtml = `
        <tr style="line-height: 1.5; border-bottom: 1px solid #f1f5f9;">
          <td style="width: 44%; padding: 3.5px 0; font-weight: 500;">${esc(t.name)}</td>
          <td style="width: 18%; padding: 3.5px 0; font-weight: bold;">${valDisplay}</td>
          <td style="width: 16%; padding: 3.5px 0;">${esc(u)}</td>
          <td style="width: 22%; padding: 3.5px 0;">${esc(rng)}</td>
        </tr>
      `;
    }

    const isLipid = (tmpl?.id === 'lipid') || t.name.toLowerCase().includes('lipid');
    const isWidal = Boolean(tmpl?.id === 't096_widal_test_slide_tube' || tmpl?.isWidal || t.name.toLowerCase().includes('widal'));

    pagesHtml.push(renderReportPage({
      r,
      pageNum,
      testTitle,
      rowsHtml,
      isLipid,
      isWidal,
      widalData: x.widal,
      remarkText,
      methodText,
      printDoctorRemarks: isLastTest,
      showSignature,
      signImg,
      docName,
      docDegree
    }));
  });

  return pagesHtml.join('\n');
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
