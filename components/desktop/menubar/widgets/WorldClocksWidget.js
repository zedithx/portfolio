'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function WorldClocksWidget({ time }) {
    const clocks = [
        { city: 'Cupertino', time: new Date(time.getTime() - 16 * 60 * 60 * 1000), label: 'Yesterday -16HRS' },
        { city: 'Tokyo', time: new Date(time.getTime() + 1 * 60 * 60 * 1000), label: 'Today +1HR' },
        { city: 'Sydney', time: new Date(time.getTime() + 3 * 60 * 60 * 1000), label: 'Today +3HRS' },
        { city: 'Paris', time: new Date(time.getTime() - 7 * 60 * 60 * 1000), label: 'Yesterday -7HRS' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
        >
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {clocks.map((clock, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className="text-white/50 text-[9px] sm:text-[10px] mb-1.5">{clock.city}</div>
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-1">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" stroke="white/20" strokeWidth="2" fill="none" />
                                <circle cx="50" cy="50" r="2" fill="#d4af37" />
                                <line 
                                    x1="50" y1="50" 
                                    x2="50" y2="30" 
                                    stroke="#d4af37" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                    transform={`rotate(${(clock.time.getHours() % 12) * 30 + clock.time.getMinutes() * 0.5} 50 50)`}
                                />
                                <line 
                                    x1="50" y1="50" 
                                    x2="50" y2="20" 
                                    stroke="#d4af37" 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round"
                                    transform={`rotate(${clock.time.getMinutes() * 6} 50 50)`}
                                />
                            </svg>
                        </div>
                        <div className="text-white/60 text-[9px] md:text-xs text-center">{clock.label}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
