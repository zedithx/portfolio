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

    // Memoize particle positions to avoid recalculation - Reduced count
    const particlePositions = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        }));
    }, []);

    return (
        <div 
            className="fixed inset-0 w-full h-full relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Optimized animated background particles - reduced count */}
            {!prefersReducedMotion && !journeyStarted && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    {particlePositions.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.1, 0.5, 0.1],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                delay: particle.delay,
                                ease: 'easeInOut'
                            }}
                        />
                    ))}
                </div>
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

