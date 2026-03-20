'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { journeySummaryContent } from '../../../../../data/data';
import GameFrame from '../GameFrame';
import { useSkillHelpers } from '../../../../../hooks/journey/useSkillHelpers';
import AnimatedValue from '../AnimatedValue';

const SKILL_BADGE_LABELS = {
    'Frontend': 'FE',
    'Backend': 'BE',
    'Hardware': 'HW',
    'Telegram Bots': 'TB',
    'Deployment': 'DP',
    'DevOps': 'DO',
    'LLMs': 'AI',
    'Cloud Infrastructure': 'CI',
    'SRE': 'SRE',
    'Product Management': 'PM',
    'Social': 'SO',
    'Recreational': 'RC'
};

const SUMMARY_SECTION_ACCENTS = ['#7dd3fc', '#60a5fa', '#34d399', '#f59e0b'];

function getSummaryParagraphs(content) {
    return content
        .replace(/\\n/g, '\n')
        .split(/\n\n+/)
        .map((block) => {
            return block
                .replace(/\n\s*[•\-]\s*/g, ' ')
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        })
        .filter(Boolean);
}

function getSkillBadgeLabel(skillName) {
    if (SKILL_BADGE_LABELS[skillName]) {
        return SKILL_BADGE_LABELS[skillName];
    }

    const initials = skillName
        .split(/\s+/)
        .map((word) => word[0])
        .join('')
        .slice(0, 3)
        .toUpperCase();

    return initials || 'SK';
}

function StatCard({ label, value, note, prefersReducedMotion, delay = 0 }) {
    return (
        <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.25, delay, ease: 'easeOut' }}
            className="rounded-lg p-2 sm:p-4 md:p-5"
            style={{
                background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)',
                border: '2px solid #ffd700',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)'
            }}
        >
            <p
                className="text-[9px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.24em]"
                style={{ color: 'rgba(255, 215, 0, 0.7)' }}
            >
                {label}
            </p>
            <p
                className="mt-1 sm:mt-3 text-lg sm:text-2xl md:text-3xl font-black"
                style={{
                    color: '#ffd700',
                    textShadow: '2px 2px 0px #000, 0 0 10px rgba(255, 215, 0, 0.5)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    letterSpacing: '1px'
                }}
            >
                {value}
            </p>
            <p
                className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed hidden sm:block"
                style={{ color: 'rgba(224, 231, 255, 0.68)' }}
            >
                {note}
            </p>
        </motion.div>
    );
}

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
    const { getSkillColor } = useSkillHelpers();
    const safeJourney = Array.isArray(journey) ? journey : [];
    const summarySections = Object.entries(journeySummaryContent);

    const journeyTranscript = safeJourney.flatMap((card, cardIndex) => {
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

    const summaryStats = [
        {
            label: 'Phases',
            value: String(summarySections.length).padStart(2, '0'),
            note: 'major chapters distilled into the final report'
        },
        {
            label: 'Milestones',
            value: String(safeJourney.length).padStart(2, '0'),
            note: 'interactive checkpoints completed across the timeline'
        },
        {
            label: 'Story beats',
            value: String(journeyTranscript.length).padStart(2, '0'),
            note: 'moments captured from the full narrative transcript'
        }
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center p-1 sm:p-2 md:p-4 lg:p-6" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
            <GameFrame className="w-full max-w-6xl h-full max-h-[100vh] sm:max-h-[95vh] flex flex-col relative" style={{ overflowX: 'hidden', overflowY: 'hidden', willChange: 'opacity' }}>
                <motion.section
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1 }}
                    transition={prefersReducedMotion ? {} : { duration: 0.4, ease: 'easeOut' }}
                    className="relative flex-1 flex flex-col min-h-0 px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-8 z-10"
                    style={{ overflowX: 'hidden', overflowY: 'hidden' }}
                >
                    <div className="w-full h-full flex flex-col p-1 sm:p-2 md:p-4" style={{ overflowX: 'hidden', overflowY: 'hidden', position: 'relative' }}>
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.1, ease: 'easeOut' }}
                            className="flex justify-center mb-2 sm:mb-3 md:mb-5 shrink-0"
                            style={{ willChange: 'opacity' }}
                        >
                            <div
                                className="relative px-4 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4"
                                style={{
                                    background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)',
                                    border: '2px solid #ffd700',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <h1
                                    className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-center"
                                    style={{
                                        color: '#ffd700',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        textShadow: '3px 3px 0px #000, 0 0 20px rgba(255, 215, 0, 0.8)',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    Journey Summary
                                </h1>
                            </div>
                        </motion.div>

                        <div
                            className="mb-2 sm:mb-3 md:mb-4 shrink-0 rounded-lg p-1 sm:p-1.5 md:p-2"
                            style={{
                                marginTop: '-4px',
                                background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)',
                                border: '2px solid #ffd700',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <div className="flex gap-2 relative">
                                <motion.button
                                    onClick={() => setActiveTab('summary')}
                                    className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-3.5 font-bold text-xs sm:text-sm md:text-base flex-1 touch-manipulation min-h-[44px] relative overflow-visible rounded-lg"
                                    style={{
                                        background: activeTab === 'summary'
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            : 'rgba(255, 255, 255, 0.03)',
                                        border: activeTab === 'summary'
                                            ? '2px solid #ffd700'
                                            : '2px solid transparent',
                                        color: activeTab === 'summary' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                        textShadow: activeTab === 'summary' ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        boxShadow: activeTab === 'summary'
                                            ? '0 0 15px rgba(102, 126, 234, 0.6)'
                                            : 'none',
                                        zIndex: 1
                                    }}
                                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                                >
                                    <span className="relative z-10">Summary</span>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('skills')}
                                    className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-3.5 font-bold text-xs sm:text-sm md:text-base flex-1 touch-manipulation min-h-[44px] relative overflow-visible rounded-lg"
                                    style={{
                                        background: activeTab === 'skills'
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            : 'rgba(255, 255, 255, 0.03)',
                                        border: activeTab === 'skills'
                                            ? '2px solid #ffd700'
                                            : '2px solid transparent',
                                        color: activeTab === 'skills' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                        textShadow: activeTab === 'skills' ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        boxShadow: activeTab === 'skills'
                                            ? '0 0 15px rgba(102, 126, 234, 0.6)'
                                            : 'none',
                                        zIndex: 1
                                    }}
                                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                                >
                                    <span className="relative z-10">Skills</span>
                                </motion.button>
                            </div>
                        </div>

                        <div
                            className="relative flex-1 overflow-y-auto min-h-0 px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6 custom-scrollbar rounded-lg"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#ffd700 transparent',
                                position: 'relative',
                                zIndex: 2,
                                background: 'linear-gradient(135deg, rgba(26, 10, 46, 0.6) 0%, rgba(22, 33, 62, 0.6) 50%, rgba(15, 52, 96, 0.6) 100%)',
                                border: '2px solid rgba(255, 215, 0, 0.4)',
                                boxShadow: '0 0 20px rgba(255, 215, 0, 0.15), inset 0 0 15px rgba(0, 0, 0, 0.4)'
                            }}
                        >

                            {activeTab === 'summary' && (
                                <div className="relative space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-7 mb-2 sm:mb-3 md:mb-6 lg:mb-8 px-0">
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                        {summaryStats.map((stat, index) => (
                                            <StatCard
                                                key={stat.label}
                                                label={stat.label}
                                                value={stat.value}
                                                note={stat.note}
                                                prefersReducedMotion={prefersReducedMotion}
                                                delay={0.08 + (index * 0.05)}
                                            />
                                        ))}
                                    </div>

                                    {summarySections.map(([key, section], index) => {
                                        const paragraphs = getSummaryParagraphs(section.content);
                                        const [kicker, ...bodyParagraphs] = paragraphs;
                                        const accentColor = SUMMARY_SECTION_ACCENTS[index % SUMMARY_SECTION_ACCENTS.length];

                                        return (
                                            <motion.div
                                                key={key}
                                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
                                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                                transition={prefersReducedMotion ? {} : { duration: 0.28, delay: 0.14 + (index * 0.06), ease: 'easeOut' }}
                                                className="relative overflow-hidden rounded-lg p-3 sm:p-5 md:p-7"
                                                style={{
                                                    background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)',
                                                    border: '2px solid rgba(255, 215, 0, 0.5)',
                                                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.5)',
                                                    willChange: 'opacity, transform'
                                                }}
                                            >
                                                <div
                                                    className="absolute inset-y-0 left-0 w-0.5"
                                                    style={{ background: `linear-gradient(180deg, transparent, #ffd700, transparent)` }}
                                                />

                                                <div className="relative flex flex-col gap-4">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl text-xs sm:text-sm font-black"
                                                                style={{
                                                                    color: '#ffd700',
                                                                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(26, 10, 46, 0.9) 100%)',
                                                                    border: '2px solid #ffd700',
                                                                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
                                                                    fontFamily: 'system-ui, -apple-system, sans-serif'
                                                                }}
                                                            >
                                                                {String(index + 1).padStart(2, '0')}
                                                            </div>
                                                            <div>
                                                                <h2
                                                                    className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold"
                                                                    style={{
                                                                        color: '#ffd700',
                                                                        textShadow: '2px 2px 0px #000, 0 0 15px rgba(255, 215, 0, 0.6)',
                                                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                                                        letterSpacing: '1.5px',
                                                                        textTransform: 'uppercase'
                                                                    }}
                                                                >
                                                                    {section.title}
                                                                </h2>
                                                                <p
                                                                    className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.15em] sm:tracking-[0.22em]"
                                                                    style={{ color: 'rgba(255, 215, 0, 0.5)' }}
                                                                >
                                                                    Chapter {index + 1}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {kicker && (
                                                        <div
                                                            className="inline-flex w-fit max-w-full rounded px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs md:text-sm font-semibold"
                                                            style={{
                                                                color: '#fff',
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                border: '1px solid #ffd700',
                                                                boxShadow: '0 0 10px rgba(102, 126, 234, 0.4)',
                                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)'
                                                            }}
                                                        >
                                                            {kicker}
                                                        </div>
                                                    )}

                                                    <div className="space-y-4">
                                                        {bodyParagraphs.map((paragraph, paraIndex) => (
                                                            <motion.p
                                                                key={paraIndex}
                                                                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                                                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                                                                transition={prefersReducedMotion ? {} : { duration: 0.26, delay: 0.2 + (index * 0.08) + (paraIndex * 0.05) }}
                                                                className="text-xs sm:text-sm md:text-base leading-relaxed"
                                                                style={{
                                                                    color: '#dbe4ff',
                                                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.45)',
                                                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                                                    textAlign: 'left',
                                                                    lineHeight: '1.8'
                                                                }}
                                                            >
                                                                {paragraph}
                                                            </motion.p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {activeTab === 'skills' && skills && (
                                <SummarySkillsTab
                                    technicalSkills={technicalSkills}
                                    nonTechnicalSkills={nonTechnicalSkills}
                                    prefersReducedMotion={prefersReducedMotion}
                                    getSkillColor={getSkillColor}
                                />
                            )}
                        </div>

                        <div className="flex justify-center pt-2 sm:pt-3 md:pt-4 lg:pt-6 pb-1 sm:pb-2 md:pb-4 shrink-0" style={{ overflow: 'visible', zIndex: 10 }}>
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
                                className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg font-bold text-xs sm:text-sm md:text-base lg:text-lg mx-auto block touch-manipulation relative min-h-[40px] sm:min-h-[44px] z-[100] overflow-hidden tracking-wider"
                                style={{
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                    border: '3px solid #ffd700',
                                    color: '#fff',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                                    boxShadow: '0 0 20px rgba(255, 107, 107, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)',
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    letterSpacing: '1.5px',
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

function SummarySkillsTab({ technicalSkills, nonTechnicalSkills, prefersReducedMotion, getSkillColor }) {
    const safeTechnicalSkills = Array.isArray(technicalSkills) ? technicalSkills : [];
    const safeNonTechnicalSkills = Array.isArray(nonTechnicalSkills) ? nonTechnicalSkills : [];
    const allSkills = [...safeTechnicalSkills, ...safeNonTechnicalSkills];
    const totalSkills = allSkills.length;
    const masteredSkills = allSkills.filter(([_, skill]) => {
        const value = skill.value || skill.baseline || 0;
        const max = skill.max || 100;

        return !skill.locked && value / max >= 0.75;
    }).length;

    const averageScore = totalSkills > 0
        ? Math.round(
            allSkills.reduce((sum, [_, skill]) => sum + (skill.value || skill.baseline || 0), 0) /
            totalSkills
        )
        : 0;

    const skillSummaryStats = [
        {
            label: 'Skills tracked',
            value: String(totalSkills).padStart(2, '0'),
            note: 'capabilities measured across the full journey'
        },
        {
            label: 'Mastered',
            value: String(masteredSkills).padStart(2, '0'),
            note: 'skills that reached at least seventy-five percent'
        },
        {
            label: 'Average score',
            value: `${averageScore}%`,
            note: 'overall progression across technical and people skills'
        }
    ];

    const renderSkillBar = (skillName, skill) => {
        const value = skill.value || skill.baseline || 0;
        const max = skill.max || 100;
        const percentage = Math.max(0, Math.min(100, (value / max) * 100));
        const displayName = skill.displayName || skillName;
        const badgeLabel = getSkillBadgeLabel(skillName);
        const color = getSkillColor(skillName);
        const isLocked = skill.locked && value === 0;

        return (
            <div
                key={skillName}
                className="rounded-lg p-2.5 sm:p-4 md:p-5"
                style={{
                    background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.7) 0%, rgba(26, 10, 46, 0.7) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.1), inset 0 0 8px rgba(0, 0, 0, 0.4)'
                }}
            >
                <div className="flex items-start gap-2 sm:gap-4">
                    <div
                        className="flex h-8 w-8 sm:h-11 sm:w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl text-[9px] sm:text-[11px] md:text-xs font-black tracking-[0.15em] sm:tracking-[0.22em]"
                        style={{
                            color: isLocked ? 'rgba(255, 255, 255, 0.5)' : color,
                            background: isLocked
                                ? 'linear-gradient(135deg, rgba(71, 85, 105, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%)'
                                : `linear-gradient(135deg, ${color}26 0%, rgba(15, 23, 42, 0.88) 100%)`,
                            border: isLocked ? '1px solid rgba(148, 163, 184, 0.2)' : `1px solid ${color}55`,
                            boxShadow: isLocked ? 'none' : `0 10px 24px ${color}20`
                        }}
                    >
                        {badgeLabel}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                            <div className="min-w-0">
                                <span
                                    className="block text-xs sm:text-sm md:text-base font-semibold truncate"
                                    style={{
                                        color: isLocked ? 'rgba(224, 231, 255, 0.5)' : '#f8fbff',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                                        fontFamily: 'system-ui, -apple-system, sans-serif'
                                    }}
                                >
                                    {displayName}
                                </span>
                                <span
                                    className="mt-0.5 sm:mt-1 block text-[9px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.22em]"
                                    style={{ color: isLocked ? 'rgba(148, 163, 184, 0.72)' : 'rgba(191, 219, 254, 0.82)' }}
                                >
                                    {isLocked ? 'Locked skill path' : `${Math.round(percentage)}% progression`}
                                </span>
                            </div>

                            <div
                                className="shrink-0 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs md:text-sm font-bold"
                                style={{
                                    color: isLocked ? 'rgba(224, 231, 255, 0.7)' : '#f8fbff',
                                    background: isLocked
                                        ? 'rgba(71, 85, 105, 0.24)'
                                        : `linear-gradient(135deg, ${color}26 0%, rgba(15, 23, 42, 0.9) 100%)`,
                                    border: isLocked ? '1px solid rgba(148, 163, 184, 0.22)' : `1px solid ${color}44`,
                                    boxShadow: isLocked ? 'none' : `inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 18px ${color}14`
                                }}
                            >
                                {isLocked ? 'LOCKED' : prefersReducedMotion ? `${value}/${max}` : <AnimatedValue from={0} to={value} max={max} />}
                            </div>
                        </div>

                        <div
                            className="mt-2 sm:mt-4 h-2 sm:h-3 md:h-3.5 relative overflow-hidden rounded-full"
                            style={{
                                background: isLocked ? 'rgba(15, 23, 42, 0.75)' : 'rgba(15, 23, 42, 0.95)',
                                border: isLocked ? '1px solid rgba(148, 163, 184, 0.18)' : `1px solid ${color}33`,
                                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
                                position: 'relative'
                            }}
                        >
                            <motion.div
                                initial={prefersReducedMotion ? {} : { width: 0 }}
                                animate={prefersReducedMotion ? {} : { width: isLocked ? '0%' : `${percentage}%` }}
                                transition={prefersReducedMotion ? {} : { duration: 0.9, delay: 0.25 }}
                                className="h-full relative rounded-full"
                                style={{
                                    width: prefersReducedMotion ? (isLocked ? '0%' : `${percentage}%`) : undefined,
                                    background: `linear-gradient(90deg, ${color} 0%, ${color}dd 60%, ${color}99 100%)`,
                                    boxShadow: isLocked ? 'none' : `0 0 12px ${color}70`
                                }}
                            >
                                {!isLocked && (
                                    <div
                                        className="absolute inset-y-0 right-0 w-12"
                                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28))' }}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSkillSection = (title, description, entries) => {
        if (!entries.length) {
            return null;
        }

        const average = Math.round(
            entries.reduce((sum, [_, skill]) => sum + (skill.value || skill.baseline || 0), 0) / entries.length
        );

        return (
            <div
                className="rounded-lg p-3 sm:p-5 md:p-7"
                style={{
                    background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)',
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p
                            className="text-[9px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.24em]"
                            style={{ color: 'rgba(191, 219, 254, 0.82)' }}
                        >
                            Skill cluster
                        </p>
                        <h3
                            className="mt-1 sm:mt-2 text-sm sm:text-lg md:text-2xl font-bold"
                            style={{
                                color: '#ffd700',
                                textShadow: '2px 2px 0px #000, 0 0 15px rgba(255, 215, 0, 0.6)',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase'
                            }}
                        >
                            {title}
                        </h3>
                        <p
                            className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed hidden sm:block"
                            style={{ color: 'rgba(219, 228, 255, 0.72)' }}
                        >
                            {description}
                        </p>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                        <div
                            className="rounded-lg px-2.5 py-2 sm:px-4 sm:py-3 text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(26, 10, 46, 0.8) 100%)',
                                border: '1px solid rgba(255, 215, 0, 0.4)'
                            }}
                        >
                            <p className="text-[8px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.22em]" style={{ color: 'rgba(191, 219, 254, 0.72)' }}>
                                Count
                            </p>
                            <p className="mt-0.5 sm:mt-1 text-base sm:text-xl md:text-2xl font-black" style={{ color: '#f8fbff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                {String(entries.length).padStart(2, '0')}
                            </p>
                        </div>
                        <div
                            className="rounded-lg px-2.5 py-2 sm:px-4 sm:py-3 text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(26, 10, 46, 0.8) 100%)',
                                border: '1px solid rgba(255, 215, 0, 0.4)'
                            }}
                        >
                            <p className="text-[8px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.22em]" style={{ color: 'rgba(191, 219, 254, 0.72)' }}>
                                Avg
                            </p>
                            <p className="mt-0.5 sm:mt-1 text-base sm:text-xl md:text-2xl font-black" style={{ color: '#f8fbff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                {average}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-3 sm:mt-5 grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
                    {entries.map(([skillName, skill]) => renderSkillBar(skillName, skill))}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2, ease: 'easeOut' }}
            className="pt-1 sm:pt-1 md:pt-2 px-0.5 sm:px-0"
            style={{ willChange: 'opacity' }}
        >
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {skillSummaryStats.map((stat, index) => (
                    <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        note={stat.note}
                        prefersReducedMotion={prefersReducedMotion}
                        delay={0.08 + (index * 0.05)}
                    />
                ))}
            </div>

            <div className="mt-3 space-y-3 sm:mt-5 sm:space-y-5 md:mt-6 md:space-y-6">
                {renderSkillSection(
                    'Technical',
                    'Engineering depth across frontend delivery, backend systems, infrastructure, automation, and reliability.',
                    safeTechnicalSkills
                )}
                {renderSkillSection(
                    'Non-technical',
                    'Product thinking, collaboration, and execution habits that shaped how the technical work was delivered.',
                    safeNonTechnicalSkills
                )}
            </div>
        </motion.div>
    );
}
