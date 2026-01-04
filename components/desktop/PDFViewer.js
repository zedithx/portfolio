'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFViewer({ isOpen, onClose, pdfUrl, title = 'Resume' }) {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const isResizing = useRef(false);
    const startPos = useRef({ x: 0, width: 0 });

    // Reset sidebar state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSidebarVisible(false);
            setSidebarWidth(250);
        }
    }, [isOpen]);

    // Add ESC key handler
    useEffect(() => {
        if (!isOpen) return;
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Handle sidebar resizing
    useEffect(() => {
        if (!isOpen) return;

        const handleMouseMove = (e) => {
            if (isResizing.current) {
                const dx = e.clientX - startPos.current.x;
                const newWidth = Math.max(150, Math.min(400, startPos.current.width + dx));
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.body.style.cursor = 'default';
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isOpen]);

    const startResize = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;
        startPos.current = {
            x: e.clientX,
            width: sidebarWidth
        };
        document.body.style.cursor = 'ew-resize';
    };

    const toggleSidebar = () => {
        setSidebarVisible(prev => !prev);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={(e) => {
                        // Click outside to close
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-6xl h-full max-h-[90vh] md:max-h-[85vh] flex flex-col bg-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Title Bar */}
                        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between shrink-0 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <div 
                                        onClick={onClose}
                                        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 cursor-pointer transition-all" 
                                    />
                                    <div 
                                        className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 cursor-pointer transition-all" 
                                    />
                                    <div 
                                        className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 cursor-pointer transition-all" 
                                    />
                                </div>
                                <span className="text-white/70 text-sm font-medium ml-2">PDF Viewer</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/50 hover:text-white/80 transition-colors text-sm px-3 py-1 rounded hover:bg-white/10"
                            >
                                Close
                            </button>
                        </div>

                        {/* PDF Viewer Container */}
                        <div className="flex-1 overflow-hidden bg-[#0a0a0a] relative flex">
                            {/* Sidebar */}
                            <AnimatePresence>
                                {sidebarVisible && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: sidebarWidth, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-[#1a1a1a] border-r border-white/10 relative shrink-0 overflow-hidden"
                                        style={{ width: sidebarWidth }}
                                    >
                                        {/* Resize Handle */}
                                        <div
                                            onMouseDown={startResize}
                                            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-500/60 active:bg-blue-500/80 transition-colors z-10 group"
                                            style={{ cursor: 'ew-resize' }}
                                        >
                                            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-1 h-8 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors" />
                                        </div>
                                        
                                        {/* Sidebar Content */}
                                        <div className="h-full overflow-y-auto p-4">
                                            <p className="text-white/50 text-xs mb-4">Navigation</p>
                                            <div className="space-y-2">
                                                <div className="text-white/70 text-sm p-2 rounded hover:bg-white/5 cursor-pointer">
                                                    Outline
                                                </div>
                                                <div className="text-white/70 text-sm p-2 rounded hover:bg-white/5 cursor-pointer">
                                                    Thumbnails
                                                </div>
                                                <div className="text-white/70 text-sm p-2 rounded hover:bg-white/5 cursor-pointer">
                                                    Attachments
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* PDF Viewer */}
                            <div className="flex-1 overflow-hidden bg-[#0a0a0a] relative">
                                <iframe
                                    src={`${pdfUrl}#toolbar=1&navpanes=${sidebarVisible ? 1 : 0}&scrollbar=1`}
                                    className="w-full h-full border-0"
                                    title={title}
                                    style={{
                                        minHeight: '100%',
                                    }}
                                />
                                {/* Fallback message for browsers that don't support PDF viewing */}
                                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] pointer-events-none opacity-0">
                                    <div className="text-white/50 text-center p-6">
                                        <p className="mb-2">PDF viewer not supported in this browser.</p>
                                        <a 
                                            href={pdfUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Open PDF in new tab
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with download option */}
                        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between shrink-0 border-t border-white/10">
                            <div className="text-white/50 text-xs">
                                Press ESC to close
                            </div>
                            <a
                                href={pdfUrl}
                                download
                                className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 rounded hover:bg-white/10 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Download PDF
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

