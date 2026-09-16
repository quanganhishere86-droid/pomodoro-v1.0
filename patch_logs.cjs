const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/console\.log\('Audio play prevented:', e\);/g, "console.error('Audio play prevented:', e);");
code = code.replace(/console\.log\("Browser blocked notification, falling back to alert", e\);/g, "console.error('Browser blocked notification, falling back to alert', e);");

fs.writeFileSync('src/App.tsx', code);
console.log('patched logs');
