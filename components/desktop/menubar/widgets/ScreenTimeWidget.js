'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function ScreenTimeWidget({ onPermissionError }) {
    const bars = [65, 45, 55, 40, 50, 35, 60, 45, 55, 50, 45, 40];
    const apps = [
        { name: '1h 38m', color: 'blue' },
        { name: '1h 36m', color: 'gray', icon: 'wifi' },
        { name: '1h 32m', color: 'yellow' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
        >
            <div className="text-white text-base sm:text-lg md:text-xl font-semibold mb-3">2h 49m</div>
            <div className="flex gap-2 sm:gap-3 md:gap-4">
                <div className="flex-1">
                    <div className="relative h-20 sm:h-24 md:h-28 mb-3 flex items-end gap-0.5 sm:gap-1">
                        {bars.map((height, idx) => (
                            <div
                                key={idx}
                                className="flex-1 rounded-t"
                                style={{
                                    height: `${height}%`,
                                    background: idx % 3 === 0 ? '#3b82f6' : idx % 3 === 1 ? '#f97316' : '#60a5fa'
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
                    {apps.map((app, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-${app.color}-500/20 rounded flex items-center justify-center`}>
                                {app.icon === 'wifi' ? (
                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-${app.color}-500 rounded-sm`}></div>
                                )}
                            </div>
                            <span className="text-white/80 text-[10px] sm:text-xs md:text-sm">{app.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 pt-4 sm:border-t sm:border-white/10 flex items-center justify-between">
                <span 
                    onClick={onPermissionError}
                    className="text-white/70 text-xs md:text-sm cursor-pointer hover:text-white transition-colors"
                >
                    Edit Widgets...
                </span>
                <svg 
                    onClick={onPermissionError}
                    className="w-4 h-4 md:w-5 md:h-5 text-white/60 cursor-pointer hover:text-white transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
        </motion.div>
    );
}
