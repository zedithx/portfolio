'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ hero, onStartJourney }) {
    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    return (
        <motion.section
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
            className="w-full px-6 md:px-8 py-12 md:py-16 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
                border: '3px solid #ffd700',
                borderRadius: '16px',
                boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.5)'
            }}
        >
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-400 opacity-60" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-400 opacity-60" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-400 opacity-60" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-400 opacity-60" />

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                {/* Character Portrait - Game Style */}
                <motion.div
                    initial={prefersReducedMotion ? {} : { scale: 0.8, rotate: -5 }}
                    animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                    transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.1, type: 'spring' }}
                    className="relative"
                >
                    <div 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-4 border-yellow-400 shadow-2xl relative"
                        style={{
                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 10px rgba(0, 0, 0, 0.8)',
                            background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)'
                        }}
                    >
                        {hero.avatar ? (
                            <img 
                                src={hero.avatar} 
                                alt={hero.name}
                                className="w-full h-full object-cover"
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-800 flex items-center justify-center text-5xl md:text-6xl">
                                ⚔️
                            </div>
                        )}
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-yellow-400/20 pointer-events-none" />
                    </div>
                </motion.div>

                {/* Character Info */}
                <div className="flex-1 text-center md:text-left space-y-4">
                    {/* Name with game-style text */}
                    <motion.h1 
                        initial={prefersReducedMotion ? {} : { x: -20, opacity: 0 }}
                        animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            textShadow: '3px 3px 0px #000, 0 0 20px rgba(255, 215, 0, 0.8)',
                            color: '#ffd700',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            letterSpacing: '2px'
                        }}
                    >
                        {hero.name.toUpperCase()}
                    </motion.h1>

                    {/* Class/Trait Badge - Game Style */}
                    <motion.div
                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                        animate={prefersReducedMotion ? {} : { scale: 1 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.3, type: 'spring' }}
                        className="inline-block px-4 py-2 rounded"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: '2px solid #ffd700',
                            boxShadow: '0 0 15px rgba(102, 126, 234, 0.6)',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                        }}
                    >
                        <span className="text-white font-bold text-sm md:text-base tracking-wider">
                            {hero.primaryTrait.toUpperCase()}
                        </span>
                    </motion.div>

                    {/* Stats Bar Preview */}
                    <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-xs md:text-sm font-semibold">HP</span>
                            <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { width: 0 }}
                                    animate={prefersReducedMotion ? {} : { width: '100%' }}
                                    transition={prefersReducedMotion ? {} : { duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                                    style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }}
                                />
                            </div>
                            <span className="text-yellow-400 text-xs font-bold">100%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-xs md:text-sm font-semibold">MP</span>
                            <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { width: 0 }}
                                    animate={prefersReducedMotion ? {} : { width: '100%' }}
                                    transition={prefersReducedMotion ? {} : { duration: 1, delay: 0.7 }}
                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                                    style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}
                                />
                            </div>
                            <span className="text-yellow-400 text-xs font-bold">100%</span>
                        </div>
                    </div>
                </div>

                {/* Start Button - Game Style */}
                <motion.button
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.8)' }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    onClick={onStartJourney}
                    className="min-h-[56px] min-w-[56px] px-8 py-4 rounded-lg font-bold text-lg md:text-xl tracking-wider relative overflow-hidden touch-manipulation"
                    style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                        border: '3px solid #ffd700',
                        color: '#fff',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        boxShadow: '0 0 20px rgba(255, 107, 107, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)'
                    }}
                    aria-label="Start Journey - Begin your adventure"
                >
                    {/* Shine effect */}
                    {!prefersReducedMotion && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        />
                    )}
                    <span className="relative z-10">{hero.ctaText || 'START'}</span>
                </motion.button>
            </div>
        </motion.section>
    );
}
