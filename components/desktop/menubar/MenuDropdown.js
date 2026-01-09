'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItem from './MenuItem';

export default function MenuDropdown({ 
    isOpen, 
    items, 
    position = 'left', 
    offsetX = -8,
    onItemClick 
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className={`absolute top-7 w-[250px] bg-[#1e1e1e]/90 backdrop-blur-3xl rounded-b-lg shadow-2xl border border-white/10 py-1 z-[60]`}
                    style={{ 
                        left: position === 'left' ? `${offsetX}px` : undefined,
                        right: position === 'right' ? '0' : undefined
                    }}
                >
                    {items.map((item, index) => (
                        <MenuItem
                            key={index}
                            item={item}
                            onClick={onItemClick}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
