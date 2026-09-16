const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

code = code.replace(/      \/\/ HMR is disabled in AI Studio via DISABLE_HMR env var.\n/g, "");
code = code.replace(/      \/\/ Do not modify[^\n]+flickering during agent edits.\n/g, "");
code = code.replace(/      \/\/ Disable file watching when DISABLE_HMR is true to save CPU during agent edits.\n/g, "");

fs.writeFileSync('vite.config.ts', code);
console.log('patched vite');
