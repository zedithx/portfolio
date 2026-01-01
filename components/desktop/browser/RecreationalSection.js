'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function RecreationalSection({ recreational, social }) {
    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    return (
        <section className="w-full mb-8 space-y-8">
            {/* Recreational Subsection */}
            {recreational && recreational.length > 0 && (
                <div>
                    <motion.h2 
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold px-4 mb-6"
                        style={{
                            textShadow: '2px 2px 0px #000, 0 0 20px rgba(255, 215, 0, 0.6)',
                            color: '#ffd700',
                            letterSpacing: '2px'
                        }}
                    >
                        🎮 PERSONAL QUESTS 🎮
                    </motion.h2>
                    <div className="space-y-3">
                        {recreational.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={prefersReducedMotion ? {} : { duration: 0.3, delay: index * 0.1 }}
                                className="w-full px-4 py-5 rounded-lg relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                                    border: '2px solid #ffd700',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                {/* Decorative corners */}
                                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400 opacity-60" />
                                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400 opacity-60" />
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400 opacity-60" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400 opacity-60" />

                                <div className="flex items-start gap-4 relative z-10">
                                    {item.icon && (
                                        <span className="text-4xl md:text-5xl flex-shrink-0">
                                            {item.icon}
                                        </span>
                                    )}
                                    <div className="flex-1">
                                        <h3 
                                            className="text-xl md:text-2xl font-bold mb-2"
                                            style={{
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                color: '#fff'
                                            }}
                                        >
                                            {item.title.toUpperCase()}
                                        </h3>
                                        <p 
                                            className="text-white/90 text-sm md:text-base leading-relaxed"
                                            style={{
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                            }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Subsection */}
            {social && social.length > 0 && (
                <div>
                    <motion.h2 
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold px-4 mb-6"
                        style={{
                            textShadow: '2px 2px 0px #000, 0 0 20px rgba(255, 215, 0, 0.6)',
                            color: '#ffd700',
                            letterSpacing: '2px'
                        }}
                    >
                        🤝 GUILD ACTIVITIES 🤝
                    </motion.h2>
                    <div className="space-y-3">
                        {social.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={prefersReducedMotion ? {} : { duration: 0.3, delay: index * 0.1 }}
                                className="w-full px-4 py-5 rounded-lg relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
                                    border: '2px solid #ffd700',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                {/* Decorative corners */}
                                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400 opacity-60" />
                                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400 opacity-60" />
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400 opacity-60" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400 opacity-60" />

                                <div className="flex items-start gap-4 relative z-10">
                                    {item.icon && (
                                        <span className="text-4xl md:text-5xl flex-shrink-0">
                                            {item.icon}
                                        </span>
                                    )}
                                    <div className="flex-1">
                                        <h3 
                                            className="text-xl md:text-2xl font-bold mb-2"
                                            style={{
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                color: '#fff'
                                            }}
                                        >
                                            {item.title.toUpperCase()}
                                        </h3>
                                        <p 
                                            className="text-white/90 text-sm md:text-base leading-relaxed"
                                            style={{
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                            }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
