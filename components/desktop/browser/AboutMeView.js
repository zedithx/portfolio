'use client';
import React, { useRef, useCallback, useMemo, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillProgression } from './hooks/useSkillProgression';
import HeroSection from './HeroSection';
import StatsDrawer from './StatsDrawer';

// Lazy load JourneySlideshow for better initial load performance
const JourneySlideshow = lazy(() => import('./JourneySlideshow'));

export default function AboutMeView({ data }) {
    const journeyStartRef = useRef(null);
    const [journeyStarted, setJourneyStarted] = useState(false);
    
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

    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    return (
        <div 
            className="fixed inset-0 w-full h-full relative overflow-hidden"
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
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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

            {/* Main Content - Full Screen Container - Scrollable on mobile */}
            <div className="absolute inset-0 w-full h-full overflow-hidden lg:overflow-hidden overflow-y-auto lg:overflow-y-hidden">
                {/* Hero Section - Full Screen Initially */}
                <AnimatePresence mode="wait">
                    {!journeyStarted && (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: -50 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="fixed inset-0 flex items-center justify-center z-50"
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
                    {journeyStarted && (
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

