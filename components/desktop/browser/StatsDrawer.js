'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStatsDrawer } from './hooks/useStatsDrawer';
import { Lock } from 'lucide-react';

export default function StatsDrawer({ skills, showButton = true, buttonPosition = 'fixed' }) {
    const { isOpen, openDrawer, closeDrawer, drawerRef } = useStatsDrawer();

    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    return (
        <>
            {/* Stats Button - Game Style */}
            {showButton && (
                <motion.button
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    onClick={openDrawer}
                    className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg shadow-lg font-bold text-sm md:text-base touch-manipulation flex items-center gap-2 relative overflow-hidden ${
                        buttonPosition === 'fixed' ? 'fixed bottom-6 right-6 z-40' : ''
                    }`}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: '2px solid #ffd700',
                        color: '#fff',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                        boxShadow: '0 0 15px rgba(102, 126, 234, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)'
                    }}
                    aria-label="Open character statistics"
                    data-stats-button
                >
                    {!prefersReducedMotion && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        />
                    )}
                    <span className="relative z-10">⚔️ STATS</span>
                </motion.button>
            )}

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
                        onClick={closeDrawer}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Drawer - Game Style Character Stats Screen */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={drawerRef}
                        initial={prefersReducedMotion ? {} : { y: '100%' }}
                        animate={prefersReducedMotion ? {} : { y: 0 }}
                        exit={prefersReducedMotion ? {} : { y: '100%' }}
                        transition={prefersReducedMotion ? {} : { type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
                        style={{
                            background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
                            border: '4px solid #ffd700',
                            borderBottom: 'none',
                            boxShadow: '0 -10px 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(255, 215, 0, 0.1)'
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Character statistics"
                    >
                        {/* Decorative top border */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

                        {/* Drag Handle */}
                        <div 
                            className="w-16 h-2 mx-auto mt-3 mb-2 rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
                                boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)'
                            }}
                        />

                        {/* Header */}
                        <div className="px-6 py-4 border-b-2 border-yellow-400/30 flex items-center justify-between relative">
                            {/* Decorative corners */}
                            <div className="absolute top-2 left-4 w-4 h-4 border-t-2 border-l-2 border-yellow-400 opacity-60" />
                            <div className="absolute top-2 right-4 w-4 h-4 border-t-2 border-r-2 border-yellow-400 opacity-60" />
                            
                            <h2 
                                className="text-2xl md:text-3xl font-bold"
                                style={{
                                    textShadow: '2px 2px 0px #000, 0 0 20px rgba(255, 215, 0, 0.8)',
                                    color: '#ffd700',
                                    letterSpacing: '2px'
                                }}
                            >
                                ⚔️ CHARACTER STATS ⚔️
                            </h2>
                            <button
                                onClick={closeDrawer}
                                className="min-h-[44px] min-w-[44px] p-2 rounded-lg transition-colors touch-manipulation relative"
                                style={{
                                    background: 'rgba(255, 107, 107, 0.3)',
                                    border: '2px solid #ff6b6b',
                                    color: '#fff'
                                }}
                                aria-label="Close statistics"
                            >
                                <span className="text-xl font-bold">✕</span>
                            </button>
                        </div>

                        {/* Skills List - Game Style */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                            {Object.entries(skills).map(([skillName, skill], index) => {
                                const value = skill.value || skill.baseline || 0;
                                const max = skill.max || 100;
                                const percentage = (value / max) * 100;
                                const isLocked = skill.locked === true;

                                // Different colors for different skills
                                const getSkillColor = (name) => {
                                    switch(name) {
                                        case 'Frontend': return { from: '#667eea', to: '#764ba2', glow: 'rgba(102, 126, 234, 0.8)' };
                                        case 'Backend': return { from: '#f093fb', to: '#f5576c', glow: 'rgba(240, 147, 251, 0.8)' };
                                        case 'Hardware': return { from: '#4facfe', to: '#00f2fe', glow: 'rgba(79, 172, 254, 0.8)' };
                                        case 'Telegram Bots': return { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67, 233, 123, 0.8)' };
                                        case 'Deployment': return { from: '#fa709a', to: '#fee140', glow: 'rgba(250, 112, 154, 0.8)' };
                                        case 'DevOps': return { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67, 233, 123, 0.8)' };
                                        case 'LLMs': return { from: '#fee140', to: '#fa709a', glow: 'rgba(254, 225, 64, 0.8)' };
                                        case 'Cloud Infrastructure': return { from: '#4facfe', to: '#00f2fe', glow: 'rgba(79, 172, 254, 0.8)' };
                                        case 'SRE': return { from: '#fa709a', to: '#fee140', glow: 'rgba(250, 112, 154, 0.8)' };
                                        case 'Product Management': return { from: '#667eea', to: '#764ba2', glow: 'rgba(102, 126, 234, 0.8)' };
                                        case 'Social': return { from: '#f093fb', to: '#f5576c', glow: 'rgba(240, 147, 251, 0.8)' };
                                        case 'Recreational': return { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67, 233, 123, 0.8)' };
                                        default: return { from: '#667eea', to: '#764ba2', glow: 'rgba(102, 126, 234, 0.8)' };
                                    }
                                };

                                const colors = getSkillColor(skillName);

                                return (
                                    <motion.div
                                        key={skillName}
                                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                                        transition={prefersReducedMotion ? {} : { delay: index * 0.1 }}
                                        className="p-4 rounded-lg relative overflow-hidden"
                                        style={{
                                            background: isLocked 
                                                ? 'rgba(0, 0, 0, 0.4)' 
                                                : 'rgba(0, 0, 0, 0.3)',
                                            border: `2px solid ${isLocked ? '#666' : '#ffd700'}`,
                                            boxShadow: isLocked 
                                                ? 'none' 
                                                : `0 0 20px ${colors.glow}, inset 0 0 10px rgba(0, 0, 0, 0.3)`
                                        }}
                                    >
                                        {/* Decorative corner elements */}
                                        <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-yellow-400 opacity-40" />
                                        <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-yellow-400 opacity-40" />
                                        <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-yellow-400 opacity-40" />
                                        <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-yellow-400 opacity-40" />

                                        <div className="flex items-center justify-between mb-3 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <h3 
                                                    className="text-lg md:text-xl font-bold"
                                                    style={{
                                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                        color: isLocked ? '#999' : '#fff'
                                                    }}
                                                >
                                                    {skillName.toUpperCase()}
                                                </h3>
                                                {isLocked && (
                                                    <Lock className="w-5 h-5 text-gray-500" aria-label="Locked" />
                                                )}
                                            </div>
                                            {!isLocked && (
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="text-xl md:text-2xl font-bold"
                                                        style={{
                                                            color: '#ffd700',
                                                            textShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
                                                        }}
                                                    >
                                                        {Math.round(value)}
                                                    </span>
                                                    <span className="text-gray-400 text-sm">/ {max}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Progress Bar - Game Style */}
                                        <div 
                                            className="w-full h-6 rounded-full overflow-hidden relative"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.5)',
                                                border: '2px solid rgba(255, 215, 0, 0.5)',
                                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
                                            }}
                                        >
                                            {!isLocked && (
                                                <>
                                                    <motion.div
                                                        initial={prefersReducedMotion ? {} : { width: 0 }}
                                                        animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                                                        transition={prefersReducedMotion ? {} : { duration: 0.8, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
                                                        className="h-full relative overflow-hidden"
                                                        style={{
                                                            background: `linear-gradient(90deg, ${colors.from} 0%, ${colors.to} 100%)`,
                                                            boxShadow: `0 0 15px ${colors.glow}, inset 0 0 10px rgba(255, 255, 255, 0.3)`
                                                        }}
                                                    >
                                                        {/* Animated shine effect */}
                                                        {!prefersReducedMotion && (
                                                            <motion.div
                                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                                                animate={{
                                                                    x: ['-100%', '200%'],
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                    repeatDelay: 1,
                                                                }}
                                                            />
                                                        )}
                                                    </motion.div>
                                                    {/* Level indicator dots */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span 
                                                            className="text-xs font-bold"
                                                            style={{
                                                                color: '#ffd700',
                                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                                            }}
                                                        >
                                                            {Math.round(percentage)}%
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                            {isLocked && (
                                                <div className="h-full flex items-center justify-center">
                                                    <span className="text-xs text-gray-500 font-bold">LOCKED</span>
                                                </div>
                                            )}
                                        </div>

                                        {isLocked && skill.unlockThreshold && (
                                            <p 
                                                className="mt-2 text-xs md:text-sm"
                                                style={{ color: '#999' }}
                                            >
                                                🔒 Unlock: {Object.entries(skill.unlockThreshold).map(([req, val]) => `${req} ≥${val}`).join(', ')}
                                            </p>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
