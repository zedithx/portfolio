'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillHelpers } from '../../../../../hooks/journey/useSkillHelpers';

export default function DesktopPopup({ 
    isOpen, 
    skills, 
    desktopPopupSkills,
    prefersReducedMotion,
    onClose,
    isMobile = false
}) {
    const { getSkillIcon } = useSkillHelpers();

    if (!isOpen || !desktopPopupSkills) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0, y: -20 }}
                animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0, y: -10 }}
                transition={prefersReducedMotion ? {} : { duration: 0.4, type: 'spring', stiffness: 200 }}
                onClick={onClose}
                className={isMobile ? "lg:hidden absolute top-4 right-4 z-50 cursor-pointer" : "hidden lg:block absolute top-4 right-4 z-50 cursor-pointer"}
                style={{
                    minWidth: isMobile ? '240px' : '280px',
                    maxWidth: isMobile ? '300px' : '350px'
                }}
            >
                <div
                    className={`relative ${isMobile ? 'p-3 md:p-4' : 'p-4'} rounded-lg`}
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 20, 50, 0.95) 100%)',
                        border: '2px solid #ffd700',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Decorative corners */}
                    <div className={`absolute top-0 left-0 ${isMobile ? 'w-3 h-3 md:w-4 md:h-4' : 'w-4 h-4'} border-t-2 border-l-2 border-yellow-400`}></div>
                    <div className={`absolute top-0 right-0 ${isMobile ? 'w-3 h-3 md:w-4 md:h-4' : 'w-4 h-4'} border-t-2 border-r-2 border-yellow-400`}></div>
                    <div className={`absolute bottom-0 left-0 ${isMobile ? 'w-3 h-3 md:w-4 md:h-4' : 'w-4 h-4'} border-b-2 border-l-2 border-yellow-400`}></div>
                    <div className={`absolute bottom-0 right-0 ${isMobile ? 'w-3 h-3 md:w-4 md:h-4' : 'w-4 h-4'} border-b-2 border-r-2 border-yellow-400`}></div>
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <h3
                            className={`${isMobile ? 'text-base md:text-lg' : 'text-lg'} font-bold`}
                            style={{
                                color: '#ffd700',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5)',
                                letterSpacing: '1px'
                            }}
                        >
                            SKILL GAINED!
                        </h3>
                    </div>
                    
                    {/* Skills List */}
                    <div className={`space-y-${isMobile ? '1.5 md:space-y-2' : '2'}`}>
                        {Object.entries(desktopPopupSkills).map(([skill, value], idx) => {
                            const skillData = skills[skill];
                            const displayName = skillData?.displayName || skill;
                            return (
                                <motion.div
                                    key={skill}
                                    initial={prefersReducedMotion ? {} : { x: -20, opacity: 0 }}
                                    animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                                    transition={prefersReducedMotion ? {} : { 
                                        delay: idx * 0.1,
                                        duration: 0.3
                                    }}
                                    className={`flex items-center justify-between gap-2 md:gap-3 py-1 md:py-1.5 px-2 rounded`}
                                    style={{
                                        background: 'rgba(255, 215, 0, 0.1)',
                                        border: '1px solid rgba(255, 215, 0, 0.3)'
                                    }}
                                >
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <span className={`${isMobile ? 'text-base md:text-lg' : 'text-lg'}`}>{getSkillIcon(skill)}</span>
                                        <span 
                                            className={`${isMobile ? 'text-xs md:text-sm' : 'text-sm'} font-semibold text-white`}
                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                        >
                                            {displayName}
                                        </span>
                                    </div>
                                    <motion.span
                                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                                        animate={prefersReducedMotion ? {} : { scale: 1 }}
                                        transition={prefersReducedMotion ? {} : { 
                                            delay: 0.2 + idx * 0.1,
                                            type: 'spring',
                                            stiffness: 300
                                        }}
                                        className={`${isMobile ? 'text-sm md:text-lg' : 'text-lg'} font-bold px-1.5 md:px-2 py-0.5 rounded`}
                                        style={{
                                            color: value >= 0 ? '#ffd700' : '#ff6b6b',
                                            background: value >= 0 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                                            border: value >= 0 ? '1px solid #ffd700' : '1px solid #ff6b6b',
                                            textShadow: value >= 0 ? '0 0 10px rgba(255, 215, 0, 0.8)' : '0 0 10px rgba(255, 107, 107, 0.8)',
                                            boxShadow: value >= 0 ? '0 0 10px rgba(255, 215, 0, 0.3)' : '0 0 10px rgba(255, 107, 107, 0.3)'
                                        }}
                                    >
                                        {value >= 0 ? '+' : ''}{value}
                                    </motion.span>
                                </motion.div>
                            );
                        })}
                    </div>
                    
                    {/* Click hint */}
                    <motion.p
                        initial={prefersReducedMotion ? {} : { opacity: 0 }}
                        animate={prefersReducedMotion ? {} : { opacity: 0.7 }}
                        transition={prefersReducedMotion ? {} : { delay: 0.5 }}
                        className={`${isMobile ? 'text-[10px] md:text-xs' : 'text-xs'} text-yellow-400/60 mt-2 text-center`}
                        style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                    >
                        Click to dismiss
                    </motion.p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
