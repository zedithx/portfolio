'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DialogueBox({
    activeDialogue,
    dialogueIndex,
    dialogues,
    hero,
    isLastDialogue,
    showDialogue,
    prefersReducedMotion,
    showMultiBackground,
    onClick
}) {
    if (!showDialogue || !activeDialogue) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={dialogueIndex}
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.2, ease: 'easeOut' }}
                onClick={onClick}
                className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 z-30 cursor-pointer touch-manipulation flex flex-col ${
                    showMultiBackground ? 'max-h-[30%] lg:max-h-[40%]' : 'max-h-[40%]'
                }`}
                style={{
                    background: 'rgba(20, 20, 30, 0.9)',
                    backdropFilter: 'blur(15px)',
                    borderTop: '4px solid #ffd700',
                    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255, 215, 0, 0.1)',
                    willChange: 'opacity'
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick();
                    }
                }}
                aria-label="Click to continue dialogue"
            >
                {/* Character Name */}
                <div className="flex items-center gap-3 mb-3">
                    <div 
                        className="text-lg md:text-xl font-bold"
                        style={{
                            color: '#ffd700',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                            letterSpacing: '1px',
                            fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif"
                        }}
                    >
                        {activeDialogue.speaker === 'hero' 
                            ? (hero?.name || 'Si Jun').toUpperCase()
                            : activeDialogue.name?.toUpperCase() || 'NPC'}
                    </div>
                </div>

                {/* Dialogue Text */}
                <motion.p
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1 }}
                    transition={prefersReducedMotion ? {} : { delay: 0.1 }}
                    className="text-white text-sm md:text-base leading-relaxed mb-2 max-h-[120px] md:max-h-[150px] overflow-y-auto pr-2"
                    style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
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
                {dialogues && dialogues.length > 1 && (
                    <div className="flex items-center gap-1 mt-2">
                        {dialogues.map((_, idx) => (
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
        </AnimatePresence>
    );
}
