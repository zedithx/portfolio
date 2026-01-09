'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function TerminalInput({ 
    isDark, 
    input, 
    inputRef, 
    measureRef, 
    cursorPosition, 
    onInputChange, 
    onKeyDown 
}) {
    return (
        <div className="flex items-center gap-2">
            <span className={`font-medium text-[14px] sm:text-sm whitespace-nowrap leading-5 shrink-0 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                <span className="hidden sm:inline">(base) zedithx@Yangs-Macbook-Pro ~ %</span>
                <span className="sm:hidden">(base) zedithx@Macbook ~ %</span>
            </span>
            <div className="flex-1 min-w-0 relative flex items-center h-5">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    onFocus={(e) => {
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            const terminalEl = e.target.closest('[class*="fixed"]') || e.target.closest('.fixed');
                            if (terminalEl) {
                                const computedLeft = window.getComputedStyle(terminalEl).left;
                                if (computedLeft && computedLeft !== 'auto') {
                                    terminalEl.style.setProperty('left', computedLeft, 'important');
                                }
                            }
                        }
                    }}
                    className={`flex-1 bg-transparent outline-none text-[14px] sm:text-sm leading-5 h-5 font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ caretColor: 'transparent', maxWidth: '100%' }}
                    spellCheck={false}
                    autoComplete="off"
                />
                <span
                    ref={measureRef}
                    className="absolute invisible text-[14px] sm:text-sm leading-5 whitespace-pre font-mono"
                    style={{ left: 0 }}
                >
                    {input}
                </span>
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className={`absolute w-1.5 h-4 sm:w-2 sm:h-5 ${isDark ? 'bg-white/80' : 'bg-gray-900/80'}`}
                    style={{ 
                        left: `${cursorPosition}px`,
                        marginLeft: '2px'
                    }}
                />
            </div>
        </div>
    );
}
