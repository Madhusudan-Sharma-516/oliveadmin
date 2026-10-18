/* ==========================================================================
   Page Module: Authentication & App Shell Navigation
   Handles login, logout, role-based navigation menus, and mobile sidebar
   ========================================================================== */

function initAuth() {
  const loginForm = $('loginForm');
  const logoutBtn = $('logoutBtn');
  const menuBtn = $('menuBtn');

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

  if (menuBtn) {
    menuBtn.onclick = () => {
      $('sidebar')?.classList.toggle('open');
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
  const sideNav = $('sideNav');
  if (sideNav) {
    sideNav.innerHTML = keys.map(k => `
      <a class="nav-link" data-view="${k}" id="nav-${k}">
        <i class="bi ${MENUS[k][1]}"></i>${MENUS[k][0]}
        <span class="badge bg-warning text-dark ms-2 d-none" id="badge-${k}"></span>
      </a>
    `).join('');

    sideNav.querySelectorAll('a').forEach(a => {
      a.onclick = () => show(a.dataset.view);
    });
  }

  if (keys.length > 0) {
    show(keys[0]);
  }
}

initAuth();
