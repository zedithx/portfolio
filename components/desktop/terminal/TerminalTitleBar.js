'use client';
import React from 'react';

export default function TerminalTitleBar({ 
    isDark, 
    onClose, 
    onMinimize, 
    onMaximize,
    onDragStart 
}) {
    return (
        <div 
            className={`px-4 py-3 flex items-center gap-2 title-bar-drag cursor-grab active:cursor-grabbing shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-100'}`}
            onMouseDown={onDragStart}
        >
            <div className="flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }} 
                    className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#ff5f57] hover:brightness-110 cursor-pointer touch-manipulation" 
                />
                <button
                    onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
                    className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#febc2e] hover:brightness-110 cursor-pointer touch-manipulation" 
                />
                <button
                    onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
                    className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#28c840] hover:brightness-110 cursor-pointer touch-manipulation" 
                />
            </div>
            <div className="flex-1 text-center select-none">
                <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Terminal — zsh</span>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className={`transition-colors text-xs md:text-sm px-2 md:px-3 py-1 rounded ${isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/10' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
            >
                Close
            </button>
        </div>
    );
}
