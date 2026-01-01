'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function SkillBreakdown({ skills }) {
    const [expandedSkill, setExpandedSkill] = useState(null);

    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    const toggleSkill = (skillName) => {
        setExpandedSkill(prev => prev === skillName ? null : skillName);
    };

    const getSkillIcon = (skillName) => {
        switch(skillName) {
            case 'Frontend': return '🎨';
            case 'Backend': return '⚙️';
            case 'Hardware': return '🔌';
            case 'Telegram Bots': return '🤖';
            case 'Deployment': return '🚀';
            case 'DevOps': return '🔧';
            case 'LLMs': return '🧠';
            case 'Cloud Infrastructure': return '☁️';
            case 'SRE': return '🛡️';
            case 'Product Management': return '📊';
            case 'Social': return '🤝';
            case 'Recreational': return '🎮';
            default: return '⚔️';
        }
    };

    const getSkillColor = (skillName) => {
        switch(skillName) {
            case 'Frontend': return { from: '#667eea', to: '#764ba2', glow: 'rgba(102, 126, 234, 0.6)' };
            case 'Backend': return { from: '#f093fb', to: '#f5576c', glow: 'rgba(240, 147, 251, 0.6)' };
            case 'Hardware': return { from: '#4facfe', to: '#00f2fe', glow: 'rgba(79, 172, 254, 0.6)' };
            case 'Telegram Bots': return { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67, 233, 123, 0.6)' };
            case 'Deployment': return { from: '#fa709a', to: '#fee140', glow: 'rgba(250, 112, 154, 0.6)' };
            case 'DevOps': return { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67, 233, 123, 0.6)' };
            case 'LLMs': return { from: '#fee140', to: '#fa709a', glow: 'rgba(254, 225, 64, 0.6)' };
            case 'Cloud Infrastructure': return { from: '#4facfe', to: '#00f2fe', glow: 'rgba(79, 172, 254, 0.6)' };
            case 'SRE': return { from: '#fa709a', to: '#fee140', glow: 'rgba(250, 112, 154, 0.6)' };
            case 'Product Management': return { from: '#667eea', to: '#764ba2', glow: 'rgba(102, 126, 234, 0.6)' };
            case 'Social': return { from: '#f093fb', to: '#f5576c', glow: 'rgba(240, 147, 251, 0.6)' };
            case 'Recreational': return { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67, 233, 123, 0.6)' };
            default: return { from: '#667eea', to: '#764ba2', glow: 'rgba(102, 126, 234, 0.6)' };
        }
    };

    return (
        <section className="w-full mb-8">
            <motion.h2 
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold px-4 mb-6"
                style={{
                    textShadow: '2px 2px 0px #000, 0 0 20px rgba(255, 215, 0, 0.6)',
                    color: '#ffd700',
                    letterSpacing: '2px'
                }}
            >
                ⚔️ ABILITY TREE ⚔️
            </motion.h2>
            <div className="space-y-3">
                {Object.entries(skills).map(([skillName, skill], index) => {
                    const isExpanded = expandedSkill === skillName;
                    const isLocked = skill.locked === true;
                    const colors = getSkillColor(skillName);
                    const icon = getSkillIcon(skillName);

                    return (
                        <motion.div
                            key={skillName}
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? {} : { delay: index * 0.1 }}
                            className="w-full rounded-lg overflow-hidden relative"
                            style={{
                                background: isLocked 
                                    ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                                    : `linear-gradient(135deg, ${colors.from}20 0%, ${colors.to}20 100%)`,
                                border: `3px solid ${isLocked ? '#666' : '#ffd700'}`,
                                boxShadow: isLocked 
                                    ? '0 4px 15px rgba(0, 0, 0, 0.4)' 
                                    : `0 4px 20px ${colors.glow}, inset 0 0 20px rgba(0, 0, 0, 0.2)`
                            }}
                        >
                            {/* Decorative corner elements */}
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400 opacity-60" />
                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400 opacity-60" />
                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400 opacity-60" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400 opacity-60" />

                            {/* Accordion Header - Game Style */}
                            <motion.button
                                onClick={() => !isLocked && toggleSkill(skillName)}
                                disabled={isLocked}
                                whileHover={!isLocked && !prefersReducedMotion ? { scale: 1.02 } : {}}
                                whileTap={!isLocked && !prefersReducedMotion ? { scale: 0.98 } : {}}
                                className={`w-full min-h-[60px] px-4 md:px-6 py-4 flex items-center justify-between text-left touch-manipulation relative overflow-hidden ${
                                    isLocked 
                                        ? 'cursor-not-allowed opacity-60' 
                                        : 'cursor-pointer'
                                }`}
                                aria-expanded={isExpanded}
                                aria-disabled={isLocked}
                                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${skillName} ability details`}
                            >
                                {/* Background glow effect when hovered */}
                                {!isLocked && !prefersReducedMotion && (
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(90deg, ${colors.from}40, ${colors.to}40)`,
                                            opacity: isExpanded ? 0.3 : 0
                                        }}
                                        animate={{
                                            opacity: isExpanded ? 0.3 : 0
                                        }}
                                    />
                                )}

                                <div className="flex items-center gap-4 relative z-10">
                                    {/* Ability Icon */}
                                    <div 
                                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-3xl md:text-4xl border-2"
                                        style={{
                                            borderColor: isLocked ? '#666' : '#ffd700',
                                            background: isLocked 
                                                ? 'rgba(0, 0, 0, 0.5)' 
                                                : `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                                            boxShadow: isLocked 
                                                ? 'none' 
                                                : `0 0 20px ${colors.glow}, inset 0 0 10px rgba(255, 255, 255, 0.2)`
                                        }}
                                    >
                                        {icon}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 
                                                className="text-xl md:text-2xl font-bold"
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
                                            <p 
                                                className="text-sm md:text-base mt-1"
                                                style={{ color: '#ffd700' }}
                                            >
                                                {skill.value || skill.baseline || 0} / {skill.max || 100} Mastery
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {!isLocked && (
                                    <motion.div
                                        animate={prefersReducedMotion ? {} : { rotate: isExpanded ? 180 : 0 }}
                                        transition={prefersReducedMotion ? {} : { duration: 0.3 }}
                                        className="relative z-10"
                                        style={{ color: '#ffd700' }}
                                    >
                                        {isExpanded ? (
                                            <ChevronUp className="w-6 h-6" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6" />
                                        )}
                                    </motion.div>
                                )}
                            </motion.button>

                            {/* Accordion Content - Game Style */}
                            <AnimatePresence>
                                {isExpanded && !isLocked && (
                                    <motion.div
                                        initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                                        animate={prefersReducedMotion ? {} : { height: 'auto', opacity: 1 }}
                                        exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                                        transition={prefersReducedMotion ? {} : { duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div 
                                            className="px-4 md:px-6 pb-4 pt-2 border-t-2 relative"
                                            style={{
                                                borderColor: '#ffd700',
                                                background: 'rgba(0, 0, 0, 0.3)'
                                            }}
                                        >
                                            {/* Description */}
                                            <p 
                                                className="text-white/90 mb-4 leading-relaxed text-sm md:text-base"
                                                style={{
                                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                                }}
                                            >
                                                {skill.description}
                                            </p>
                                            
                                            {/* Sub-skills - Game Style Badges */}
                                            {skill.subSkills && skill.subSkills.length > 0 && (
                                                <div>
                                                    <h4 
                                                        className="text-sm font-bold mb-3"
                                                        style={{
                                                            color: '#ffd700',
                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                                        }}
                                                    >
                                                        LEARNED ABILITIES:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {skill.subSkills.map((subSkill, idx) => (
                                                            <motion.span
                                                                key={idx}
                                                                initial={prefersReducedMotion ? {} : { scale: 0 }}
                                                                animate={prefersReducedMotion ? {} : { scale: 1 }}
                                                                transition={prefersReducedMotion ? {} : { delay: idx * 0.05, type: 'spring' }}
                                                                className="px-3 py-2 rounded text-xs md:text-sm font-bold border-2"
                                                                style={{
                                                                    background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                                                                    borderColor: '#ffd700',
                                                                    color: '#fff',
                                                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                                    boxShadow: `0 0 10px ${colors.glow}`
                                                                }}
                                                            >
                                                                {subSkill}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {isLocked && skill.unlockThreshold && (
                                                <div 
                                                    className="mt-4 p-3 rounded"
                                                    style={{
                                                        background: 'rgba(255, 0, 0, 0.2)',
                                                        border: '1px solid #ff6b6b'
                                                    }}
                                                >
                                                    <p 
                                                        className="text-sm"
                                                        style={{ color: '#ffd700' }}
                                                    >
                                                        🔒 Unlock Requirements: {Object.entries(skill.unlockThreshold).map(([req, val]) => `${req} ≥${val}`).join(', ')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
