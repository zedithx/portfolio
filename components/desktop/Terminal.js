'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const commands = [
    { name: 'background', description: 'Learn about who I am and my journey' },
    { name: 'projects', description: 'Browse through my portfolio of work' },
    { name: 'experience', description: 'View my professional experience' },
];

const Typewriter = ({ text, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        let timeout;
        if (delay > 0) {
            timeout = setTimeout(() => {
                let i = 0;
                const interval = setInterval(() => {
                    setDisplayedText(text.slice(0, i + 1));
                    i++;
                    if (i >= text.length) {
                        clearInterval(interval);
                        if (onComplete) onComplete();
                    }
                }, 30);
            }, delay);
        } else {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, 30);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

export default function Terminal({ onCommand }) {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);
    const showWelcomeRef = useRef(true);
    const [isAnimating, setIsAnimating] = useState(true);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    // Variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    // Resizing and Dragging state
    const [dimensions, setDimensions] = useState({ width: 850, height: 550, top: 100, left: 100 });
    const [isMounted, setIsMounted] = useState(false);
    const isResizing = useRef(false);
    const isDragging = useRef(false);
    const resizeType = useRef(null);
    const startPos = useRef({ x: 0, y: 0, w: 0, h: 0, t: 0, l: 0 });
    const dimensionsRef = useRef({ width: 850, height: 550, top: 100, left: 100 });

    useEffect(() => {
        setIsMounted(true);
        
        // Center the terminal on mount
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const isMobile = w < 768;
            
            if (isMobile) {
                const mobileDim = {
                    width: w * 0.95,
                    height: h * 0.7,
                    top: (h - h * 0.7) / 2,
                    left: (w - w * 0.95) / 2
                };
                setDimensions(mobileDim);
                dimensionsRef.current = mobileDim;
            } else {
                const desktopDim = {
                    width: Math.min(850, w * 0.8),
                    height: Math.min(550, h * 0.7),
                    top: (h - Math.min(550, h * 0.7)) / 2,
                    left: (w - Math.min(850, w * 0.8)) / 2
                };
                setDimensions(desktopDim);
                dimensionsRef.current = desktopDim;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        inputRef.current?.focus();

        const handleClear = () => {
            setHistory([]);
            setShowWelcome(true);
            showWelcomeRef.current = true;
            setIsAnimating(true);
            setTimeout(() => inputRef.current?.focus(), 50);
        };

        window.addEventListener('clear-terminal', handleClear);

        const handleMouseMove = (e) => {
            if (isResizing.current) {
                const dx = e.clientX - startPos.current.x;
                const dy = e.clientY - startPos.current.y;
                const newDim = { ...dimensionsRef.current };

                if (resizeType.current.includes('e')) {
                    newDim.width = Math.max(400, startPos.current.w + dx);
                }
                if (resizeType.current.includes('w')) {
                    const newWidth = Math.max(400, startPos.current.w - dx);
                    if (newWidth !== 400) {
                        newDim.width = newWidth;
                        newDim.left = startPos.current.l + dx;
                    }
                }
                if (resizeType.current.includes('s')) {
                    newDim.height = Math.max(300, startPos.current.h + dy);
                }
                if (resizeType.current.includes('n')) {
                    const newHeight = Math.max(300, startPos.current.h - dy);
                    if (newHeight !== 300) {
                        newDim.height = newHeight;
                        newDim.top = startPos.current.t + dy;
                    }
                }
                setDimensions(newDim);
                dimensionsRef.current = newDim;
            } else if (isDragging.current) {
                const dx = e.clientX - startPos.current.x;
                const dy = e.clientY - startPos.current.y;
                const newDim = {
                    ...dimensionsRef.current,
                    top: startPos.current.t + dy,
                    left: startPos.current.l + dx
                };
                setDimensions(newDim);
                dimensionsRef.current = newDim;
            }
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            isDragging.current = false;
            resizeType.current = null;
            document.body.style.cursor = 'default';
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('clear-terminal', handleClear);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const startResize = (type, e) => {
        if (window.innerWidth < 768) return;
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;
        resizeType.current = type;
        const rect = terminalRef.current.parentElement.getBoundingClientRect();
        startPos.current = {
            x: e.clientX,
            y: e.clientY,
            w: rect.width,
            h: rect.height,
            t: rect.top,
            l: rect.left
        };
        const cursor = type.includes('n') || type.includes('s') ? (type.includes('e') || type.includes('w') ? (type === 'nw' || type === 'se' ? 'nwse-resize' : 'nesw-resize') : 'ns-resize') : 'ew-resize';
        document.body.style.cursor = cursor;
    };

    const startDrag = (e) => {
        if (window.innerWidth < 768) return;
        if (e.target.closest('.title-bar-drag') || e.target === terminalRef.current) {
            isDragging.current = true;
            const rect = terminalRef.current.parentElement.getBoundingClientRect();
            startPos.current = {
                x: e.clientX,
                y: e.clientY,
                t: rect.top,
                l: rect.left
            };
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            const cmd = input.trim().toLowerCase();
            
            if (['background', 'projects', 'experience'].includes(cmd)) {
                setHistory(prev => [...prev, { type: 'input', content: input }, { type: 'success', content: `Opening ${cmd}...` }]);
                setShowWelcome(false);
                showWelcomeRef.current = false;
                setTimeout(() => onCommand(cmd), 300);
            } else {
                setHistory(prev => [...prev, { type: 'input', content: input }, { type: 'error', content: `Command not found: ${cmd}.` }]);
                setShowWelcome(false);
                showWelcomeRef.current = false;
            }
            
            setInput('');
        }
    };

    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onMouseDown={startDrag}
            className="fixed z-20 shadow-2xl rounded-xl overflow-hidden border border-white/10"
            style={{ 
                width: dimensions.width, 
                height: dimensions.height, 
                top: dimensions.top, 
                left: dimensions.left
            }}
        >
            {/* Custom Resize Handles */}
            <div className="absolute inset-0 pointer-events-none z-30">
                <div onMouseDown={(e) => startResize('n', e)} className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize pointer-events-auto" />
                <div onMouseDown={(e) => startResize('s', e)} className="absolute bottom-0 left-0 right-0 h-1.5 cursor-ns-resize pointer-events-auto" />
                <div onMouseDown={(e) => startResize('e', e)} className="absolute top-0 right-0 bottom-0 w-1.5 cursor-ew-resize pointer-events-auto" />
                <div onMouseDown={(e) => startResize('w', e)} className="absolute top-0 left-0 bottom-0 w-1.5 cursor-ew-resize pointer-events-auto" />
                <div onMouseDown={(e) => startResize('nw', e)} className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize pointer-events-auto" />
                <div onMouseDown={(e) => startResize('ne', e)} className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize pointer-events-auto" />
                <div onMouseDown={(e) => startResize('sw', e)} className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize pointer-events-auto" />
                <div onMouseDown={(e) => startResize('se', e)} className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize pointer-events-auto" />
            </div>

            <div className="h-full flex flex-col">
                {/* Title Bar */}
                <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2 title-bar-drag cursor-grab active:cursor-grabbing">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 cursor-pointer" />
                    </div>
                    <div className="flex-1 text-center select-none">
                        <span className="text-white/60 text-sm font-medium">Terminal — zsh</span>
                    </div>
                    <div className="w-14" />
                </div>

                <div 
                    ref={terminalRef}
                    onClick={handleTerminalClick}
                    className="flex-1 bg-[#1e1e1e]/95 backdrop-blur-xl p-4 overflow-y-auto font-mono text-sm cursor-text scrollbar-hide"
                >
                    {showWelcome && (
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="mb-4"
                        >
                            <motion.pre 
                                variants={itemVariants}
                                className="text-green-400 text-[10px] xs:text-xs sm:text-xs leading-tight mb-4 overflow-x-hidden"
                            >
{`
┌───────────────────────────────────────┐
│  session: zedithx                     │
│  status: systems warming up...        │
└───────────────────────────────────────┘
`}
                            </motion.pre>
                            
                            <motion.p variants={itemVariants} className="text-white/70 mb-4 text-sm sm:text-sm">
                                <Typewriter 
                                    text="Welcome to my interactive portfolio. Type a command to explore." 
                                    onComplete={() => setIsAnimating(false)}
                                />
                            </motion.p>

                            {!isAnimating && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-white/10 rounded-lg overflow-hidden"
                                >
                                    <div className="bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 border-b border-white/10">
                                        <span className="text-white/50 text-xs sm:text-xs uppercase tracking-wider">Available Commands</span>
                                    </div>
                                    {commands.map((cmd) => (
                                        <div key={cmd.name} className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-start gap-2 sm:gap-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <span className="text-green-400 font-semibold w-20 sm:w-24 text-sm sm:text-sm">{cmd.name}</span>
                                            <span className="text-white/50 text-xs sm:text-xs leading-relaxed">{cmd.description}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* History */}
                    {history.map((item, index) => (
                        <div key={index} className="mb-2">
                            {item.type === 'input' && (
                                <div className="flex items-start gap-2 mb-1">
                                    <span className="text-white/70 font-medium text-sm sm:text-sm whitespace-nowrap">(base) zedithx@Yangs-Macbook-Pro ~ %</span>
                                    <span className="text-white text-sm sm:text-sm break-all">{item.content}</span>
                                </div>
                            )}
                            {item.type === 'error' && (
                                <p className="text-red-400 ml-0">{item.content}</p>
                            )}
                            {item.type === 'success' && (
                                <p className="text-green-400 ml-0">{item.content}</p>
                            )}
                        </div>
                    ))}

                    {/* Input Line */}
                    <div className="flex items-start gap-2">
                        <span className="text-white/70 font-medium text-sm sm:text-sm whitespace-nowrap">(base) zedithx@Yangs-Macbook-Pro ~ %</span>
                        <div className="flex-1 min-w-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-transparent text-white outline-none caret-white text-sm sm:text-sm"
                                spellCheck={false}
                                autoComplete="off"
                            />
                        </div>
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-1.5 h-4 sm:w-2 sm:h-5 bg-white/80 shrink-0"
                        />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </motion.div>
    );
}
