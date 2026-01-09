'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundScene({
    currentScene,
    showMultiBackground,
    multiBackgrounds,
    getSceneBackground,
    getBackgroundPosition,
    isLargeScreen,
    prefersReducedMotion,
    rainParticles,
    floatingParticles,
    currentCard
}) {
    return (
        <>
            {showMultiBackground && multiBackgrounds ? (
                <div className="absolute inset-0 flex flex-col lg:flex-row" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    {multiBackgrounds.map((bg, index) => (
                        <motion.div
                            key={`${bg.url}-${index}`}
                            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
                            className="relative overflow-hidden w-full lg:w-auto flex-shrink-0"
                            style={{
                                flex: !isLargeScreen ? `0 0 ${100 / multiBackgrounds.length}%` : '1 1 0',
                                minWidth: 0,
                                minHeight: 0,
                                maxHeight: !isLargeScreen ? `${100 / multiBackgrounds.length}%` : 'none',
                                backgroundImage: `url(${getSceneBackground(bg.url)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: isLargeScreen ? (bg.positionLg || bg.position) : bg.position,
                                backgroundRepeat: 'no-repeat',
                                imageRendering: 'auto',
                                WebkitImageRendering: 'auto',
                                willChange: 'opacity, transform'
                            }}
                        >
                            {index < multiBackgrounds.length - 1 && (
                                <>
                                    <div className="lg:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent z-10" />
                                    <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent z-10" />
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${getSceneBackground(currentScene)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: getBackgroundPosition(currentScene),
                        backgroundRepeat: 'no-repeat',
                        imageRendering: 'auto',
                        WebkitImageRendering: 'auto'
                    }}
                />
            )}
            
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />
            
            {/* Atmospheric Effects */}
            {!prefersReducedMotion && (
                <>
                    {currentCard.id === 1 && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {rainParticles.map((particle) => (
                                <motion.div
                                    key={`rain-${particle.id}`}
                                    className="absolute w-0.5 bg-white/20"
                                    style={{
                                        left: `${particle.left}%`,
                                        top: '-10px',
                                        height: '20px',
                                        willChange: 'transform, opacity',
                                        transform: 'translateZ(0)'
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
                    )}

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {floatingParticles.map((particle) => (
                            <motion.div
                                key={`particle-${particle.id}`}
                                className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
                                style={{
                                    left: `${particle.left}%`,
                                    top: `${particle.top}%`,
                                    willChange: 'transform, opacity',
                                    transform: 'translateZ(0)'
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
        </>
    );
}
