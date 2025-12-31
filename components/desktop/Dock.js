'use client';
import React from 'react';
import { motion } from 'framer-motion';

const dockApps = [
    { name: 'Terminal', icon: '/dock-icons/iterm2.png' },
    { name: 'Gmail', icon: '/dock-icons/gmail.webp' },
    { name: 'GitHub', icon: '/platform-icons/github.webp' },
    { name: 'LinkedIn', icon: '/platform-icons/linkedin.webp' },
    { name: 'Spotify', icon: '/dock-icons/spotify.png' },
];

export default function Dock({ onPermissionError, onGmailClick, onTerminalClick, onSpotifyClick, terminalState }) {
    return (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="flex items-end gap-1.5 sm:gap-2 md:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
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
                            } else if (app.name === 'Gmail') {
                                onGmailClick();
                            } else if (app.name === 'GitHub') {
                                window.open('https://github.com/zedithx', '_blank');
                            } else if (app.name === 'LinkedIn') {
                                window.open('https://linkedin.com/in/yang-si-jun/', '_blank');
                            } else if (app.name === 'Spotify') {
                                onSpotifyClick();
                            } else {
                                onPermissionError();
                            }
                        }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 rounded-md text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {app.name}
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl overflow-hidden shadow-lg cursor-pointer flex items-center justify-center">
                            <img 
                                src={app.icon} 
                                alt={app.name} 
                                className={`w-full h-full object-cover ${app.name === 'LinkedIn' ? 'scale-[85%]' : ''}`}
                            />
                        </div>
                        {(app.active || (app.name === 'Terminal' && terminalState !== 'closed')) && (
                            <div className="absolute -bottom-1 sm:-bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full" />
                        )}
                    </motion.div>
                ))}
                
                <div className="w-px h-12 sm:h-14 md:h-14 bg-white/20 mx-0.5 sm:mx-1 md:mx-1 self-center" />
                
                <motion.div
                    className="group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-end justify-center -translate-y-1 sm:-translate-y-0.5"
                    whileHover={{ y: -8, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => onPermissionError("Mind your own business pfft!")}
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 rounded-md text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        Trash
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-500/50 to-gray-700/50 flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg cursor-pointer backdrop-blur-md">
                        🗑️
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

