/* ==========================================================================
   Range Checker Utility
   Evaluates numerical and qualitative test results against reference ranges
   Returns: 'normal' | 'low' | 'high' | 'abnormal'
   ========================================================================== */

function checkValueRange(valStr, rangeStr) {
  if (valStr === undefined || valStr === null || rangeStr === undefined || rangeStr === null) return 'normal';
  const rawVal = String(valStr).trim();
  const rawRng = String(rangeStr).trim();
  if (!rawVal || !rawRng) return 'normal';

  const v = parseFloat(rawVal.replace(/,/g, ''));
  if (isNaN(v)) {
    const uVal = rawVal.toUpperCase();
    const uRng = rawRng.toUpperCase();
    if (uRng === 'NIL' || uRng === 'NEGATIVE') {
      const normalTokens = ['NIL', 'NEGATIVE', 'NEG', '0', '-', 'CLEAR', 'ACIDIC', 'PALE YELLOW', 'NORMAL'];
      if (!normalTokens.includes(uVal)) {
        return 'abnormal';
      }
    }
    return 'normal';
  }

  // Check Range: "min - max" or "min to max"
  const rangeMatch = rawRng.match(/^([0-9.]+)\s*(?:-|to)\s*([0-9.]+)$/i);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (!isNaN(min) && v < min) return 'low';
    if (!isNaN(max) && v > max) return 'high';
    return 'normal';
  }

  // Check Range: "upto X" or "< X" or "<= X" or "below X"
  const maxMatch = rawRng.match(/^(?:upto|below|<|<=)\s*([0-9.]+)/i);
  if (maxMatch) {
    const max = parseFloat(maxMatch[1]);
    if (!isNaN(max) && v > max) return 'high';
    return 'normal';
  }

  // Check Range: "above X" or "> X" or ">= X"
  const minMatch = rawRng.match(/^(?:above|>|>=)\s*([0-9.]+)/i);
  if (minMatch) {
    const min = parseFloat(minMatch[1]);
    if (!isNaN(min) && v < min) return 'low';
    return 'normal';
  }

  return 'normal';
}
