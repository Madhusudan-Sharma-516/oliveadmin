/* ==========================================================================
   Helper Utilities
   ========================================================================== */

// DOM Selector Shortcut
const $ = id => document.getElementById(id);

// LocalStorage Persistence Helpers
const load = (k, d) => {
  try {
    const item = localStorage.getItem(k);
    return item ? JSON.parse(item) : d;
  } catch (e) {
    console.error(`Error loading key "${k}" from localStorage:`, e);
    return d;
  }
};

const store = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    console.error(`Error storing key "${k}" to localStorage:`, e);
  }
};

// Date & Time Helpers
const today = () => new Date().toISOString().slice(0, 10);

const fmtDate = d => {
  if (!d) return '';
  return d.split('-').reverse().join('-');
};

const fmtTime = t => {
  if (!t) return '';
  let [h, m] = t.split(':');
  const ap = Number(h) >= 12 ? 'PM' : 'AM';
  h = Number(h) % 12 || 12;
  return `${h}:${m} ${ap}`;
};

// HTML Escaping to prevent XSS
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

// Toast Notification
function toast(msg) {
  const toastMsg = $('toastMsg');
  const toastEl = $('toast');
  if (!toastMsg || !toastEl) return;
  toastMsg.textContent = msg;
  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 }).show();
}
