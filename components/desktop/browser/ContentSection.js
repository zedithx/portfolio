'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function ContentSection({ 
    isDark, 
    prefersReducedMotion, 
    children, 
    delay = 0 
}) {
    return (
        <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3, delay }}
            className={`rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 border mb-4 sm:mb-6 md:mb-8 ${
                isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'
            }`}
        >
            {children}
        </motion.div>
    );
}
