'use client';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import TerminalTitleBar from './terminal/TerminalTitleBar';
import TerminalWelcome from './terminal/TerminalWelcome';
import TerminalHistory from './terminal/TerminalHistory';
import TerminalInput from './terminal/TerminalInput';
import TerminalLoading from './terminal/TerminalLoading';

export default function Terminal({ onCommand, onClose, onMinimize, onMaximize, terminalState, onOpenPDF }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
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
            } else if (cmd === 'cd') {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                toggleTheme(newTheme);
                setHistory(prev => [...prev, { type: 'success', content: `✓ Switched to ${newTheme} mode` }]);
                setInput('');
                setCursorPosition(0);
            } else if (cmd === 'aboutme') {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                setIsLoading(true);
                setLoadingCommand(cmd);
                setTimeout(() => {
                    onCommand('about-me');
                    setIsLoading(false);
                    setLoadingCommand('');
                    setHistory(prev => [...prev, { type: 'success', content: '✓ Opened About Me' }]);
                    setCursorPosition(0);
                }, 1200);
            } else if (cmd === 'resume') {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                setIsLoading(true);
                setLoadingCommand('resume');
                setTimeout(() => {
                    // Open PDF viewer modal
                    if (onOpenPDF) {
                        onOpenPDF();
                    }
                    
                    setIsLoading(false);
                    setLoadingCommand('');
                    setHistory(prev => [...prev, { type: 'success', content: '✓ Opened resume' }]);
                }, 1200);
            } else if (['projects', 'experience'].includes(cmd)) {
                setHistory(prev => [...prev, { type: 'input', content: input }]);
                setIsLoading(true);
                setLoadingCommand(cmd);
                setTimeout(() => {
                    // Map 'projects' to 'projects' and 'experience' to 'experience' for the modal
                    onCommand(cmd);
                    // Reset loading state for when user returns
                    setIsLoading(false);
                    setLoadingCommand('');
                }, 1500); 
            } else {
                setHistory(prev => [...prev, { type: 'input', content: input }, { type: 'error', content: `Command not found: ${cmd}.` }]);
            }
            
            setInput('');
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
                    } else if (cmd === 'cd') {
                        const newTheme = theme === 'dark' ? 'light' : 'dark';
                        toggleTheme(newTheme);
                        setHistory(prev => [...prev, { type: 'success', content: `✓ Switched to ${newTheme} mode` }]);
                        setInput('');
                        setCursorPosition(0);
                    } else if (cmd === 'aboutme') {
                        setIsLoading(true);
                        setLoadingCommand(cmd);
                        
                        setTimeout(() => {
                            onCommand('about-me');
                            setIsLoading(false);
                            setLoadingCommand('');
                            setHistory(prev => [...prev, { type: 'success', content: '✓ Opened About Me' }]);
                            setCursorPosition(0);
                        }, 1200);
                    } else if (cmd === 'resume') {
                        setIsLoading(true);
                        setLoadingCommand('resume');
                        
                        setTimeout(() => {
                            // Open PDF viewer modal
                            if (onOpenPDF) {
                                onOpenPDF();
                            }
                            
                            setIsLoading(false);
                            setLoadingCommand('');
                            setHistory(prev => [...prev, { type: 'success', content: '✓ Opened resume' }]);
                            setInput('');
                            setCursorPosition(0);
                        }, 1200);
                    } else if (['projects', 'experience'].includes(cmd)) {
                        setIsLoading(true);
                        setLoadingCommand(cmd);
                        
                        setTimeout(() => {
                            // Map 'projects' to 'projects' and 'experience' to 'experience' for the modal
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
    }, [handleClear, onCommand, onOpenPDF, theme, toggleTheme]);

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
                height: terminalState === 'maximized' ? '100vh' : dimensions.height,
                top: terminalState === 'maximized' ? 0 : dimensions.top,
                left: terminalState === 'maximized' ? 0 : safeLeft,
                pointerEvents: terminalState === 'minimized' ? 'none' : 'auto'
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onMouseDown={startDrag}
            className={`fixed shadow-2xl overflow-hidden border border-white/10 ${terminalState === 'maximized' ? 'z-[60] rounded-none' : 'z-20 rounded-xl'}`}
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
                <TerminalTitleBar
                    isDark={isDark}
                    onClose={onClose}
                    onMinimize={onMinimize}
                    onMaximize={onMaximize}
                    onDragStart={startDrag}
                />

                <div 
                    ref={terminalRef}
                    onClick={handleTerminalClick}
                    className={`flex-1 backdrop-blur-xl p-4 overflow-y-auto overflow-x-hidden font-mono text-sm cursor-text scrollbar-hide relative ${isDark ? 'bg-[#1e1e1e]/95' : 'bg-gray-50'}`}
                    style={{ 
                        maxWidth: '100%',
                        width: '100%'
                    }}
                >
                    {showWelcome && !isLoading && (
                        <TerminalWelcome
                            isDark={isDark}
                            isReady={isReady}
                            isAnimating={isAnimating}
                            sessionText={sessionText}
                            statusText={statusText}
                            onCommandClick={handleCommandClick}
                            onAnimationComplete={() => setIsAnimating(false)}
                        />
                    )}

                    {!isLoading && <TerminalHistory isDark={isDark} history={history} />}

                    {isLoading && <TerminalLoading isDark={isDark} loadingCommand={loadingCommand} />}

                    {!isLoading && (
                        <TerminalInput
                            isDark={isDark}
                            input={input}
                            inputRef={inputRef}
                            measureRef={measureRef}
                            cursorPosition={cursorPosition}
                            onInputChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
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
