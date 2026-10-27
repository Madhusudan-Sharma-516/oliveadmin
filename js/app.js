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

  // Tally-style auto-focus on first interactive field in newly opened tab
  setTimeout(() => {
    focusFirstFieldInView(v);
  }, 50);
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
// Universal Tally ERP / Tally Prime Style Navigation Engine
// Supports Enter, Shift+Enter, and Arrow keys (Up, Down, Left, Right)
// across all forms, tables, and views with instantaneous auto-focus
// --------------------------------------------------------------------------

function focusElement(el) {
  if (!el) return;
  el.focus();
  if (el.tagName === 'INPUT' && typeof el.select === 'function') {
    try { el.select(); } catch (_) { }
  }
  el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function focusFirstFieldInView(v) {
  const viewEl = $('view-' + v) || document.querySelector('.view.show');
  if (!viewEl) return;

  let target = null;
  if (v === 'register') {
    target = $('rgLab') || $('rgName');
  } else if (v === 'receipt') {
    target = $('labNo') || $('name');
  } else if (v === 'pending') {
    target = viewEl.querySelector('tbody button') || viewEl.querySelector('input');
  } else if (v === 'done') {
    target = viewEl.querySelector('tbody button') || viewEl.querySelector('input');
  } else if (v === 'saved') {
    target = $('receiptSearch') || viewEl.querySelector('tbody button');
  } else if (v === 'tests') {
    target = $('testName') || $('testSearch');
  } else if (v === 'users') {
    target = $('uName');
  } else if (v === 'editor') {
    target = $('edRows')?.querySelector('input.form-control-result:not([readonly]):not([disabled])') ||
      $('edAdvance') || $('edDoctor');
  }

  if (!target) {
    const fields = getViewNavElements(viewEl);
    if (fields.length) target = fields[0];
  }

  if (target) {
    focusElement(target);
  }
}

function getViewNavElements(container) {
  if (!container) {
    container = document.querySelector('.view.show') || document.querySelector('#loginScreen') || document.body;
  }

  const selector = [
    'input:not([type="hidden"]):not([readonly]):not([disabled])',
    'select:not([disabled])',
    'textarea:not([readonly]):not([disabled])',
    'button:not([disabled]):not(.d-none):not(.expand-btn):not(.btn-close):not([tabindex="-1"])',
    'a.btn:not([disabled])'
  ].join(', ');

  return Array.from(container.querySelectorAll(selector)).filter(el => {
    if (el.offsetParent === null || el.closest('.d-none')) return false;
    if (el.closest('.desktop-header') || el.closest('.desktop-nav-ribbon')) return false;
    return true;
  });
}

function isCaretAtStart(inp) {
  if (inp.tagName !== 'INPUT' && inp.tagName !== 'TEXTAREA') return true;
  try {
    const start = inp.selectionStart ?? 0;
    const end = inp.selectionEnd ?? 0;
    const len = (inp.value || '').length;
    return start === 0 && (end === 0 || end === len);
  } catch (_) {
    return true;
  }
}

function isCaretAtEnd(inp) {
  if (inp.tagName !== 'INPUT' && inp.tagName !== 'TEXTAREA') return true;
  try {
    const start = inp.selectionStart ?? 0;
    const end = inp.selectionEnd ?? 0;
    const len = (inp.value || '').length;
    return (start === len && end === len) || (start === 0 && end === len);
  } catch (_) {
    return true;
  }
}

function findTableVerticalNeighbor(currentInput, direction) {
  const currentTr = currentInput.closest('tr');
  if (!currentTr) return null;
  const tbody = currentTr.closest('tbody');
  if (!tbody) return null;

  const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => r.offsetParent !== null && !r.closest('.d-none'));
  const currentIdx = rows.indexOf(currentTr);
  if (currentIdx === -1) return null;

  const targetIdx = direction === 'down' ? currentIdx + 1 : currentIdx - 1;
  if (targetIdx < 0 || targetIdx >= rows.length) return null;

  const targetTr = rows[targetIdx];
  const fieldName = currentInput.dataset?.f;
  if (fieldName) {
    const match = targetTr.querySelector(`[data-f="${fieldName}"]:not([readonly]):not([disabled])`);
    if (match && match.offsetParent !== null) return match;
  }

  const fallback = targetTr.querySelector('input:not([readonly]):not([disabled]), button:not([disabled]), select:not([disabled])');
  if (fallback && fallback.offsetParent !== null) return fallback;

  return null;
}

function initEnterKeyNavigation() {
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented) return;

    const key = e.key;
    if (key !== 'Enter' && key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'ArrowRight' && key !== 'ArrowLeft') {
      return;
    }

    const appShell = $('appShell');
    const isLogin = !appShell || appShell.classList.contains('d-none');
    const container = isLogin ? $('loginScreen') : (document.querySelector('.view.show') || document.body);
    if (!container) return;

    const target = e.target;
    const isInput = target && target.tagName === 'INPUT';
    const isSelect = target && target.tagName === 'SELECT';
    const isTextarea = target && target.tagName === 'TEXTAREA';
    const isButton = target && target.tagName === 'BUTTON';
    const isInteractive = isInput || isSelect || isTextarea || isButton;

    // 1. If NO form field is currently focused (focus on body or topNav tab),
    // pressing Enter or Down Arrow immediately focuses the first element in the active tab!
    if (!isInteractive || target.closest('#topNav') || target.tagName === 'BODY') {
      if (key === 'Enter' || key === 'ArrowDown') {
        e.preventDefault();
        const curView = document.querySelector('.view.show');
        const viewId = curView ? curView.id.replace('view-', '') : '';
        focusFirstFieldInView(viewId);
      }
      return;
    }

    // 2. In Textarea: Shift+Enter or Ctrl+Enter inserts a new line. Plain Enter moves to next field.
    if (isTextarea && key === 'Enter' && (e.shiftKey || e.ctrlKey || e.altKey)) {
      return;
    }

    // 3. For buttons: If Enter is pressed, let action buttons click normally.
    if (isButton && key === 'Enter') {
      return; // native click execution
    }

    // 4. For <select>: Up/Down arrow changes the option natively. Only Enter moves to next field.
    if (isSelect && (key === 'ArrowDown' || key === 'ArrowUp')) {
      return; // native select behavior
    }

    const fields = getViewNavElements(container);
    const currentIndex = fields.indexOf(target);
    if (currentIndex === -1) return;

    // ----------------------------------------------------
    // ENTER or ARROW DOWN: Move Forward / Down
    // ----------------------------------------------------
    if ((key === 'Enter' && !e.shiftKey) || key === 'ArrowDown') {
      // In tables (like editor parameters, pending table, done table), ArrowDown navigates to row below
      if (key === 'ArrowDown') {
        const neighbor = findTableVerticalNeighbor(target, 'down');
        if (neighbor) {
          e.preventDefault();
          focusElement(neighbor);
          return;
        }
      }

      e.preventDefault();
      if (currentIndex < fields.length - 1) {
        const next = fields[currentIndex + 1];
        focusElement(next);
      } else {
        // Reached end of form: focus primary button if not already there
        const primaryBtn = container.querySelector('button.btn-primary, button[type="submit"], #rgSubmit, #saveBtn, #edComplete');
        if (primaryBtn && primaryBtn !== target) {
          focusElement(primaryBtn);
        }
      }
      return;
    }

    // ----------------------------------------------------
    // SHIFT + ENTER or ARROW UP: Move Backward / Up
    // ----------------------------------------------------
    if ((key === 'Enter' && e.shiftKey) || key === 'ArrowUp') {
      // In tables, ArrowUp navigates to row above
      if (key === 'ArrowUp') {
        const neighbor = findTableVerticalNeighbor(target, 'up');
        if (neighbor) {
          e.preventDefault();
          focusElement(neighbor);
          return;
        }
      }

      e.preventDefault();
      if (currentIndex > 0) {
        const prev = fields[currentIndex - 1];
        focusElement(prev);
      }
      return;
    }

    // ----------------------------------------------------
    // ARROW RIGHT: Move to next field to the right
    // ----------------------------------------------------
    if (key === 'ArrowRight') {
      if (isCaretAtEnd(target) || isButton || isSelect) {
        if (currentIndex < fields.length - 1) {
          e.preventDefault();
          focusElement(fields[currentIndex + 1]);
        }
      }
      return;
    }

    // ----------------------------------------------------
    // ARROW LEFT: Move to previous field to the left
    // ----------------------------------------------------
    if (key === 'ArrowLeft') {
      if (isCaretAtStart(target) || isButton || isSelect) {
        if (currentIndex > 0) {
          e.preventDefault();
          focusElement(fields[currentIndex - 1]);
        }
      }
      return;
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
