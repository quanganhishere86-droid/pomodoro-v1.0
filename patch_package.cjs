const fs = require('fs');
let config = JSON.parse(fs.readFileSync('package.json', 'utf8'));

config.build.nsis.include = "public/installer.nsh";

// Also add a setting to force electron-builder to wait or close processes robustly 
// (electron-builder defaults to using `nsExec` in `installer.nsh`, which we just provided)
// Let's also ensure `guid` is set explicitly if it helps, but appId is enough.

fs.writeFileSync('package.json', JSON.stringify(config, null, 2));
console.log('patched package.json');
