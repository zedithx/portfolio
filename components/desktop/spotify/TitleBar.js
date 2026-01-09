'use client';
import React from 'react';

export default function TitleBar({ 
    isDark, 
    onClose, 
    onMinimize, 
    onMaximize 
}) {
    return (
        <div className={`flex items-center justify-between px-4 py-3 sm:px-4 sm:py-3 border-b relative ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
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
                />
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
            <div className={`absolute left-1/2 -translate-x-1/2 text-sm sm:text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Spotify
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onClose) {
                        onClose();
                    }
                }}
                className={`transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 rounded ${isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
            >
                Close
            </button>
        </div>
    );
}
