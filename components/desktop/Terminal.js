'use client';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const commands = [
    { name: 'whoami', description: 'Learn about who I am and my journey' },
    { name: 'projects', description: 'Browse through my portfolio of work' },
    { name: 'experience', description: 'View my professional experience' },
    { name: 'github', description: 'Visit my GitHub profile' },
    { name: 'linkedin', description: 'Connect with me on LinkedIn' },
    { name: 'clear', description: 'Clear the terminal screen' },
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
                }, 20);
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
            }, 20);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

export default function Terminal({ onCommand, onClose, onMinimize, onMaximize, terminalState }) {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);
    const showWelcomeRef = useRef(true);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingCommand, setLoadingCommand] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [sessionText, setSessionText] = useState('');
    const [statusText, setStatusText] = useState('');
    const [isReady, setIsReady] = useState(false);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const measureRef = useRef(null);
    const typingIntervalRef = useRef(null);

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

    const handleClear = (shouldAnimate = true) => {
        // Clear any active typing interval
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
        
        setHistory([]);
        setShowWelcome(true);
        showWelcomeRef.current = true;
        setIsAnimating(shouldAnimate);
        setIsLoading(false);
        setLoadingCommand('');
        setInput('');
        setCursorPosition(0);
        
        if (shouldAnimate) {
            setSessionText('');
            setStatusText('');
            setIsReady(false);
        } else {
            setSessionText('session: zedithx');
            setStatusText('systems ready');
            setIsReady(true);
        }
        
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 50);
    };

    useEffect(() => {
        if (showWelcome && isAnimating && sessionText === '') {
            // Type out session text
            const fullSessionText = 'session: zedithx';
            let i = 0;
            const sessionInterval = setInterval(() => {
                setSessionText(fullSessionText.slice(0, i + 1));
                i++;
                if (i > fullSessionText.length) {
                    clearInterval(sessionInterval);
                    // Start typing status
                    setTimeout(() => {
                        let j = 0;
                        const fullStatusText = 'systems warming up...';
                        const statusInterval = setInterval(() => {
                            setStatusText(fullStatusText.slice(0, j + 1));
                            j++;
                            if (j > fullStatusText.length) {
                                clearInterval(statusInterval);
                                // Wait 0.5s then type out "ready"
                                setTimeout(() => {
                                    let k = 0;
                                    const readyText = 'systems ready';
                                    const readyInterval = setInterval(() => {
                                        setStatusText(readyText.slice(0, k + 1));
                                        k++;
                                        if (k > readyText.length) {
                                            clearInterval(readyInterval);
                                            setIsReady(true);
                                        }
                                    }, 40);
                                }, 500);
                            }
                        }, 40);
                    }, 100);
                }
            }, 40);
        }
    }, [showWelcome, isAnimating, sessionText]);

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

        // Focus input on mount
        if (inputRef.current) {
            inputRef.current.focus();
        }

        const onClearEvent = () => handleClear(true);
        window.addEventListener('clear-terminal', onClearEvent);

        const onRestoreEvent = () => {
            // Restore welcome screen but keep history and don't reset animations
            setShowWelcome(true);
            showWelcomeRef.current = true;
            setIsLoading(false);
            setLoadingCommand('');
            setInput('');
            setCursorPosition(0);
            // Ensure session and status are set (not animated)
            setSessionText('session: zedithx');
            setStatusText('systems ready');
            setIsReady(true);
            // Scroll to bottom when restoring
            setTimeout(() => {
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                }
            }, 100);
            setIsAnimating(false); // Don't re-animate, show commands list immediately
            setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 50);
        };
        window.addEventListener('restore-terminal', onRestoreEvent);

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

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('clear-terminal', onClearEvent);
            window.removeEventListener('restore-terminal', onRestoreEvent);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            
            // Clear any active typing interval on unmount
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (measureRef.current) {
            setCursorPosition(measureRef.current.offsetWidth);
        }
    }, [input]);

    useEffect(() => {
        if (terminalRef.current) {
            // Use double requestAnimationFrame to ensure DOM has fully updated
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (terminalRef.current) {
                        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                    }
                });
            });
            // Fallback timeout to ensure scroll happens
            setTimeout(() => {
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                }
            }, 50);
        }
    }, [history, isLoading, input]);

    // Scroll to bottom when terminal becomes visible (e.g., when returning from modal)
    useEffect(() => {
        if (terminalState?.isOpen && terminalRef.current) {
            const scrollTimer = setTimeout(() => {
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                }
            }, 100);
            return () => clearTimeout(scrollTimer);
        }
    }, [terminalState?.isOpen]);

    // Add ESC key handler to close terminal
    useEffect(() => {
        if (terminalState === 'closed') return;
        
        const handleEscape = (e) => {
            // Only close if not typing in input field and not loading
            if (e.key === 'Escape' && !isLoading && document.activeElement !== inputRef.current) {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [terminalState, isLoading, onClose]);

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
            
            if (cmd === 'clear') {
                handleClear(false);
            } else if (cmd === 'github') {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                setInput('');
                setIsLoading(true);
                setLoadingCommand('github');
                
                setTimeout(() => {
                    // Open link after loading animation completes
                    const link = document.createElement('a');
                    link.href = 'https://github.com/zedithx';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setIsLoading(false);
                    setLoadingCommand('');
                    setHistory(prev => [...prev, { type: 'success', content: '✓ Opened GitHub profile in new tab' }]);
                    setCursorPosition(0);
                }, 1500);
            } else if (cmd === 'linkedin') {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                setInput('');
                setIsLoading(true);
                setLoadingCommand('linkedin');
                
                setTimeout(() => {
                    // Open link after loading animation completes
                    const link = document.createElement('a');
                    link.href = 'https://linkedin.com/in/yang-si-jun/';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setIsLoading(false);
                    setLoadingCommand('');
                    setHistory(prev => [...prev, { type: 'success', content: '✓ Opened LinkedIn profile in new tab' }]);
                    setCursorPosition(0);
                }, 1500);
            } else if (cmd === 'whoami') {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                setIsLoading(true);
                setLoadingCommand(cmd);
                setTimeout(() => {
                    // Navigate to /whoami route instead of opening modal
                    window.location.href = '/whoami';
                }, 1500);
            } else if (['projects', 'experience'].includes(cmd)) {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                setIsLoading(true);
                setLoadingCommand(cmd);
                setTimeout(() => {
                    onCommand(cmd);
                    // Reset loading state for when user returns
                    setIsLoading(false);
                    setLoadingCommand('');
                }, 1500); 
            } else {
                setHistory(prev => [...prev, { type: 'input', content: input }, { type: 'error', content: `Command not found: ${cmd}.` }]);
            }
            
            if (!['github', 'linkedin'].includes(cmd)) {
                setInput('');
            }
        }
    };

    const handleTerminalClick = () => {
        // Focus input when terminal is clicked
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleCommandClick = useCallback((commandName) => {
        const cmd = commandName.trim().toLowerCase();
        
        // Clear any existing typing interval
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
        
        // Simulate typing the command character by character
        let typedText = '';
        let charIndex = 0;
        typingIntervalRef.current = setInterval(() => {
            if (charIndex < commandName.length) {
                typedText += commandName[charIndex];
                setInput(typedText);
                charIndex++;
            } else {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
                
                // Wait a moment after typing completes, then process the command
                setTimeout(() => {
                    // Add to history
                    setHistory(prev => [...prev, { type: 'input', content: commandName }]);
                    
                    // Process the command
                    if (cmd === 'clear') {
                        handleClear(false);
                    } else if (cmd === 'github') {
                        setInput('');
                        setIsLoading(true);
                        setLoadingCommand('github');
                        
                        setTimeout(() => {
                            // Open link after loading animation completes
                            const link = document.createElement('a');
                            link.href = 'https://github.com/zedithx';
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            setIsLoading(false);
                            setLoadingCommand('');
                            setHistory(prev => [...prev, { type: 'success', content: '✓ Opened GitHub profile in new tab' }]);
                            setCursorPosition(0);
                        }, 1500);
                    } else if (cmd === 'linkedin') {
                        setInput('');
                        setIsLoading(true);
                        setLoadingCommand('linkedin');
                        
                        setTimeout(() => {
                            // Open link after loading animation completes
                            const link = document.createElement('a');
                            link.href = 'https://linkedin.com/in/yang-si-jun/';
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            setIsLoading(false);
                            setLoadingCommand('');
                            setHistory(prev => [...prev, { type: 'success', content: '✓ Opened LinkedIn profile in new tab' }]);
                            setCursorPosition(0);
                        }, 1500);
                    } else if (cmd === 'whoami') {
                        setIsLoading(true);
                        setLoadingCommand(cmd);
                        
                        setTimeout(() => {
                            // Navigate to /whoami route instead of opening modal
                            window.location.href = '/whoami';
                        }, 1500);
                    } else if (['projects', 'experience'].includes(cmd)) {
                        setIsLoading(true);
                        setLoadingCommand(cmd);
                        
                        setTimeout(() => {
                            onCommand(cmd);
                            setIsLoading(false);
                            setLoadingCommand('');
                            setInput('');
                            setCursorPosition(0);
                        }, 1500);
                    } else {
                        setHistory(prev => [...prev, { type: 'error', content: `Command not found: ${cmd}.` }]);
                        setInput('');
                        setCursorPosition(0);
                    }
                    
                    // Focus the input
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }, 200); // Brief pause after typing completes
            }
        }, 30); // Type each character every 30ms
    }, [handleClear, onCommand]);

    // Calculate safe left position for mobile to prevent horizontal shifting
    const safeLeft = useMemo(() => {
        if (terminalState === 'maximized') return 0;
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            return Math.max(0, Math.min(dimensions.left, window.innerWidth - dimensions.width));
        }
        return dimensions.left;
    }, [dimensions.left, dimensions.width, terminalState]);

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, y: 200 }}
            animate={{ 
                scale: terminalState === 'minimized' ? 0 : 1, 
                opacity: terminalState === 'minimized' ? 0 : 1,
                y: terminalState === 'minimized' ? 200 : 0,
                width: terminalState === 'maximized' ? '100vw' : dimensions.width,
                height: terminalState === 'maximized' ? 'calc(100vh - 28px)' : dimensions.height,
                top: terminalState === 'maximized' ? '28px' : dimensions.top,
                left: safeLeft,
                pointerEvents: terminalState === 'minimized' ? 'none' : 'auto'
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onMouseDown={startDrag}
            className="fixed z-20 shadow-2xl rounded-xl overflow-hidden border border-white/10"
            style={{ 
                transformOrigin: 'bottom',
                maxWidth: '100vw',
                overflowX: 'hidden'
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
                <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2 title-bar-drag cursor-grab active:cursor-grabbing shrink-0">
                    <div className="flex gap-2">
                        <div 
                            onClick={(e) => { e.stopPropagation(); onClose(); }} 
                            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 cursor-pointer" 
                        />
                        <div 
                            onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
                            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 cursor-pointer" 
                        />
                        <div 
                            onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
                            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 cursor-pointer" 
                        />
                    </div>
                    <div className="flex-1 text-center select-none">
                        <span className="text-white/60 text-sm font-medium">Terminal — zsh</span>
                    </div>
                    <div className="w-14" />
                </div>

                <div 
                    ref={terminalRef}
                    onClick={handleTerminalClick}
                    className="flex-1 bg-[#1e1e1e]/95 backdrop-blur-xl p-4 overflow-y-auto overflow-x-hidden font-mono text-sm cursor-text scrollbar-hide relative"
                    style={{ 
                        maxWidth: '100%',
                        width: '100%'
                    }}
                >
                    {showWelcome && !isLoading && (
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="mb-4"
                        >
                            <motion.pre 
                                variants={itemVariants}
                                className="text-green-400 text-sm sm:text-xs leading-tight mb-4 overflow-x-hidden"
                            >
{`┌───────────────────────────────────────┐
│  ${sessionText.padEnd(37)}│
│  status: ${statusText.padEnd(28)}│
└───────────────────────────────────────┘`}
                            </motion.pre>
                            
                            {isReady && (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    variants={itemVariants} 
                                    className="text-white/70 mb-4 text-sm sm:text-sm"
                                >
                                    <Typewriter 
                                        text="Welcome to my interactive portfolio. Type a command to explore." 
                                        onComplete={() => setIsAnimating(false)}
                                    />
                                </motion.p>
                            )}

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
                                        <div 
                                            key={cmd.name} 
                                            onClick={() => handleCommandClick(cmd.name)}
                                            className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-start gap-2 sm:gap-4 border-b border-white/5 last:border-0 hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
                                        >
                                            <span className="text-green-400 font-semibold w-20 sm:w-24 text-xs sm:text-sm shrink-0">{cmd.name}</span>
                                            <span className="text-white/50 text-xs sm:text-xs leading-relaxed min-w-0 flex-1 truncate">{cmd.description}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* History */}
                    {!isLoading && history.map((item, index) => (
                        <div key={index} className="mb-2">
                            {item.type === 'input' && (
                                <div className="flex items-start gap-2 mb-1">
                                    <span className="text-white/70 font-medium text-[14px] sm:text-sm whitespace-nowrap leading-5 shrink-0">
                                        <span className="hidden sm:inline">(base) zedithx@Yangs-Macbook-Pro ~ %</span>
                                        <span className="sm:hidden">(base) zedithx@Macbook ~ %</span>
                                    </span>
                                    <span className="text-white text-[14px] sm:text-sm break-all leading-5">{item.content}</span>
                                </div>
                            )}
                            {item.type === 'error' && (
                                <p className="text-red-400 ml-0 leading-5">{item.content}</p>
                            )}
                            {item.type === 'success' && (
                                <p className="text-green-400 ml-0 leading-5">{item.content}</p>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="h-full flex items-center justify-center">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-80 space-y-6 flex flex-col items-center"
                            >
                                {(loadingCommand === 'github' || loadingCommand === 'linkedin') && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: [0, 360] }}
                                        transition={{ 
                                            scale: { type: 'spring', stiffness: 200 },
                                            rotate: { duration: 1.5, ease: 'easeInOut' }
                                        }}
                                        className="w-24 h-24 flex items-center justify-center"
                                    >
                                        <img 
                                            src={loadingCommand === 'github' ? '/platform-icons/github.webp' : '/platform-icons/linkedin.webp'}
                                            alt={loadingCommand}
                                            className={`w-full h-full object-contain ${loadingCommand === 'linkedin' ? 'scale-85' : ''}`}
                                        />
                                    </motion.div>
                                )}
                                
                                <div className="text-green-400 text-sm font-bold animate-pulse text-center">
                                    {loadingCommand === 'github' && '🔗 Connecting to GitHub...'}
                                    {loadingCommand === 'linkedin' && '🔗 Connecting to LinkedIn...'}
                                    {!['github', 'linkedin'].includes(loadingCommand) && (
                                        <>{`>`} INITIALIZING {loadingCommand.toUpperCase()}...</>
                                    )}
                                </div>
                                
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                        className="h-full bg-green-500"
                                    />
                                </div>
                                
                                <div className="flex justify-between text-[9px] text-white/30 font-mono w-full">
                                    <span>{loadingCommand === 'github' || loadingCommand === 'linkedin' ? 'REDIRECTING' : 'LOADING MODULES'}</span>
                                    <span>DONE</span>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Input Line */}
                    {!isLoading && (
                        <div className="flex items-center gap-2">
                            <span className="text-white/70 font-medium text-[14px] sm:text-sm whitespace-nowrap leading-5 shrink-0">
                                <span className="hidden sm:inline">(base) zedithx@Yangs-Macbook-Pro ~ %</span>
                                <span className="sm:hidden">(base) zedithx@Macbook ~ %</span>
                            </span>
                            <div className="flex-1 min-w-0 relative flex items-center h-5">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={(e) => {
                                    // Prevent terminal from shifting on mobile when keyboard appears
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
                                className="flex-1 bg-transparent text-white outline-none text-[14px] sm:text-sm leading-5 h-5 font-mono"
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
                                className="absolute w-1.5 h-4 sm:w-2 sm:h-5 bg-white/80"
                                style={{ 
                                    left: `${cursorPosition}px`,
                                    marginLeft: '2px'
                                }}
                            />
                            </div>
                        </div>
                    )}
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
