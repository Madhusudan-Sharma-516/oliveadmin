/* ==========================================================================
   Application Controller & Desktop Shortcut Router
   Handles view routing, F1-F12 desktop shortcut keys, live clock,
   and universal Enter-key field traversal
   ========================================================================== */

function show(v) {
  // Toggle visibility of views
  document.querySelectorAll('.view').forEach(s => {
    s.classList.toggle('show', s.id === 'view-' + v);
  });

  // Highlight active horizontal top navigation item (pure highlight, no bounce/glow)
  document.querySelectorAll('#topNav a, #sideNav a').forEach(a => {
    a.classList.toggle('active', a.dataset.view === v);
  });

  // Update topbar title and view badge
  const pageTitleEl = $('pageTitle');
  if (pageTitleEl) {
    pageTitleEl.textContent = v === 'editor' ? 'Prepare Report' : (MENUS[v] ? MENUS[v][0] : 'Olive Diagnostics');
  }

  const currentViewBadge = $('currentViewBadge');
  if (currentViewBadge) {
    currentViewBadge.textContent = v === 'editor' ? 'EDITOR' : (MENUS[v] ? MENUS[v][0].toUpperCase() : 'ACTIVE');
  }

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
  document.querySelectorAll('#badge-pending').forEach(badgeEl => {
    badgeEl.textContent = pendingCount;
    badgeEl.classList.toggle('d-none', !pendingCount);
  });
}

// --------------------------------------------------------------------------
// Desktop Function Keys (F1, F2, F3...) Keyboard Shortcut Manager
// --------------------------------------------------------------------------
window.addEventListener('keydown', e => {
  const appShell = $('appShell');
  // Only handle shortcuts when logged in
  if (!appShell || appShell.classList.contains('d-none')) return;

  // 1. Handle Function Keys F1 - F12 (Direct instantaneous switch, no flash/bounces)
  const match = e.key.match(/^F([1-9]|1[0-2])$/);
  if (match) {
    const fNum = parseInt(match[1], 10);
    const tabs = Array.from(document.querySelectorAll('#topNav a[data-view]'));
    
    if (fNum >= 1 && fNum <= tabs.length) {
      e.preventDefault(); // Stop native browser action (F1 help, F3 search, F5 refresh, etc.)
      const targetTab = tabs[fNum - 1];
      const targetView = targetTab.dataset.view;
      if (targetView) {
        show(targetView);
        if (typeof toast === 'function') {
          toast(`Switched to: ${MENUS[targetView] ? MENUS[targetView][0] : targetView} (F${fNum})`);
        }
      }
    }
    return;
  }

  // 2. Escape key shortcut: Go back to Pending queue if inside Editor
  if (e.key === 'Escape') {
    const editorView = $('view-editor');
    if (editorView && editorView.classList.contains('show')) {
      e.preventDefault();
      show('pending');
    }
  }
});

// --------------------------------------------------------------------------
// Universal Enter-to-Next-Field Navigation (Like Excel / Desktop Billing Software)
// Eliminates the need to use the mouse to move between fields
// --------------------------------------------------------------------------
function initEnterKeyNavigation() {
  document.addEventListener('keydown', e => {
    // Only capture Enter key
    if (e.key !== 'Enter') return;

    const target = e.target;
    if (!target) return;

    // If Enter was pressed directly on an action button, let it trigger normally
    if (target.tagName === 'BUTTON') return;

    const isInput = target.tagName === 'INPUT';
    const isSelect = target.tagName === 'SELECT';
    const isTextarea = target.tagName === 'TEXTAREA';

    if (!isInput && !isSelect && !isTextarea) return;

    // In textarea: Shift+Enter inserts a new line; plain Enter moves forward to the next field
    if (isTextarea && (e.shiftKey || e.ctrlKey || e.altKey)) {
      return;
    }

    // Determine current active view or form container
    let container = target.closest('.view.show') || target.closest('#loginScreen') || target.closest('form') || document.body;

    // Collect all visible, non-disabled, non-readonly interactive fields
    const selector = [
      'input:not([type="hidden"]):not([readonly]):not([disabled])',
      'select:not([disabled])',
      'textarea:not([readonly]):not([disabled])',
      'button.btn-primary:not([disabled])',
      'button[type="submit"]:not([disabled])',
      '#rgSubmit:not([disabled])',
      '#saveBtn:not([disabled])',
      '#edComplete:not([disabled])',
      '#loginBtn:not([disabled])'
    ].join(', ');

    const fields = Array.from(container.querySelectorAll(selector))
      .filter(el => el.offsetParent !== null && !el.closest('.d-none'));

    const currentIndex = fields.indexOf(target);
    if (currentIndex === -1) return;

    // Shift + Enter: Move to previous field
    if (e.shiftKey) {
      if (currentIndex > 0) {
        e.preventDefault();
        const prev = fields[currentIndex - 1];
        prev.focus();
        if (prev.tagName === 'INPUT' && typeof prev.select === 'function') {
          try { prev.select(); } catch (_) {}
        }
        prev.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      return;
    }

    // Plain Enter: Move to next field
    e.preventDefault();

    if (currentIndex < fields.length - 1) {
      const next = fields[currentIndex + 1];
      next.focus();
      if (next.tagName === 'INPUT' && typeof next.select === 'function') {
        try { next.select(); } catch (_) {}
      }
      next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      // Reached the end: focus on the primary action / submit button
      const lastField = fields[fields.length - 1];
      if (lastField.tagName === 'BUTTON') {
        lastField.focus();
      }
    }
  });
}

// --------------------------------------------------------------------------
// Desktop Live Clock
// --------------------------------------------------------------------------
function updateLiveClock() {
  const el = $('liveClockText');
  if (!el) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  el.textContent = `${dateStr} | ${timeStr}`;
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// Initial bootstrap of components & datalists
if (typeof renderTestSelect === 'function') renderTestSelect();
if (typeof renderTestsTable === 'function') renderTestsTable();
if (typeof updateDoctors === 'function') updateDoctors();
if (typeof clearForm === 'function') clearForm();
if (typeof resetReg === 'function') resetReg();
initEnterKeyNavigation();

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
