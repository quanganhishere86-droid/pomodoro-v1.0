const fs = require('fs');
let code = fs.readFileSync('electron-main.cjs', 'utf8');

if (!code.includes("icon:")) {
  code = code.replace(
    /title: "Pomofruti",/,
    "title: \"Pomofruti\",\n    icon: path.join(app.getAppPath(), 'dist', 'icon.png'),"
  );
  fs.writeFileSync('electron-main.cjs', code);
  console.log("patched electron-main.cjs");
} else {
  console.log("already patched");
}
