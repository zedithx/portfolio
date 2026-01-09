'use client';
import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function PageHeader({ 
    isDark, 
    title, 
    subtitle, 
    onToggleToInformal 
}) {
    return (
        <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col gap-3 sm:gap-4">
                <div>
                    <h1 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight mb-1.5 sm:mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {onToggleToInformal && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onToggleToInformal) {
                                onToggleToInformal();
                            }
                        }}
                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-medium border rounded-lg transition-colors ${
                            isDark 
                                ? 'text-white/80 hover:text-white border-gray-600 hover:bg-gray-800/50' 
                                : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <span>Interactive Journey</span>
                    </button>
                )}
            </div>
        </div>
    );
}
