'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollTrigger } from './hooks/useScrollTrigger';

export default function JourneyFeed({ journey, updateSkills, onSkillGain }) {
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [toast, setToast] = useState(null);

    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    const showToast = useCallback((message) => {
        setToast(message);
        setTimeout(() => {
            setToast(null);
        }, 2000);
    }, []);

    const handleCardTrigger = useCallback((card) => {
        const updated = updateSkills(card.id, card.skillsGained);
        if (updated) {
            // Show toast with skill gains
            const skillNames = Object.keys(card.skillsGained).join(', ');
            showToast(`⚔️ LEVEL UP! +${skillNames}`);
            if (onSkillGain) {
                onSkillGain(card.id, card.skillsGained);
            }
        }
    }, [updateSkills, showToast, onSkillGain]);

    const toggleSkillsGained = useCallback((cardId) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cardId)) {
                newSet.delete(cardId);
            } else {
                newSet.add(cardId);
            }
            return newSet;
        });
    }, []);

    return (
        <>
            <section className="w-full space-y-4 md:space-y-6 mb-8">
                <motion.h2 
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold px-4"
                    style={{
                        textShadow: '2px 2px 0px #000, 0 0 20px rgba(255, 215, 0, 0.6)',
                        color: '#ffd700',
                        letterSpacing: '2px'
                    }}
                >
                    ⚔️ ADVENTURE LOG ⚔️
                </motion.h2>
                <div className="space-y-4">
                    {journey.map((card, index) => (
                        <JourneyCard
                            key={card.id}
                            card={card}
                            index={index}
                            isExpanded={expandedCards.has(card.id)}
                            onToggleSkills={() => toggleSkillsGained(card.id)}
                            onTrigger={() => handleCardTrigger(card)}
                            prefersReducedMotion={prefersReducedMotion}
                        />
                    ))}
                </div>
            </section>

            {/* Toast Notification - Game Style */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.8 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.8 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.3, type: 'spring' }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl text-base md:text-lg font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 100%)',
                            border: '3px solid #ffd700',
                            color: '#ffd700',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                            boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)'
                        }}
                        role="alert"
                        aria-live="polite"
                    >
                        <div className="flex items-center gap-2">
                            <motion.span
                                animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
                                transition={prefersReducedMotion ? {} : { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
                                className="text-2xl"
                            >
                                ⭐
                            </motion.span>
                            <span>{toast}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function JourneyCard({ card, index, isExpanded, onToggleSkills, onTrigger, prefersReducedMotion }) {
    const { ref, hasTriggered } = useScrollTrigger(onTrigger, {
        threshold: 0.5,
        once: true
    });

    // Determine stage difficulty color based on category
    const getStageColor = (category) => {
        switch(category) {
            case 'Popular': return { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: '#ffd700' };
            case 'Student Government': return { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: '#ffd700' };
            case 'DevOps Projects': return { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: '#ffd700' };
            default: return { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: '#ffd700' };
        }
    };

    const stageColors = getStageColor(card.category);

    return (
        <motion.div
            ref={ref}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -30, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, scale: 1 }}
            transition={prefersReducedMotion ? {} : { duration: 0.4, delay: index * 0.1, type: 'spring' }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -5 }}
            className="w-full relative overflow-hidden rounded-lg"
            style={{
                background: stageColors.bg,
                border: `3px solid ${stageColors.border}`,
                boxShadow: hasTriggered 
                    ? '0 0 30px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.2)'
            }}
        >
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-yellow-400 opacity-60" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-400 opacity-60" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-yellow-400 opacity-60" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-yellow-400 opacity-60" />

            {/* Stage number badge */}
            <div 
                className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-yellow-400"
                style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                    boxShadow: '0 0 15px rgba(255, 107, 107, 0.8)'
                }}
            >
                {index + 1}
            </div>

            {/* Combat particles effect when triggered */}
            {hasTriggered && !prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                            style={{
                                left: '50%',
                                top: '50%',
                            }}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{
                                x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                                y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                                scale: [1, 0],
                                opacity: [1, 0]
                            }}
                            transition={{
                                duration: 1,
                                delay: 0.1
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="p-4 md:p-6 relative z-10">
                <div className="flex items-start gap-4">
                    {/* Icon - Larger and more prominent */}
                    {card.icon && (
                        <motion.div 
                            className="text-5xl md:text-6xl flex-shrink-0"
                            animate={hasTriggered && !prefersReducedMotion ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            {card.icon}
                        </motion.div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Stage Title */}
                        <div className="flex items-center gap-2 mb-2">
                            <h3 
                                className="text-2xl md:text-3xl font-bold"
                                style={{
                                    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8)',
                                    color: '#fff'
                                }}
                            >
                                {card.title.toUpperCase()}
                            </h3>
                            {hasTriggered && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-2xl"
                                >
                                    ✓
                                </motion.span>
                            )}
                        </div>

                        {/* Category Badge */}
                        <div 
                            className="inline-block px-3 py-1 rounded mb-3 text-xs md:text-sm font-bold"
                            style={{
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid #ffd700',
                                color: '#ffd700'
                            }}
                        >
                            {card.category.toUpperCase()}
                        </div>

                        {/* Description */}
                        <p 
                            className={`text-white/90 leading-relaxed mb-4 text-sm md:text-base ${
                                !isExpanded ? 'overflow-hidden' : ''
                            }`}
                            style={{
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                ...(!isExpanded ? {
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical'
                                } : {})
                            }}
                        >
                            {card.description}
                        </p>

                        {/* Skills Gained Toggle - Game Style Button */}
                        <motion.button
                            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                            onClick={onToggleSkills}
                            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded font-bold text-sm md:text-base touch-manipulation relative overflow-hidden"
                            style={{
                                background: isExpanded 
                                    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                border: '2px solid #ffd700',
                                color: '#fff',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
                            }}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Hide' : 'Show'} skills gained for ${card.title}`}
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
                            <span className="relative z-10">
                                {isExpanded ? '▼ HIDE REWARDS' : '▲ VIEW REWARDS'}
                            </span>
                        </motion.button>

                        {/* Skills Gained List - Game Style */}
                        {isExpanded && (
                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, height: 'auto' }}
                                exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                                transition={prefersReducedMotion ? {} : { duration: 0.3 }}
                                className="mt-4 space-y-2"
                            >
                                {Object.entries(card.skillsGained).map(([skill, value], idx) => (
                                    <motion.div
                                        key={skill}
                                        initial={prefersReducedMotion ? {} : { x: -20, opacity: 0 }}
                                        animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                                        transition={prefersReducedMotion ? {} : { delay: idx * 0.1 }}
                                        className="flex items-center justify-between px-4 py-3 rounded"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            border: '1px solid rgba(255, 215, 0, 0.5)'
                                        }}
                                    >
                                        <span className="text-white font-bold text-sm md:text-base">{skill}</span>
                                        <motion.span
                                            initial={prefersReducedMotion ? {} : { scale: 0 }}
                                            animate={prefersReducedMotion ? {} : { scale: 1 }}
                                            transition={prefersReducedMotion ? {} : { type: 'spring', delay: idx * 0.1 + 0.2 }}
                                            className="text-yellow-400 font-bold text-lg md:text-xl"
                                            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}
                                        >
                                            +{value}
                                        </motion.span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
