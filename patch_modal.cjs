const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = `        {/* Footer */}`;
const replace = `        {/* Start Confirm Modal */}
        {showStartConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="aero-panel p-8 rounded-[32px] max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-white/40 pointer-events-none rounded-[32px] shadow-[inset_0_1px_3px_rgba(255,255,255,0.9)]"></div>
              
              <div className="relative z-10 w-16 h-16 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center mb-4 shadow-inner">
                <CheckSquare size={32} className="text-yellow-600 opacity-80" />
              </div>
              <h2 className={\`relative z-10 text-xl font-bold mb-2 \${t.text}\`}>Are you sure to start the timer?</h2>
              <p className={\`relative z-10 mb-8 font-medium text-sm \${t.textLight}\`}>You didn't write task.</p>
              
              <div className="relative z-10 flex gap-4 w-full">
                <button 
                  onClick={() => setShowStartConfirm(false)}
                  className="flex-1 aero-btn px-6 py-3 rounded-xl font-bold text-slate-600 transition-all shadow-sm hover:bg-white/80"
                >
                  no
                </button>
                <button 
                  onClick={() => {
                    setShowStartConfirm(false);
                    executeToggleTimer();
                  }}
                  className={\`flex-1 aero-btn-primary px-6 py-3 rounded-xl font-bold transition-all shadow-md\`}
                >
                  yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}`;

if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched modal');
} else {
  console.log('not found');
}
