const mod = require('google-spreadsheet');

console.log('[STEP1] typeof mod:', typeof mod);
console.log('[STEP2] Object.keys(mod):', Object.keys(mod));
console.log('[STEP3] typeof mod.default:', typeof mod.default);
console.log('[STEP4] Object.keys(mod.default):', mod.default ? Object.keys(mod.default) : 'N/A');

const GoogleSpreadsheet = mod.default || mod.GoogleSpreadsheet;
console.log('[STEP5] typeof GoogleSpreadsheet:', typeof GoogleSpreadsheet);
console.log('[STEP6] Prototype methods:', Object.getOwnPropertyNames(GoogleSpreadsheet.prototype));
