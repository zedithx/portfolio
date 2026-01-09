'use client';
import React from 'react';
import AlbumArt from './AlbumArt';

export default function TrackList({ 
    tracks, 
    currentTrackIndex, 
    isPlaying, 
    isDark, 
    onTrackSelect 
}) {
    return (
        <div className="mt-6 sm:mt-8">
            <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Songs</h3>
            <div className="space-y-2">
                {tracks.map((track, index) => (
                    <div
                        key={index}
                        onClick={() => onTrackSelect && onTrackSelect(index)}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-3 rounded-lg cursor-pointer transition-colors touch-manipulation ${
                            index === currentTrackIndex
                                ? 'bg-[#1db954]/20 border border-[#1db954]/50'
                                : isDark 
                                    ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] active:bg-[#2a2a2a]'
                                    : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-transparent'
                        }`}
                    >
                        <AlbumArt 
                            albumArt={track.albumArt} 
                            title={track.title}
                            size="small"
                        />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm sm:text-base font-medium truncate ${
                                index === currentTrackIndex ? 'text-[#1db954]' : (isDark ? 'text-white' : 'text-gray-900')
                            }`}>
                                {track.title}
                            </p>
                            <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
    );
}
