'use client';
import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contentData } from './browser/data';
import CashShopView from './browser/CashShopView';
import BrowserView from './browser/BrowserView';

export default function BrowserModal({ type, onClose, onPermissionError }) {
    // Memoize data access to prevent unnecessary recalculations
    const data = useMemo(() => contentData[type], [type]);
    const isCashShop = useMemo(() => type === 'projects' && data.items, [type, data.items]);
    const commits = 1247; // Hardcoded commit count

    // Add ESC key handler
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Cash Shop Layout
    if (isCashShop) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                    onClick={(e) => {
                        // Click outside to close
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-7xl h-full max-h-screen sm:max-h-[95vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CashShopView 
                            onClose={onClose}
                            onPermissionError={onPermissionError}
                            data={data}
                            commits={commits}
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Regular Browser Layout (for background, experience, etc.)
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                onClick={(e) => {
                    // Click outside to close
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-full max-w-4xl h-full max-h-[90vh] md:max-h-[85vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <BrowserView 
                        type={type}
                        data={data}
                        onClose={onClose}
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
