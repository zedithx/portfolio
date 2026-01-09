'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useSkillHelpers } from '../../../../../hooks/journey/useSkillHelpers';
import AnimatedValue from '../AnimatedValue';

export default function SkillItem({ 
    skillName, 
    skill, 
    recentlyUnlockedSkills = new Set(),
    recentlyUpdatedSkills = new Set(),
    previousSkillValues = {},
    prefersReducedMotion 
}) {
    const { getSkillIcon, getSkillColor } = useSkillHelpers();
    
    const isLocked = skill.locked;
    const value = skill.value || skill.baseline || 0;
    const max = skill.max || 100;
    const percentage = isLocked ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
    const color = getSkillColor(skillName);
    const icon = getSkillIcon(skillName);
    const displayName = skill.displayName || skillName;
    const isRecentlyUnlocked = recentlyUnlockedSkills.has(skillName);
    const isRecentlyUpdated = recentlyUpdatedSkills.has(skillName);
    const hasPreviousValue = previousSkillValues[skillName] !== undefined;
    const prevValue = hasPreviousValue ? previousSkillValues[skillName] : value;
    const prevPercentage = ((prevValue || 0) / max) * 100;
    const displayPercentage = (hasPreviousValue && !isRecentlyUpdated) ? prevPercentage : percentage;

    return (
        <motion.div 
            className="space-y-1.5"
            initial={isRecentlyUnlocked && !prefersReducedMotion ? { scale: 0.8, opacity: 0 } : {}}
            animate={isRecentlyUnlocked && !prefersReducedMotion ? { 
                scale: [0.8, 1.1, 1],
                opacity: [0, 1, 1]
            } : isRecentlyUpdated ? {
                scale: [1, 1.03, 1]
            } : {}}
            transition={isRecentlyUnlocked && !prefersReducedMotion ? { 
                duration: 0.6,
                ease: 'easeOut'
            } : { duration: 0.8, ease: 'easeOut' }}
            style={{
                willChange: (isRecentlyUpdated || isRecentlyUnlocked) ? 'transform' : 'auto',
                padding: isRecentlyUpdated ? '4px' : '0',
                borderRadius: '4px',
                background: isRecentlyUpdated ? 'rgba(255, 215, 0, 0.1)' : isRecentlyUnlocked ? 'rgba(255, 215, 0, 0.2)' : 'transparent'
            }}
        >
            <div className="flex items-center gap-2">
                <motion.span 
                    className="text-lg flex-shrink-0"
                    animate={isRecentlyUnlocked && !prefersReducedMotion ? {
                        rotate: [0, 360],
                        scale: [1, 1.3, 1]
                    } : isRecentlyUpdated ? { scale: [1, 1.2, 1] } : {}}
                    transition={isRecentlyUnlocked && !prefersReducedMotion ? {
                        duration: 0.6,
                        ease: 'easeOut'
                    } : { duration: 0.8, ease: 'easeOut' }}
                    style={{ willChange: (isRecentlyUpdated || isRecentlyUnlocked) ? 'transform' : 'auto' }}
                >
                    {icon}
                </motion.span>
                <span 
                    className="text-xs font-bold truncate flex-1"
                    style={{ 
                        color: isLocked ? '#666' : '#ffd700',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                        opacity: isLocked ? 0.5 : 1
                    }}
                >
                    {displayName}
                </span>
                {isLocked ? (
                    <span 
                        className="text-[10px] text-gray-500 flex items-center gap-1"
                        style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                    >
                        🔒 LOCKED
                    </span>
                ) : (
                    <motion.span 
                        className="text-[10px] text-yellow-400/70 font-bold"
                        style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                        animate={isRecentlyUpdated ? {
                            color: ['#fbbf24', '#ffd700', '#fbbf24'],
                            scale: [1, 1.2, 1]
                        } : {}}
                        transition={{ duration: 1.0 }}
                    >
                        <AnimatedValue from={prevValue} to={isRecentlyUpdated ? value : prevValue} max={max} showGain={isRecentlyUpdated} />
                    </motion.span>
                )}
            </div>
            <div 
                className="w-full h-2 rounded-full overflow-hidden relative"
                style={{
                    background: isLocked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
                    border: isLocked ? '1px solid rgba(100, 100, 100, 0.3)' : (isRecentlyUpdated ? '1px solid rgba(255, 215, 0, 0.8)' : '1px solid rgba(255, 215, 0, 0.3)'),
                    opacity: isLocked ? 0.5 : 1
                }}
            >
                {isLocked ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[8px] text-gray-500">🔒</span>
                    </div>
                ) : (
                    <motion.div
                        initial={prefersReducedMotion || !hasPreviousValue ? {} : { width: `${prevPercentage}%` }}
                        animate={prefersReducedMotion ? {} : { width: `${displayPercentage}%` }}
                        transition={prefersReducedMotion || !hasPreviousValue ? {} : { 
                            duration: isRecentlyUpdated ? 1.2 : 0,
                            ease: [0.16, 1, 0.3, 1],
                            type: 'tween'
                        }}
                        className="h-full relative"
                        style={{
                            background: isRecentlyUnlocked && !prefersReducedMotion
                                ? `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`
                                : `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                            boxShadow: isRecentlyUnlocked && !prefersReducedMotion
                                ? `0 0 20px ${color}, 0 0 30px ${color}80, 0 0 40px rgba(255, 215, 0, 0.6)`
                                : isRecentlyUpdated 
                                ? `0 0 15px ${color}, 0 0 25px rgba(255, 215, 0, 0.6)`
                                : `0 0 8px ${color}80`,
                            willChange: 'width'
                        }}
                    >
                        {isRecentlyUpdated && (
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                                    willChange: 'transform'
                                }}
                                animate={{
                                    x: ['-100%', '100%']
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                            />
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
