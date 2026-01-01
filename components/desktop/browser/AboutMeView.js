'use client';
import React, { useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSkillProgression } from './hooks/useSkillProgression';
import HeroSection from './HeroSection';
import JourneyFeed from './JourneyFeed';
import StatsDrawer from './StatsDrawer';
import SkillBreakdown from './SkillBreakdown';
import RecreationalSection from './RecreationalSection';

export default function AboutMeView({ data }) {
    const journeyStartRef = useRef(null);
    
    // Initialize skills from data - pass raw skill data, hook will handle initialization
    const initialSkills = useMemo(() => {
        return data.skills;
    }, [data.skills]);

    const { skills, updateSkills, isSREUnlocked } = useSkillProgression(initialSkills);

    const handleStartJourney = useCallback(() => {
        if (journeyStartRef.current) {
            journeyStartRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
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
            className="w-full min-h-screen relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Animated background particles */}
            {!prefersReducedMotion && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.1, 0.5, 0.1],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 relative z-10">
                {/* Hero Section */}
                <HeroSection 
                    hero={data.hero} 
                    onStartJourney={handleStartJourney}
                />

                {/* Journey Feed */}
                <div ref={journeyStartRef}>
                    <JourneyFeed
                        journey={data.journey}
                        updateSkills={updateSkills}
                        onSkillGain={handleSkillGain}
                    />
                </div>

                {/* Skill Breakdown */}
                <SkillBreakdown skills={skills} />

                {/* Recreational & Social */}
                <RecreationalSection
                    recreational={data.recreational}
                    social={data.social}
                />
            </div>

            {/* Stats Drawer */}
            <StatsDrawer skills={skills} />
        </div>
    );
}

