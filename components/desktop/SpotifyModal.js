'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

// Your music tracks
const defaultTracks = [
    {
        title: "Golden State of Mind",
        artist: "Luke Bergs",
        url: "/music/Luke-Bergs_Golden-State-of-Mind.mp3",
        albumArt: "/music/luke_bergs.jpg"
    },
    {
        title: "Lose This",
        artist: "Dylan Emmet",
        url: "/music/DylanEmmet_Lose-This.mp3",
        albumArt: "/music/dylanemmet.jpg"
    },
    {
        title: "Love Me Back",
        artist: "Hotham",
        url: "/music/Hotham_Love-Me-Back.mp3",
        albumArt: "/music/hotham.jpeg"
    }
];

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function SpotifyModal({ isOpen, onClose, onPermissionError, onMinimize, onMaximize, modalState = 'normal' }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);
    const shouldAutoPlayRef = useRef(false);

    const currentTrack = defaultTracks[currentTrackIndex];

    // Handle audio time updates
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setCurrentTrackIndex(prev => {
                const nextIndex = prev < defaultTracks.length - 1 ? prev + 1 : 0;
                return nextIndex;
            });
            setIsPlaying(true);
            shouldAutoPlayRef.current = true;
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentTrackIndex]);

    // Update audio source when track changes (works even when minimized)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const wasPlaying = !audio.paused || isPlaying;
        shouldAutoPlayRef.current = wasPlaying && isPlaying;
        audio.src = currentTrack.url;
        audio.volume = isMuted ? 0 : volume / 100;
        setCurrentTime(0);
        
        // Load the new track
        audio.load();
        
        // Handle play after track loads - use a one-time handler
        const handleCanPlay = () => {
            // Only play if we should auto-play (check ref which is updated when user pauses)
            if (shouldAutoPlayRef.current) {
                audio.play().catch(err => {
                    // Ignore play() interruption errors
                    if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
                        console.error('Playback error:', err);
                    }
                });
            }
            // Remove listener after first play attempt
            audio.removeEventListener('canplay', handleCanPlay);
        };
        
        audio.addEventListener('canplay', handleCanPlay);
        
        // Also try to play immediately if already playing (for fast track changes)
        if (isPlaying && wasPlaying) {
            const tryPlay = () => {
                // Double-check shouldAutoPlayRef before playing
                if (shouldAutoPlayRef.current) {
                    audio.play().catch(() => {
                        // If immediate play fails, wait for canplay event
                    });
                }
            };
            // Small delay to ensure src is set
            setTimeout(tryPlay, 10);
        }
        
        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [currentTrackIndex, currentTrack.url]); // Only run when track actually changes

    // Update volume separately (don't reset track)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = isMuted ? 0 : volume / 100;
    }, [volume, isMuted]);

    // Handle play/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(err => {
                // Ignore play() interruption errors
                if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
                    console.error('Playback error:', err);
                }
            });
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Handle volume changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = isMuted ? 0 : volume / 100;
    }, [volume, isMuted]);

    const togglePlayPause = () => {
        setIsPlaying(prev => {
            const newState = !prev;
            shouldAutoPlayRef.current = newState;
            return newState;
        });
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handlePrevious = () => {
        if (currentTime > 3) {
            // If more than 3 seconds into track, restart it
            const audio = audioRef.current;
            if (audio) {
                audio.currentTime = 0;
                setCurrentTime(0);
            }
        } else {
            // Otherwise go to previous track
            setCurrentTrackIndex(prev => (prev > 0 ? prev - 1 : defaultTracks.length - 1));
        }
    };

    const handleNext = useCallback(() => {
        setCurrentTrackIndex(prev => (prev < defaultTracks.length - 1 ? prev + 1 : 0));
    }, []);

    // Reset when modal closes (but not when minimized)
    useEffect(() => {
        if (!isOpen && modalState === 'closed') {
            setIsPlaying(false);
            setCurrentTime(0);
            const audio = audioRef.current;
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }, [isOpen, modalState]);

    const isMaximized = modalState === 'maximized';
    const isMinimized = modalState === 'minimized';
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Add ESC key handler
    useEffect(() => {
        if (!isOpen || isMinimized) return;
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, isMinimized, onClose]);

    return (
        <>
            {/* Hidden audio element - always rendered so music continues when minimized */}
            <audio ref={audioRef} preload="metadata" />
            
            {/* Modal UI */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ 
                            scale: isMinimized ? 0 : 1,
                            opacity: isMinimized ? 0 : 1,
                            width: isMaximized ? '100vw' : (isMobile ? '95vw' : '90vw'),
                            height: isMaximized ? '100vh' : (isMobile ? '85vh' : '90vh'),
                            top: isMaximized ? 0 : '50%',
                            left: isMaximized ? 0 : '50%',
                            x: isMaximized ? 0 : '-50%',
                            y: isMinimized ? '100vh' : (isMaximized ? 0 : '-50%'),
                        }}
                        exit={{ scale: 0, opacity: 0, y: '100vh' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className={`fixed flex flex-col bg-[#121212] shadow-2xl overflow-hidden ${isMaximized ? 'z-[60] rounded-none' : 'z-[100] rounded-lg'} ${isMaximized ? '' : 'max-w-[80rem]'}`}
                        style={{ 
                            transformOrigin: 'center',
                            pointerEvents: isMinimized ? 'none' : 'auto',
                        }}
                        onClick={(e) => {
                            // Click outside to close (only if not minimized and clicking the backdrop)
                            if (!isMinimized && e.target === e.currentTarget) {
                                onClose();
                            }
                        }}
                    >
                    {/* Title Bar */}
                        <div className="flex items-center justify-between px-4 py-3 sm:px-4 sm:py-3 bg-[#1a1a1a] border-b border-white/10">
                            <div className="flex items-center gap-2 sm:gap-2">
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    onTouchStart={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="w-4 h-4 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57] hover:brightness-90 active:brightness-75 transition-all touch-manipulation"
                                    aria-label="Close"
                                ></button>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (onMinimize) {
                                            onMinimize();
                                        }
                                    }}
                                    onTouchStart={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="w-4 h-4 sm:w-3 sm:h-3 rounded-full bg-[#febc2e] hover:brightness-90 active:brightness-75 transition-all touch-manipulation"
                                    aria-label="Minimize"
                                />
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (onMaximize) {
                                            onMaximize();
                                        }
                                    }}
                                    onTouchStart={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="w-4 h-4 sm:w-3 sm:h-3 rounded-full bg-[#28c840] hover:brightness-90 active:brightness-75 transition-all touch-manipulation"
                                    aria-label="Maximize"
                                />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 text-sm sm:text-sm text-white font-medium">
                                Spotify
                            </div>
                            <div className="w-12 sm:w-12"></div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-auto bg-[#121212] p-4 sm:p-6 md:p-8">
                            {/* Current Track Info */}
                            <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
                                {/* Album Art */}
                                {currentTrack.albumArt ? (
                                    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-lg shadow-2xl mb-4 sm:mb-6 overflow-hidden">
                                        <img 
                                            src={currentTrack.albumArt} 
                                            alt={`${currentTrack.title} album art`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-lg shadow-2xl mb-4 sm:mb-6 flex items-center justify-center">
                                        <span className="text-5xl sm:text-6xl md:text-8xl">♪</span>
                                    </div>
                                )}
                                
                                {/* Track Info */}
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center px-2">
                                    {currentTrack.title}
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-gray-400 text-center px-2">
                                    {currentTrack.artist}
                                </p>
                            </div>

                            {/* Track List */}
                            <div className="mt-6 sm:mt-8">
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Songs</h3>
                                <div className="space-y-2">
                                    {defaultTracks.map((track, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setCurrentTrackIndex(index);
                                                setIsPlaying(true);
                                                shouldAutoPlayRef.current = true;
                                            }}
                                            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-3 rounded-lg cursor-pointer transition-colors touch-manipulation ${
                                                index === currentTrackIndex
                                                    ? 'bg-[#1db954]/20 border border-[#1db954]/50'
                                                    : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] active:bg-[#2a2a2a]'
                                            }`}
                                        >
                                            {track.albumArt ? (
                                                <div className="w-12 h-12 sm:w-12 sm:h-12 rounded overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={track.albumArt} 
                                                        alt={`${track.title} album art`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xl">♪</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm sm:text-base font-medium truncate ${
                                                    index === currentTrackIndex ? 'text-[#1db954]' : 'text-white'
                                                }`}>
                                                    {track.title}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-400 truncate">
                                                    {track.artist}
                                                </p>
                                            </div>
                                            {index === currentTrackIndex && isPlaying && (
                                                <div className="w-2 h-2 bg-[#1db954] rounded-full animate-pulse flex-shrink-0"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Player Controls Bar */}
                        <div className="bg-[#181818] border-t border-white/10 p-3 sm:p-4 md:p-6">
                            {/* Progress Bar */}
                            <div className="mb-3 sm:mb-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1.5 sm:h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1db954] touch-manipulation"
                                    style={{
                                        background: `linear-gradient(to right, #1db954 0%, #1db954 ${(currentTime / duration) * 100}%, #535353 ${(currentTime / duration) * 100}%, #535353 100%)`
                                    }}
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                                {/* Track Info - Hidden on mobile, shown on desktop */}
                                <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
                                    {currentTrack.albumArt ? (
                                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                            <img 
                                                src={currentTrack.albumArt} 
                                                alt={`${currentTrack.title} album art`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">♪</span>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white truncate">
                                            {currentTrack.title}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {currentTrack.artist}
                                        </p>
                                    </div>
                                </div>

                                {/* Playback Controls */}
                                <div className="flex items-center gap-3 sm:gap-2 md:gap-4">
                                    <button
                                        onClick={handlePrevious}
                                        className="p-2 sm:p-2 text-gray-400 hover:text-white active:text-white transition-colors touch-manipulation"
                                        aria-label="Previous track"
                                    >
                                        <SkipBack size={22} className="sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        onClick={togglePlayPause}
                                        className="w-14 h-14 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white hover:scale-105 active:scale-95 rounded-full flex items-center justify-center transition-transform shadow-lg touch-manipulation"
                                        aria-label={isPlaying ? 'Pause' : 'Play'}
                                    >
                                        {isPlaying ? (
                                            <Pause size={26} className="text-black sm:w-6 sm:h-6" fill="black" />
                                        ) : (
                                            <Play size={26} className="text-black ml-0.5 sm:w-6 sm:h-6" fill="black" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="p-2 sm:p-2 text-gray-400 hover:text-white active:text-white transition-colors touch-manipulation"
                                        aria-label="Next track"
                                    >
                                        <SkipForward size={22} className="sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                {/* Volume Control */}
                                <div className="flex items-center gap-2 flex-1 sm:flex-1 justify-end">
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 text-gray-400 hover:text-white active:text-white transition-colors touch-manipulation"
                                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted || volume === 0 ? (
                                            <VolumeX size={20} className="sm:w-5 sm:h-5" />
                                        ) : (
                                            <Volume2 size={20} className="sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-16 sm:w-20 md:w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1db954] touch-manipulation"
                                        style={{
                                            background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #535353 ${volume}%, #535353 100%)`
                                        }}
                                        aria-label="Volume"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

