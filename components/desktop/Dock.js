'use client';
import React from 'react';
import { motion } from 'framer-motion';

const dockApps = [
    { name: 'GitHub', icon: '/platform-icons/github.webp' },
    { name: 'LinkedIn', icon: '/platform-icons/linkedin.webp' },
    { name: 'Terminal', icon: '/dock-icons/iterm2.png' },
    { name: 'Spotify', icon: '/dock-icons/spotify.png' },
    { name: 'Telegram', icon: '/dock-icons/telegram.webp' },
    { name: 'Settings', icon: '/dock-icons/settings.png' },
];

export default function Dock({ onPermissionError, onTerminalClick, terminalState }) {
    return (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="flex items-end gap-1 px-2 py-1.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
            >
                {dockApps.map((app, index) => (
                    <motion.div
                        key={app.name}
                        className="group relative"
                        whileHover={{ y: -8, scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        onClick={(e) => {
                            if (app.name === 'Terminal') {
                                onTerminalClick();
                            } else if (app.name === 'GitHub') {
                                window.open('https://github.com/zedithx', '_blank');
                            } else if (app.name === 'LinkedIn') {
                                window.open('https://linkedin.com/in/yang-si-jun/', '_blank');
                            } else {
                                onPermissionError();
                            }
                        }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 rounded-md text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {app.name}
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl overflow-hidden shadow-lg cursor-pointer flex items-center justify-center">
                            <img 
                                src={app.icon} 
                                alt={app.name} 
                                className={`w-full h-full object-cover ${app.name === 'LinkedIn' ? 'scale-[85%]' : ''}`}
                            />
                        </div>
                        {(app.active || (app.name === 'Terminal' && terminalState !== 'closed')) && (
                            <div className="absolute -bottom-1 sm:-bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full" />
                        )}
                    </motion.div>
                ))}
                
                <div className="w-px h-8 sm:h-10 bg-white/20 mx-0.5 sm:mx-1 self-center" />
                
                <motion.div
                    className="group relative"
                    whileHover={{ y: -8, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={onPermissionError}
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 rounded-md text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        Trash
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-500/50 to-gray-700/50 flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-lg cursor-pointer backdrop-blur-md">
                        🗑️
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

