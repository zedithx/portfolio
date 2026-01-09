'use client';
import React from 'react';

export default function AlbumArt({ albumArt, title, size = 'large' }) {
    const sizeClasses = {
        large: 'w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64',
        small: 'w-12 h-12',
    };

    if (albumArt) {
        return (
            <div className={`${sizeClasses[size]} rounded-lg shadow-2xl mb-4 sm:mb-6 overflow-hidden ${size === 'small' ? 'mb-0' : ''}`}>
                <img 
                    src={albumArt} 
                    alt={`${title} album art`}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-lg shadow-2xl mb-4 sm:mb-6 flex items-center justify-center ${size === 'small' ? 'mb-0' : ''}`}>
            <span className={size === 'large' ? 'text-5xl sm:text-6xl md:text-8xl' : 'text-lg'}>♪</span>
        </div>
    );
}
