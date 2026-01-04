'use client';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { aboutMeData } from '../../data/data';

// Lazy load AboutMeView for better performance
// Add minimum delay to show loading animation for longer
const AboutMeView = dynamic(
    () => Promise.all([
        import('../../components/desktop/browser/AboutMeView'),
        new Promise(resolve => setTimeout(resolve, 1500)) // Minimum 1.5 second delay
    ]).then(([module]) => module),
    { 
        ssr: false
    }
);

export default function WhoAmIPage() {
    const router = useRouter();
    const exitButtonRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // Reset sessionStorage on page load to start fresh each time
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('aboutMe_skillProgression');
            sessionStorage.removeItem('aboutMe_processedCards');
        }
    }, []);

    // Handle smooth transition from loading to content
    useEffect(() => {
        // Wait for minimum load time, then fade out loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleExit = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Use window.location for more reliable navigation
        window.location.href = '/';
    }, []);

    // ESC key to exit
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleExit(e);
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [handleExit]);

    // Attach touch event listener for exit button on mobile
    useEffect(() => {
        const exitButton = exitButtonRef.current;
        
        const handleTouchEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleExit(e);
        };

        if (exitButton) {
            exitButton.addEventListener('touchend', handleTouchEnd, { passive: false });
        }

        return () => {
            if (exitButton) {
                exitButton.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [handleExit]);

    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden">
            {/* Exit Button - High z-index to ensure it's always on top and clickable */}
            <motion.button
                ref={exitButtonRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleExit(e);
                }}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleExit(e);
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="fixed top-2 right-2 md:right-4 z-[10000] min-h-[44px] min-w-[44px] md:min-h-[36px] md:min-w-[36px] p-2 rounded-lg flex items-center justify-center touch-manipulation"
                style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid #ffd700',
                    color: '#ffd700',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                    position: 'fixed',
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

            {/* Loading Screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-3 sm:p-2 md:p-4 lg:p-6 z-50"
                    >
                        <motion.div 
                            className="w-full max-w-2xl flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 relative mx-auto text-center"
                            style={{
                                background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
                                border: '3px solid #ffd700',
                                borderRadius: '16px',
                                boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            {/* Decorative corner elements */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-400 opacity-60" />
                            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-400 opacity-60" />
                            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-400 opacity-60" />
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-400 opacity-60" />

                            {/* Loading spinner */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 md:w-20 md:h-20 mb-6"
                                style={{
                                    border: '4px solid rgba(255, 215, 0, 0.3)',
                                    borderTop: '4px solid #ffd700',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
                                }}
                            />
                            
                            {/* Loading text */}
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl md:text-3xl font-bold mb-2"
                                style={{
                                    color: '#ffd700',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 215, 0, 0.6)',
                                    letterSpacing: '2px',
                                    fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif"
                                }}
                            >
                                LOADING ADVENTURE...
                            </motion.h2>
                            
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-yellow-400/80 text-sm md:text-base text-center"
                                style={{
                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                                }}
                            >
                                Preparing your journey...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content - Always rendered, just hidden behind loading screen */}
            <div className="fixed inset-0 w-full h-full">
                <AboutMeView data={aboutMeData} />
            </div>
        </div>
    );
}


