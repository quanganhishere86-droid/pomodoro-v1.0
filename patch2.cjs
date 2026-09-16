const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/;
const replace = `            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="w-full text-center mt-6 pb-4">
          <p className="text-white/80 text-[11px] font-semibold tracking-wide drop-shadow-md">
            Copyright &copy; 2026 Pomofruti. Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}`;

if (regex.test(code)) {
  code = code.replace(regex, replace);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched');
} else {
  console.log('not found');
}
