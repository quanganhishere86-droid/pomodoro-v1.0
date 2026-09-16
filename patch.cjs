const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const search = `            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
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
if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched');
} else {
  console.log('not found');
  console.log(code.substring(code.length - 200));
}
