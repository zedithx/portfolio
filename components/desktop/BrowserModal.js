'use client';
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { contentData, aboutMeData, projectData } from '../../data/data';
import CashShopView from './browser/CashShopView';
import BrowserView from './browser/BrowserView';
import FormalAboutMeView from './browser/FormalAboutMeView';
import AboutMeView from './browser/AboutMeView';

export default function BrowserModal({ type, onClose, onPermissionError }) {
    const [showInteractiveJourney, setShowInteractiveJourney] = useState(false);
    
    // Memoize data access to prevent unnecessary recalculations
    const data = useMemo(() => contentData[type], [type]);
    const isCashShop = useMemo(() => type === 'projects' && data && data.items, [type, data]);
    const isAboutMe = type === 'about-me';
    
    // Calculate total commits from all projects automatically
    const commits = useMemo(() => {
        let total = 0;
        Object.keys(projectData).forEach(category => {
            projectData[category].forEach(project => {
                if (project.commits && typeof project.commits === 'number') {
                    total += project.commits;
                }
            });
        });
        return total;
    }, []);

    // Reset interactive journey state when modal type changes
    useEffect(() => {
        if (isAboutMe) {
            setShowInteractiveJourney(false);
        }
    }, [type, isAboutMe]);

    // Stable callback for toggling to interactive journey
    const handleToggleToInteractive = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setShowInteractiveJourney(true);
    }, []);

    // Add ESC key handler
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // About Me Layout (formal view or interactive journey)
    if (isAboutMe) {
    return (
        <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                onClick={(e) => {
                    // Click outside to close
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <AnimatePresence mode="wait">
                <motion.div
                        key={showInteractiveJourney ? 'interactive' : 'formal'}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-7xl h-full max-h-[90vh] md:max-h-[85vh] flex flex-col relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showInteractiveJourney ? (
                            <>
                                {/* Yellow X Button - Top Right within modal - Only for interactive journey */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    onTouchEnd={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="absolute top-4 right-4 z-[10001] min-h-[44px] min-w-[44px] md:min-h-[36px] md:min-w-[36px] p-2 rounded-lg flex items-center justify-center touch-manipulation"
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.8)',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid #ffd700',
                                        color: '#ffd700',
                                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                                        pointerEvents: 'auto',
                                        WebkitTapHighlightColor: 'transparent'
                                    }}
                                    whileHover={{ 
                                        scale: 1.1, 
                                        boxShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
                                        background: 'rgba(0, 0, 0, 0.95)',
                                        transition: { duration: 0, ease: 'linear' }
                                    }}
                                    transition={{ 
                                        opacity: { duration: 0.3, delay: 0.5 },
                                        scale: { duration: 0 },
                                        boxShadow: { duration: 0 },
                                        background: { duration: 0 }
                                    }}
                                    whileTap={{ 
                                        scale: 0.95,
                                        transition: { duration: 0, ease: 'linear' }
                                    }}
                                    aria-label="Exit to main page"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                                <AboutMeView 
                                    data={aboutMeData}
                                    onModeChange={() => {}}
                                    onToggleToFormal={() => setShowInteractiveJourney(false)}
                                />
                            </>
                        ) : (
                            <FormalAboutMeView 
                                onToggleToInformal={handleToggleToInteractive}
                                onClose={onClose}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
        </motion.div>
    );
    }

    // Cash Shop Layout
    if (isCashShop) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                    onClick={(e) => {
                        // Click outside to close
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-7xl h-full max-h-screen sm:max-h-[95vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CashShopView 
                            onClose={onClose}
                            onPermissionError={onPermissionError}
                            data={data}
                            commits={commits}
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Regular Browser Layout (for background, experience, etc.)
    if (!data) {
        return null; // Safety check
    }
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                onClick={(e) => {
                    // Click outside to close
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-full max-w-7xl h-full max-h-[90vh] md:max-h-[85vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <BrowserView 
                        type={type}
                        data={data}
                        onClose={onClose}
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
