const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">';
const replace = '<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-3xl transition-all">';

if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched z-index and blur');
} else {
  console.log('not found');
}
