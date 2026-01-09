'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function TerminalLoading({ isDark, loadingCommand }) {
    const loadingMessages = {
        'aboutme': 'Loading about me...',
        'projects': 'Initializing projects...',
        'experience': 'Initializing work experience...',
        'resume': 'Opening resume...'
    };

    const statusMessages = {
        'aboutme': 'LOADING DETAILS',
        'projects': 'LOADING PROJECTS',
        'experience': 'LOADING EXPERIENCE',
        'resume': 'OPENING PDF'
    };

    return (
        <div className="h-full flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-80 space-y-6 flex flex-col items-center"
            >
                <div className={`text-sm font-bold animate-pulse text-center ${isDark ? 'text-green-400' : 'text-blue-700'}`}>
                    {`> ${loadingMessages[loadingCommand] || `Initializing ${loadingCommand}...`}`}
                </div>
                
                <div className={`w-full h-1.5 rounded-full overflow-hidden border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-200 border-gray-300'}`}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className={`h-full ${isDark ? 'bg-green-500' : 'bg-blue-600'}`}
                    />
                </div>
                
                <div className={`flex justify-between text-[9px] font-mono w-full ${isDark ? 'text-white/30' : 'text-gray-500'}`}>
                    <span>{statusMessages[loadingCommand] || 'LOADING MODULES'}</span>
                    <span>DONE</span>
                </div>
            </motion.div>
        </div>
    );
}
