'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aboutMe_skillProgression';
const PROCESSED_CARDS_KEY = 'aboutMe_processedCards';

export function useSkillProgression(initialSkills) {
    // Initialize skills from sessionStorage or baseline
    const [skills, setSkills] = useState(() => {
        // Helper to initialize skills with baseline values
        const initializeSkills = (skillData) => {
            const initialized = {};
            Object.entries(skillData).forEach(([key, value]) => {
                initialized[key] = {
                    ...value,
                    value: value.baseline || 0
                };
            });
            return initialized;
        };

        if (typeof window === 'undefined') {
            return initializeSkills(initialSkills);
        }
        
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Merge with initial to ensure all properties exist and use baseline if value is missing
                const merged = {};
                Object.keys(initialSkills).forEach(key => {
                    // If stored value exists, use it; otherwise use baseline
                    const storedValue = parsed[key]?.value;
                    const baselineValue = initialSkills[key]?.baseline ?? 0;
                    merged[key] = {
                        ...initialSkills[key],
                        ...parsed[key],
                        value: storedValue !== undefined ? storedValue : baselineValue
                    };
                });
                return merged;
            } catch {
                return initializeSkills(initialSkills);
            }
        }
        
        return initializeSkills(initialSkills);
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

    // Check if a locked skill should be unlocked based on its unlockThreshold
    const checkSkillUnlock = useCallback((skillName, currentSkills) => {
        const skill = currentSkills[skillName];
        if (!skill || !skill.locked) return false;

        const { unlockThreshold } = skill;
        return Object.entries(unlockThreshold).every(([requiredSkillName, threshold]) => {
            const requiredSkill = currentSkills[requiredSkillName];
            return requiredSkill && requiredSkill.value >= threshold;
        });
    }, []);

    // Update skills when a journey card is triggered
    const updateSkills = useCallback((cardId, skillDeltas) => {
        // Only update if this card hasn't been processed yet
        if (processedCards.has(cardId)) {
            return { updated: false, unlockedSkills: [] };
        }

        const unlockedSkillNames = [];

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

            // Check for skill unlocks (Cloud Infrastructure, DevOps, and SRE)
            const skillsToCheck = ['Cloud Infrastructure', 'DevOps', 'SRE'];
            skillsToCheck.forEach(skillName => {
                if (newSkills[skillName]?.locked) {
                    const shouldUnlock = checkSkillUnlock(skillName, newSkills);
                    if (shouldUnlock) {
                        newSkills[skillName] = {
                            ...newSkills[skillName],
                            locked: false
                        };
                        // Only add if not already in the array (prevent duplicates)
                        if (!unlockedSkillNames.includes(skillName)) {
                            unlockedSkillNames.push(skillName);
                        }
                        hasUpdates = true;
                    }
                }
            });

            return hasUpdates ? newSkills : prevSkills;
        });

        // Mark card as processed
        setProcessedCards(prev => new Set([...prev, cardId]));

        // Deduplicate before returning
        const uniqueUnlockedSkills = [...new Set(unlockedSkillNames)];
        return { updated: true, unlockedSkills: uniqueUnlockedSkills };
    }, [processedCards, checkSkillUnlock]);

    // Check if SRE is currently unlocked (for backwards compatibility)
    const isSREUnlocked = checkSkillUnlock('SRE', skills);

    return {
        skills,
        updateSkills,
        isSREUnlocked,
        checkSREUnlock: () => checkSkillUnlock('SRE', skills),
        processedCards
    };
}
