const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { createPortal }")) {
  code = code.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { createPortal } from 'react-dom';");
}

const searchModal = `        {/* Start Confirm Modal */}
        {showStartConfirm && (
          <>
            {/* Fullscreen Blur Overlay (Transparent) */}
            <div className="fixed inset-0 z-[9998] bg-black/5 backdrop-blur-[15px] transition-all"></div>
            
            {/* Clear Confirmation Dialog */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <div className="aero-panel p-8 rounded-[32px] max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden pointer-events-auto">
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-white/40 pointer-events-none rounded-[32px] shadow-[inset_0_1px_3px_rgba(255,255,255,0.9)]"></div>
                
                <div className="relative z-10 flex items-center justify-center mb-4 bg-transparent">
                  <CheckSquare size={48} className="text-yellow-600 drop-shadow-md" />
                </div>
                <h2 className={\`relative z-10 text-xl font-bold mb-2 \${t.text}\`}>Are you sure to start the timer?</h2>
                <p className={\`relative z-10 mb-8 font-medium text-sm \${t.textLight}\`}>You didn't write task.</p>
                
                <div className="relative z-10 flex gap-4 w-full">
                  <button 
                    onClick={() => setShowStartConfirm(false)}
                    className="flex-1 aero-btn px-6 py-3 rounded-xl font-bold text-slate-600 transition-all shadow-sm hover:bg-white/80"
                  >
                    No
                  </button>
                  <button 
                    onClick={() => {
                      setShowStartConfirm(false);
                      executeToggleTimer();
                    }}
                    className={\`flex-1 aero-btn-primary px-6 py-3 rounded-xl font-bold transition-all shadow-md\`}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </>
        )}`;

const replaceModal = `        {/* Start Confirm Modal */}
        {showStartConfirm && createPortal(
          <>
            {/* Fullscreen Blur Overlay (Transparent) */}
            <div 
              className="fixed top-0 left-0 right-0 bottom-0 z-[99998] bg-black/5 transition-all"
              style={{ width: '100vw', height: '100dvh', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
            ></div>
            
            {/* Clear Confirmation Dialog */}
            <div 
              className="fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center p-4 pointer-events-none"
              style={{ width: '100vw', height: '100dvh' }}
            >
              <div className="aero-panel p-8 rounded-[32px] max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden pointer-events-auto">
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-white/40 pointer-events-none rounded-[32px] shadow-[inset_0_1px_3px_rgba(255,255,255,0.9)]"></div>
                
                <div className="relative z-10 flex items-center justify-center mb-4 bg-transparent">
                  <CheckSquare size={48} className="text-yellow-600 drop-shadow-md" />
                </div>
                <h2 className={\`relative z-10 text-xl font-bold mb-2 \${t.text}\`}>Are you sure to start the timer?</h2>
                <p className={\`relative z-10 mb-8 font-medium text-sm \${t.textLight}\`}>You didn't write task.</p>
                
                <div className="relative z-10 flex gap-4 w-full">
                  <button 
                    onClick={() => setShowStartConfirm(false)}
                    className="flex-1 aero-btn px-6 py-3 rounded-xl font-bold text-slate-600 transition-all shadow-sm hover:bg-white/80"
                  >
                    No
                  </button>
                  <button 
                    onClick={() => {
                      setShowStartConfirm(false);
                      executeToggleTimer();
                    }}
                    className={\`flex-1 aero-btn-primary px-6 py-3 rounded-xl font-bold transition-all shadow-md\`}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}`;

if (code.includes(searchModal)) {
  code = code.replace(searchModal, replaceModal);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched portal');
} else {
  console.log('not found modal');
}
