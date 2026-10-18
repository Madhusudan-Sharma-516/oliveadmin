/* ==========================================================================
   Page Module: Users & Logins (Admin)
   System accounts CRUD, role assignments, and authentication credentials
   ========================================================================== */

function renderUsers() {
  const usersTable = $('usersTable');
  if (!usersTable) return;

  usersTable.innerHTML = users.map((u, i) => `
    <tr>
      <td><code class="fs-6">${esc(u.name)}</code></td>
      <td><code class="fs-6">${esc(u.pass)}</code></td>
      <td><span class="badge bg-secondary text-capitalize">${esc(u.role)}</span></td>
      <td class="text-end">
        ${u.name === 'admin' 
          ? '<span class="badge text-bg-light border text-muted">Primary Admin</span>' 
          : `<button class="btn btn-sm btn-outline-danger" onclick="delUser(${i})"><i class="bi bi-trash"></i></button>`}
      </td>
    </tr>
  `).join('');
}

window.delUser = i => {
  if (confirm(`Delete user "${users[i]?.name}"?`)) {
    users.splice(i, 1);
    store('users', users);
    renderUsers();
    toast('User deleted');
  }
};

function initUsersManager() {
  const userForm = $('userForm');
  if (userForm) {
    userForm.onsubmit = e => {
      e.preventDefault();
      const uNameEl = $('uName');
      const uPassEl = $('uPass');
      const uRoleEl = $('uRole');

      const name = (uNameEl?.value || '').trim();
      const pass = (uPassEl?.value || '').trim();
      const role = uRoleEl?.value || 'receptionist';

      if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        return toast('Username already exists');
      }

      users.push({ name, pass, role });
      store('users', users);
      userForm.reset();
      renderUsers();
      toast('User added');
    };
  }
}

initUsersManager();
