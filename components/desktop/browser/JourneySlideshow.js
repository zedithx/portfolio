'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ScrollText } from 'lucide-react';
import { journeySummaryContent } from './data';

// Optimized preload background images with priority and error handling
const preloadImages = (urls) => {
    if (!urls || urls.length === 0) return;
    
    // Use Set to avoid preloading the same image multiple times
    const uniqueUrls = [...new Set(urls)];
    
    uniqueUrls.forEach((url, index) => {
        // Skip if already preloaded (check if image is in cache)
        const img = new Image();
        
        // Set loading priority for first few images
        if (index < 3) {
            img.fetchPriority = 'high';
        } else {
            img.fetchPriority = 'low'; // Lower priority for future slides
        }
        
        img.loading = 'eager';
        img.decoding = 'async';
        img.crossOrigin = 'anonymous'; // Help with caching
        
        img.onload = () => {
            // Image loaded successfully - now in browser cache
        };
        img.onerror = () => {
            // Silently handle errors
        };
        
        // Start loading
        img.src = url;
    });
};

// Optimized animated value component showing +points then animating
const AnimatedValue = memo(({ from, to, max, showGain = false }) => {
    const [displayValue, setDisplayValue] = useState(from || 0);
    const [showGainIndicator, setShowGainIndicator] = useState(false);
    const gainAmount = to - from;
    
    useEffect(() => {
        if (from === to) {
            setDisplayValue(to);
            setShowGainIndicator(false);
            return;
        }
        
        let gainTimeout;
        let animationFrameId;
        
        // First show the gain indicator
        if (showGain && gainAmount > 0) {
            setDisplayValue(from); // Show current value
            setShowGainIndicator(true);
            
            // After showing gain, start animating
            gainTimeout = setTimeout(() => {
                setShowGainIndicator(false);
                
                // Start value animation
                const duration = 1000; // Slowed down from 500ms
                const startTime = performance.now();
                const startValue = from || 0;
                const endValue = to || 0;
                const difference = endValue - startValue;
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cubic for smoother animation
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.round(startValue + difference * eased);
                    
                    setDisplayValue(currentValue);
                    
                    if (progress < 1) {
                        animationFrameId = requestAnimationFrame(animate);
                    } else {
                        setDisplayValue(endValue);
                    }
                };
                
                animationFrameId = requestAnimationFrame(animate);
            }, 600); // Show gain for 600ms
        } else {
            // No gain indicator, just animate directly
            const duration = 500;
            const startTime = performance.now();
            const startValue = from || 0;
            const endValue = to || 0;
            const difference = endValue - startValue;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(startValue + difference * eased);
                
                setDisplayValue(currentValue);
                
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    setDisplayValue(endValue);
                }
            };
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        return () => {
            if (gainTimeout) {
                clearTimeout(gainTimeout);
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [from, to, showGain, gainAmount]);
    
    return (
        <span>
            {displayValue}/{max}
            {showGainIndicator && gainAmount > 0 && (
                <motion.span
                    initial={{ opacity: 0, x: -5, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 5, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="text-green-400 ml-1 font-bold"
                    style={{ textShadow: '0 0 8px rgba(34, 197, 94, 0.8)' }}
                >
                    +{gainAmount}
                </motion.span>
            )}
        </span>
    );
});

export default function JourneySlideshow({ journey, updateSkills, onSkillGain, hero, skills }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [showDialogue, setShowDialogue] = useState(true);
    const [showDesktopPopup, setShowDesktopPopup] = useState(false);
    const [desktopPopupSkills, setDesktopPopupSkills] = useState(null);
    const [processedCards, setProcessedCards] = useState(new Set());
    const [isTransitioning, setIsTransitioning] = useState(false);
    const desktopPopupTimeoutRef = useRef(null);
    const skipButtonRef = useRef(null);
    const returnButtonRef = useRef(null);
    const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
    const [recentlyUpdatedSkills, setRecentlyUpdatedSkills] = useState(new Set());
    const [previousSkillValues, setPreviousSkillValues] = useState({});
    const [showSummary, setShowSummary] = useState(false);
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'skills'

    // Memoize prefersReducedMotion to avoid checking on every render
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    const currentCard = journey[currentIndex];
    // Use safe dialogue access - will be validated later
    const currentDialogue = currentCard?.dialogues?.[dialogueIndex];

    // Reset dialogue index when slide changes
    useEffect(() => {
        if (currentCard) {
            setDialogueIndex(0);
            setShowDialogue(true);
            setShowDesktopPopup(false);
            setDesktopPopupSkills(null);
            setIsTransitioning(false);
            // Clear any pending timeouts
            if (desktopPopupTimeoutRef.current) {
                clearTimeout(desktopPopupTimeoutRef.current);
                desktopPopupTimeoutRef.current = null;
            }
        }
    }, [currentIndex, currentCard]);

    // Handle dialogue click to advance
    const handleDialogueClick = useCallback(() => {
        if (!currentCard?.dialogues) return;

        if (dialogueIndex < currentCard.dialogues.length - 1) {
            // Move to next dialogue
            setDialogueIndex(prev => prev + 1);
        } else {
            // All dialogues done
            setShowDialogue(false);
            
            // Trigger skill update if not already processed
            if (!processedCards.has(currentCard.id)) {
                // Store previous values for animation
                const prevValues = {};
                Object.keys(currentCard.skillsGained).forEach(skillName => {
                    if (skills[skillName]) {
                        prevValues[skillName] = skills[skillName].value || skills[skillName].baseline || 0;
                    }
                });
                setPreviousSkillValues(prevValues);
                
                const updated = updateSkills(currentCard.id, currentCard.skillsGained);
                if (updated) {
                    // Mark skills as recently updated for animation
                    const updatedSkillNames = Object.keys(currentCard.skillsGained);
                    setRecentlyUpdatedSkills(new Set(updatedSkillNames));
                    
                    // Clear the highlight after animation
                    setTimeout(() => {
                        setRecentlyUpdatedSkills(new Set());
                    }, 2000);
                    
                    if (onSkillGain) {
                        onSkillGain(currentCard.id, currentCard.skillsGained);
                    }
                    setProcessedCards(prev => new Set([...prev, currentCard.id]));
                }
            }
            
            // Check if this is the last slide - if so, go to summary automatically
            const isLastSlide = currentIndex === journey.length - 1;
            if (isLastSlide) {
                // Auto-dismiss popup quickly, then show summary
                setDesktopPopupSkills(currentCard.skillsGained);
                setShowDesktopPopup(true);
                
                if (desktopPopupTimeoutRef.current) {
                    clearTimeout(desktopPopupTimeoutRef.current);
                }
                desktopPopupTimeoutRef.current = setTimeout(() => {
                    setShowDesktopPopup(false);
                    setDesktopPopupSkills(null);
                    desktopPopupTimeoutRef.current = null;
                    // Navigate to summary after popup - add extra delay to ensure skills state has updated
                    setTimeout(() => {
                        setIsTransitioning(true);
                        setShowDialogue(false);
                        setTimeout(() => {
                            setShowSummary(true);
                            setIsTransitioning(false);
                        }, 300);
                    }, 800); // Increased from 500 to 800 to ensure skills state has propagated
                }, 2000);
            } else {
                // Show small popup for both mobile and desktop
                setDesktopPopupSkills(currentCard.skillsGained);
                setShowDesktopPopup(true);
                
                // Auto-dismiss after 3 seconds
                if (desktopPopupTimeoutRef.current) {
                    clearTimeout(desktopPopupTimeoutRef.current);
                }
                desktopPopupTimeoutRef.current = setTimeout(() => {
                    setShowDesktopPopup(false);
                    setDesktopPopupSkills(null);
                    desktopPopupTimeoutRef.current = null;
                }, 3000);
            }
        }
    }, [dialogueIndex, currentCard, processedCards, updateSkills, onSkillGain, currentIndex, journey.length]);

    const goNext = useCallback(() => {
        if (currentIndex < journey.length - 1 && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 300);
        }
    }, [currentIndex, journey.length, isTransitioning]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0 && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
            }, 300);
        }
    }, [currentIndex, isTransitioning]);

    const goToSlide = useCallback((index) => {
        if (!isTransitioning && index !== currentIndex) {
            setIsTransitioning(true);
            setShowSummary(false);
            setTimeout(() => {
                setCurrentIndex(index);
            }, 300);
        }
    }, [currentIndex, isTransitioning]);

    const goToSummary = useCallback(() => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setShowDialogue(false);
            setTimeout(() => {
                setShowSummary(true);
                setIsTransitioning(false);
            }, 300);
        }
    }, [isTransitioning]);


    // Memoize all unique background images from journey and preload them
    const bgImages = useMemo(() => {
        const uniqueBgs = [...new Set(journey.map(card => card.scene).filter(Boolean))];
        return uniqueBgs;
    }, [journey]);

    // Preload ALL background images immediately on mount for instant transitions
    useEffect(() => {
        if (bgImages && bgImages.length > 0) {
            // Preload all backgrounds immediately when component mounts
            preloadImages(bgImages);
        }
    }, [bgImages]);

    // Aggressively preload next 2-3 slides ahead for smoother navigation
    useEffect(() => {
        if (journey.length > 0) {
            const imagesToPreload = [];
            
            // Preload next 3 slides ahead
            for (let i = 1; i <= 3; i++) {
                const nextIndex = (currentIndex + i) % journey.length;
                if (journey[nextIndex]?.scene) {
                    imagesToPreload.push(journey[nextIndex].scene);
                }
            }
            
            // Also preload previous slide (in case user goes back)
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : journey.length - 1;
            if (journey[prevIndex]?.scene) {
                imagesToPreload.push(journey[prevIndex].scene);
            }
            
            if (imagesToPreload.length > 0) {
                preloadImages(imagesToPreload);
            }
        }
    }, [currentIndex, journey]);

    // Attach touch event listeners for buttons on mobile
    useEffect(() => {
        const skipButton = skipButtonRef.current;
        const returnButton = returnButtonRef.current;

        const handleSkipTouch = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning && skipButton) {
                goToSummary();
            }
        };

        const handleReturnTouch = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (returnButton) {
                window.location.href = '/';
            }
        };

        if (skipButton) {
            skipButton.addEventListener('touchend', handleSkipTouch, { passive: false });
        }
        if (returnButton) {
            returnButton.addEventListener('touchend', handleReturnTouch, { passive: false });
        }

        return () => {
            if (skipButton) {
                skipButton.removeEventListener('touchend', handleSkipTouch);
            }
            if (returnButton) {
                returnButton.removeEventListener('touchend', handleReturnTouch);
            }
        };
    }, [isTransitioning]);

    // Add custom scrollbar styles for parchment scroll
    useEffect(() => {
        const styleId = 'parchment-scrollbar-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #8B4513;
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #6B3410;
            }
        `;
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    const getSceneBackground = useCallback((scene) => {
        // Scene is now a direct path, return it as-is
        return scene || '/background/absolum1.jpeg';
    }, []);

    // Seeded random function for deterministic values (fixes hydration mismatch)
    const seededRandom = useCallback((seed, index) => {
        const x = Math.sin(seed + index) * 10000;
        return x - Math.floor(x);
    }, []);

    // Memoize particle arrays per slide to avoid recreation on every render
    // Use seeded random to ensure server and client render the same values
    const rainParticles = useMemo(() => {
        const seed = currentIndex * 1000; // Use currentIndex as seed
        return Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: (i * 6.67) % 100,
            duration: 1 + seededRandom(seed, i * 2),
            delay: seededRandom(seed, i * 2 + 1) * 0.5
        }));
    }, [currentIndex, seededRandom]); // Recreate only when slide changes

    const floatingParticles = useMemo(() => {
        const seed = currentIndex * 1000 + 500; // Different seed for floating particles
        return Array.from({ length: 5 }, (_, i) => ({
            id: i,
            left: seededRandom(seed, i * 3) * 100,
            top: seededRandom(seed, i * 3 + 1) * 100,
            duration: 3 + seededRandom(seed, i * 3 + 2) * 2,
            delay: seededRandom(seed, i * 3 + 3) * 2
        }));
    }, [currentIndex, seededRandom]); // Recreate only when slide changes

    // Memoize skill icon and color functions (needed for summary)
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

    // Render skill item component (reusable) - MUST be before any early returns
    const renderSkillItem = useCallback((skillName, skill) => {
        if (skill.locked) return null;
        
        const value = skill.value || skill.baseline || 0;
        const max = skill.max || 100;
        const percentage = (value / max) * 100;
        const color = getSkillColor(skillName);
        const icon = getSkillIcon(skillName);

        return (
            <div key={skillName} className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-lg flex-shrink-0">{icon}</span>
                    <span 
                        className="text-xs font-bold truncate flex-1"
                        style={{ 
                            color: '#ffd700',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                        }}
                    >
                        {skillName}
                    </span>
                    <span 
                        className="text-[10px] text-yellow-400/70"
                        style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                    >
                        {Math.round(value)}/{max}
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
            </div>
        );
    }, [getSkillColor, getSkillIcon, prefersReducedMotion]);

    // Memoize skill filtering and sorting to avoid recalculation on every render
    const technicalSkillOrder = useMemo(() => [
        'Backend',
        'Frontend',
        'Hardware',
        'Telegram Bots',
        'Deployment',
        'DevOps',
        'LLMs',
        'Cloud Infrastructure',
        'SRE'
    ], []);
    
    const technicalSkills = useMemo(() => {
        return Object.entries(skills || {})
            .filter(([name]) => !['Product Management', 'Social', 'Recreational'].includes(name))
            .sort(([a], [b]) => {
                const indexA = technicalSkillOrder.indexOf(a);
                const indexB = technicalSkillOrder.indexOf(b);
                // If not in order array, put at end
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
    }, [skills, technicalSkillOrder]);
    
    const nonTechnicalSkills = useMemo(() => {
        return Object.entries(skills || {}).filter(([name]) => 
            ['Product Management', 'Social', 'Recreational'].includes(name)
        );
    }, [skills]);

    // Generate background particles for summary page - MUST be before early return
    const summaryParticles = useMemo(() => {
        return Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: 2 + Math.random() * 3,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 2,
            type: Math.random() > 0.5 ? 'dot' : 'sparkle'
        }));
    }, []);

    // Calculate final skill values by summing all skillsGained from all journey segments
    // This ensures the summary always shows the complete final values regardless of user progress
    const finalSkills = useMemo(() => {
        if (!skills || !journey) return {};
        
        // Start with baseline values from initial skills
        const final = {};
        Object.entries(skills).forEach(([skillName, skill]) => {
            final[skillName] = {
                ...skill,
                value: skill.baseline || 0
            };
        });
        
        // Sum all skillsGained from all journey segments
        journey.forEach((segment) => {
            if (segment.skillsGained) {
                Object.entries(segment.skillsGained).forEach(([skillName, gain]) => {
                    if (final[skillName]) {
                        final[skillName].value = (final[skillName].value || 0) + gain;
                        // Cap at max value
                        if (final[skillName].value > (final[skillName].max || 100)) {
                            final[skillName].value = final[skillName].max || 100;
                        }
                    }
                });
            }
        });
        
        return final;
    }, [skills, journey]);

    // Memoize summary skills using the calculated final values
    const summarySkills = useMemo(() => {
        if (!finalSkills) return { allSkills: [], technicalSkills: [], nonTechnicalSkills: [] };
        // Filter out locked skills and get all unlocked skills with final values
        const allSkills = Object.entries(finalSkills).filter(([_, skill]) => !skill.locked);
        const technicalSkills = allSkills.filter(([name, _]) => 
            ['Frontend', 'Backend', 'Hardware', 'Telegram Bots', 'Deployment', 'DevOps', 'LLMs', 'Cloud Infrastructure', 'SRE'].includes(name)
        );
        const nonTechnicalSkills = allSkills.filter(([name, _]) => 
            !['Frontend', 'Backend', 'Hardware', 'Telegram Bots', 'Deployment', 'DevOps', 'LLMs', 'Cloud Infrastructure', 'SRE'].includes(name)
        );
        return { allSkills, technicalSkills, nonTechnicalSkills };
    }, [finalSkills]);

    // Early return after all hooks - but handle summary case
    if (showSummary) {
        // Render summary page - use memoized skills to ensure latest values
        const { allSkills, technicalSkills, nonTechnicalSkills } = summarySkills;

        // Collect all journey dialogues for the transcript
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
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-3 sm:p-2 md:p-4 lg:p-6 xl:p-8" style={{ background: 'radial-gradient(circle at center, rgba(139, 69, 19, 0.1), rgba(0, 0, 0, 0.3))', willChange: 'auto' }}>
                {/* Gamified background effects for summary page */}
                {!prefersReducedMotion && (
                    <>
                        {/* Spawning dots */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            {summaryParticles.filter(p => p.type === 'dot').map((particle) => (
                                <motion.div
                                    key={`summary-dot-${particle.id}`}
                                    className="absolute rounded-full bg-yellow-400/40"
                                    style={{
                                        left: `${particle.left}%`,
                                        top: '-10px',
                                        width: `${particle.size}px`,
                                        height: `${particle.size}px`,
                                        boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)'
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 0.8, 0.8, 0],
                                        scale: [0, 1.5, 1, 0.5],
                                        y: [0, 1000],
                                        x: [0, Math.sin(particle.id) * 50, 0]
                                    }}
                                    transition={{
                                        duration: particle.duration,
                                        repeat: Infinity,
                                        delay: particle.delay,
                                        ease: 'easeInOut'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Floating sparkles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            {summaryParticles.filter(p => p.type === 'sparkle').map((particle) => (
                                <motion.div
                                    key={`summary-sparkle-${particle.id}`}
                                    className="absolute text-yellow-300/60"
                                    style={{
                                        left: `${particle.left}%`,
                                        top: `${particle.top}%`,
                                        fontSize: `${particle.size * 2}px`,
                                        filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.7))'
                                    }}
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1.5, 0.8],
                                        y: [0, -40, 0],
                                        rotate: [0, 180, 360],
                                        x: [0, Math.cos(particle.id) * 30, 0]
                                    }}
                                    transition={{
                                        duration: particle.duration,
                                        repeat: Infinity,
                                        delay: particle.delay,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    ✨
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* Parchment Scroll Container with aged edges */}
                <motion.div
                    initial={prefersReducedMotion ? {} : { 
                        opacity: 0,
                        clipPath: 'inset(0 0 100% 0)',
                        scale: 0.95
                    }}
                    animate={prefersReducedMotion ? {} : { 
                        opacity: 1,
                        clipPath: 'inset(0 0 0% 0)',
                        scale: 1
                    }}
                    transition={prefersReducedMotion ? {} : { 
                        duration: 1.0,
                        ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out for natural unroll
                        clipPath: {
                            duration: 1.0,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        },
                        opacity: {
                            duration: 0.6,
                            ease: 'easeOut'
                        },
                        scale: {
                            duration: 1.0,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }
                    }}
                    className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-full max-h-[94vh] sm:max-h-[95vh] md:max-h-[90vh] flex flex-col px-4 sm:px-4 md:px-6 lg:px-8 xl:px-12 my-3 sm:my-0"
                    style={{
                        background: 'linear-gradient(to bottom, #d4aa68 0%, #e8c896 8%, #f0dd9c 20%, #e8c896 50%, #d4aa68 80%, #c19b5d 100%)',
                        color: '#3b2712',
                        fontFamily: 'serif',
                        position: 'relative',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        boxShadow: '0 0 0 1px rgba(139, 69, 19, 0.3), 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 50px rgba(255, 255, 255, 0.1)',
                        transformOrigin: 'top center',
                        willChange: prefersReducedMotion ? 'auto' : 'transform, opacity, clip-path'
                    }}
                >
                    {/* Aged/broken top edge */}
                    <div 
                        className="absolute top-0 left-0 right-0 h-3 pointer-events-none z-20"
                        style={{
                            backgroundImage: `
                                repeating-linear-gradient(90deg, 
                                    transparent 0px, transparent 2px,
                                    rgba(139, 69, 19, 0.4) 2px, rgba(139, 69, 19, 0.4) 3px,
                                    transparent 3px, transparent 5px
                                )
                            `,
                            clipPath: 'polygon(0 0, 2% 100%, 5% 0, 8% 100%, 12% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 98% 0, 100% 100%)'
                        }}
                    />

                    {/* Top curled edge with shadow */}
                    <div 
                        className="absolute -top-6 left-0 right-0 h-12 pointer-events-none z-10"
                        style={{
                            backgroundImage: `
                                radial-gradient(ellipse 60px 24px at 0% 50%, #8B4513 0%, #A0522D 20%, #CD853F 40%, transparent 60%),
                                radial-gradient(ellipse 60px 24px at 100% 50%, #8B4513 0%, #A0522D 20%, #CD853F 40%, transparent 60%),
                                linear-gradient(to bottom, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                            `,
                            backgroundSize: '80px 100%, 80px 100%, 100% 100%',
                            backgroundPosition: '0% 50%, 100% 50%, center',
                            backgroundRepeat: 'no-repeat',
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
                            clipPath: 'polygon(0 0, 3% 100%, 7% 0, 12% 100%, 18% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 97% 0, 100% 100%)'
                        }}
                    />

                    {/* Parchment texture overlay with noise */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
                                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.08) 0%, transparent 50%)
                            `,
                            mixBlendMode: 'multiply',
                            opacity: 0.6
                        }}
                    />

                    {/* Aged spots/burns */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.15) 0%, transparent 3%),
                                radial-gradient(circle at 85% 75%, rgba(160, 82, 45, 0.12) 0%, transparent 2.5%),
                                radial-gradient(circle at 50% 10%, rgba(139, 69, 19, 0.1) 0%, transparent 2%)
                            `,
                            mixBlendMode: 'multiply'
                        }}
                    />

                    {/* Scroll Body - Content Area with irregular edges */}
                    <div 
                        className="relative flex-1 flex flex-col min-h-0 px-3 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-3 sm:py-3 md:py-4 lg:py-6 xl:py-8"
                        style={{
                            background: 'radial-gradient(circle at 50% 0, rgba(255, 255, 255, 0.4), transparent 60%)',
                            borderLeft: '2px solid rgba(139, 69, 19, 0.4)',
                            borderRight: '2px solid rgba(139, 69, 19, 0.4)',
                            marginTop: '4px',
                            marginBottom: '4px',
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                            overflow: 'visible'
                        }}
                    >
                        <div className="w-full h-full flex flex-col overflow-hidden">
                            {/* Title */}
                            <motion.h1
                                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                                transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.2 }}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-4 md:mb-6 shrink-0 px-2"
                                style={{
                                    color: '#8B4513',
                                    textShadow: '0 1px 0 #f7edd3, 2px 2px 4px rgba(0, 0, 0, 0.5)',
                                    fontFamily: 'serif',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Journey Summary
                            </motion.h1>

                            {/* Tabs - Ancient scroll style tabs */}
                            <div className="flex gap-0 mb-0 shrink-0 relative" style={{ marginTop: '-4px' }}>
                                <motion.button
                                    onClick={() => setActiveTab('summary')}
                                    className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 font-bold text-xs sm:text-sm md:text-base flex-1 touch-manipulation min-h-[44px] sm:min-h-[48px] relative overflow-hidden`}
                                    style={{
                                        background: activeTab === 'summary' 
                                            ? 'linear-gradient(to bottom, #e8c896 0%, #f0dd9c 20%, #e8c896 50%, #d4aa68 100%)' 
                                            : 'linear-gradient(to bottom, #c19b5d 0%, #d4aa68 30%, #c19b5d 100%)',
                                        border: `1px solid ${activeTab === 'summary' ? 'rgba(139, 69, 19, 0.6)' : 'rgba(139, 69, 19, 0.4)'}`,
                                        borderBottom: activeTab === 'summary' ? 'none' : '1px solid rgba(139, 69, 19, 0.4)',
                                        borderTopLeftRadius: '6px',
                                        borderTopRightRadius: '6px',
                                        color: '#5D4037',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), 0 0 4px rgba(139, 69, 19, 0.3)',
                                        fontFamily: 'serif',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        boxShadow: activeTab === 'summary' 
                                            ? 'inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(139, 69, 19, 0.2), 0 2px 6px rgba(0, 0, 0, 0.3)' 
                                            : 'inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(139, 69, 19, 0.1)',
                                        zIndex: activeTab === 'summary' ? 3 : 1,
                                        position: 'relative',
                                        marginRight: activeTab === 'summary' ? '0' : '-1px'
                                    }}
                                    whileHover={prefersReducedMotion ? {} : {
                                        scale: activeTab === 'summary' ? 1 : 1.01
                                    }}
                                    whileTap={prefersReducedMotion ? {} : {
                                        scale: 0.98
                                    }}
                                    transition={{
                                        scale: { duration: 0 },
                                        background: { duration: 0 },
                                        borderColor: { duration: 0 }
                                    }}
                                >
                                    {/* Parchment texture overlay with noise - matching scroll */}
                                    <div 
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            backgroundImage: `
                                                url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
                                                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
                                                radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.08) 0%, transparent 50%)
                                            `,
                                            mixBlendMode: 'multiply',
                                            opacity: 0.6
                                        }}
                                    />
                                    {/* Aged spots/burns - matching scroll */}
                                    <div 
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            backgroundImage: `
                                                radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.15) 0%, transparent 3%),
                                                radial-gradient(circle at 85% 75%, rgba(160, 82, 45, 0.12) 0%, transparent 2.5%),
                                                radial-gradient(circle at 50% 10%, rgba(139, 69, 19, 0.1) 0%, transparent 2%)
                                            `,
                                            mixBlendMode: 'multiply'
                                        }}
                                    />
                                    {/* Decorative corner elements for active tab */}
                                    {activeTab === 'summary' && (
                                        <>
                                            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#8B4513] opacity-60" />
                                            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#8B4513] opacity-60" />
                                            <div 
                                                className="absolute bottom-0 left-0 right-0 h-1"
                                                style={{
                                                    background: 'linear-gradient(to bottom, #e8c896, #d4aa68)',
                                                    zIndex: 4
                                                }}
                                            />
                                        </>
                                    )}
                                    <span className="relative z-10">Summary</span>
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('skills')}
                                    className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 font-bold text-xs sm:text-sm md:text-base flex-1 touch-manipulation min-h-[44px] sm:min-h-[48px] relative overflow-hidden`}
                                    style={{
                                        background: activeTab === 'skills' 
                                            ? 'linear-gradient(to bottom, #e8c896 0%, #f0dd9c 20%, #e8c896 50%, #d4aa68 100%)' 
                                            : 'linear-gradient(to bottom, #c19b5d 0%, #d4aa68 30%, #c19b5d 100%)',
                                        border: `1px solid ${activeTab === 'skills' ? 'rgba(139, 69, 19, 0.6)' : 'rgba(139, 69, 19, 0.4)'}`,
                                        borderBottom: activeTab === 'skills' ? 'none' : '1px solid rgba(139, 69, 19, 0.4)',
                                        borderTopLeftRadius: '6px',
                                        borderTopRightRadius: '6px',
                                        color: '#5D4037',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), 0 0 4px rgba(139, 69, 19, 0.3)',
                                        fontFamily: 'serif',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        boxShadow: activeTab === 'skills' 
                                            ? 'inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(139, 69, 19, 0.2), 0 2px 6px rgba(0, 0, 0, 0.3)' 
                                            : 'inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(139, 69, 19, 0.1)',
                                        zIndex: activeTab === 'skills' ? 3 : 1,
                                        position: 'relative',
                                        marginLeft: activeTab === 'skills' ? '0' : '-1px'
                                    }}
                                    whileHover={prefersReducedMotion ? {} : {
                                        scale: activeTab === 'skills' ? 1 : 1.01
                                    }}
                                    whileTap={prefersReducedMotion ? {} : {
                                        scale: 0.98
                                    }}
                                    transition={{
                                        scale: { duration: 0 },
                                        background: { duration: 0 },
                                        borderColor: { duration: 0 }
                                    }}
                                >
                                    {/* Parchment texture overlay with noise - matching scroll */}
                                    <div 
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            backgroundImage: `
                                                url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
                                                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
                                                radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.08) 0%, transparent 50%)
                                            `,
                                            mixBlendMode: 'multiply',
                                            opacity: 0.6
                                        }}
                                    />
                                    {/* Aged spots/burns - matching scroll */}
                                    <div 
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            backgroundImage: `
                                                radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.15) 0%, transparent 3%),
                                                radial-gradient(circle at 85% 75%, rgba(160, 82, 45, 0.12) 0%, transparent 2.5%),
                                                radial-gradient(circle at 50% 10%, rgba(139, 69, 19, 0.1) 0%, transparent 2%)
                                            `,
                                            mixBlendMode: 'multiply'
                                        }}
                                    />
                                    {/* Decorative corner elements for active tab */}
                                    {activeTab === 'skills' && (
                                        <>
                                            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#8B4513] opacity-60" />
                                            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#8B4513] opacity-60" />
                                            <div 
                                                className="absolute bottom-0 left-0 right-0 h-1"
                                                style={{
                                                    background: 'linear-gradient(to bottom, #e8c896, #d4aa68)',
                                                    zIndex: 4
                                                }}
                                            />
                                        </>
                                    )}
                                    <span className="relative z-10">Skills</span>
                                </motion.button>
                            </div>

                            {/* Scrollable Content Container */}
                            <div 
                                className="flex-1 overflow-y-auto min-h-0 py-3 sm:py-2 md:py-4 custom-scrollbar"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#8B4513 transparent',
                                    borderTop: '2px solid rgba(139, 69, 19, 0.3)',
                                    marginTop: '-2px',
                                    position: 'relative',
                                    zIndex: 2
                                }}
                            >
                            {/* Journey Transcript Tab */}
                            {activeTab === 'summary' && (
                            <div className="space-y-3 sm:space-y-3 md:space-y-4 lg:space-y-6 mb-4 sm:mb-4 md:mb-6 lg:mb-8 px-1 sm:px-0 pt-2 sm:pt-2">
                                {Object.entries(journeySummaryContent).map(([key, section], index) => (
                                    <motion.div
                                        key={key}
                                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                        transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.1 + (index * 0.1) }}
                                        className="relative space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4"
                                        style={{
                                            marginTop: index === 0 ? '0.25rem' : '1rem',
                                            paddingTop: '1.25rem'
                                        }}
                                    >
                                        <h2 
                                            className="text-sm sm:text-base md:text-lg lg:text-xl font-bold absolute top-0 left-0"
                                            style={{
                                                color: '#8B4513',
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), 0 0 8px rgba(139, 69, 19, 0.3)',
                                                fontFamily: 'serif',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                borderBottom: '2px solid rgba(139, 69, 19, 0.4)',
                                                paddingBottom: '0.25rem',
                                                paddingRight: '0.75rem',
                                                marginTop: '0',
                                                maxWidth: '90%',
                                                zIndex: 1,
                                                lineHeight: '1.2'
                                            }}
                                        >
                                            {section.title}
                                        </h2>
                                        <div className="mt-5 sm:mt-7 md:mt-8 lg:mt-10" style={{ position: 'relative', zIndex: 0 }}>
                                            {section.content
                                                .replace(/\\n\\n/g, '\n\n') // Replace literal \n\n with actual newlines
                                                .split('\n\n')
                                                .map((paragraph, paraIndex) => (
                                                    paragraph.trim() && (
                                                        <motion.p
                                                            key={paraIndex}
                                                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                                            animate={prefersReducedMotion ? {} : { opacity: 1 }}
                                                            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.1 + (index * 0.1) + (paraIndex * 0.05) }}
                                                            className="text-sm sm:text-base md:text-lg leading-relaxed"
                                                            style={{
                                                                color: '#5D4037',
                                                                textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.3)',
                                                                fontFamily: 'serif',
                                                                textAlign: 'justify',
                                                                marginBottom: '0.75rem',
                                                                hyphens: 'auto',
                                                                wordBreak: 'break-word',
                                                                lineHeight: '1.6'
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

                            {/* Skills Tab */}
                            {activeTab === 'skills' && skills && (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                    transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.4 }}
                                    className="pt-3 sm:pt-3 md:pt-4 lg:pt-6 px-1 sm:px-0"
                                >
                                    <h2 
                                        className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 md:mb-6"
                                        style={{
                                            color: '#8B4513',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                            fontFamily: 'serif'
                                        }}
                                    >
                                        Final Skills
                                    </h2>
                                    
                                    {/* Technical Skills */}
                                    {technicalSkills.length > 0 && (
                                        <div className="mb-3 sm:mb-4 md:mb-6">
                                            <h3 
                                                className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3"
                                                style={{
                                                    color: '#8B4513',
                                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                                    fontFamily: 'serif'
                                                }}
                                            >
                                                Technical Skills
                                            </h3>
                                            <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-3">
                                                {technicalSkills.map(([skillName, skill]) => {
                                                    const value = skill.value || skill.baseline || 0;
                                                    const max = skill.max || 100;
                                                    const percentage = (value / max) * 100;
                                                    return (
                                                        <div
                                                            key={skillName}
                                                            className="py-0.5 sm:py-1 md:py-2"
                                                        >
                                                            <div className="flex items-center justify-between mb-0.5 sm:mb-1 gap-1">
                                                                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-1 min-w-0">
                                                                    <span className="text-base sm:text-lg md:text-xl flex-shrink-0">{getSkillIcon(skillName)}</span>
                                                                    <span 
                                                                        className="text-xs sm:text-sm md:text-base font-semibold truncate"
                                                                        style={{
                                                                            color: '#8B4513',
                                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                                                            fontFamily: 'serif'
                                                                        }}
                                                                    >
                                                                        {skillName}
                                                                    </span>
                                                                </div>
                                                                <span 
                                                                    className="text-sm md:text-base font-bold"
                                                                    style={{
                                                                        color: '#8B4513',
                                                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                                                        fontFamily: 'serif'
                                                                    }}
                                                                >
                                                                    {value}/{max}
                                                                </span>
                                                            </div>
                                                            <div 
                                                                className="h-2 md:h-3 rounded-full overflow-hidden"
                                                                style={{
                                                                    background: 'rgba(139, 69, 19, 0.2)',
                                                                    border: '1px solid rgba(139, 69, 19, 0.4)'
                                                                }}
                                                            >
                                                                <motion.div
                                                                    initial={prefersReducedMotion ? {} : { width: 0 }}
                                                                    animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                                                                    transition={prefersReducedMotion ? {} : { duration: 1, delay: 0.5 }}
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        background: `linear-gradient(90deg, ${getSkillColor(skillName)}, ${getSkillColor(skillName)}dd)`,
                                                                        boxShadow: `0 0 8px ${getSkillColor(skillName)}80`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Non-Technical Skills */}
                                    {nonTechnicalSkills.length > 0 && (
                                        <div>
                                            <h3 
                                                className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3"
                                                style={{
                                                    color: '#8B4513',
                                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                                    fontFamily: 'serif'
                                                }}
                                            >
                                                Non-Technical Skills
                                            </h3>
                                            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                                                {nonTechnicalSkills.map(([skillName, skill]) => {
                                                    const value = skill.value || skill.baseline || 0;
                                                    const max = skill.max || 100;
                                                    const percentage = (value / max) * 100;
                                                    return (
                                                        <div
                                                            key={skillName}
                                                            className="py-1 sm:py-2"
                                                        >
                                                            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                                                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-1 min-w-0">
                                                                    <span className="text-base sm:text-lg md:text-xl flex-shrink-0">{getSkillIcon(skillName)}</span>
                                                                    <span 
                                                                        className="text-xs sm:text-sm md:text-base font-semibold truncate"
                                                                        style={{
                                                                            color: '#8B4513',
                                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                                                            fontFamily: 'serif'
                                                                        }}
                                                                    >
                                                                        {skillName}
                                                                    </span>
                                                                </div>
                                                                <span 
                                                                    className="text-xs sm:text-sm md:text-base font-bold flex-shrink-0"
                                                                    style={{
                                                                        color: '#8B4513',
                                                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                                                        fontFamily: 'serif'
                                                                    }}
                                                                >
                                                                    {value}/{max}
                                                                </span>
                                                            </div>
                                                            <div 
                                                                className="h-1.5 sm:h-2 md:h-3 rounded-full overflow-hidden"
                                                                style={{
                                                                    background: 'rgba(139, 69, 19, 0.2)',
                                                                    border: '1px solid rgba(139, 69, 19, 0.4)'
                                                                }}
                                                            >
                                                                <motion.div
                                                                    initial={prefersReducedMotion ? {} : { width: 0 }}
                                                                    animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                                                                    transition={prefersReducedMotion ? {} : { duration: 1, delay: 0.5 }}
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        background: `linear-gradient(90deg, ${getSkillColor(skillName)}, ${getSkillColor(skillName)}dd)`,
                                                                        boxShadow: `0 0 8px ${getSkillColor(skillName)}80`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                            {/* Return to MacBook Button - Fixed at bottom */}
                            <div className="flex justify-center pt-4 sm:pt-3 md:pt-4 lg:pt-6 pb-3 sm:pb-3 md:pb-4 shrink-0" style={{ overflow: 'visible', zIndex: 10 }}>
                                <motion.button
                                    ref={returnButtonRef}
                                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.location.href = '/';
                                    }}
                                    onTouchEnd={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.location.href = '/';
                                    }}
                                    className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg font-bold text-xs sm:text-sm md:text-base lg:text-lg mx-auto block touch-manipulation relative min-h-[40px] sm:min-h-[44px] z-[100]"
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
                                    whileHover={prefersReducedMotion ? {} : { 
                                        scale: 1.08,
                                        rotate: 1,
                                        boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.5), 0 6px 20px rgba(139, 69, 19, 0.5), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 0 2px rgba(139, 69, 19, 0.4)',
                                        borderColor: '#8B4513',
                                        background: 'linear-gradient(to bottom, #f0dd9c, #e8c896)'
                                    }}
                                    transition={{
                                        opacity: { duration: 0.5, delay: 0.6 },
                                        y: { duration: 0.5, delay: 0.6 },
                                        scale: { duration: 0 },
                                        rotate: { duration: 0 },
                                        boxShadow: { duration: 0 },
                                        borderColor: { duration: 0 },
                                        background: { duration: 0 }
                                    }}
                                    whileTap={prefersReducedMotion ? {} : { 
                                        scale: 0.96,
                                        rotate: -0.5,
                                        transition: { duration: 0, ease: 'linear' }
                                    }}
                                >
                                    <motion.span 
                                        className="relative z-10"
                                        whileHover={prefersReducedMotion ? {} : {
                                            x: [0, -2, 2, 0],
                                            transition: {
                                                duration: 0.5,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }
                                        }}
                                    >
                                        Return to MacBook
                                    </motion.span>
                                    {/* Shimmer effect on hover */}
                                    <motion.div 
                                        className="absolute inset-0 opacity-0 pointer-events-none"
                                        style={{
                                            background: 'linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%)',
                                            backgroundSize: '200% 100%'
                                        }}
                                        whileHover={prefersReducedMotion ? {} : {
                                            opacity: [0, 1, 0],
                                            x: ['-100%', '100%'],
                                            transition: {
                                                duration: 0.8,
                                                ease: 'easeInOut'
                                            }
                                        }}
                                    />
                                    {/* Subtle texture overlay */}
                                    <div 
                                        className="absolute inset-0 opacity-10 pointer-events-none"
                                        style={{
                                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                                            mixBlendMode: 'multiply'
                                        }}
                                    />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom curled edge with shadow */}
                    <div 
                        className="absolute -bottom-6 left-0 right-0 h-12 pointer-events-none z-10"
                        style={{
                            backgroundImage: `
                                radial-gradient(ellipse 60px 24px at 0% 50%, #8B4513 0%, #A0522D 20%, #CD853F 40%, transparent 60%),
                                radial-gradient(ellipse 60px 24px at 100% 50%, #8B4513 0%, #A0522D 20%, #CD853F 40%, transparent 60%),
                                linear-gradient(to top, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                            `,
                            backgroundSize: '80px 100%, 80px 100%, 100% 100%',
                            backgroundPosition: '0% 50%, 100% 50%, center',
                            backgroundRepeat: 'no-repeat',
                            filter: 'drop-shadow(0 -4px 8px rgba(0, 0, 0, 0.4))',
                            clipPath: 'polygon(0 0, 3% 100%, 7% 0, 12% 100%, 18% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 97% 0, 100% 100%)'
                        }}
                    />

                    {/* Aged/broken bottom edge */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none z-20"
                        style={{
                            backgroundImage: `
                                repeating-linear-gradient(90deg, 
                                    transparent 0px, transparent 2px,
                                    rgba(139, 69, 19, 0.4) 2px, rgba(139, 69, 19, 0.4) 3px,
                                    transparent 3px, transparent 5px
                                )
                            `,
                            clipPath: 'polygon(0 0, 2% 100%, 5% 0, 8% 100%, 12% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 98% 0, 100% 100%)'
                        }}
                    />

                    {/* Left side curl detail */}
                    <div 
                        className="absolute left-0 top-1/4 bottom-1/4 w-8 pointer-events-none z-10"
                        style={{
                            background: 'radial-gradient(ellipse 32px 100% at 0% 50%, rgba(139, 69, 19, 0.3) 0%, transparent 70%)',
                            filter: 'drop-shadow(-2px 0 4px rgba(0, 0, 0, 0.3))'
                        }}
                    />

                    {/* Right side curl detail */}
                    <div 
                        className="absolute right-0 top-1/4 bottom-1/4 w-8 pointer-events-none z-10"
                        style={{
                            background: 'radial-gradient(ellipse 32px 100% at 100% 50%, rgba(139, 69, 19, 0.3) 0%, transparent 70%)',
                            filter: 'drop-shadow(2px 0 4px rgba(0, 0, 0, 0.3))'
                        }}
                    />
                </motion.div>
            </div>
        );
    }

    // Early return after all hooks - ensure we have valid data
    // Don't return null, render a loading/empty state instead to maintain hook consistency
    // Only show loading if journey is empty or currentIndex is invalid
    if (!journey || journey.length === 0 || currentIndex < 0 || currentIndex >= journey.length) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-yellow-400 text-xl">Loading adventure...</div>
            </div>
        );
    }

    // If currentCard doesn't exist, show loading
    if (!currentCard) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-yellow-400 text-xl">Loading adventure...</div>
            </div>
        );
    }

    // If dialogue is missing or out of bounds, use the first dialogue
    // This can happen during transitions before useEffect resets dialogueIndex
    const validDialogueIndex = currentCard.dialogues && currentCard.dialogues.length > 0
        ? Math.min(dialogueIndex, currentCard.dialogues.length - 1)
        : 0;
    const activeDialogue = currentCard.dialogues?.[validDialogueIndex];

    // If no valid dialogue exists, show loading
    if (!activeDialogue) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-yellow-400 text-xl">Loading adventure...</div>
            </div>
        );
    }

    // Use the active dialogue for rendering
    const isLastDialogue = validDialogueIndex === (currentCard.dialogues?.length || 0) - 1;

    return (
        <>
            <section className="w-full h-full flex flex-col relative lg:overflow-hidden">
                {/* Section Header - Better margins */}
                <motion.h2 
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                    className="text-lg md:text-xl lg:text-2xl font-bold px-4 md:px-6 py-3 md:py-4 shrink-0"
                    style={{
                        textShadow: '2px 2px 0px #000, 0 0 20px rgba(255, 215, 0, 0.6)',
                        color: '#ffd700',
                        letterSpacing: '1px'
                    }}
                >
                    <div className="flex items-center justify-between w-full pr-12 md:pr-16">
                        <span>ADVENTURE LOG</span>
                        {!showSummary && (
                            <motion.button
                                ref={skipButtonRef}
                                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                                transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.5 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isTransitioning) {
                                        goToSummary();
                                    }
                                }}
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isTransitioning) {
                                        goToSummary();
                                    }
                                }}
                                disabled={isTransitioning}
                                className={`px-2 py-2 md:px-3 md:py-1.5 rounded-lg flex items-center gap-1.5 md:gap-2 transition-all touch-manipulation min-h-[44px] md:min-h-0 z-[100] ${
                                    isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:scale-105 active:scale-95'
                                }`}
                                style={{
                                    background: 'rgba(139, 69, 19, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    border: '2px solid #8B4513',
                                    color: '#ffd700',
                                    boxShadow: '0 0 15px rgba(139, 69, 19, 0.5)',
                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                    pointerEvents: isTransitioning ? 'none' : 'auto',
                                    position: 'relative',
                                    zIndex: 100
                                }}
                                whileHover={prefersReducedMotion || isTransitioning ? {} : { scale: 1.05 }}
                                whileTap={prefersReducedMotion || isTransitioning ? {} : { scale: 0.95 }}
                                aria-label="Skip to summary"
                            >
                                <ScrollText className="w-6 h-6 md:w-4 md:h-4" />
                                <span className="text-xs md:text-sm font-bold hidden sm:inline">Skip to Summary</span>
                            </motion.button>
                        )}
                    </div>
                </motion.h2>

                {/* Main Content - Desktop: Side by side, Mobile: Stacked, Focus on Adventure Log */}
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0 px-4 md:px-6 pb-4 md:pb-6 lg:overflow-hidden">
                    {/* Adventure Slideshow - Full width on mobile */}
                    <div className="flex-1 min-h-0 flex flex-col w-full lg:w-auto">

                {/* Stage Background with Character Scene */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCard.id}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: 50 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0, x: -50 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                        className="w-full h-full rounded-lg relative overflow-hidden"
                        style={{
                            backgroundImage: `url(${getSceneBackground(currentCard.scene)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            border: '3px solid #ffd700',
                            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 50px rgba(0, 0, 0, 0.5)',
                            willChange: 'background-image',
                            imageRendering: 'crisp-edges'
                        }}
                    >
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />
                        
                        {/* Optimized Atmospheric Effects - Reduced particle count */}
                        {!prefersReducedMotion && (
                            <>
                                {/* Rain/Water Effect - Reduced to 8 particles for better performance */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    {rainParticles.map((particle) => (
                                        <motion.div
                                            key={`rain-${particle.id}`}
                                            className="absolute w-0.5 bg-white/20"
                                            style={{
                                                left: `${particle.left}%`,
                                                top: '-10px',
                                                height: '20px',
                                            }}
                                            animate={{
                                                y: [0, 700],
                                                opacity: [0, 0.5, 0],
                                            }}
                                            transition={{
                                                duration: particle.duration,
                                                repeat: Infinity,
                                                delay: particle.delay,
                                                ease: 'linear'
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Floating particles - Reduced to 5 for better performance */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    {floatingParticles.map((particle) => (
                                        <motion.div
                                            key={`particle-${particle.id}`}
                                            className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
                                            style={{
                                                left: `${particle.left}%`,
                                                top: `${particle.top}%`,
                                            }}
                                            animate={{
                                                y: [0, -30, 0],
                                                opacity: [0.2, 0.6, 0.2],
                                                scale: [1, 1.5, 1],
                                            }}
                                            transition={{
                                                duration: particle.duration,
                                                repeat: Infinity,
                                                delay: particle.delay,
                                                ease: 'easeInOut'
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}


                        {/* Hero Character (Left Side) - No border, directly on background */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { x: -100, opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.1, type: 'spring' }}
                            className="absolute left-12 md:left-16 lg:left-20 bottom-[40%] md:bottom-[35%] lg:bottom-[30%] z-20 flex flex-col items-center"
                        >
                            {hero.avatar ? (
                                <img 
                                    src={hero.avatar} 
                                    alt={hero.name}
                                    className="w-16 h-24 md:w-24 md:h-36 lg:w-32 lg:h-48 object-contain rounded-lg"
                                    style={{
                                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
                                    }}
                                />
                            ) : (
                                <div className="w-16 h-24 md:w-24 md:h-36 lg:w-32 lg:h-48 bg-gradient-to-br from-purple-600 to-blue-800 flex items-center justify-center text-3xl md:text-4xl lg:text-5xl rounded-lg">
                                    ⚔️
                                </div>
                            )}
                            <div 
                                className="mt-0 text-center text-[10px] md:text-xs lg:text-sm font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded"
                                style={{ 
                                    color: '#ffd700', 
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    backdropFilter: 'blur(4px)'
                                }}
                            >
                                ZEDITHX
                            </div>
                        </motion.div>


                        {/* Stage Icon (Top Right) */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { scale: 0, rotate: 180 }}
                            animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.4, type: 'spring' }}
                            className="absolute right-8 top-8 z-20"
                        >
                            <div 
                                className="text-6xl md:text-8xl"
                                style={{ 
                                    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
                                    textShadow: '0 0 30px rgba(255, 215, 0, 0.6)'
                                }}
                            >
                                {currentCard.icon}
                            </div>
                        </motion.div>

                        {/* Dialogue Box - Click to Advance */}
                        <AnimatePresence mode="wait">
                            {showDialogue && activeDialogue && (
                                <motion.div
                                    key={validDialogueIndex}
                                    initial={prefersReducedMotion ? {} : { y: 100, opacity: 0 }}
                                    animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
                                    exit={prefersReducedMotion ? {} : { y: 100, opacity: 0 }}
                                    transition={prefersReducedMotion ? {} : { duration: 0.3, type: 'spring' }}
                                    onClick={handleDialogueClick}
                                    className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-30 cursor-pointer touch-manipulation max-h-[40%] flex flex-col"
                                    style={{
                                        background: 'rgba(20, 20, 30, 0.9)',
                                        backdropFilter: 'blur(15px)',
                                        borderTop: '4px solid #ffd700',
                                        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255, 215, 0, 0.1)'
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleDialogueClick();
                                        }
                                    }}
                                    aria-label="Click to continue dialogue"
                                >
                                    {/* Character Name and Category */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div 
                                            className="px-4 py-2 rounded text-sm font-bold"
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: '2px solid #ffd700',
                                                color: '#fff',
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                boxShadow: '0 0 15px rgba(102, 126, 234, 0.6)'
                                            }}
                                        >
                                            {currentCard.category.toUpperCase()}
                                        </div>
                                        <div 
                                            className="text-lg md:text-xl font-bold"
                                            style={{
                                                color: '#ffd700',
                                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            {activeDialogue.speaker === 'hero' 
                                                ? 'ZEDITHX' 
                                                : activeDialogue.name?.toUpperCase() || 'ZEDITHX'}
                                        </div>
                                    </div>

                                    {/* Dialogue Text - Allow longer text with better wrapping */}
                                    <motion.p
                                        initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                        animate={prefersReducedMotion ? {} : { opacity: 1 }}
                                        transition={prefersReducedMotion ? {} : { delay: 0.1 }}
                                        className="text-white text-sm md:text-base leading-relaxed mb-2 max-h-[120px] md:max-h-[150px] overflow-y-auto pr-2"
                                        style={{
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            wordWrap: 'break-word',
                                            overflowWrap: 'break-word'
                                        }}
                                    >
                                        {activeDialogue.text}
                                    </motion.p>

                                    {/* Click to Continue Indicator */}
                                    <div className="flex items-center justify-end gap-2 mt-3">
                                        <span 
                                            className="text-xs text-yellow-400/70 italic"
                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                        >
                                            {isLastDialogue ? 'Click to view rewards →' : 'Click to continue →'}
                                        </span>
                                    </div>

                                    {/* Dialogue Progress Indicator */}
                                    {currentCard.dialogues && currentCard.dialogues.length > 1 && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {currentCard.dialogues.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-1 rounded-full transition-all ${
                                                        idx === dialogueIndex ? 'flex-1' : 'w-2'
                                                    }`}
                                                    style={{
                                                        background: idx === dialogueIndex 
                                                            ? '#ffd700' 
                                                            : 'rgba(255, 215, 0, 0.3)',
                                                        boxShadow: idx === dialogueIndex 
                                                            ? '0 0 10px rgba(255, 215, 0, 0.8)' 
                                                            : 'none'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Small Game-Like Popup - Both Mobile and Desktop */}
                        <AnimatePresence>
                            {showDesktopPopup && desktopPopupSkills && (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0, y: -20 }}
                                    animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1, y: 0 }}
                                    exit={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0, y: -10 }}
                                    transition={prefersReducedMotion ? {} : { duration: 0.4, type: 'spring', stiffness: 200 }}
                                    onClick={() => {
                                        setShowDesktopPopup(false);
                                        setDesktopPopupSkills(null);
                                        if (desktopPopupTimeoutRef.current) {
                                            clearTimeout(desktopPopupTimeoutRef.current);
                                            desktopPopupTimeoutRef.current = null;
                                        }
                                    }}
                                    className="absolute top-4 right-4 z-50 cursor-pointer"
                                    style={{
                                        minWidth: '240px',
                                        maxWidth: '300px'
                                    }}
                                >
                                    <div
                                        className="relative p-3 md:p-4 rounded-lg"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 20, 50, 0.95) 100%)',
                                            border: '2px solid #ffd700',
                                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.5)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        {/* Decorative corners */}
                                        <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-yellow-400"></div>
                                        <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-yellow-400"></div>
                                        <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-yellow-400"></div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-yellow-400"></div>
                                        
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                                            <h3
                                                className="text-base md:text-lg font-bold"
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
                                        <div className="space-y-1.5 md:space-y-2">
                                            {Object.entries(desktopPopupSkills).map(([skill, value], idx) => (
                                                <motion.div
                                                    key={skill}
                                                    initial={prefersReducedMotion ? {} : { x: -20, opacity: 0 }}
                                                    animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                                                    transition={prefersReducedMotion ? {} : { 
                                                        delay: idx * 0.1,
                                                        duration: 0.3
                                                    }}
                                                    className="flex items-center justify-between gap-2 md:gap-3 py-1 md:py-1.5 px-2 rounded"
                                                    style={{
                                                        background: 'rgba(255, 215, 0, 0.1)',
                                                        border: '1px solid rgba(255, 215, 0, 0.3)'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-1.5 md:gap-2">
                                                        <span className="text-base md:text-lg">{getSkillIcon(skill)}</span>
                                                        <span 
                                                            className="text-xs md:text-sm font-semibold text-white"
                                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                                        >
                                                            {skill}
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
                                                        className="text-sm md:text-lg font-bold px-1.5 md:px-2 py-0.5 rounded"
                                                        style={{
                                                            color: '#ffd700',
                                                            background: 'rgba(255, 215, 0, 0.2)',
                                                            border: '1px solid #ffd700',
                                                            textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
                                                            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                                                        }}
                                                    >
                                                        +{value}
                                                    </motion.span>
                                                </motion.div>
                                            ))}
                                        </div>
                                        
                                        {/* Click hint */}
                                        <motion.p
                                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                            animate={prefersReducedMotion ? {} : { opacity: 0.7 }}
                                            transition={prefersReducedMotion ? {} : { delay: 0.5 }}
                                            className="text-[10px] md:text-xs text-yellow-400/60 mt-2 text-center"
                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                        >
                                            Click to dismiss
                                        </motion.p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Small Game-Like Popup - Both Mobile and Desktop */}
                        <AnimatePresence>
                            {showDesktopPopup && desktopPopupSkills && (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0, y: -20 }}
                                    animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1, y: 0 }}
                                    exit={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0, y: -10 }}
                                    transition={prefersReducedMotion ? {} : { duration: 0.4, type: 'spring', stiffness: 200 }}
                                    onClick={() => {
                                        setShowDesktopPopup(false);
                                        setDesktopPopupSkills(null);
                                        if (desktopPopupTimeoutRef.current) {
                                            clearTimeout(desktopPopupTimeoutRef.current);
                                            desktopPopupTimeoutRef.current = null;
                                        }
                                    }}
                                    className="hidden lg:block absolute top-4 right-4 z-50 cursor-pointer"
                                    style={{
                                        minWidth: '280px',
                                        maxWidth: '350px'
                                    }}
                                >
                                    <div
                                        className="relative p-4 rounded-lg"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 20, 50, 0.95) 100%)',
                                            border: '2px solid #ffd700',
                                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.5)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        {/* Decorative corners */}
                                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400"></div>
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400"></div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400"></div>
                                        
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <h3
                                                className="text-lg font-bold"
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
                                        <div className="space-y-2">
                                            {Object.entries(desktopPopupSkills).map(([skill, value], idx) => (
                                                <motion.div
                                                    key={skill}
                                                    initial={prefersReducedMotion ? {} : { x: -20, opacity: 0 }}
                                                    animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                                                    transition={prefersReducedMotion ? {} : { 
                                                        delay: idx * 0.1,
                                                        duration: 0.3
                                                    }}
                                                    className="flex items-center justify-between gap-3 py-1.5 px-2 rounded"
                                                    style={{
                                                        background: 'rgba(255, 215, 0, 0.1)',
                                                        border: '1px solid rgba(255, 215, 0, 0.3)'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{getSkillIcon(skill)}</span>
                                                        <span 
                                                            className="text-sm font-semibold text-white"
                                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                                        >
                                                            {skill}
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
                                                        className="text-lg font-bold px-2 py-0.5 rounded"
                                                        style={{
                                                            color: '#ffd700',
                                                            background: 'rgba(255, 215, 0, 0.2)',
                                                            border: '1px solid #ffd700',
                                                            textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
                                                            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                                                        }}
                                                    >
                                                        +{value}
                                                    </motion.span>
                                                </motion.div>
                                            ))}
                                        </div>
                                        
                                        {/* Click hint */}
                                        <motion.p
                                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                            animate={prefersReducedMotion ? {} : { opacity: 0.7 }}
                                            transition={prefersReducedMotion ? {} : { delay: 0.5 }}
                                            className="text-xs text-yellow-400/60 mt-2 text-center"
                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                        >
                                            Click to dismiss
                                        </motion.p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {!showDialogue && (
                            <>
                                <button
                                    onClick={goPrev}
                                    disabled={currentIndex === 0 || isTransitioning}
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 min-h-[48px] min-w-[48px] p-3 rounded-full transition-all touch-manipulation ${
                                        currentIndex === 0 || isTransitioning ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'
                                    }`}
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        border: '3px solid #ffd700',
                                        color: '#ffd700',
                                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
                                    }}
                                    aria-label="Previous adventure"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={goNext}
                                    disabled={currentIndex === journey.length - 1 || isTransitioning}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 min-h-[48px] min-w-[48px] p-3 rounded-full transition-all touch-manipulation ${
                                        currentIndex === journey.length - 1 || isTransitioning ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'
                                    }`}
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        border: '3px solid #ffd700',
                                        color: '#ffd700',
                                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
                                    }}
                                    aria-label="Next adventure"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                        {/* Slide Indicators - Compact */}
                        <div className="flex items-center justify-center gap-2 mt-2 shrink-0">
                            {journey.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    disabled={isTransitioning || showDialogue || showSummary}
                                    className={`min-h-[14px] min-w-[14px] rounded-full transition-all touch-manipulation ${
                                        index === currentIndex ? 'w-10' : 'w-3'
                                    } ${isTransitioning || showDialogue || showSummary ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{
                                        background: index === currentIndex ? '#ffd700' : 'rgba(255, 215, 0, 0.3)',
                                        border: '2px solid #ffd700',
                                        boxShadow: index === currentIndex ? '0 0 15px rgba(255, 215, 0, 0.8)' : 'none'
                                    }}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                    </div>

                    {/* Skills Accordion - Mobile (Below Adventure Log) */}
                    {skills && (
                        <div className="lg:hidden w-full mt-4">
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
                                            className="mt-2 p-4 rounded-lg space-y-4"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                backdropFilter: 'blur(10px)',
                                                border: '2px solid #ffd700',
                                                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                                            }}
                                        >
                                            {/* Technical Skills */}
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
                                                    {technicalSkills.map(([skillName, skill]) => renderSkillItem(skillName, skill))}
                                                </div>
                                            </div>

                                            {/* Non-Technical Skills */}
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
                                                    {nonTechnicalSkills.map(([skillName, skill]) => renderSkillItem(skillName, skill))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Skills Sidebar - Desktop (Right Side) */}
                    {skills && (
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.2 }}
                            className="hidden lg:block w-72 flex-shrink-0 min-h-0 flex flex-col"
                        >
                            <div 
                                className="p-3 rounded-lg flex-1 min-h-0 flex flex-col overflow-hidden"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: '2px solid #ffd700',
                                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <h3 
                                    className="text-lg font-bold mb-4 text-center"
                                    style={{
                                        color: '#ffd700',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    SKILLS
                                </h3>
                                
                                {/* Technical Skills - Scrollable */}
                                <div className="mb-4 flex-1 min-h-0 overflow-y-auto pr-1">
                                    <h4 
                                        className="text-xs font-bold mb-2 px-2 shrink-0"
                                        style={{
                                            color: '#ffd700',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        TECHNICAL
                                    </h4>
                                    <div className="space-y-2">
                                        {technicalSkills.map(([skillName, skill]) => {
                                            if (skill.locked) return null;
                                            
                                            const value = skill.value || skill.baseline || 0;
                                            const max = skill.max || 100;
                                            const percentage = (value / max) * 100;
                                            const color = getSkillColor(skillName);
                                            const icon = getSkillIcon(skillName);
                                            const isRecentlyUpdated = recentlyUpdatedSkills.has(skillName);
                                            const prevValue = previousSkillValues[skillName] || value;
                                            const prevPercentage = ((prevValue || 0) / max) * 100;

                                            return (
                                                <motion.div 
                                                    key={skillName} 
                                                    className="space-y-1.5"
                                                    animate={isRecentlyUpdated ? {
                                                        scale: [1, 1.03, 1]
                                                    } : {}}
                                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                                    style={{
                                                        willChange: isRecentlyUpdated ? 'transform' : 'auto',
                                                        padding: isRecentlyUpdated ? '4px' : '0',
                                                        borderRadius: '4px',
                                                        background: isRecentlyUpdated ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <motion.span 
                                                            className="text-lg flex-shrink-0"
                                                            animate={isRecentlyUpdated ? { scale: [1, 1.2, 1] } : {}}
                                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                                            style={{ willChange: isRecentlyUpdated ? 'transform' : 'auto' }}
                                                        >
                                                            {icon}
                                                        </motion.span>
                                                        <span 
                                                            className="text-xs font-bold truncate flex-1"
                                                            style={{ 
                                                                color: '#ffd700',
                                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                                            }}
                                                        >
                                                            {skillName}
                                                        </span>
                                                        <motion.span 
                                                            className="text-[10px] text-yellow-400/70 font-bold"
                                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                                            animate={isRecentlyUpdated ? {
                                                                color: ['#fbbf24', '#ffd700', '#fbbf24'],
                                                                scale: [1, 1.2, 1]
                                                            } : {}}
                                                            transition={{ duration: 1.0 }}
                                                        >
                                                            <AnimatedValue from={prevValue} to={value} max={max} showGain={isRecentlyUpdated} />
                                                        </motion.span>
                                                    </div>
                                                    <div 
                                                        className="w-full h-2 rounded-full overflow-hidden relative"
                                                        style={{
                                                            background: 'rgba(0, 0, 0, 0.5)',
                                                            border: isRecentlyUpdated ? '1px solid rgba(255, 215, 0, 0.8)' : '1px solid rgba(255, 215, 0, 0.3)'
                                                        }}
                                                    >
                                                        <motion.div
                                                            initial={prefersReducedMotion ? {} : { width: `${prevPercentage}%` }}
                                                            animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                                                            transition={prefersReducedMotion ? {} : { 
                                                                duration: 1.2, 
                                                                ease: [0.16, 1, 0.3, 1],
                                                                type: 'tween'
                                                            }}
                                                            className="h-full relative"
                                                            style={{
                                                                background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                                                                boxShadow: isRecentlyUpdated 
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
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Non-Technical Skills - Scrollable */}
                                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                                    <h4 
                                        className="text-xs font-bold mb-2 px-2 shrink-0"
                                        style={{
                                            color: '#ffd700',
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        NON-TECHNICAL
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(skills).filter(([name]) => 
                                            ['Product Management', 'Social', 'Recreational'].includes(name)
                                        ).map(([skillName, skill]) => {
                                            if (skill.locked) return null;
                                            
                                            const value = skill.value || skill.baseline || 0;
                                            const max = skill.max || 100;
                                            const percentage = (value / max) * 100;
                                            const color = getSkillColor(skillName);
                                            const icon = getSkillIcon(skillName);
                                            const isRecentlyUpdated = recentlyUpdatedSkills.has(skillName);
                                            const prevValue = previousSkillValues[skillName] || value;
                                            const prevPercentage = ((prevValue || 0) / max) * 100;

                                            return (
                                                <motion.div 
                                                    key={skillName} 
                                                    className="space-y-1.5"
                                                    animate={isRecentlyUpdated ? {
                                                        scale: [1, 1.03, 1]
                                                    } : {}}
                                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                                    style={{
                                                        willChange: isRecentlyUpdated ? 'transform' : 'auto',
                                                        padding: isRecentlyUpdated ? '4px' : '0',
                                                        borderRadius: '4px',
                                                        background: isRecentlyUpdated ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <motion.span 
                                                            className="text-lg flex-shrink-0"
                                                            animate={isRecentlyUpdated ? { scale: [1, 1.2, 1] } : {}}
                                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                                            style={{ willChange: isRecentlyUpdated ? 'transform' : 'auto' }}
                                                        >
                                                            {icon}
                                                        </motion.span>
                                                        <span 
                                                            className="text-xs font-bold truncate flex-1"
                                                            style={{ 
                                                                color: '#ffd700',
                                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                                            }}
                                                        >
                                                            {skillName}
                                                        </span>
                                                        <motion.span 
                                                            className="text-[10px] text-yellow-400/70 font-bold"
                                                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                                                            animate={isRecentlyUpdated ? {
                                                                color: ['#fbbf24', '#ffd700', '#fbbf24'],
                                                                scale: [1, 1.2, 1]
                                                            } : {}}
                                                            transition={{ duration: 1.0 }}
                                                        >
                                                            <AnimatedValue from={prevValue} to={value} max={max} showGain={isRecentlyUpdated} />
                                                        </motion.span>
                                                    </div>
                                                    <div 
                                                        className="w-full h-2 rounded-full overflow-hidden relative"
                                                        style={{
                                                            background: 'rgba(0, 0, 0, 0.5)',
                                                            border: isRecentlyUpdated ? '1px solid rgba(255, 215, 0, 0.8)' : '1px solid rgba(255, 215, 0, 0.3)'
                                                        }}
                                                    >
                                                        <motion.div
                                                            initial={prefersReducedMotion ? {} : { width: `${prevPercentage}%` }}
                                                            animate={prefersReducedMotion ? {} : { width: `${percentage}%` }}
                                                            transition={prefersReducedMotion ? {} : { 
                                                                duration: 1.2, 
                                                                ease: [0.16, 1, 0.3, 1],
                                                                type: 'tween'
                                                            }}
                                                            className="h-full relative"
                                                            style={{
                                                                background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                                                                boxShadow: isRecentlyUpdated 
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
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

        </>
    );
}

