'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarWidget from './widgets/CalendarWidget';
import WeatherWidget from './widgets/WeatherWidget';
import WorldClocksWidget from './widgets/WorldClocksWidget';
import StockWidget from './widgets/StockWidget';
import ScreenTimeWidget from './widgets/ScreenTimeWidget';

export default function WidgetScreen({ isOpen, onClose, onPermissionError, time }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    {/* Widget Panel - Right Side */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 z-[101] w-[85%] max-w-[320px] sm:w-[320px] md:w-[360px] lg:w-[380px] bg-black/30 backdrop-blur-2xl shadow-2xl overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
                            <CalendarWidget time={time} />
                            <WeatherWidget />
                            <WorldClocksWidget time={time} />
                            <StockWidget />
                            <ScreenTimeWidget onPermissionError={onPermissionError} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
