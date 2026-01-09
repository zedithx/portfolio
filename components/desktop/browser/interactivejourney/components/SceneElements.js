'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function SceneElements({
    currentCard,
    hero,
    prefersReducedMotion
}) {
    return (
        <>
            {/* Segment Header - Top Left */}
            <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.1, ease: 'easeOut' }}
                className="absolute top-4 left-4 md:top-6 md:left-6 z-30 max-w-[80%] md:max-w-none"
                style={{ willChange: 'opacity' }}
            >
                <div 
                    className="px-4 py-2 md:px-5 md:py-2.5 rounded text-sm md:text-base font-bold"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: '2px solid #ffd700',
                        color: '#fff',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                        boxShadow: '0 0 15px rgba(102, 126, 234, 0.6), 0 0 10px rgba(255, 215, 0, 0.4)',
                        fontFamily: "'Orbitron', system-ui, -apple-system, sans-serif",
                        letterSpacing: '1px'
                    }}
                >
                    {currentCard.title}
                </div>
            </motion.div>

            {/* Hero Character (Left Side) */}
            <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.05, ease: 'easeOut' }}
                style={{ willChange: 'opacity' }}
                className="absolute left-12 md:left-16 lg:left-20 bottom-[40%] md:bottom-[35%] lg:bottom-[30%] z-20 flex flex-col items-center"
            >
                {hero.avatar ? (
                    <img 
                        src={hero.avatar} 
                        alt={hero.name}
                        className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-cover rounded-lg"
                        style={{
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
                            objectPosition: 'center 25%'
                        }}
                    />
                ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-600 to-blue-800 flex items-center justify-center text-3xl md:text-4xl lg:text-5xl rounded-lg">
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
                    {(hero?.name || 'Si Jun').toUpperCase()}
                </div>
            </motion.div>

            {/* Stage Icon (Top Right) - Hidden on mobile */}
            <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2, ease: 'easeOut' }}
                className="absolute right-8 top-8 z-20 hidden md:block"
                style={{ willChange: 'opacity' }}
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
        </>
    );
}
