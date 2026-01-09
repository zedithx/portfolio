'use client';
import { useCallback } from 'react';

export const useSkillHelpers = () => {
    const getSkillIcon = useCallback((skill) => {
        const iconMap = {
            'Frontend': '🎨',
            'Backend': '⚙️',
            'Hardware': '🔌',
            'Telegram Bots': '🤖',
            'Deployment': '🚀',
            'DevOps': '🔧',
            'LLMs': '🧠',
            'Cloud Infrastructure': '☁️',
            'SRE': '🛡️',
            'Product Management': '📊',
            'Social': '🤝',
            'Recreational': '🎮'
        };
        return iconMap[skill] || '⚔️';
    }, []);

    const getSkillColor = useCallback((skill) => {
        const colorMap = {
            'Frontend': '#667eea',
            'Backend': '#f093fb',
            'Hardware': '#4facfe',
            'Telegram Bots': '#43e97b',
            'Deployment': '#fa709a',
            'DevOps': '#43e97b',
            'LLMs': '#fee140',
            'Cloud Infrastructure': '#4facfe',
            'SRE': '#fa709a',
            'Product Management': '#667eea',
            'Social': '#f093fb',
            'Recreational': '#43e97b'
        };
        return colorMap[skill] || '#667eea';
    }, []);

    return { getSkillIcon, getSkillColor };
};
