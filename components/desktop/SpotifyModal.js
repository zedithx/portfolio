'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

// Your music tracks
const defaultTracks = [
    {
        title: "Ambient Chill Lofi Music",
        artist: "Lofi Beats",
        url: "/music/ambient-chill-lofi-music-hip-hop-beats-340449.mp3",
        albumArt: null
    },
    {
        title: "Chill Lofi Ambient",
        artist: "Lofi Beats",
        url: "/music/chill-lofi-ambient-438053.mp3",
        albumArt: null
    },
    {
        title: "Chill Lofi Ambient Music",
        artist: "Lofi Beats",
        url: "/music/chill-lofi-ambient-music-344109.mp3",
        albumArt: null
    },
    {
        title: "Lofi Chill Background",
        artist: "Lofi Beats",
        url: "/music/lofi-chill-background-187713.mp3",
        albumArt: null
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

    return (
        <>
            {/* Hidden audio element - always rendered so music continues when minimized */}
            <audio ref={audioRef} preload="metadata" />
            
            {/* Modal UI */}
            {isOpen && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ 
                        scale: isMinimized ? 0 : 1,
                        opacity: isMinimized ? 0 : 1,
                        width: isMaximized ? '100vw' : '80rem',
                        height: isMaximized ? 'calc(100vh - 28px)' : '90vh',
                        top: isMaximized ? '28px' : '50%',
                        left: isMaximized ? 0 : '50%',
                        x: isMaximized ? 0 : '-50%',
                        y: isMinimized ? 200 : (isMaximized ? 0 : '-50%'),
                    }}
                    exit={{ scale: 0, opacity: 0, y: 200 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className={`fixed z-[100] flex flex-col bg-[#121212] shadow-2xl overflow-hidden ${isMaximized ? 'rounded-none' : 'rounded-lg'}`}
                    style={{ 
                        transformOrigin: 'bottom',
                        pointerEvents: isMinimized ? 'none' : 'auto',
                        maxWidth: isMaximized ? '100vw' : '80rem'
                    }}
                >
                    {/* Title Bar */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onClose} 
                                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"
                                ></button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onMinimize) onMinimize();
                                    }}
                                    className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all"
                                />
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onMaximize) onMaximize();
                                    }}
                                    className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all"
                                />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 text-sm text-white font-medium">
                                Spotify
                            </div>
                            <div className="w-12"></div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-auto bg-[#121212] p-6 sm:p-8">
                            {/* Current Track Info */}
                            <div className="flex flex-col items-center justify-center mb-8">
                                {/* Album Art Placeholder */}
                                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-lg shadow-2xl mb-6 flex items-center justify-center">
                                    <span className="text-6xl sm:text-8xl">♪</span>
                                </div>
                                
                                {/* Track Info */}
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
                                    {currentTrack.title}
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-400 text-center">
                                    {currentTrack.artist}
                                </p>
                            </div>

                            {/* Track List */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-white mb-4">Songs</h3>
                                <div className="space-y-2">
                                    {defaultTracks.map((track, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setCurrentTrackIndex(index);
                                                setIsPlaying(true);
                                                shouldAutoPlayRef.current = true;
                                            }}
                                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                                                index === currentTrackIndex
                                                    ? 'bg-[#1db954]/20 border border-[#1db954]/50'
                                                    : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                                            }`}
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded flex items-center justify-center flex-shrink-0">
                                                <span className="text-xl">♪</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium truncate ${
                                                    index === currentTrackIndex ? 'text-[#1db954]' : 'text-white'
                                                }`}>
                                                    {track.title}
                                                </p>
                                                <p className="text-sm text-gray-400 truncate">
                                                    {track.artist}
                                                </p>
                                            </div>
                                            {index === currentTrackIndex && isPlaying && (
                                                <div className="w-2 h-2 bg-[#1db954] rounded-full animate-pulse"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Player Controls Bar */}
                        <div className="bg-[#181818] border-t border-white/10 p-4 sm:p-6">
                            {/* Progress Bar */}
                            <div className="mb-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
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
                            <div className="flex items-center justify-between">
                                {/* Track Info */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">♪</span>
                                    </div>
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
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <button
                                        onClick={handlePrevious}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                        aria-label="Previous track"
                                    >
                                        <SkipBack size={20} />
                                    </button>
                                    <button
                                        onClick={togglePlayPause}
                                        className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:scale-105 rounded-full flex items-center justify-center transition-transform shadow-lg"
                                        aria-label={isPlaying ? 'Pause' : 'Play'}
                                    >
                                        {isPlaying ? (
                                            <Pause size={24} className="text-black" fill="black" />
                                        ) : (
                                            <Play size={24} className="text-black ml-0.5" fill="black" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                        aria-label="Next track"
                                    >
                                        <SkipForward size={20} />
                                    </button>
                                </div>

                                {/* Volume Control */}
                                <div className="flex items-center gap-2 flex-1 justify-end">
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted || volume === 0 ? (
                                            <VolumeX size={20} />
                                        ) : (
                                            <Volume2 size={20} />
                                        )}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-20 sm:w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
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
        </>
    );
}

