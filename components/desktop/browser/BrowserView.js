'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCw, Lock, Star, Share, Plus } from 'lucide-react';
import AboutMeView from './AboutMeView';
import { aboutMeData } from './data';

export default function BrowserView({ type, data, onClose }) {
    // If background type, render AboutMeView instead
    if (type === 'background') {
        return (
            <>
                {/* Browser Chrome */}
                <div className="bg-[#f6f6f6] rounded-t-xl border border-gray-200 border-b-0 shrink-0">
                    {/* Title Bar */}
                    <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 relative">
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all group flex items-center justify-center">
                                <X className="w-2 h-2 text-[#ff5f57] group-hover:text-red-800" />
                            </button>
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 text-[10px] md:text-sm text-gray-600 font-medium truncate max-w-[150px] md:max-w-none">
                            About Me
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-gray-400">
                            <Plus className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:text-gray-600" />
                        </div>
                    </div>

                    {/* Navigation & URL Bar */}
                    <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2">
                        <div className="flex items-center gap-0.5 md:gap-1">
                            <button 
                                disabled
                                className="p-1 md:p-1.5 rounded-lg transition-colors text-gray-300 cursor-not-allowed"
                            >
                                <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                            <button 
                                disabled
                                className="p-1 md:p-1.5 rounded-lg transition-colors text-gray-300 cursor-not-allowed"
                            >
                                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                            <button className="hidden sm:block p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
                                <RotateCw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 flex items-center gap-1.5 md:gap-2 bg-white rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-gray-200 min-w-0">
                            <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400 shrink-0" />
                            <span className="text-[10px] md:text-sm text-gray-600 truncate">portfolio.dev/background</span>
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                            <Share className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                            <Star className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center px-2 -mb-px">
                        <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-t-lg border border-gray-200 border-b-white text-[10px] md:text-sm">
                            <span className="text-gray-700">About Me</span>
                            <X className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Browser Content - AboutMeView */}
                <div className="flex-1 bg-white rounded-b-xl border border-gray-200 border-t-0 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        <AboutMeView data={aboutMeData} />
                    </div>
                </div>
            </>
        );
    }
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = data.pages ? data.pages.length : 0;

    const goNext = useCallback(() => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, totalPages]);

    const goPrev = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);

    return (
        <>
            {/* Browser Chrome */}
            <div className="bg-[#f6f6f6] rounded-t-xl border border-gray-200 border-b-0 shrink-0">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 relative">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all group flex items-center justify-center">
                            <X className="w-2 h-2 text-[#ff5f57] group-hover:text-red-800" />
                        </button>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 text-[10px] md:text-sm text-gray-600 font-medium truncate max-w-[150px] md:max-w-none">
                        {data.pages[currentPage].title}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-gray-400">
                        <Plus className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:text-gray-600" />
                    </div>
                </div>

                {/* Navigation & URL Bar */}
                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2">
                    <div className="flex items-center gap-0.5 md:gap-1">
                        <button 
                            onClick={goPrev}
                            disabled={currentPage === 0}
                            className={`p-1 md:p-1.5 rounded-lg transition-colors ${currentPage === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button 
                            onClick={goNext}
                            disabled={currentPage === totalPages - 1}
                            className={`p-1 md:p-1.5 rounded-lg transition-colors ${currentPage === totalPages - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button className="hidden sm:block p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
                            <RotateCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center gap-1.5 md:gap-2 bg-white rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-gray-200 min-w-0">
                        <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400 shrink-0" />
                        <span className="text-[10px] md:text-sm text-gray-600 truncate">portfolio.dev/{type}</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <Share className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <Star className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center px-2 -mb-px">
                    <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-t-lg border border-gray-200 border-b-white text-[10px] md:text-sm">
                        <span className="text-gray-700">{data.title}</span>
                        <X className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Browser Content */}
            <div className="flex-1 bg-white rounded-b-xl border border-gray-200 border-t-0 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {data.pages[currentPage].content}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Page Indicator */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
                        {data.pages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentPage 
                                        ? 'bg-gray-800 w-6' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

