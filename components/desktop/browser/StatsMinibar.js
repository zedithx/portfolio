'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function StatsMinibar({ skills }) {
    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    const getSkillIcon = (skill) => {
        switch(skill) {
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

    const getSkillColor = (skill) => {
        switch(skill) {
            case 'Frontend': return '#667eea';
            case 'Backend': return '#f093fb';
            case 'Hardware': return '#4facfe';
            case 'Telegram Bots': return '#43e97b';
            case 'Deployment': return '#fa709a';
            case 'DevOps': return '#43e97b';
            case 'LLMs': return '#fee140';
            case 'Cloud Infrastructure': return '#4facfe';
            case 'SRE': return '#fa709a';
            case 'Product Management': return '#667eea';
            case 'Social': return '#f093fb';
            case 'Recreational': return '#43e97b';
            default: return '#667eea';
        }
    };

    // Separate technical and non-technical skills
    const technicalSkills = Object.entries(skills).filter(([name]) => 
        !['Product Management', 'Social', 'Recreational'].includes(name)
    );
    const nonTechnicalSkills = Object.entries(skills).filter(([name]) => 
        ['Product Management', 'Social', 'Recreational'].includes(name)
    );

    return (
        <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.3 }}
            className="w-full"
        >
            <div 
                className="w-full p-4 rounded-lg"
                style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid #ffd700',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Technical Skills Section */}
                <div className="mb-4">
                    <h3 
                        className="text-xs md:text-sm font-bold mb-3 px-2"
                        style={{
                            color: '#ffd700',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                            letterSpacing: '1px'
                        }}
                    >
                        TECHNICAL SKILLS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {technicalSkills.map(([skillName, skill]) => {
                            if (skill.locked) return null;
                            
                            const value = skill.value || skill.baseline || 0;
                            const max = skill.max || 100;
                            const percentage = (value / max) * 100;
                            const color = getSkillColor(skillName);
                            const icon = getSkillIcon(skillName);

                            return (
                                <div 
                                    key={skillName}
                                    className="flex flex-col gap-1.5"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg md:text-xl flex-shrink-0">{icon}</span>
                                        <span 
                                            className="text-xs md:text-sm font-bold truncate flex-1"
                                            style={{ 
                                                color: '#ffd700',
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                            }}
                                        >
                                            {skillName}
                                        </span>
                                    </div>
                                    <div 
                                        className="w-full h-2 rounded-full overflow-hidden"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.5)',
                                            border: '1px solid rgba(255, 215, 0, 0.3)'
                                        }}
                                    >
                                        <motion.div
                                            initial={prefersReducedMotion ? {} : { width: 0 }}
                                            animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                                            transition={prefersReducedMotion ? {} : { duration: 0.5, ease: 'easeOut' }}
                                            className="h-full"
                                            style={{
                                                background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                                                boxShadow: `0 0 8px ${color}80`
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span 
                                            className="text-[10px] text-yellow-400/70"
                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                        >
                                            {Math.round(value)}/{max}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Non-Technical Skills Section */}
                {nonTechnicalSkills.length > 0 && (
                    <div>
                        <h3 
                            className="text-xs md:text-sm font-bold mb-3 px-2"
                            style={{
                                color: '#ffd700',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                letterSpacing: '1px'
                            }}
                        >
                            NON-TECHNICAL SKILLS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {nonTechnicalSkills.map(([skillName, skill]) => {
                                if (skill.locked) return null;
                                
                                const value = skill.value || skill.baseline || 0;
                                const max = skill.max || 100;
                                const percentage = (value / max) * 100;
                                const color = getSkillColor(skillName);
                                const icon = getSkillIcon(skillName);

                                return (
                                    <div 
                                        key={skillName}
                                        className="flex flex-col gap-1.5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg md:text-xl flex-shrink-0">{icon}</span>
                                            <span 
                                                className="text-xs md:text-sm font-bold truncate flex-1"
                                                style={{ 
                                                    color: '#ffd700',
                                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                                }}
                                            >
                                                {skillName}
                                            </span>
                                        </div>
                                        <div 
                                            className="w-full h-2 rounded-full overflow-hidden"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.5)',
                                                border: '1px solid rgba(255, 215, 0, 0.3)'
                                            }}
                                        >
                                            <motion.div
                                                initial={prefersReducedMotion ? {} : { width: 0 }}
                                                animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                                                transition={prefersReducedMotion ? {} : { duration: 0.5, ease: 'easeOut' }}
                                                className="h-full"
                                                style={{
                                                    background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                                                    boxShadow: `0 0 8px ${color}80`
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span 
                                                className="text-[10px] text-yellow-400/70"
                                                style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                            >
                                                {Math.round(value)}/{max}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
