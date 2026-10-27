/* ==========================================================================
   Page Module: Authentication & Desktop Top-Navigation Initialization
   Handles login, logout, top horizontal ribbon tabs, and user session
   ========================================================================== */

function initAuth() {
  const loginForm = $('loginForm');
  const logoutBtn = $('logoutBtn');

  if (loginForm) {
    loginForm.onsubmit = e => {
      e.preventDefault();
      const loginUserEl = $('loginUser');
      const loginPassEl = $('loginPass');
      const loginErrEl = $('loginErr');

      const name = (loginUserEl?.value || '').trim().toLowerCase();
      const pass = loginPassEl?.value || '';
      const u = users.find(x => x.name.toLowerCase() === name);

      if (!u || u.pass !== pass) {
        if (loginErrEl) loginErrEl.classList.remove('d-none');
        return;
      }

      if (loginErrEl) loginErrEl.classList.add('d-none');
      user = { name: u.name, role: u.role };
      sessionStorage.setItem('user', JSON.stringify(user));
      startApp();
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      sessionStorage.removeItem('user');
      location.reload();
    };
  }
}

function startApp() {
  $('loginScreen')?.classList.add('d-none');
  $('appShell')?.classList.remove('d-none');

  const whoami = $('whoami');
  if (whoami && user) {
    whoami.textContent = `${user.name} (${user.role})`;
  }

  // Filter accessible menus by role
  const keys = Object.keys(MENUS).filter(k => MENUS[k][2].includes(user?.role));

  // Render tabs into top horizontal ribbon
  const topNav = $('topNav') || $('sideNav');
  if (topNav) {
    topNav.innerHTML = keys.map((k, idx) => `
      <a class="nav-link" data-view="${k}" id="nav-${k}" title="Shortcut: Press F${idx + 1} to open">
        <span>${MENUS[k][0]}</span>
        <span class="badge bg-warning text-dark ms-1 d-none" id="badge-${k}"></span>
      </a>
    `).join('');

    topNav.querySelectorAll('a').forEach(a => {
      a.onclick = () => show(a.dataset.view);
    });
  }

  const sideNav = $('sideNav');
  if (sideNav && sideNav !== topNav) {
    sideNav.innerHTML = topNav.innerHTML;
  }

  if (keys.length > 0) {
    show(keys[0]);
  }
}

initAuth();
