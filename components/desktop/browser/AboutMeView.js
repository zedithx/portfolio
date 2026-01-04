'use client';
import React, { useRef, useCallback, useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillProgression } from './hooks/useSkillProgression';
import HeroSection from './HeroSection';
import StatsDrawer from './StatsDrawer';
import FormalAboutMeView from './FormalAboutMeView';

// Lazy load JourneySlideshow for better initial load performance
const JourneySlideshow = lazy(() => import('./JourneySlideshow'));

export default function AboutMeView({ data, onModeChange, onToggleToFormal }) {
    const journeyStartRef = useRef(null);
    const [journeyStarted, setJourneyStarted] = useState(false);
    const [isFormalMode, setIsFormalMode] = useState(false); // Always informal when opened from modal
    const [isLoading, setIsLoading] = useState(true); // Show loading screen initially
    
    // Notify parent of mode changes
    useEffect(() => {
        if (onModeChange) {
            onModeChange(isFormalMode);
        }
    }, [isFormalMode, onModeChange]);
    
    // Initialize skills from data - pass raw skill data, hook will handle initialization
    const initialSkills = useMemo(() => {
        return data.skills;
    }, [data.skills]);

    const { skills, updateSkills, isSREUnlocked } = useSkillProgression(initialSkills);

    const handleStartJourney = useCallback(() => {
        setJourneyStarted(true);
        // Small delay to allow hero exit animation, then scroll to journey
        setTimeout(() => {
            if (journeyStartRef.current) {
                journeyStartRef.current.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 500);
    }, []);

    const handleSkillGain = useCallback((cardId, skillDeltas) => {
        // Optional: Additional handling when skills are gained
        // Could trigger animations, sounds, etc.
    }, []);

    const handleToggleToInformal = useCallback(() => {
        setIsFormalMode(false);
    }, []);

    const handleToggleToFormal = useCallback(() => {
        if (onToggleToFormal) {
            onToggleToFormal();
        } else {
            setIsFormalMode(true);
        }
    }, [onToggleToFormal]);

    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    // Show loading screen initially, then fade to content
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Minimum 1.5 second delay
        return () => clearTimeout(timer);
    }, []);

    // Render formal view (default for headhunters)
    if (isFormalMode) {
        return (
            <div className="w-full h-full flex flex-col">
                <FormalAboutMeView onToggleToInformal={handleToggleToInformal} />
            </div>
        );
    }

    // Render informal/interactive view
    return (
        <div 
            className="w-full h-full relative overflow-hidden rounded-xl"
            style={{
                background: `
                    radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.06) 0%, transparent 50%),
                    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
                `,
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Gamified background effects - Optimized for performance */}
            {!prefersReducedMotion && (
                <>
                    {/* Spawning dots effect - Optimized: reduced count and simplified shadows */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        {Array.from({ length: 15 }, (_, i) => {
                            const left = Math.random() * 100;
                            const spawnDelay = Math.random() * 3;
                            const duration = 2 + Math.random() * 2;
                            const fallDistance = typeof window !== 'undefined' ? window.innerHeight + 100 : 1000;
                            const size = 2.5; // Fixed size for better performance
                            const opacity = 0.8;
                            return (
                                <motion.div
                                    key={`spawn-dot-${i}`}
                                    className="absolute rounded-full bg-yellow-400"
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        left: `${left}%`,
                                        top: '-10px',
                                        boxShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
                                        opacity: opacity,
                                        willChange: 'transform',
                                        transform: 'translateZ(0)' // GPU acceleration
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, opacity, opacity, 0],
                                        scale: [0, 1.2, 1, 0.8],
                                        y: [0, fallDistance],
                                    }}
                                    transition={{
                                        duration,
                                        repeat: Infinity,
                                        delay: spawnDelay,
                                        ease: 'linear'
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Floating glowing particles - Optimized: reduced count */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        {Array.from({ length: 8 }, (_, i) => {
                            const left = 10 + (i * 11);
                            const top = 15 + (i % 3) * 30;
                            const duration = 3 + (i * 0.4);
                            const delay = i * 0.3;
                            const size = 2.5; // Fixed size
                            return (
                                <motion.div
                                    key={`float-particle-${i}`}
                                    className="absolute rounded-full bg-yellow-400"
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        left: `${left}%`,
                                        top: `${top}%`,
                                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.9)',
                                        opacity: 0.8,
                                        willChange: 'transform',
                                        transform: 'translateZ(0)' // GPU acceleration
                                    }}
                                    animate={{
                                        y: [0, -30, 0],
                                        opacity: [0.5, 1, 0.5],
                                        scale: [1, 1.5, 1],
                                        x: [0, Math.sin(i) * 15, 0]
                                    }}
                                    transition={{
                                        duration,
                                        repeat: Infinity,
                                        delay,
                                        ease: 'easeInOut'
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Falling stars/sparkles - Optimized: reduced count and simplified filter */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        {Array.from({ length: 8 }, (_, i) => {
                            const left = 10 + (i * 11);
                            const fallDelay = i * 0.8;
                            const duration = 4 + Math.random() * 2;
                            const size = 16; // Fixed size
                            return (
                                <motion.div
                                    key={`falling-star-${i}`}
                                    className="absolute text-yellow-300"
                                    style={{
                                        left: `${left}%`,
                                        top: '-20px',
                                        fontSize: `${size}px`,
                                        filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))',
                                        opacity: 0.9,
                                        willChange: 'transform',
                                        transform: 'translateZ(0)' // GPU acceleration
                                    }}
                                    initial={{ opacity: 0, rotate: 0 }}
                                    animate={{
                                        opacity: [0, 0.9, 0.9, 0],
                                        y: [0, typeof window !== 'undefined' ? window.innerHeight + 100 : 1000],
                                        rotate: [0, 180, 360],
                                        x: [0, Math.sin(i) * 30, 0]
                                    }}
                                    transition={{
                                        duration,
                                        repeat: Infinity,
                                        delay: fallDelay,
                                        ease: 'easeIn'
                                    }}
                                >
                                    ✨
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Loading Screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute inset-0 flex items-center justify-center z-[100] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-xl"
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

            {/* Main Content - Full Screen Container - Scrollable on mobile */}
            <div className="absolute inset-0 w-full h-full overflow-hidden lg:overflow-hidden overflow-y-auto lg:overflow-y-hidden">
                {/* Hero Section - Full Screen Initially */}
                <AnimatePresence mode="wait">
                    {!journeyStarted && !isLoading && (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: -50 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="absolute inset-0 flex items-center justify-center z-50"
                        >
                            <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
                                <HeroSection 
                                    hero={data.hero} 
                                    onStartJourney={handleStartJourney}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Journey Content - Appears after hero disappears */}
                <AnimatePresence>
                    {journeyStarted && !isLoading && (
                        <motion.div
                            key="journey"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="absolute inset-0 w-full h-full flex flex-col"
                        >
                            {/* Journey Slideshow with integrated skills - Takes full space on mobile */}
                            <div ref={journeyStartRef} className="flex-1 min-h-0 overflow-hidden w-full">
                                <Suspense fallback={
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-yellow-400 text-xl">Loading adventure...</div>
                                    </div>
                                }>
                                    <JourneySlideshow
                                        journey={data.journey}
                                        updateSkills={updateSkills}
                                        onSkillGain={handleSkillGain}
                                        hero={data.hero}
                                        skills={skills}
                                        onToggleToFormal={handleToggleToFormal}
                                    />
                                </Suspense>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stats Drawer (drawer only, no button) */}
            <StatsDrawer skills={skills} showButton={false} />
        </div>
    );
}

