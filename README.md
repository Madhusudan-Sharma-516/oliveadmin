# Olive Diagnostic Raigarh — Project Structure & Developer Guide

इस प्रोजेक्ट को single-file mess से निकालकर एक clean, modular और page-wise folder structure में divide कर दिया गया है। अब हर page और feature की अपनी dedicated file है, जिससे code को maintain और edit करना बहुत आसान और clear है।

---

## 📁 Directory Structure Overview

```text
olive/
│
├── index.html                   # Main HTML layout & structured page views
├── style.css                    # Master stylesheet (imports modular CSS files)
├── app.monolithic.bak.js        # Legacy backup of original monolithic code
│
├── assets/
│   └── css/                     # Modular CSS styling by feature
│       ├── base.css             # Global variables, color palettes, reset & table styles
│       ├── layout.css           # App shell, responsive sidebar & topbar
│       ├── login.css            # Login screen & logo cards
│       ├── editor.css           # Report editor, parameter tables, chips & badges
│       └── print.css            # Thermal receipt & A4 pre-printed letterhead print/PDF rules
│
└── js/                          # Modular JavaScript logic
    ├── app.js                   # Master view router, navigation & app initialization
    │
    ├── config/                  # Static definitions, catalogs & templates
    │   ├── constants.js         # Clinic name, role-based sidebar menus
    │   ├── users-data.js        # Default user accounts (admin, receptionist, reporter)
    │   ├── tests-data.js        # Tests catalog & automatic migration helper
    │   ├── test-templates.js    # Haematology (CBC), Lipid Profile, Biochemistry, Urine templates
    │   └── remarks-data.js      # Standard Urine Analysis clinical remarks / phrases
    │
    ├── utils/                   # Reusable helpers & calculations
    │   ├── helpers.js           # DOM selector ($), load/store (localStorage), dates, toast
    │   └── range-checker.js     # Biological reference range evaluator (High / Low / Normal)
    │
    ├── services/                # Core domain services
    │   ├── state.js             # Central data state, doctor datalist sync & find helpers
    │   ├── print-service.js     # Receipt & Lab Report HTML generation & printing
    │   └── pdf-service.js       # html2pdf.js generation with loading overlay
    │
    └── pages/                   # Page-specific business logic & event handlers
        ├── auth.js              # Login, logout, session persistence & permission check
        ├── register.js          # [View: Add Patient] Receptionist registration & recent list
        ├── receipt.js           # [View: New Custom Report] Billing, test selection & advance
        ├── pending.js           # [View: Pending Reports] Queue for reporters
        ├── done.js              # [View: Completed Reports] Ready reports list
        ├── editor.js            # [View: Report Editor] Parameters entry, auto-formulas & shortcuts
        ├── saved.js             # [View: All Receipts] Searchable receipt history & reprints
        ├── tests.js             # [View: Manage Tests] Price configuration & add/edit tests
        └── users.js             # [View: Users & Logins] Admin credentials & accounts
```

---

## 🧭 किस Page का Code कहाँ है? (Quick Reference)

| Page / Feature | View ID in HTML | JavaScript Module | CSS File |
| :--- | :--- | :--- | :--- |
| **Login / Logout** | `#loginScreen` | `js/pages/auth.js` | `assets/css/login.css` |
| **Add Patient (Receptionist)** | `#view-register` | `js/pages/register.js` | `assets/css/editor.css` |
| **New Custom Report (Billing)** | `#view-receipt` | `js/pages/receipt.js` | `assets/css/layout.css` |
| **Pending Reports Queue** | `#view-pending` | `js/pages/pending.js` | `assets/css/base.css` |
| **Completed Reports** | `#view-done` | `js/pages/done.js` | `assets/css/base.css` |
| **Report Editor (Parameters & Formulas)** | `#view-editor` | `js/pages/editor.js` | `assets/css/editor.css` |
| **All Receipts & Search** | `#view-saved` | `js/pages/saved.js` | `assets/css/base.css` |
| **Manage Tests & Pricing** | `#view-tests` | `js/pages/tests.js` | `assets/css/base.css` |
| **Manage Users & Passwords** | `#view-users` | `js/pages/users.js` | `assets/css/base.css` |
| **Receipt & Report Printing / PDF** | `#printArea` | `js/services/print-service.js`, `js/services/pdf-service.js` | `assets/css/print.css` |

---

## ⌨️ Desktop Keyboard Shortcut Keys (F1 – F7)

डेस्कटॉप सॉफ़्टवेयर की तरह सभी मुख्य टैब्स को कीबोर्ड के **Function Keys** से तुरंत एक्सेस किया जा सकता है:

| Shortcut Key | Tab / Feature Name | Description |
| :---: | :--- | :--- |
| <kbd>F1</kbd> | **Add Patient** | नए मरीज का पंजीकरण (Receptionist / Admin) |
| <kbd>F2</kbd> | **New Custom Report** | नया कस्टम रिपोर्ट बिलिंग और टेस्ट सिलेक्शन |
| <kbd>F3</kbd> | **Pending Reports** | रिपोर्टर की पेंडिंग रिपोर्ट लिस्ट |
| <kbd>F4</kbd> | **Completed Reports** | तैयार रिपोर्ट्स की सूची |
| <kbd>F5</kbd> | **All Receipts** | सभी रसीदों का खोज और विवरण |
| <kbd>F6</kbd> | **Manage Tests** | टेस्ट कैटलॉग और मूल्य सूची प्रबंधन |
| <kbd>F7</kbd> | **Users & Logins** | एडमिन यूजर क्रेडेंशियल्स |
| <kbd>Esc</kbd> | **Back to Queue** | रिपोर्ट एडिटर में रहते हुए वापस पेंडिंग सूची पर जाने के लिए |

> [!TIP]
> ये शॉर्टकट कीज आप कहीं भी, यहाँ तक कि फॉर्म भरते समय भी दबा सकते हैं। ब्राउज़र का डिफ़ॉल्ट एक्शन (जैसे F1 हेल्प या F5 रिफ्रेश) ब्लॉक करके तुरंत वही स्क्रीन खुल जाएगी।

---

## 🛠️ काम कैसे करना है? (How to work / edit)

1. **नया Test Template जोड़ना या बदलना हो:**
   - फ़ाइल खोलें: `js/config/test-templates.js`
   - यहाँ `haematology`, `lipid`, `biochemistry`, `urine` आदि के items, normal ranges और units structured object में दिए गए हैं।

2. **Report Editor में कोई फ़ॉर्मूला बदलना हो:**
   - फ़ाइल खोलें: `js/pages/editor.js`
   - `calculateLipidProfile()` और `calculateBiochemistry()` फ़ंक्शंस यहीं मौजूद हैं।

3. **Patient Registration फॉर्म में कोई फ़ील्ड बढ़ानी हो:**
   - HTML: `index.html` के `<!-- VIEW 1: RECEPTIONIST -->` सेक्शन में input जोड़ें।
   - JS: `js/pages/register.js` में submit handler को अपडेट करें।

4. **Print / PDF की styling या Letterhead margins ठीक करनी हों:**
   - फ़ाइल खोलें: `assets/css/print.css`
   - `@media print` और `#pdfRenderWrap .report-page` के अंदर padding और layout आसानी से adjust कर सकते हैं।

---

## 🚀 How to Run

- **Direct Open**: आप सीधे `index.html` को double-click करके किसी भी browser (Chrome, Edge) में खोल सकते हैं।
- **Local Server**: या फिर VS Code Live Server / Python server चला सकते हैं:
  ```bash
  python -m http.server 8080
  ```
  और ब्राउज़र में `http://localhost:8080` खोलें।
