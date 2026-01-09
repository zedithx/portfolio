'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AboutMeView from './AboutMeView';
import BrowserChrome from './BrowserChrome';
import { aboutMeData } from '../../../data/data';
import { useTheme } from '../../../contexts/ThemeContext';

export default function BrowserView({ type, data, onClose }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    // If background type, render AboutMeView instead
    if (type === 'background') {
        return (
            <>
                <BrowserChrome
                    isDark={false}
                    title="About Me"
                    url="portfolio.dev/background"
                    onClose={onClose}
                    showReload={true}
                />
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

    const handleReload = useCallback(() => {
        // Reset to first page and scroll to top
        if (currentPage !== 0) {
            setCurrentPage(0);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    return (
        <>
            <BrowserChrome
                isDark={isDark}
                title={data.pages[currentPage]?.title || data.title}
                tabTitle={data.title}
                url={`portfolio.dev/${type}`}
                onClose={onClose}
                showReload={true}
                onPrev={goPrev}
                onNext={goNext}
                canGoPrev={currentPage > 0}
                canGoNext={currentPage < totalPages - 1}
                onReload={handleReload}
            />

            {/* Browser Content */}
            <div className={`flex-1 rounded-b-xl border border-t-0 overflow-hidden flex flex-col ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {typeof data.pages[currentPage].content === 'function' 
                                ? data.pages[currentPage].content(isDark)
                                : data.pages[currentPage].content
                            }
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

