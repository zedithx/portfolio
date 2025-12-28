'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuBar({ onPermissionError }) {
    const [time, setTime] = useState(new Date());
    const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
    const [isiTermMenuOpen, setIsiTermMenuOpen] = useState(false);
    const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    
    const appleMenuRef = useRef(null);
    const iTermMenuRef = useRef(null);
    const fileMenuRef = useRef(null);
    const editMenuRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (appleMenuRef.current && !appleMenuRef.current.contains(event.target)) {
                setIsAppleMenuOpen(false);
            }
            if (iTermMenuRef.current && !iTermMenuRef.current.contains(event.target)) {
                setIsiTermMenuOpen(false);
            }
            if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
                setIsFileMenuOpen(false);
            }
            if (editMenuRef.current && !editMenuRef.current.contains(event.target)) {
                setIsEditMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const handleMenuClick = () => {
        onPermissionError();
        setIsAppleMenuOpen(false);
        setIsiTermMenuOpen(false);
        setIsFileMenuOpen(false);
        setIsEditMenuOpen(false);
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-7 bg-black/20 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-5">
                    {/* Apple Menu */}
                    <div className="relative flex items-center" ref={appleMenuRef}>
                        <img 
                            src="/menubar-icon/apple.png"
                            alt="Apple"
                            className="w-4 h-4 cursor-pointer brightness-200 contrast-200" 
                            onClick={() => setIsAppleMenuOpen(!isAppleMenuOpen)}
                        />
                        <AnimatePresence>
                            {isAppleMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-16px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">About This Mac</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between">
                                        <span>System Settings...</span>
                                        <span className="bg-white/10 px-2 rounded-full text-[11px] text-white/50">1 update</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between">
                                        <span>App Store...</span>
                                        <span className="bg-white/10 px-2 rounded-full text-[11px] text-white/50">5 updates</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between">
                                        <span>Recent Items</span>
                                        <span className="text-white/40">›</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Force Quit...</span>
                                        <span className="text-white/40 text-[11px]">⌥⌘⎋</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Sleep</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Restart...</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Shut Down...</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Lock Screen</span>
                                        <span className="text-white/40 text-[11px]">⌃⌘Q</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Log Out zedithx...</span>
                                        <span className="text-white/40 text-[11px]">⇧⌘Q</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* iTerm2 Menu */}
                    <div className="relative flex items-center" ref={iTermMenuRef}>
                        <span 
                            className="text-white/90 text-[13px] font-bold cursor-pointer"
                            onClick={() => setIsiTermMenuOpen(!isiTermMenuOpen)}
                        >
                            iTerm2
                        </span>
                        <AnimatePresence>
                            {isiTermMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-8px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">About iTerm2</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Show Tip of the Day</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Check for Updates...</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Toggle Debug Logging</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Copy Performance Stats</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Settings...</span>
                                        <span className="text-white/40 text-[11px]">⌘,</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Services</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Hide iTerm2</span>
                                        <span className="text-white/40 text-[11px]">⌘H</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Hide Others</span>
                                        <span className="text-white/40 text-[11px]">⌥⌘H</span>
                                    </div>
                                    <div className="px-4 py-1 text-white/30 text-[13px] cursor-default">Show All</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Secure Keyboard Entry</span>
                                        <span className="text-white/40 text-[11px]">⌥⌘S</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Make iTerm2 Default Term</span>
                                        <span className="text-white/40 text-[11px]">⌃⇧⌘\</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Install Shell Integration</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Quit iTerm2</span>
                                        <span className="text-white/40 text-[11px]">⌘Q</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* File Menu */}
                    <div className="relative flex items-center" ref={fileMenuRef}>
                        <span 
                            className="text-white/70 text-[13px] cursor-pointer hover:text-white"
                            onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
                        >
                            File
                        </span>
                        <AnimatePresence>
                            {isFileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-8px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>New Text File</span>
                                        <span className="text-white/40 text-[11px]">⌘N</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>New Window</span>
                                        <span className="text-white/40 text-[11px]">⇧⌘N</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>New Window with Profile</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Open...</span>
                                        <span className="text-white/40 text-[11px]">⌘O</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Open Folder...</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Open Workspace from File...</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Open Recent</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Add Folder to Workspace...</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Save Workspace As...</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Duplicate Workspace</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Save</span>
                                        <span className="text-white/40 text-[11px]">⌘S</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Save As...</span>
                                        <span className="text-white/40 text-[11px]">⇧⌘S</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white/30 text-[13px] cursor-default flex justify-between items-center">
                                        <span>Save All</span>
                                        <span className="text-white/20 text-[11px]">⌥⌘S</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Share</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex items-center gap-2">
                                        <span className="text-[10px]">✓</span>
                                        <span>Auto Save</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Revert File</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Close Editor</span>
                                        <span className="text-white/40 text-[11px]">⌘W</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Close Folder</span>
                                        <span className="text-white/40 text-[11px]">⌘K F</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Close Window</span>
                                        <span className="text-white/40 text-[11px]">⇧⌘W</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Edit Menu */}
                    <div className="relative flex items-center" ref={editMenuRef}>
                        <span 
                            className="text-white/70 text-[13px] cursor-pointer hover:text-white"
                            onClick={() => setIsEditMenuOpen(!isEditMenuOpen)}
                        >
                            Edit
                        </span>
                        <AnimatePresence>
                            {isEditMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-8px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Undo</span>
                                        <span className="text-white/40 text-[11px]">⌘Z</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Redo</span>
                                        <span className="text-white/40 text-[11px]">⇧⌘Z</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Cut</span>
                                        <span className="text-white/40 text-[11px]">⌘X</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Copy</span>
                                        <span className="text-white/40 text-[11px]">⌘C</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Paste</span>
                                        <span className="text-white/40 text-[11px]">⌘V</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Find</span>
                                        <span className="text-white/40 text-[11px]">⌘F</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Replace</span>
                                        <span className="text-white/40 text-[11px]">⌥⌘F</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Find in Files</span>
                                        <span className="text-white/40 text-[11px]">⇧⌘F</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Replace in Files</span>
                                        <span className="text-white/40 text-[11px]">⇧⌘H</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Toggle Line Comment</span>
                                        <span className="text-white/40 text-[11px]">⌘/</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Toggle Block Comment</span>
                                        <span className="text-white/40 text-[11px]">⌥⇧A</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Emmet: Expand Abbreviation</span>
                                        <span className="text-white/40 text-[11px]">⇥</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Writing Tools</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>AutoFill</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Start Dictation...</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Emoji & Symbols</span>
                                        <span className="text-white/40 text-[11px]">🌐E</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative hidden md:flex items-center">
                        <span className="text-white/70 text-[13px]">View</span>
                    </div>
                    <div className="relative hidden md:flex items-center">
                        <span className="text-white/70 text-[13px]">Go</span>
                    </div>
                    <div className="relative hidden lg:flex items-center">
                        <span className="text-white/70 text-[13px]">Window</span>
                    </div>
                    <div className="relative hidden lg:flex items-center">
                        <span className="text-white/70 text-[13px]">Help</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Wifi className="w-4 h-4 text-white/80" />
                    <Search className="w-4 h-4 text-white/80" />
                    <div className="flex items-center gap-1">
                        <Battery className="w-5 h-5 text-white/80" />
                        <span className="text-white/80 text-[12px]">100%</span>
                    </div>
                    <span className="text-white/90 text-[13px]">
                        {formatDate(time)} {formatTime(time)}
                    </span>
                </div>
            </div>
        </>
    );
}
