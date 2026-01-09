'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'LOADING SUMMARY...', subMessage = 'Preparing your journey report' }) {
    return (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center p-8 md:p-12 relative">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 md:w-20 md:h-20 mb-6"
                style={{
                    border: '4px solid rgba(255, 215, 0, 0.3)',
                    borderTop: '4px solid #ffd700',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
                }}
            />
            
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{
                    color: '#ffd700',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 215, 0, 0.6)',
                    letterSpacing: '2px',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                }}
            >
                {message}
            </motion.h2>
            
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-yellow-400/80 text-sm md:text-base"
                style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
            >
                {subMessage}
            </motion.p>
        </div>
    );
}
