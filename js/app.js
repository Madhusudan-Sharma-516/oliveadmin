/* ==========================================================================
   Application Controller & View Router
   Orchestrates views, badge counters, and application startup
   ========================================================================== */

function show(v) {
  // Toggle visibility of views
  document.querySelectorAll('.view').forEach(s => {
    s.classList.toggle('show', s.id === 'view-' + v);
  });

  // Highlight active sidebar navigation item
  document.querySelectorAll('#sideNav a').forEach(a => {
    a.classList.toggle('active', a.dataset.view === v);
  });

  // Update topbar title
  const pageTitleEl = $('pageTitle');
  if (pageTitleEl) {
    pageTitleEl.textContent = v === 'editor' ? 'Prepare Report' : (MENUS[v] ? MENUS[v][0] : 'Olive Diagnostics');
  }

  // Auto-close sidebar on mobile
  $('sidebar')?.classList.remove('open');

  // Trigger page-specific data rendering
  if (v === 'pending' && typeof renderPending === 'function') renderPending();
  if (v === 'done' && typeof renderDone === 'function') renderDone();
  if (v === 'saved' && typeof renderSaved === 'function') renderSaved();
  if (v === 'users' && typeof renderUsers === 'function') renderUsers();
  if (v === 'register') {
    if (typeof renderRegTests === 'function') renderRegTests();
    if (typeof renderRecent === 'function') renderRecent();
  }

  updateBadge();
}

function updateBadge() {
  const pendingCount = receipts.filter(r => r.status !== 'done').length;
  const badgeEl = $('badge-pending');
  if (badgeEl) {
    badgeEl.textContent = pendingCount;
    badgeEl.classList.toggle('d-none', !pendingCount);
  }
}

// Initial bootstrap of components & datalists
if (typeof renderTestSelect === 'function') renderTestSelect();
if (typeof renderTestsTable === 'function') renderTestsTable();
if (typeof updateDoctors === 'function') updateDoctors();
if (typeof clearForm === 'function') clearForm();
if (typeof resetReg === 'function') resetReg();

// Auto-restore logged-in session if page reloaded
const savedSession = sessionStorage.getItem('user');
if (savedSession) {
  try {
    user = JSON.parse(savedSession);
    if (typeof startApp === 'function') startApp();
  } catch (err) {
    console.error('Failed to restore user session:', err);
    sessionStorage.removeItem('user');
  }
}
