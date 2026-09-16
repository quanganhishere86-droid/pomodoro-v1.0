const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove unused albumArt import
code = code.replace("import albumArt from './assets/images/frutiger_aero_album_art_1789057557691.jpg';\n", "");

// Remove image upload comment
code = code.replace("// To use an uploaded image, ensure it is in the /src/assets/images folder and import it here:\n", "");

// Remove verbose explanatory comments
code = code.replace("  // Background music state (YouTube)\n", "");
code = code.replace("  // Sound effect for when the timer ends\n", "");
code = code.replace("    // A pleasant chime/bell sound for when a timer completes\n", "");
code = code.replace("  // Request Notification permission\n", "");
code = code.replace("    // Fallback to standard alert if notifications are disabled/denied\n", "");
code = code.replace("  // Background bubbles generator\n", "");
code = code.replace("  // If it's not the active mode, we want the ring to look full (0 progress).\n", "");

fs.writeFileSync('src/App.tsx', code);
console.log('patched');
