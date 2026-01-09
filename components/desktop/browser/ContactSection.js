'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

export default function ContactSection({ isDark, prefersReducedMotion }) {
    return (
        <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2 }}
            className={`rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 border ${
                isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'
            }`}
        >
            <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Connect</h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
                <a
                    href="https://github.com/zedithx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm md:text-base ${
                        isDark 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>GitHub</span>
                </a>
                <a
                    href="https://www.linkedin.com/in/yangsijun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm md:text-base ${
                        isDark 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>LinkedIn</span>
                </a>
            </div>
        </motion.div>
    );
}
