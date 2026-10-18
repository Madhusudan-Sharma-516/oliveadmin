/* ==========================================================================
   Application Constants & Menu Configurations
   ========================================================================== */

const CLINIC = 'Olive Diagnostic Raigarh';

// Menu mapping: key -> [Label, Bootstrap Icon, Allowed Roles]
const MENUS = {
  register: ['Add Patient', 'bi-person-plus', ['receptionist']],
  receipt: ['New Custom Report', 'bi-plus-square', ['admin', 'reporter']],
  pending: ['Pending Reports', 'bi-hourglass-split', ['admin', 'reporter']],
  done: ['Completed Reports', 'bi-patch-check', ['admin', 'reporter']],
  saved: ['All Receipts', 'bi-folder2-open', ['admin', 'reporter']],
  tests: ['Manage Tests', 'bi-list-check', ['admin', 'reporter']],
  users: ['Users & Logins', 'bi-people', ['admin']]
};
