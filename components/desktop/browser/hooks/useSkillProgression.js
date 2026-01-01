'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aboutMe_skillProgression';
const PROCESSED_CARDS_KEY = 'aboutMe_processedCards';

export function useSkillProgression(initialSkills) {
    // Initialize skills from sessionStorage or baseline
    const [skills, setSkills] = useState(() => {
        if (typeof window === 'undefined') return initialSkills;
        
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return initialSkills;
            }
        }
        return initialSkills;
    });

    // Track which cards have been processed
    const [processedCards, setProcessedCards] = useState(() => {
        if (typeof window === 'undefined') return new Set();
        
        const stored = sessionStorage.getItem(PROCESSED_CARDS_KEY);
        if (stored) {
            try {
                return new Set(JSON.parse(stored));
            } catch {
                return new Set();
            }
        }
        return new Set();
    });

    // Persist skills to sessionStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
        }
    }, [skills]);

    // Persist processed cards to sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(PROCESSED_CARDS_KEY, JSON.stringify([...processedCards]));
        }
    }, [processedCards]);

    // Check if SRE should be unlocked
    const checkSREUnlock = useCallback((currentSkills) => {
        const sreSkill = currentSkills.SRE;
        if (!sreSkill || !sreSkill.locked) return false;

        const { unlockThreshold } = sreSkill;
        return Object.entries(unlockThreshold).every(([skillName, threshold]) => {
            const skill = currentSkills[skillName];
            return skill && skill.value >= threshold;
        });
    }, []);

    // Update skills when a journey card is triggered
    const updateSkills = useCallback((cardId, skillDeltas) => {
        // Only update if this card hasn't been processed yet
        if (processedCards.has(cardId)) {
            return false;
        }

        setSkills(prevSkills => {
            const newSkills = { ...prevSkills };
            let hasUpdates = false;

            // Apply skill deltas
            Object.entries(skillDeltas).forEach(([skillName, delta]) => {
                if (newSkills[skillName]) {
                    const currentValue = newSkills[skillName].value || newSkills[skillName].baseline || 0;
                    const max = newSkills[skillName].max || 100;
                    const newValue = Math.min(max, currentValue + delta);
                    
                    if (newValue !== currentValue) {
                        newSkills[skillName] = {
                            ...newSkills[skillName],
                            value: newValue
                        };
                        hasUpdates = true;
                    }
                }
            });

            // Check SRE unlock
            if (newSkills.SRE?.locked) {
                const shouldUnlock = checkSREUnlock(newSkills);
                if (shouldUnlock) {
                    newSkills.SRE = {
                        ...newSkills.SRE,
                        locked: false
                    };
                    hasUpdates = true;
                }
            }

            return hasUpdates ? newSkills : prevSkills;
        });

        // Mark card as processed
        setProcessedCards(prev => new Set([...prev, cardId]));

        return true;
    }, [processedCards, checkSREUnlock]);

    // Check if SRE is currently unlocked
    const isSREUnlocked = checkSREUnlock(skills);

    return {
        skills,
        updateSkills,
        isSREUnlocked,
        checkSREUnlock: () => checkSREUnlock(skills),
        processedCards
    };
}

