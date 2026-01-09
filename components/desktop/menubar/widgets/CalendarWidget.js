'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function CalendarWidget({ time }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
        >
            <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1.5">
                {time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
            </div>
            <div className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                {time.getDate()}
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-red-400 text-xs md:text-sm">Timeleft Dinner</span>
                    <span className="text-white/60 text-xs md:text-sm">7-9PM</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-green-400 text-xs md:text-sm">Learning reminder</span>
                    <span className="text-white/60 text-xs md:text-sm">8-8:30PM</span>
                </div>
            </div>
        </motion.div>
    );
}
