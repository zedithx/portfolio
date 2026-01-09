'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UnlockNotification({ 
    unlockedSkills, 
    skills, 
    prefersReducedMotion 
}) {
    if (!unlockedSkills || unlockedSkills.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0, y: -50 }}
                animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0, y: -20 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5, type: 'spring', stiffness: 300 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
                style={{
                    minWidth: '280px',
                    maxWidth: '90vw'
                }}
            >
                <div
                    className="relative p-4 md:p-6 rounded-lg text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(30, 20, 50, 0.98) 100%)',
                        border: '3px solid #ffd700',
                        boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), inset 0 0 30px rgba(255, 215, 0, 0.2)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400"></div>
                    
                    <motion.div
                        initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                        animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.6, type: 'spring', stiffness: 200 }}
                        className="text-4xl md:text-5xl mb-2"
                    >
                        🔓
                    </motion.div>
                    <h3
                        className="text-lg md:text-xl font-bold mb-2"
                        style={{
                            color: '#ffd700',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 215, 0, 0.6)',
                            letterSpacing: '1px'
                        }}
                    >
                        {unlockedSkills.length === 1 ? 'SKILL UNLOCKED!' : 'SKILLS UNLOCKED!'}
                    </h3>
                    <div className="space-y-2">
                        {unlockedSkills.map((skillName, index) => (
                            <div key={`${skillName}-${index}`}>
                                <p
                                    className="text-base md:text-lg font-semibold"
                                    style={{
                                        color: '#ffd700',
                                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
                                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                                    }}
                                >
                                    {skills[skillName]?.displayName || skillName}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p
                        className="text-xs md:text-sm mt-3 text-yellow-300/80"
                        style={{
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                        }}
                    >
                        {unlockedSkills.length === 1 
                            ? (unlockedSkills[0] === 'SRE' 
                                ? 'Unlocked by gaining DevOps experience!' 
                                : unlockedSkills[0] === 'DevOps' 
                                ? 'Unlocked by gaining Backend experience!' 
                                : unlockedSkills[0] === 'Cloud Infrastructure'
                                ? 'Unlocked by gaining Backend experience!'
                                : 'New skill available!')
                            : 'Unlocked by gaining Backend experience!'}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
