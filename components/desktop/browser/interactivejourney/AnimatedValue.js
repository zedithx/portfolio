'use client';
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

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
        
        if (showGain && gainAmount !== 0) {
            setDisplayValue(from);
            setShowGainIndicator(true);
            
            gainTimeout = setTimeout(() => {
                setShowGainIndicator(false);
                
                const duration = 1000;
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
            }, 600);
        } else {
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
            if (gainTimeout) clearTimeout(gainTimeout);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [from, to, showGain, gainAmount]);
    
    return (
        <span>
            {displayValue}/{max}
            {showGainIndicator && gainAmount !== 0 && (
                <motion.span
                    initial={{ opacity: 0, x: -5, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 5, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={gainAmount > 0 ? "text-green-400 ml-1 font-bold" : "text-red-400 ml-1 font-bold"}
                    style={{ 
                        textShadow: gainAmount > 0 
                            ? '0 0 8px rgba(34, 197, 94, 0.8)' 
                            : '0 0 8px rgba(239, 68, 68, 0.8)' 
                    }}
                >
                    {gainAmount > 0 ? '+' : ''}{gainAmount}
                </motion.span>
            )}
        </span>
    );
});

AnimatedValue.displayName = 'AnimatedValue';

export default AnimatedValue;
