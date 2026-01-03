'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dockApps = [
    { name: 'Terminal', icon: '/dock-icons/iterm2.png' },
    { name: 'Gmail', icon: '/dock-icons/gmail.webp' },
    { name: 'GitHub', icon: '/platform-icons/github.webp' },
    { name: 'LinkedIn', icon: '/platform-icons/linkedin.webp' },
    { name: 'Spotify', icon: '/dock-icons/spotify.png' },
];

function DockIcon({ app, onPermissionError, onGmailClick, onTerminalClick, onSpotifyClick, terminalState, spotifyModalState, onLoadingStart }) {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (app.name === 'Terminal') {
            onTerminalClick();
        } else if (app.name === 'Gmail') {
            onGmailClick();
        } else if (app.name === 'GitHub') {
            onLoadingStart('github', 'https://github.com/zedithx');
        } else if (app.name === 'LinkedIn') {
            onLoadingStart('linkedin', 'https://linkedin.com/in/yang-si-jun/');
        } else if (app.name === 'Spotify') {
            onSpotifyClick();
        } else {
            onPermissionError();
        }
    };
    
    const handleTouchEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick(e);
    };
    
    return (
        <motion.div
            className="group relative"
            whileHover={{ y: -8, scale: 1.15 }}
            transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 17
            }}
            onClick={handleClick}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
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
            {(app.active || 
              (app.name === 'Terminal' && terminalState !== 'closed') ||
              (app.name === 'Spotify' && spotifyModalState !== 'closed')) && (
                            <div className="absolute -bottom-1 sm:-bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full" />
                        )}
                    </motion.div>
    );
}

export default function Dock({ onPermissionError, onGmailClick, onTerminalClick, onSpotifyClick, terminalState, spotifyModalState }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingService, setLoadingService] = useState(null);
    
    const handleLoadingStart = (service, url) => {
        setIsLoading(true);
        setLoadingService(service);
        
        // Use window.open which is more reliable on mobile
        // Reduced delay for better mobile experience
        setTimeout(() => {
            try {
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                
                // Fallback if popup is blocked - use location.href
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    window.location.href = url;
                }
            } catch (error) {
                // Final fallback - direct navigation
                window.location.href = url;
            }
            
            // Keep loading state for a bit longer for visual feedback
            setTimeout(() => {
                setIsLoading(false);
                setLoadingService(null);
            }, 300);
        }, 1200);
    };
    
    return (
        <>
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ pointerEvents: 'none' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="w-80 space-y-6 flex flex-col items-center"
                        >
                            {(loadingService === 'github' || loadingService === 'linkedin') && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, 360] }}
                                    transition={{ 
                                        scale: { type: 'spring', stiffness: 200 },
                                        rotate: { duration: 1.5, ease: 'easeInOut', repeat: Infinity }
                                    }}
                                    className="w-24 h-24 flex items-center justify-center"
                                >
                                    <img 
                                        src={loadingService === 'github' ? '/platform-icons/github.webp' : '/platform-icons/linkedin.webp'}
                                        alt={loadingService}
                                        className={`w-full h-full object-contain ${loadingService === 'linkedin' ? 'scale-85' : ''}`}
                                    />
                                </motion.div>
                            )}
                            
                            <div className="text-green-400 text-sm font-bold animate-pulse text-center">
                                {loadingService === 'github' && '🔗 Connecting to GitHub...'}
                                {loadingService === 'linkedin' && '🔗 Connecting to LinkedIn...'}
                            </div>
                            
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                    className="h-full bg-green-500"
                                />
                            </div>
                            
                            <div className="flex justify-between text-[9px] text-white/30 font-mono w-full">
                                <span>REDIRECTING</span>
                                <span>DONE</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="flex items-end gap-1.5 sm:gap-2 md:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
            >
                {dockApps.map((app, index) => (
                    <DockIcon
                        key={app.name}
                        app={app}
                        onPermissionError={onPermissionError}
                        onGmailClick={onGmailClick}
                        onTerminalClick={onTerminalClick}
                        onSpotifyClick={onSpotifyClick}
                        terminalState={terminalState}
                        spotifyModalState={spotifyModalState}
                        onLoadingStart={handleLoadingStart}
                    />
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
        </>
    );
}

