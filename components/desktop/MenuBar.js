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
    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
    const [isGoMenuOpen, setIsGoMenuOpen] = useState(false);
    const [isWindowMenuOpen, setIsWindowMenuOpen] = useState(false);
    const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
    const [isWifiMenuOpen, setIsWifiMenuOpen] = useState(false);
    const [isWifiOn, setIsWifiOn] = useState(true);
    const [isBatteryMenuOpen, setIsBatteryMenuOpen] = useState(false);
    const [isWidgetScreenOpen, setIsWidgetScreenOpen] = useState(false);
    
    const appleMenuRef = useRef(null);
    const iTermMenuRef = useRef(null);
    const fileMenuRef = useRef(null);
    const editMenuRef = useRef(null);
    const viewMenuRef = useRef(null);
    const goMenuRef = useRef(null);
    const windowMenuRef = useRef(null);
    const helpMenuRef = useRef(null);
    const wifiMenuRef = useRef(null);
    const batteryMenuRef = useRef(null);
    const widgetScreenRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isWidgetScreenOpen) {
                setIsWidgetScreenOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isWidgetScreenOpen]);

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
            if (viewMenuRef.current && !viewMenuRef.current.contains(event.target)) {
                setIsViewMenuOpen(false);
            }
            if (goMenuRef.current && !goMenuRef.current.contains(event.target)) {
                setIsGoMenuOpen(false);
            }
            if (windowMenuRef.current && !windowMenuRef.current.contains(event.target)) {
                setIsWindowMenuOpen(false);
            }
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
                setIsHelpMenuOpen(false);
            }
            if (wifiMenuRef.current && !wifiMenuRef.current.contains(event.target)) {
                setIsWifiMenuOpen(false);
            }
            if (batteryMenuRef.current && !batteryMenuRef.current.contains(event.target)) {
                setIsBatteryMenuOpen(false);
            }
            if (widgetScreenRef.current && !widgetScreenRef.current.contains(event.target)) {
                setIsWidgetScreenOpen(false);
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
        }).toLowerCase().replace(/\s/g, '');
    };

    const formatDate = (date) => {
        if (typeof window !== 'undefined' && window.innerWidth < 380) {
            // Very small screens: just show time
            return '';
        } else if (typeof window !== 'undefined' && window.innerWidth < 550) {
            // Small screens: abbreviated format
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
        // Desktop: full format
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const closeAllMenus = () => {
        setIsAppleMenuOpen(false);
        setIsiTermMenuOpen(false);
        setIsFileMenuOpen(false);
        setIsEditMenuOpen(false);
        setIsViewMenuOpen(false);
        setIsGoMenuOpen(false);
        setIsWindowMenuOpen(false);
        setIsHelpMenuOpen(false);
        setIsWifiMenuOpen(false);
        setIsBatteryMenuOpen(false);
    };

    const handleMenuClick = () => {
        onPermissionError();
        closeAllMenus();
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-7 bg-black/20 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-2 sm:px-3 md:px-4 z-50">
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    {/* Apple Menu */}
                    <div className="relative flex items-center" ref={appleMenuRef}>
                        <img 
                            src="/menubar-icon/apple.png"
                            alt="Apple"
                            className="w-4 h-4 cursor-pointer brightness-200 contrast-200" 
                            onClick={() => {
                                closeAllMenus();
                                setIsAppleMenuOpen(!isAppleMenuOpen);
                            }}
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
                            className="text-white/90 text-[12px] md:text-[13px] font-bold cursor-pointer"
                            onClick={() => {
                                closeAllMenus();
                                setIsiTermMenuOpen(!isiTermMenuOpen);
                            }}
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
                            onClick={() => {
                                closeAllMenus();
                                setIsFileMenuOpen(!isFileMenuOpen);
                            }}
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
                            onClick={() => {
                                closeAllMenus();
                                setIsEditMenuOpen(!isEditMenuOpen);
                            }}
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

                    {/* View Menu */}
                    <div className="relative hidden md:flex items-center" ref={viewMenuRef}>
                        <span 
                            className="text-white/70 text-[13px] cursor-pointer hover:text-white"
                            onClick={() => {
                                closeAllMenus();
                                setIsViewMenuOpen(!isViewMenuOpen);
                            }}
                        >
                            View
                        </span>
                        <AnimatePresence>
                            {isViewMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-8px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Show Sidebar</span>
                                        <span className="text-white/40 text-[11px]">⌘B</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Hide Sidebar</span>
                                        <span className="text-white/40 text-[11px]">⌘B</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Appearance</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Editor Layout</span>
                                        <span className="text-white/40 text-[11px]">›</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Zoom In</span>
                                        <span className="text-white/40 text-[11px]">⌘+</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Zoom Out</span>
                                        <span className="text-white/40 text-[11px]">⌘-</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Reset Zoom</span>
                                        <span className="text-white/40 text-[11px]">⌘0</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Go Menu */}
                    <div className="relative hidden md:flex items-center" ref={goMenuRef}>
                        <span 
                            className="text-white/70 text-[13px] cursor-pointer hover:text-white"
                            onClick={() => {
                                closeAllMenus();
                                setIsGoMenuOpen(!isGoMenuOpen);
                            }}
                        >
                            Go
                        </span>
                        <AnimatePresence>
                            {isGoMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-8px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Back</span>
                                        <span className="text-white/40 text-[11px]">⌘[</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Forward</span>
                                        <span className="text-white/40 text-[11px]">⌘]</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Go to File...</span>
                                        <span className="text-white/40 text-[11px]">⌘P</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Go to Symbol in File...</span>
                                        <span className="text-white/40 text-[11px]">⌘⇧O</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Go to Symbol in Workspace...</span>
                                        <span className="text-white/40 text-[11px]">⌘T</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Go to Line/Column...</span>
                                        <span className="text-white/40 text-[11px]">⌘G</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Go to Definition</span>
                                        <span className="text-white/40 text-[11px]">F12</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Go to Declaration</span>
                                        <span className="text-white/40 text-[11px]">⌘F12</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Window Menu */}
                    <div className="relative hidden lg:flex items-center" ref={windowMenuRef}>
                        <span 
                            className="text-white/70 text-[13px] cursor-pointer hover:text-white"
                            onClick={() => {
                                closeAllMenus();
                                setIsWindowMenuOpen(!isWindowMenuOpen);
                            }}
                        >
                            Window
                        </span>
                        <AnimatePresence>
                            {isWindowMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-8px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Minimize</span>
                                        <span className="text-white/40 text-[11px]">⌘M</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Zoom</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Move Tab to New Window</span>
                                    </div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center">
                                        <span>Merge All Windows</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white/30 text-[13px] cursor-default">1 Terminal — zsh</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Bring All to Front</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Help Menu */}
                    <div className="relative hidden lg:flex items-center" ref={helpMenuRef}>
                        <span 
                            className="text-white/70 text-[13px] cursor-pointer hover:text-white"
                            onClick={() => {
                                closeAllMenus();
                                setIsHelpMenuOpen(!isHelpMenuOpen);
                            }}
                        >
                            Help
                        </span>
                        <AnimatePresence>
                            {isHelpMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 left-[-8px] w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]"
                                >
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Get Started</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Documentation</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Release Notes</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Keyboard Shortcuts Reference</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Video Tutorials</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Tips and Tricks</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Report Issue</div>
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Feature Request</div>
                                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                                    <div onClick={handleMenuClick} className="px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default">Community</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
                    {/* Wi-Fi Menu */}
                    <div className="relative hidden md:block" ref={wifiMenuRef}>
                        <Wifi 
                            className="w-4 h-4 text-white/80 cursor-pointer hover:text-white transition-colors" 
                            onClick={() => {
                                closeAllMenus();
                                setIsWifiMenuOpen(!isWifiMenuOpen);
                            }}
                        />
                        <AnimatePresence>
                            {isWifiMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 right-0 w-[280px] bg-[#2d2d2d]/95 backdrop-blur-3xl rounded-lg shadow-2xl border border-white/10 py-2 z-[60]"
                                >
                                    {/* Wi-Fi Toggle */}
                                    <div className="px-4 py-2 flex items-center justify-between">
                                        <span className="text-white text-[14px]">Wi-Fi</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMenuClick();
                                            }}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${
                                                isWifiOn ? 'bg-blue-500' : 'bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                                    isWifiOn ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Personal Hotspot */}
                                    <div className="px-4 py-2">
                                        <div className="text-white text-[14px] mb-2">Personal Hotspot</div>
                                        <div 
                                            onClick={handleMenuClick}
                                            className="flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors -mx-2 px-2 py-1 rounded"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                <span className="text-white text-[14px]">Jun</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-end gap-0.5 h-3">
                                                    <div className="w-0.5 h-1 bg-gray-400"></div>
                                                    <div className="w-0.5 h-1.5 bg-gray-400"></div>
                                                    <div className="w-0.5 h-2 bg-gray-400"></div>
                                                    <div className="w-0.5 h-1 bg-gray-400"></div>
                                                </div>
                                                <span className="text-white/70 text-[12px]">4G</span>
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-13zM4 5a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm5 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-white/10 mx-2 my-1" />

                                    {/* Known Network */}
                                    <div className="px-4 py-2">
                                        <div className="text-white text-[14px] mb-2">Known Network</div>
                                        <div 
                                            onClick={handleMenuClick}
                                            className="flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors -mx-2 px-2 py-1 rounded"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="absolute -bottom-0.5 -right-0.5 flex items-end gap-0.5 h-2.5 w-3">
                                                        <div className="w-0.5 h-1 bg-blue-500"></div>
                                                        <div className="w-0.5 h-1.5 bg-blue-500"></div>
                                                        <div className="w-0.5 h-2 bg-blue-500"></div>
                                                    </div>
                                                </div>
                                                <span className="text-white text-[14px]">SINGTEL-8DM4</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-white/10 mx-2 my-1" />

                                    {/* Other Networks */}
                                    <div 
                                        onClick={handleMenuClick}
                                        className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-white text-[14px]">Other Networks</span>
                                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>

                                    <div className="h-[1px] bg-white/10 mx-2 my-1" />

                                    {/* Wi-Fi Settings */}
                                    <div 
                                        onClick={handleMenuClick}
                                        className="px-4 py-2 text-white text-[14px] cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        Wi-Fi Settings...
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <Search className="hidden lg:block w-4 h-4 text-white/80" />
                    {/* Battery Menu */}
                    <div className="relative hidden sm:flex items-center gap-1" ref={batteryMenuRef}>
                        <Battery 
                            className="w-4 h-4 md:w-5 md:h-5 text-white/80 cursor-pointer hover:text-white transition-colors" 
                            onClick={() => {
                                closeAllMenus();
                                setIsBatteryMenuOpen(!isBatteryMenuOpen);
                            }}
                        />
                        <span 
                            className="text-white/80 text-[10px] md:text-[12px] cursor-pointer hover:text-white transition-colors"
                            onClick={() => {
                                closeAllMenus();
                                setIsBatteryMenuOpen(!isBatteryMenuOpen);
                            }}
                        >
                            100%
                        </span>
                        <AnimatePresence>
                            {isBatteryMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-7 right-0 w-[280px] bg-[#2d2d2d]/95 backdrop-blur-3xl rounded-lg shadow-2xl border border-white/10 py-2 z-[60]"
                                >
                                    {/* Battery Title */}
                                    <div className="px-4 py-2 flex items-center justify-between">
                                        <span className="text-white text-[14px] font-semibold">Battery</span>
                                        <span className="text-white/60 text-[14px]">100%</span>
                                    </div>

                                    <div className="h-[1px] bg-white/10 mx-2 my-1" />

                                    {/* Power Source */}
                                    <div className="px-4 py-2">
                                        <div className="text-white/70 text-[13px]">Power Source: Battery</div>
                                    </div>

                                    <div className="h-[1px] bg-white/10 mx-2 my-1" />

                                    {/* Energy Mode */}
                                    <div className="px-4 py-2">
                                        <div className="text-white/70 text-[13px] mb-2">Energy Mode</div>
                                        <div 
                                            onClick={handleMenuClick}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors -mx-2 px-2 py-2 rounded"
                                        >
                                            <div className="relative w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Battery className="w-3.5 h-3.5 text-white" fill="white" />
                                            </div>
                                            <span className="text-white text-[14px]">Low Power</span>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-white/10 mx-2 my-1" />

                                    {/* App Energy Usage */}
                                    <div className="px-4 py-2">
                                        <div className="text-white/70 text-[13px]">No Apps Using Significant Energy</div>
                                    </div>

                                    <div className="h-[1px] bg-white/10 mx-2 my-1" />

                                    {/* Battery Settings */}
                                    <div 
                                        onClick={handleMenuClick}
                                        className="px-4 py-2 text-white text-[14px] font-semibold cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        Battery Settings...
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <span 
                        className="text-white/90 text-[10px] sm:text-[11px] md:text-[13px] whitespace-nowrap cursor-pointer hover:text-white transition-colors"
                        onClick={() => setIsWidgetScreenOpen(true)}
                    >
                        {formatDate(time)} {formatTime(time)}
                    </span>
                </div>
            </div>

            {/* Widget Screen */}
            <AnimatePresence>
                {isWidgetScreenOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsWidgetScreenOpen(false)}
                        />
                        {/* Widget Panel - Right Side */}
                        <motion.div
                            ref={widgetScreenRef}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 z-[101] w-full sm:w-[320px] md:w-[360px] lg:w-[380px] bg-black/30 backdrop-blur-2xl shadow-2xl overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
                                {/* Calendar Widget */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
                                >
                                    <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1.5">
                                        {time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
                                    </div>
                                    <div className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                                        {time.getDate()}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-red-400 text-xs md:text-sm">Timeleft Dinner</span>
                                            <span className="text-white/60 text-xs md:text-sm">7-9PM</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-green-400 text-xs md:text-sm">Learning reminder</span>
                                            <span className="text-white/60 text-xs md:text-sm">8-8:30PM</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Weather Widget */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
                                >
                                    <div className="text-white/50 text-[10px] sm:text-xs mb-1.5">Singapore</div>
                                    <div className="flex items-baseline gap-2 mb-1.5">
                                        <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">25°</span>
                                    </div>
                                    <div className="text-white/70 text-xs sm:text-sm md:text-base mb-3">Cloudy</div>
                                    <div className="text-white/50 text-[10px] sm:text-xs">H:30° L:24°</div>
                                </motion.div>

                                {/* World Clocks Widget */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
                                >
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                                        {[
                                            { city: 'Cupertino', time: new Date(time.getTime() - 16 * 60 * 60 * 1000), label: 'Yesterday -16HRS' },
                                            { city: 'Tokyo', time: new Date(time.getTime() + 1 * 60 * 60 * 1000), label: 'Today +1HR' },
                                            { city: 'Sydney', time: new Date(time.getTime() + 3 * 60 * 60 * 1000), label: 'Today +3HRS' },
                                            { city: 'Paris', time: new Date(time.getTime() - 7 * 60 * 60 * 1000), label: 'Yesterday -7HRS' },
                                        ].map((clock, idx) => (
                                            <div key={idx} className="flex flex-col items-center">
                                                <div className="text-white/50 text-[9px] sm:text-[10px] mb-1.5">{clock.city}</div>
                                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-1">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" stroke="white/20" strokeWidth="2" fill="none" />
                                                        <circle cx="50" cy="50" r="2" fill="#d4af37" />
                                                        {/* Hour hand */}
                                                        <line 
                                                            x1="50" y1="50" 
                                                            x2="50" y2="30" 
                                                            stroke="#d4af37" 
                                                            strokeWidth="2" 
                                                            strokeLinecap="round"
                                                            transform={`rotate(${(clock.time.getHours() % 12) * 30 + clock.time.getMinutes() * 0.5} 50 50)`}
                                                        />
                                                        {/* Minute hand */}
                                                        <line 
                                                            x1="50" y1="50" 
                                                            x2="50" y2="20" 
                                                            stroke="#d4af37" 
                                                            strokeWidth="1.5" 
                                                            strokeLinecap="round"
                                                            transform={`rotate(${clock.time.getMinutes() * 6} 50 50)`}
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="text-white/60 text-[9px] md:text-xs text-center">{clock.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Stock Widget */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
                                >
                                    <div className="space-y-2 sm:space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-xs sm:text-sm md:text-base font-semibold">DOW</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-red-400 text-[10px] sm:text-xs">▼</span>
                                                <span className="text-white text-xs sm:text-sm md:text-base">48,493</span>
                                            </div>
                                            <span className="text-red-400 text-[10px] sm:text-xs">-217.90</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-xs sm:text-sm md:text-base font-semibold">S&P 500</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-red-400 text-[10px] sm:text-xs">▼</span>
                                                <span className="text-white text-xs sm:text-sm md:text-base">6,901</span>
                                            </div>
                                            <span className="text-red-400 text-[10px] sm:text-xs">-29.07</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-xs sm:text-sm md:text-base font-semibold">AAPL</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-green-400 text-[10px] sm:text-xs">▲</span>
                                                <span className="text-white text-xs sm:text-sm md:text-base">273.83</span>
                                            </div>
                                            <span className="text-green-400 text-[10px] sm:text-xs">+0.43</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Screen Time Widget */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
                                >
                                    <div className="text-white text-base sm:text-lg md:text-xl font-semibold mb-3">2h 49m</div>
                                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                                        <div className="flex-1">
                                            <div className="relative h-20 sm:h-24 md:h-28 mb-3 flex items-end gap-0.5 sm:gap-1">
                                                {[65, 45, 55, 40, 50, 35, 60, 45, 55, 50, 45, 40].map((height, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex-1 rounded-t"
                                                        style={{
                                                            height: `${height}%`,
                                                            background: idx % 3 === 0 ? '#3b82f6' : idx % 3 === 1 ? '#f97316' : '#60a5fa'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-blue-500/20 rounded flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-blue-500 rounded-sm"></div>
                                                </div>
                                                <span className="text-white/80 text-[10px] sm:text-xs md:text-sm">1h 38m</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-gray-500/20 rounded flex items-center justify-center">
                                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-white/80 text-[10px] sm:text-xs md:text-sm">1h 36m</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-yellow-500/20 rounded flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-yellow-500 rounded-sm"></div>
                                                </div>
                                                <span className="text-white/80 text-[10px] sm:text-xs md:text-sm">1h 32m</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 sm:border-t sm:border-white/10 flex items-center justify-between">
                                        <span 
                                            onClick={onPermissionError}
                                            className="text-white/70 text-xs md:text-sm cursor-pointer hover:text-white transition-colors"
                                        >
                                            Edit Widgets...
                                        </span>
                                        <svg 
                                            onClick={onPermissionError}
                                            className="w-4 h-4 md:w-5 md:h-5 text-white/60 cursor-pointer hover:text-white transition-colors" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
