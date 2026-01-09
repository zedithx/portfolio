'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { journeySummaryContent } from '../../../../../data/data';
import GameFrame from '../GameFrame';
import { useSkillHelpers } from '../../../../../hooks/journey/useSkillHelpers';
import SkillItem from './SkillItem';
import AnimatedValue from '../AnimatedValue';

export default function SummaryView({
    journey,
    skills,
    technicalSkills,
    nonTechnicalSkills,
    activeTab,
    setActiveTab,
    prefersReducedMotion,
    onToggleToFormal,
    returnButtonRef
}) {
    const { getSkillIcon, getSkillColor } = useSkillHelpers();

    const journeyTranscript = journey.flatMap((card, cardIndex) => {
        const cardTitle = card.title;
        const dialogues = card.dialogues || [];
        return dialogues.map((dialogue, dialogueIndex) => ({
            cardTitle,
            cardIndex,
            dialogueIndex,
            speaker: dialogue.speaker,
            name: dialogue.name,
            text: dialogue.text
        }));
    });

    return (
        <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-2 md:p-4 lg:p-6" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
            <GameFrame className="w-full max-w-6xl h-full max-h-[95vh] flex flex-col relative" style={{ overflowX: 'hidden', overflowY: 'hidden', willChange: 'opacity' }}>
                <motion.section
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1 }}
                    transition={prefersReducedMotion ? {} : { duration: 0.4, ease: 'easeOut' }}
                    className="relative flex-1 flex flex-col min-h-0 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 z-10"
                    style={{ overflowX: 'hidden', overflowY: 'auto' }}
                >
                    <div className="w-full h-full flex flex-col p-4" style={{ overflowX: 'hidden', overflowY: 'auto', position: 'relative'}}>
                        {/* Title */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.1, ease: 'easeOut' }}
                            className="flex justify-center mb-4 sm:mb-4 md:mb-6 shrink-0"
                            style={{ willChange: 'opacity' }}
                        >
                            <div
                                className="relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
                                    border: '2px solid #ffd700',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 25px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(255, 215, 0, 0.1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-400 opacity-60" />
                                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-400 opacity-60" />
                                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-yellow-400 opacity-60" />
                                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-400 opacity-60" />
                                
                                <h1
                                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-center"
                                    style={{
                                        color: '#ffd700',
                                        fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif",
                                        letterSpacing: '3px',
                                        textTransform: 'uppercase',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 215, 0, 0.6)',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    Journey Summary
                                </h1>
                            </div>
                        </motion.div>

                        {/* Tabs */}
                        <div className="flex gap-0 mb-0 shrink-0 relative" style={{ marginTop: '-4px' }}>
                            <motion.button
                                onClick={() => setActiveTab('summary')}
                                className="px-6 md:px-8 py-3 md:py-3.5 font-bold text-sm md:text-base flex-1 touch-manipulation min-h-[48px] relative overflow-visible rounded-lg"
                                style={{
                                    background: activeTab === 'summary' 
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                        : 'rgba(102, 126, 234, 0.3)',
                                    border: '2px solid #ffd700',
                                    color: '#fff',
                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    boxShadow: activeTab === 'summary' 
                                        ? '0 0 15px rgba(102, 126, 234, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.1)' 
                                        : '0 0 5px rgba(102, 126, 234, 0.3)',
                                    zIndex: 1
                                }}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2, boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)', zIndex: 10 }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                            >
                                <span className="relative z-10">Summary</span>
                            </motion.button>
                            <motion.button
                                onClick={() => setActiveTab('skills')}
                                className="px-6 md:px-8 py-3 md:py-3.5 font-bold text-sm md:text-base flex-1 touch-manipulation min-h-[48px] relative overflow-visible rounded-lg"
                                style={{
                                    background: activeTab === 'skills' 
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                        : 'rgba(102, 126, 234, 0.3)',
                                    border: '2px solid #ffd700',
                                    color: '#fff',
                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    boxShadow: activeTab === 'skills' 
                                        ? '0 0 15px rgba(102, 126, 234, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.1)' 
                                        : '0 0 5px rgba(102, 126, 234, 0.3)',
                                    zIndex: 1
                                }}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2, boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)', zIndex: 10 }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                            >
                                <span className="relative z-10">Skills</span>
                            </motion.button>
                        </div>

                        {/* Scrollable Content */}
                        <div 
                            className="flex-1 overflow-y-auto min-h-0 py-3 sm:py-2 md:py-4 custom-scrollbar"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#ffd700 transparent',
                                position: 'relative',
                                zIndex: 2
                            }}
                        >
                            {activeTab === 'summary' && (
                                <div className="space-y-3 sm:space-y-3 md:space-y-4 lg:space-y-6 mb-4 sm:mb-4 md:mb-6 lg:mb-8 px-1 sm:px-0 pt-2 sm:pt-2">
                                    {Object.entries(journeySummaryContent).map(([key, section], index) => (
                                        <motion.div
                                            key={key}
                                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                            animate={prefersReducedMotion ? {} : { opacity: 1 }}
                                            transition={prefersReducedMotion ? {} : { duration: 0.2, delay: 0.05 + (index * 0.05), ease: 'easeOut' }}
                                            className="relative space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4"
                                            style={{
                                                marginTop: index === 0 ? '0.25rem' : '1rem',
                                                paddingTop: '1.25rem',
                                                willChange: 'opacity'
                                            }}
                                        >
                                            <h2 
                                                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4"
                                                style={{
                                                    color: '#ffd700',
                                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 215, 0, 0.6)',
                                                    fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif",
                                                    letterSpacing: '1px',
                                                    textTransform: 'uppercase',
                                                    borderBottom: '2px solid rgba(255, 215, 0, 0.5)',
                                                    paddingBottom: '0.5rem'
                                                }}
                                            >
                                                {section.title}
                                            </h2>
                                            <div className="mt-4">
                                                {section.content
                                                    .replace(/\\n\\n/g, '\n\n')
                                                    .split('\n\n')
                                                    .map((paragraph, paraIndex) => (
                                                        paragraph.trim() && (
                                                            <motion.p
                                                                key={paraIndex}
                                                                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                                                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                                                                transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.1 + (index * 0.1) + (paraIndex * 0.05) }}
                                                                className="text-sm sm:text-base md:text-lg leading-relaxed mb-4"
                                                                style={{
                                                                    color: '#e0e0e0',
                                                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                                    textAlign: 'left',
                                                                    lineHeight: '1.7'
                                                                }}
                                                            >
                                                                {paragraph.trim()}
                                                            </motion.p>
                                                        )
                                                    ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'skills' && skills && (
                                <SummarySkillsTab
                                    technicalSkills={technicalSkills}
                                    nonTechnicalSkills={nonTechnicalSkills}
                                    skills={skills}
                                    prefersReducedMotion={prefersReducedMotion}
                                    getSkillIcon={getSkillIcon}
                                    getSkillColor={getSkillColor}
                                />
                            )}
                        </div>

                        {/* Return Button */}
                        <div className="flex justify-center pt-4 sm:pt-3 md:pt-4 lg:pt-6 pb-3 sm:pb-3 md:pb-4 shrink-0" style={{ overflow: 'visible', zIndex: 10 }}>
                            <motion.button
                                ref={returnButtonRef}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onToggleToFormal) {
                                        onToggleToFormal();
                                    }
                                }}
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onToggleToFormal) {
                                        onToggleToFormal();
                                    }
                                }}
                                className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg font-bold text-xs sm:text-sm md:text-base lg:text-lg mx-auto block touch-manipulation relative min-h-[40px] sm:min-h-[44px] z-[100] overflow-hidden"
                                style={{
                                    background: 'linear-gradient(to bottom, #e8c896, #d4aa68)',
                                    border: '2px solid #b08b4c',
                                    color: '#5D4037',
                                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.5), 1px 1px 2px rgba(0, 0, 0, 0.3)',
                                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(139, 69, 19, 0.3), 0 0 0 1px rgba(139, 69, 19, 0.2)',
                                    fontFamily: 'serif',
                                    letterSpacing: '0.05em',
                                    transformOrigin: 'center center',
                                    willChange: 'transform',
                                    pointerEvents: 'auto',
                                    WebkitTapHighlightColor: 'transparent',
                                    zIndex: 100
                                }}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.8)' }}
                                transition={{ opacity: { duration: 0.5, delay: 0.6 }, y: { duration: 0.5, delay: 0.6 }, scale: { duration: 0.2 } }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                            >
                                {!prefersReducedMotion && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                    />
                                )}
                                <span className="relative z-10">{onToggleToFormal ? 'Back to About Me' : 'Return to MacBook'}</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.section>
            </GameFrame>
        </div>
    );
}

function SummarySkillsTab({ technicalSkills, nonTechnicalSkills, skills, prefersReducedMotion, getSkillIcon, getSkillColor }) {
    const renderSkillBar = (skillName, skill) => {
        const value = skill.value || skill.baseline || 0;
        const max = skill.max || 100;
        const percentage = Math.max(0, Math.min(100, (value / max) * 100));
        const displayName = skill.displayName || skillName;
        
        return (
            <div key={skillName} className="py-0.5 sm:py-1 md:py-2">
                <div className="flex items-center justify-between mb-0.5 sm:mb-1 gap-1">
                    <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-1 min-w-0">
                        <span className="text-base sm:text-lg md:text-xl flex-shrink-0">{getSkillIcon(skillName)}</span>
                        <span 
                            className="text-xs sm:text-sm md:text-base font-semibold truncate"
                            style={{
                                color: '#ffd700',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                            }}
                        >
                            {displayName}
                        </span>
                    </div>
                    <span 
                        className="text-sm md:text-base font-bold"
                        style={{
                            color: '#ffd700',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                        }}
                    >
                        {value}/{max}
                    </span>
                </div>
                <div 
                    className="h-3 sm:h-4 md:h-5 relative overflow-hidden rounded-full"
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
                        position: 'relative'
                    }}
                >
                    <motion.div
                        initial={prefersReducedMotion ? {} : { width: 0 }}
                        animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                        transition={prefersReducedMotion ? {} : { duration: 1, delay: 0.5 }}
                        className="h-full relative rounded-full"
                        style={{
                            background: `linear-gradient(90deg, ${getSkillColor(skillName)} 0%, ${getSkillColor(skillName)}dd 100%)`,
                            boxShadow: `0 0 8px ${getSkillColor(skillName)}80`
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2, ease: 'easeOut' }}
            className="pt-3 sm:pt-3 md:pt-4 lg:pt-6 px-1 sm:px-0"
            style={{ willChange: 'opacity' }}
        >
            <h2 
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-6"
                style={{
                    color: '#ffd700',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 215, 0, 0.6)',
                    fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif",
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}
            >
                FINAL SKILLS
            </h2>
            
            {technicalSkills.length > 0 && (
                <div className="mb-6">
                    <h3 
                        className="text-base sm:text-lg md:text-xl font-bold mb-4"
                        style={{
                            color: '#ffd700',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                            fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif",
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                        }}
                    >
                        TECHNICAL
                    </h3>
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-3">
                        {technicalSkills.map(([skillName, skill]) => renderSkillBar(skillName, skill))}
                    </div>
                </div>
            )}

            {nonTechnicalSkills.length > 0 && (
                <div>
                    <h3 
                        className="text-base sm:text-lg md:text-xl font-bold mb-4"
                        style={{
                            color: '#ffd700',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                            fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif",
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                        }}
                    >
                        NON-TECHNICAL
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                        {nonTechnicalSkills.map(([skillName, skill]) => renderSkillBar(skillName, skill))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
