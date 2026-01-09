'use client';
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import AlbumArt from './AlbumArt';

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function PlayerControls({
    isDark,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    onPlayPause,
    onPrevious,
    onNext,
    onSeek,
    onVolumeChange,
    onToggleMute,
}) {
    return (
        <div className={`border-t p-3 sm:p-4 md:p-6 ${isDark ? 'bg-[#181818] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            {/* Progress Bar */}
            <div className="mb-3 sm:mb-4">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={onSeek}
                    className={`w-full h-1.5 sm:h-1 rounded-lg appearance-none cursor-pointer accent-[#1db954] touch-manipulation ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
                    style={{
                        background: `linear-gradient(to right, #1db954 0%, #1db954 ${(currentTime / duration) * 100}%, #535353 ${(currentTime / duration) * 100}%, #535353 100%)`
                    }}
                />
                <div className={`flex justify-between text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                {/* Track Info - Hidden on mobile, shown on desktop */}
                <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
                    <AlbumArt 
                        albumArt={currentTrack.albumArt} 
                        title={currentTrack.title}
                        size="small"
                    />
                    <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {currentTrack.title}
                        </p>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {currentTrack.artist}
                        </p>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-3 sm:gap-2 md:gap-4">
                    <button
                        onClick={onPrevious}
                        className={`p-2 sm:p-2 transition-colors touch-manipulation ${isDark ? 'text-gray-400 hover:text-white active:text-white' : 'text-gray-600 hover:text-gray-900 active:text-gray-900'}`}
                        aria-label="Previous track"
                    >
                        <SkipBack size={22} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={onPlayPause}
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
                        onClick={onNext}
                        className={`p-2 sm:p-2 transition-colors touch-manipulation ${isDark ? 'text-gray-400 hover:text-white active:text-white' : 'text-gray-600 hover:text-gray-900 active:text-gray-900'}`}
                        aria-label="Next track"
                    >
                        <SkipForward size={22} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 flex-1 sm:flex-1 justify-end">
                    <button
                        onClick={onToggleMute}
                        className={`p-2 transition-colors touch-manipulation ${isDark ? 'text-gray-400 hover:text-white active:text-white' : 'text-gray-600 hover:text-gray-900 active:text-gray-900'}`}
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
                        onChange={onVolumeChange}
                        className={`w-16 sm:w-20 md:w-24 h-1 rounded-lg appearance-none cursor-pointer accent-[#1db954] touch-manipulation ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
                        style={{
                            background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #535353 ${volume}%, #535353 100%)`
                        }}
                        aria-label="Volume"
                    />
                </div>
            </div>
        </div>
    );
}
