'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

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
const AnimatedValue = ({ from, to, max, showGain = false }) => {
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
};

export default function JourneySlideshow({ journey, updateSkills, onSkillGain, hero, skills }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [showDialogue, setShowDialogue] = useState(true);
    const [showDesktopPopup, setShowDesktopPopup] = useState(false);
    const [desktopPopupSkills, setDesktopPopupSkills] = useState(null);
    const [processedCards, setProcessedCards] = useState(new Set());
    const [isTransitioning, setIsTransitioning] = useState(false);
    const desktopPopupTimeoutRef = useRef(null);
    const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
    const [recentlyUpdatedSkills, setRecentlyUpdatedSkills] = useState(new Set());
    const [previousSkillValues, setPreviousSkillValues] = useState({});

    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    const currentCard = journey[currentIndex];
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
    }, [dialogueIndex, currentCard, processedCards, updateSkills, onSkillGain]);

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
            setTimeout(() => {
                setCurrentIndex(index);
            }, 300);
        }
    }, [currentIndex, isTransitioning]);

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

    const getSceneBackground = useCallback((scene) => {
        // Scene is now a direct path, return it as-is
        return scene || '/background/absolum1.jpeg';
    }, []);

    // Early return after all hooks
    if (!currentCard || !currentDialogue) return null;

    const isLastDialogue = dialogueIndex === (currentCard.dialogues?.length || 0) - 1;

    // Memoize skill icon and color functions
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

    // Render skill item component (reusable)
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

    // Define custom order for technical skills - SRE after Cloud Infrastructure
    const technicalSkillOrder = [
        'Backend',
        'Frontend',
        'Hardware',
        'Telegram Bots',
        'Deployment',
        'DevOps',
        'LLMs',
        'Cloud Infrastructure',
        'SRE'
    ];
    
    const technicalSkills = Object.entries(skills)
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
    
    const nonTechnicalSkills = Object.entries(skills).filter(([name]) => 
        ['Product Management', 'Social', 'Recreational'].includes(name)
    );

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
                    ADVENTURE LOG
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
                                    {Array.from({ length: 8 }, (_, i) => {
                                        const left = (i * 6.67) % 100;
                                        const duration = 1 + Math.random();
                                        const delay = Math.random() * 0.5;
                                        return (
                                            <motion.div
                                                key={`rain-${i}`}
                                                className="absolute w-0.5 bg-white/20"
                                                style={{
                                                    left: `${left}%`,
                                                    top: '-10px',
                                                    height: '20px',
                                                }}
                                                animate={{
                                                    y: [0, 700],
                                                    opacity: [0, 0.5, 0],
                                                }}
                                                transition={{
                                                    duration,
                                                    repeat: Infinity,
                                                    delay,
                                                    ease: 'linear'
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Floating particles - Reduced to 5 for better performance */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const left = Math.random() * 100;
                                        const top = Math.random() * 100;
                                        const duration = 3 + Math.random() * 2;
                                        const delay = Math.random() * 2;
                                        return (
                                            <motion.div
                                                key={`particle-${i}`}
                                                className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
                                                style={{
                                                    left: `${left}%`,
                                                    top: `${top}%`,
                                                }}
                                                animate={{
                                                    y: [0, -30, 0],
                                                    opacity: [0.2, 0.6, 0.2],
                                                    scale: [1, 1.5, 1],
                                                }}
                                                transition={{
                                                    duration,
                                                    repeat: Infinity,
                                                    delay,
                                                    ease: 'easeInOut'
                                                }}
                                            />
                                        );
                                    })}
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
                            {showDialogue && currentDialogue && (
                                <motion.div
                                    key={dialogueIndex}
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
                                            {currentDialogue.speaker === 'hero' 
                                                ? 'ZEDITHX' 
                                                : currentDialogue.name?.toUpperCase() || 'ZEDITHX'}
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
                                        {currentDialogue.text}
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
                                    disabled={isTransitioning || showDialogue}
                                    className={`min-h-[14px] min-w-[14px] rounded-full transition-all touch-manipulation ${
                                        index === currentIndex ? 'w-10' : 'w-3'
                                    } ${isTransitioning || showDialogue ? 'opacity-50 cursor-not-allowed' : ''}`}
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

