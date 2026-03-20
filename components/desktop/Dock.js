'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'lucide-react';

const dockApps = [
    { name: 'Terminal', icon: '/dock-icons/iterm2.png' },
    { name: 'Gmail', icon: '/dock-icons/gmail.webp' },
    { name: 'GitHub', icon: '/platform-icons/github.webp' },
    { name: 'LinkedIn', icon: '/platform-icons/linkedin.webp' },
    { name: 'Spotify', icon: '/dock-icons/spotify.png' },
];

function DockIcon({ app, index, mouseX, isHovering, prefersReducedMotion, onPermissionError, onGmailClick, onTerminalClick, onSpotifyClick, terminalState, spotifyModalState, onLoadingStart, iconRef }) {
    const scale = useMotionValue(1);
    const y = useMotionValue(0);

    const springScale = useSpring(scale, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    useEffect(() => {
        if (prefersReducedMotion) return;

        const unsubscribe = mouseX.on('change', (latestX) => {
            if (!isHovering.current || !iconRef.current) {
                scale.set(1);
                y.set(0);
                return;
            }

            const rect = iconRef.current.getBoundingClientRect();
            const iconCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(latestX - iconCenterX);

            // Magnification radius in pixels
            const maxDistance = 150;

            if (distance > maxDistance) {
                scale.set(1);
                y.set(0);
            } else {
                // Smooth cosine falloff
                const ratio = distance / maxDistance;
                const magnification = Math.cos(ratio * (Math.PI / 2));
                // Scale from 1.0 to 1.4 based on proximity
                const newScale = 1 + magnification * 0.4;
                scale.set(newScale);
                y.set(-magnification * 12);
            }
        });

        return () => unsubscribe();
    }, [mouseX, scale, y, iconRef, isHovering, prefersReducedMotion]);

    // Reset when not hovering
    useEffect(() => {
        if (prefersReducedMotion) return;

        const interval = setInterval(() => {
            if (!isHovering.current) {
                scale.set(1);
                y.set(0);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isHovering, scale, y, prefersReducedMotion]);

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

    const handleTouchStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick(e);
    };

    // For reduced motion: use simple whileHover
    const hoverProps = prefersReducedMotion
        ? { whileHover: { scale: 1.1 } }
        : {};

    return (
        <motion.button
            ref={iconRef}
            className="group relative cursor-pointer"
            aria-label={`Open ${app.name}`}
            style={prefersReducedMotion ? {} : { scale: springScale, y: springY }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17
            }}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            {...hoverProps}
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
        </motion.button>
    );
}

export default function Dock({ onPermissionError, onGmailClick, onTerminalClick, onSpotifyClick, terminalState, spotifyModalState }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingService, setLoadingService] = useState(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const mouseX = useMotionValue(-1000);
    const isHovering = useRef(false);
    const iconRefs = useRef(dockApps.map(() => React.createRef()));

    useEffect(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mql.matches);

        const handler = (e) => setPrefersReducedMotion(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    const handleMouseMove = useCallback((e) => {
        mouseX.set(e.clientX);
    }, [mouseX]);

    const handleMouseEnter = useCallback(() => {
        isHovering.current = true;
    }, []);

    const handleMouseLeave = useCallback(() => {
        isHovering.current = false;
        mouseX.set(-1000);
    }, [mouseX]);

    const handleLoadingStart = (service, url) => {
        setIsLoading(true);
        setLoadingService(service);

        // Use window.open which is more reliable on mobile
        // Reduced delay for better mobile experience
        setTimeout(() => {
            try {
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

                // Only use location.href as fallback on mobile devices
                // On desktop, we should never redirect the current window
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // Check if mobile device
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        // Only redirect on mobile as fallback
                        window.location.href = url;
                    } else {
                        // On desktop, just log error but don't redirect
                        console.warn('Popup blocked. Please allow popups for this site to open links in new tabs.');
                    }
                }
            } catch (error) {
                // Check if mobile device
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    // Only redirect on mobile as fallback
                    window.location.href = url;
                } else {
                    // On desktop, just log error but don't redirect
                    console.warn('Failed to open link. Please allow popups for this site.');
                }
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

                            <div className="text-green-400 text-sm font-bold animate-pulse text-center flex items-center gap-1.5">
                                {loadingService === 'github' && <><Link className="w-4 h-4" /> Connecting to GitHub...</>}
                                {loadingService === 'linkedin' && <><Link className="w-4 h-4" /> Connecting to LinkedIn...</>}
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
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="flex items-end gap-1.5 sm:gap-2 md:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
                aria-label="Application dock"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {dockApps.map((app, index) => (
                    <DockIcon
                        key={app.name}
                        app={app}
                        index={index}
                        mouseX={mouseX}
                        isHovering={isHovering}
                        prefersReducedMotion={prefersReducedMotion}
                        onPermissionError={onPermissionError}
                        onGmailClick={onGmailClick}
                        onTerminalClick={onTerminalClick}
                        onSpotifyClick={onSpotifyClick}
                        terminalState={terminalState}
                        spotifyModalState={spotifyModalState}
                        onLoadingStart={handleLoadingStart}
                        iconRef={iconRefs.current[index]}
                    />
                ))}
            </motion.nav>
        </div>
        </>
    );
}

