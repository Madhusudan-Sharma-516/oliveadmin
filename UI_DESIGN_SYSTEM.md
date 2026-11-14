# UI/UX Architecture & Implementation Principles
## High-Speed Desktop Diagnostic & ERP Systems (Windows 7 Aero Blue Specification)

> **Document Type:** AI Prompt Ruleset / System Prompt Slot / Technical Implementation Specification  
> **Application Context:** Clinical Diagnostic, Pathology Lab, Billing & Data-Entry ERP Software  
> **Target Environment:** Desktop-First Web Application (Chrome, Edge, PWA, Electron)  

---

## 1. Visual Design Philosophy & Color Palette

### 1.1 Anti-Fatigue Calm Palette (No Harsh Whites, No Jarring Neons)
Operators and laboratory technicians spend 8–12 continuous hours on this interface. High contrast pure-white backgrounds cause eye strain, while dark mode often interferes with document/print preview fidelity.

* **Body Canvas Background:** Soft ice-blue gradient:
  ```css
  background: var(--body-bg, #e2ecf5);
  background-image: linear-gradient(180deg, #e8f1f8 0%, #d8e6f3 100%);
  background-attachment: fixed;
  ```
* **Fixed Desktop Shell Header & Ribbon:** Windows 7 Aero Glass Deep Prussian Navy:
  ```css
  background: linear-gradient(180deg, #0e2a3f 0%, #071927 100%);
  border-bottom: 1px solid #144970;
  box-shadow: 0 3px 12px rgba(5, 20, 35, 0.32);
  ```
* **Card & Form Containers:** Pure crisp white `#ffffff` with subtle soft blue border `#b6d2e9` and delicate drop shadows:
  ```css
  border: 1px solid #b6d2e9;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(16, 50, 76, 0.08);
  ```
* **Text & Typography:** High-legibility slate navy `#10324c` and deep charcoal `#1e293b`.
* **State Badges:**
  - Active/Saved: `#dcfce7` (border `#86efac`, text `#166534`)
  - Warning/Pending Draft: `#fef3c7` (border `#fcd34d`, text `#92400e`)
  - Abnormal Out-of-Range: High-contrast clinical crimson `#b91c1c` with bold `H` / `L` indicator.

### 1.2 Pinned Top Unit (Zero Layout Shift)
The top navigation (Logo, Live Clock, User Profile, Function-Key Ribbon) MUST remain permanently pinned:
```css
.desktop-top-fixed-bar {
  position: sticky;
  top: 0;
  z-index: 1040;
  width: 100%;
}
```
View routing changes page content smoothly underneath without unmounting or flickering the top bar.

---

## 2. Keyboard-First "Tally ERP" Operator Ergonomics

Medical data entry speed is 3x faster when the operator never needs to touch the mouse.

### 2.1 Universal Field Traversal
* **`Enter` or `ArrowDown`:** Commit current shortcut and advance to next vertical parameter input.
* **`Shift + Enter` or `ArrowUp`:** Move back to previous vertical parameter input.
* **`ArrowLeft` / `ArrowRight`:** Traverse horizontally between parameter fields on the same row (only when caret is at text edge or fully selected).
* **Auto-Select on Focus:** When entering an input field, automatically select all existing content (`inp.select()`) so operators can either overwrite instantly or press Enter to keep default.

### 2.2 Smooth Centered Auto-Scrolling
When filling multi-row reports (e.g., 20 to 50 parameters), standard `scrollIntoView({ block: 'nearest' })` fails because the active input stays near the bottom edge obscured by toolbars.
**Mandatory Implementation Pattern:**
```javascript
function focusAndSelectInput(inp) {
  if (!inp) return;
  // 1. Prevent default instant browser jump
  try {
    inp.focus({ preventScroll: true });
  } catch (err) {
    inp.focus();
  }
  // 2. Select content for instantaneous overwrite
  try { inp.select(); } catch (err) { }
  // 3. Smoothly center active input vertically row-by-row
  try {
    inp.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
  } catch (err) {
    inp.scrollIntoView(false);
  }
}
```

### 2.3 Desktop Function Keys (<kbd>F1</kbd> – <kbd>F7</kbd>)
* `F1` – Add Patient (Reception)
* `F2` – New Custom Report / Billing
* `F3` – Pending Reports Queue
* `F4` – Completed Reports
* `F5` – All Saved Receipts & Search
* `F6` – Manage Tests & Pricing
* `F7` – Users & Permissions
* `Escape` – Safely auto-save draft and exit Editor back to Pending queue.

---

## 3. High-Speed Micro-Shortcuts (Single-Keystroke Expansions)

All shortcuts trigger on `Enter`, `Tab`, `ArrowDown`, `ArrowUp`, or `blur`. They auto-convert shorthand into standardized medical uppercase labels without requiring dropdown selection:

| Target Parameter | Trigger Shorthand | Auto-Expanded Value |
| :--- | :--- | :--- |
| **Any Field Globally** | `z` / `Z` | `NIL` |
| **Blood RH Factor** | `p` / `pos` / `+` | `POSITIVE` |
| | `n` / `neg` / `-` | `NEGATIVE` |
| **Stool Consistency** | `ss` / `semi solid` | `SEMI SOLID` |
| | `py` | `PALE YELLOW` |
| | `s` | `SOLID` |
| | `l` | `LOOSE` |
| | `w` | `WATERY` |
| **Stool / Urine Color** | `y` / `yl` / `yellowis` / `yellowish` | `YELLOWISH` |
| | `b` / `br` / `brown` / `brownish` | `BROWNISH` |
| | `py` | `PALE YELLOW` |
| | `r` | `REDDISH` |
| | `n` | `NORMAL` |
| | `g` | `GREENISH` |
| **Urine Appearance** | `c` / `cl` / `clear` | `CLEAR` |
| | `s` / `sh` / `slight` / `slightly hazy` | `SLIGHTLY HAZY` |
| | `h` / `hz` / `hazy` | `HAZY` |
| | `t` / `tb` / `turbid` | `TURBID` |
| **Urine Reaction (pH)**| `a` / `ac` / `acid` / `acidic` | `ACIDIC` |
| | `al` / `alk` / `alkaline` | `ALKALINE` |
| | `n` / `neu` / `neutral` | `NEUTRAL` |
| **Mucus** | `p` | `PRESENT` |
| | `a` | `ABSENT` |
| **Lab Remark** | `n` | `NORMAL` |

---

## 4. Continuous Local-First Persistence (Zero Data Loss)

Diagnostic applications must never lose entered measurements due to power cuts, accidental tab close, or browser refresh.

1. **Real-Time Debounced Auto-Save (600ms):**
   - Every `input` or `change` event in the editor triggers a 600ms debounced auto-save.
   - Automatically serializes all DOM inputs into the central `editorState` and calls `persist()`.
2. **Exit Lifecycle Hook Safety:**
   - Clicking `Back` button, pressing `Escape`, switching views with `F1-F7`, or `window.beforeunload` triggers an immediate synchronous `saveEditor()` call.
3. **Queue State Transition:**
   - New registration: `status: 'pending'`.
   - Editing in progress: Saved under `r.results` with visual indicator:
     - 🟡 **Draft in Progress** in Pending queue with `Resume Report` button.
     - 🟢 **Saved Locally (HH:MM:SS)** live badge in Editor header.
   - On clicking `Save & Mark Completed`: `status: 'done'`, moving report to Completed list.

---

## 5. Print & PDF Architecture (Pre-Printed Letterhead A4 Paper)

Clinical reports are printed directly onto clinics' pre-printed stationery letterhead.

### 5.1 Letterhead Safe Zones
* **Page Dimensions:** A4 portrait (210mm x 297mm / 794px x 1120px at 96 DPI).
* **Header Clearance (Top Margin):** `46mm` (~`175px` / ~`15.5%`) to clear the clinic's embossed letterhead logo and doctor panel.
* **Footer Clearance (Bottom Margin):** `35mm` (~`135px` / ~`11.8%`) to stay above clinic footer address/phone lines.
* **Side Margins:** `15mm` left and right.

### 5.2 Strict Pagination & Layout Stability
* **Multi-Page Partitioning:** Large comprehensive panels (like Form 21) are strictly partitioned into discrete pages:
  - Page 1: Haematology
  - Page 2: Biochemistry & Lipid Profile (with Reference Range Matrix)
  - Page 3: Urine Analysis (with Centrifuged Sediment Protocol Note)
  - Page 4: Serology & Stool Examination
* **Fixed Column Width Alignment:**
  To guarantee that headers and table columns line up pixel-perfect across all browsers and print drivers:
  ```html
  <table style="width: 100%; table-layout: fixed; font-size: 13px; border-collapse: collapse;">
    <col style="width: 44%;">
    <col style="width: 18%;">
    <col style="width: 16%;">
    <col style="width: 22%;">
  ```
* **Font Sizing for Legibility & Fit:**
  - Table Header & Parameter Rows: `13px` with line-height `1.48` and row padding `2.8px 0`.
  - Category Headers: `13px` bold underlined.
  - Section Title: `14.5px` bold underlined centered.
  - Ensures up to 16–20 parameter rows + tables fit on one A4 sheet without spilling over.

### 5.3 Signature Block Rendering
* Doctor signature images must be placed directly above the doctor's name and designation:
  ```html
  <img src="signature.jpg" style="max-height: 46px; max-width: 140px; object-fit: contain; mix-blend-mode: multiply;" />
  <b>Dr. Hanish Kumar Chawda, MBBS, MD</b><br>
  <span style="font-size: 11px;">Pathologist, Olive Diagnostics, Raigarh</span>
  ```
* `mix-blend-mode: multiply` eliminates white JPEG bounding boxes, seamlessly blending signatures onto pre-printed stationery.

---

## 6. Real-Time Laboratory Calculation Engines

* **Friedewald Formula for Lipid Profile:**
  - $\text{VLDL} = \frac{\text{Triglycerides}}{5}$
  - $\text{LDL} = \text{Total Cholesterol} - \text{HDL} - \text{VLDL}$
  - $\text{Total:HDL Ratio} = \frac{\text{Total Cholesterol}}{\text{HDL}}$
* **Widal Test Matrix (Slide / Tube Agglutination):**
  - Interactive grid for antigens: *S. Typhi 'O'*, *S. Typhi 'H'*, *S. Paratyphi 'AH'*, *S. Paratyphi 'BH'*.
  - Dilutions: `1:20`, `1:40`, `1:80`, `1:160`, `1:320`.
  - Automated diagnostic impression deduction based on significant titre cutoffs ($\ge 1:80$ for O, $\ge 1:160$ for H).

---

## 7. Golden Rules for Future AI Implementations

When generating or modifying UI components in this ecosystem:
1. **Never introduce blocking modals** for standard parameter entry. All editing happens inline in table grids.
2. **Never break keyboard navigation.** Every new input must support `Enter`/`Arrow` traversal.
3. **Never hardcode absolute screen pixel heights** that break print pagination.
4. **Always sanitize inputs with `esc()`** before inserting into HTML templates.
5. **Always preserve relative paths (`./`)** for assets to ensure 100% portability on GitHub Pages, PWA, and desktop wrappers.
