'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import SkillItem from './SkillItem';

export default function SkillList({
    technicalSkills,
    nonTechnicalSkills,
    skills,
    isSkillsExpanded,
    setIsSkillsExpanded,
    recentlyUnlockedSkills = new Set(),
    recentlyUpdatedSkills = new Set(),
    previousSkillValues = {},
    prefersReducedMotion,
    isMobile = false
}) {
    if (isMobile) {
        return (
            <div className="w-full mt-4">
                <motion.button
                    onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                    className="w-full p-4 rounded-lg flex items-center justify-between touch-manipulation"
                    style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid #ffd700',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                    }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                    <h3 
                        className="text-base font-bold"
                        style={{
                            color: '#ffd700',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                            letterSpacing: '1px'
                        }}
                    >
                        SKILLS
                    </h3>
                    {isSkillsExpanded ? (
                        <ChevronUp className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-yellow-400" />
                    )}
                </motion.button>

                <AnimatePresence>
                    {isSkillsExpanded && (
                        <motion.div
                            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { height: 'auto', opacity: 1 }}
                            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div 
                                className="mt-2 p-4 rounded-lg space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: '2px solid #ffd700',
                                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                {technicalSkills.length > 0 && (
                                    <div>
                                        <h4 
                                            className="text-xs font-bold mb-3 px-2"
                                            style={{
                                                color: '#ffd700',
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            TECHNICAL
                                        </h4>
                                        <div className="space-y-3">
                                            {technicalSkills.map(([skillName, skill]) => (
                                                <SkillItem
                                                    key={skillName}
                                                    skillName={skillName}
                                                    skill={skill}
                                                    recentlyUnlockedSkills={recentlyUnlockedSkills}
                                                    recentlyUpdatedSkills={recentlyUpdatedSkills}
                                                    previousSkillValues={previousSkillValues}
                                                    prefersReducedMotion={prefersReducedMotion}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {nonTechnicalSkills.length > 0 && (
                                    <div>
                                        <h4 
                                            className="text-xs font-bold mb-3 px-2"
                                            style={{
                                                color: '#ffd700',
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            NON-TECHNICAL
                                        </h4>
                                        <div className="space-y-3">
                                            {nonTechnicalSkills.map(([skillName, skill]) => (
                                                <SkillItem
                                                    key={skillName}
                                                    skillName={skillName}
                                                    skill={skill}
                                                    recentlyUnlockedSkills={recentlyUnlockedSkills}
                                                    recentlyUpdatedSkills={recentlyUpdatedSkills}
                                                    previousSkillValues={previousSkillValues}
                                                    prefersReducedMotion={prefersReducedMotion}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Desktop version
    return (
        <div className="hidden lg:block w-80 shrink-0">
            <div 
                className="h-full p-4 rounded-lg space-y-4 overflow-y-auto custom-scrollbar"
                style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid #ffd700',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                }}
            >
                <h3 
                    className="text-base font-bold mb-4"
                    style={{
                        color: '#ffd700',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                        letterSpacing: '1px'
                    }}
                >
                    SKILLS
                </h3>
                
                {technicalSkills.length > 0 && (
                    <div>
                        <h4 
                            className="text-xs font-bold mb-3 px-2"
                            style={{
                                color: '#ffd700',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                letterSpacing: '1px'
                            }}
                        >
                            TECHNICAL
                        </h4>
                        <div className="space-y-3">
                            {technicalSkills.map(([skillName, skill]) => (
                                <SkillItem
                                    key={skillName}
                                    skillName={skillName}
                                    skill={skill}
                                    recentlyUnlockedSkills={recentlyUnlockedSkills}
                                    prefersReducedMotion={prefersReducedMotion}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {nonTechnicalSkills.length > 0 && (
                    <div>
                        <h4 
                            className="text-xs font-bold mb-3 px-2"
                            style={{
                                color: '#ffd700',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                letterSpacing: '1px'
                            }}
                        >
                            NON-TECHNICAL
                        </h4>
                        <div className="space-y-3">
                            {nonTechnicalSkills.map(([skillName, skill]) => (
                                <SkillItem
                                    key={skillName}
                                    skillName={skillName}
                                    skill={skill}
                                    recentlyUnlockedSkills={recentlyUnlockedSkills}
                                    prefersReducedMotion={prefersReducedMotion}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
