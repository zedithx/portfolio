'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { SequentialTypewriter } from './Typewriter';

const commands = [
    { name: 'aboutme', description: 'Learn about who I am and my journey' },
    { name: 'projects', description: 'Browse through my portfolio of work' },
    { name: 'experience', description: 'View my professional experience' },
    { name: 'resume', description: 'View my resume' },
    { name: 'clear', description: 'Clear the terminal screen' },
    { name: 'cd', description: 'Toggle between dark and light mode' },
];

const welcomeMessages = [
    { text: "Hi, I'm Si Jun!", speed: 10 },
    { text: "Click a command or icon in the dock below (or type one if you prefer).", speed: 10 }
];
const completedWelcomeText = welcomeMessages.map(({ text }) => text).join(' ');

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export default function TerminalWelcome({ 
    isDark, 
    isReady, 
    isAnimating, 
    sessionText, 
    statusText, 
    statusGlitchKey,
    onCommandClick,
    onAnimationComplete
}) {
    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-4"
        >
            <motion.div
                variants={itemVariants}
                className="mb-4 w-max max-w-full"
            >
                <div
                    key={statusGlitchKey}
                    className={`box-border grid w-max min-w-[42ch] max-w-full border border-current px-2.5 py-1.5 font-mono text-[15px] leading-snug overflow-x-auto ${isReady ? 'terminal-status-glitch' : ''} ${isDark ? 'text-green-400' : 'text-blue-700'}`}
                >
                    <div className="whitespace-nowrap">{sessionText}</div>
                    <div className="whitespace-nowrap">
                        status: {statusText}
                    </div>
                </div>
            </motion.div>
            
            {isReady && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    variants={itemVariants} 
                    className={`mb-4 text-sm sm:text-sm ${isDark ? 'text-white/70' : 'text-gray-700'}`}
                >
                    {isAnimating ? (
                        <SequentialTypewriter
                            messages={welcomeMessages}
                            onComplete={onAnimationComplete}
                        />
                    ) : completedWelcomeText}
                </motion.p>
            )}

            {!isAnimating && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg overflow-hidden ${isDark ? 'border-white/10' : 'border-gray-300'}`}
                >
                    <div className={`px-2 sm:px-3 py-1.5 sm:py-2 border-b ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'}`}>
                        <span className={`text-xs sm:text-xs uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-gray-600'}`}>Available Commands</span>
                    </div>
                    {commands.map((cmd) => (
                        <button
                            key={cmd.name}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onCommandClick(cmd.name);
                            }}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onCommandClick(cmd.name);
                            }}
                            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 flex items-start gap-2 sm:gap-4 border-b last:border-0 transition-colors cursor-pointer ${isDark ? 'border-white/5 hover:bg-white/10 active:bg-white/15' : 'border-gray-200 hover:bg-gray-100 active:bg-gray-150'}`}
                            style={{ touchAction: 'manipulation' }}
                            aria-label={`Run ${cmd.name} command: ${cmd.description}`}
                        >
                            <span className={`font-semibold w-20 sm:w-24 text-xs sm:text-sm shrink-0 ${isDark ? 'text-green-400' : 'text-blue-700'}`}>{cmd.name}</span>
                            <span className={`text-xs sm:text-xs leading-relaxed min-w-0 flex-1 truncate ${isDark ? 'text-white/50' : 'text-gray-600'}`}>{cmd.description}</span>
                        </button>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
