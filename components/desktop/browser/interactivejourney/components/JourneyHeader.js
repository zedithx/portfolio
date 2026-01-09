'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

export default function JourneyHeader({
    prefersReducedMotion,
    showSummary,
    isTransitioning,
    goToSummary
}) {
    return (
        <motion.h2 
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3, ease: 'easeOut' }}
            className="text-lg md:text-xl lg:text-2xl font-bold px-4 md:px-6 py-3 md:py-4 shrink-0"
            style={{
                textShadow: '2px 2px 0px #000, 0 0 20px rgba(255, 215, 0, 0.6)',
                color: '#ffd700',
                letterSpacing: '1px',
                willChange: 'opacity'
            }}
        >
            <div className="flex items-center justify-between w-full pr-12 md:pr-16">
                <span>ADVENTURE LOG</span>
                <div className="flex items-center gap-2">
                    {!showSummary && (
                        <motion.button
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2, ease: 'easeOut' }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isTransitioning) {
                                    goToSummary();
                                }
                            }}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isTransitioning) {
                                    goToSummary();
                                }
                            }}
                            disabled={isTransitioning}
                            className={`px-2 py-2 md:px-3 md:py-1.5 rounded-lg flex items-center gap-1.5 md:gap-2 transition-all touch-manipulation min-h-[44px] md:min-h-0 z-[100] ${
                                isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:scale-105 active:scale-95'
                            }`}
                            style={{
                                background: 'rgba(139, 69, 19, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid #8B4513',
                                color: '#ffd700',
                                boxShadow: '0 0 15px rgba(139, 69, 19, 0.5)',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                pointerEvents: isTransitioning ? 'none' : 'auto',
                                position: 'relative',
                                zIndex: 100,
                                willChange: 'opacity'
                            }}
                            whileHover={prefersReducedMotion || isTransitioning ? {} : { scale: 1.05 }}
                            whileTap={prefersReducedMotion || isTransitioning ? {} : { scale: 0.95 }}
                            aria-label="Skip to summary"
                        >
                            <ScrollText className="w-6 h-6 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm font-bold hidden sm:inline">Skip to Summary</span>
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.h2>
    );
}
