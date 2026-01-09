'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
        >
            <div className="text-white/50 text-[10px] sm:text-xs mb-1.5">Singapore</div>
            <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">25°</span>
            </div>
            <div className="text-white/70 text-xs sm:text-sm md:text-base mb-3">Cloudy</div>
            <div className="text-white/50 text-[10px] sm:text-xs">H:30° L:24°</div>
        </motion.div>
    );
}
