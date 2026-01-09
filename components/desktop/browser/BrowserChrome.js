'use client';
import React from 'react';
import { X, ChevronLeft, ChevronRight, RotateCw, Lock } from 'lucide-react';

export default function BrowserChrome({ 
    isDark, 
    title = 'About Me',
    tabTitle,
    url = 'portfolio.dev/about-me',
    onClose,
    showReload = true,
    onPrev,
    onNext,
    canGoPrev = false,
    canGoNext = false,
    onReload
}) {
    const displayTabTitle = tabTitle !== undefined ? tabTitle : title;
    return (
        <div className={`${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-[#f6f6f6] border-gray-200'} rounded-t-xl border border-b-0 shrink-0`}>
            {/* Title Bar */}
            <div className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} relative`}>
                <div className="flex items-center gap-1.5 md:gap-2">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onClose) {
                                onClose();
                            }
                        }} 
                        className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all group flex items-center justify-center cursor-pointer touch-manipulation"
                    >
                        <X className="w-2.5 h-2.5 md:w-2 md:h-2 text-[#ff5f57] group-hover:text-red-800" />
                    </button>
                    <button 
                        className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all cursor-pointer touch-manipulation" 
                        title="Minimize"
                    />
                    <button 
                        className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all cursor-pointer touch-manipulation" 
                        title="Maximize"
                    />
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 text-sm md:text-base ${isDark ? 'text-white/80' : 'text-gray-600'} font-medium truncate max-w-[150px] md:max-w-none`}>
                    {title}
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onClose) {
                            onClose();
                        }
                    }}
                    className={`${isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors text-xs md:text-sm px-2 md:px-3 py-1 rounded`}
                >
                    Close
                </button>
            </div>

            {/* Navigation & URL Bar */}
            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2">
                <div className="flex items-center gap-0.5 md:gap-1">
                    <button 
                        onClick={onPrev}
                        disabled={!canGoPrev || !onPrev}
                        className={`p-1 md:p-1.5 rounded-lg transition-colors ${!canGoPrev || !onPrev
                            ? `cursor-not-allowed ${isDark ? 'text-gray-600/50' : 'text-gray-300'}`
                            : (isDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-200')
                        }`}
                    >
                        <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <button 
                        onClick={onNext}
                        disabled={!canGoNext || !onNext}
                        className={`p-1 md:p-1.5 rounded-lg transition-colors ${!canGoNext || !onNext
                            ? `cursor-not-allowed ${isDark ? 'text-gray-600/50' : 'text-gray-300'}`
                            : (isDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-200')
                        }`}
                    >
                        <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    {showReload && (
                        <button 
                            onClick={onReload || (() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            })}
                            className={`hidden sm:block p-1.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                            title="Reload"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className={`flex-1 flex items-center gap-1.5 md:gap-2 rounded-lg px-2 md:px-3 py-1.5 md:py-1.5 border min-w-0 ${isDark ? 'bg-[#2d2d2d] border-gray-600' : 'bg-white border-gray-200'}`}>
                    <Lock className={`w-3 h-3 md:w-3 md:h-3 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm md:text-base truncate ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{url}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-2 -mb-px">
                <div className={`flex items-center gap-2 md:gap-2 px-3 md:px-4 py-2 md:py-2 rounded-t-lg border border-b-0 text-sm md:text-base ${isDark ? 'bg-[#2d2d2d] border-gray-700 border-b-[#2d2d2d]' : 'bg-white border-gray-200 border-b-white'}`}>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>{displayTabTitle}</span>
                    {onClose && (
                        <X 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onClose) {
                                    onClose();
                                }
                            }}
                            className={`w-2.5 h-2.5 md:w-3 md:h-3 cursor-pointer ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
