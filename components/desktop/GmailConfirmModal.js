'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GmailConfirmModal({ isOpen, onConfirm, onCancel }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const handleConfirm = () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }
        
        setError('');
        onConfirm(email.trim());
    };
    
    const handleCancel = () => {
        setEmail('');
        setError('');
        onCancel();
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    // Add ESC key handler (backup in case input doesn't capture it)
    useEffect(() => {
        if (!isOpen) return;
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, handleCancel]);
    
    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={(e) => {
                        // Click outside to cancel
                        if (e.target === e.currentTarget) {
                            handleCancel();
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-[90%] max-w-[400px] bg-[#1e1e1e]/90 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✉️</span>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2 text-center">
                            Looking to contact me?
                        </h3>
                        <p className="text-white/70 text-sm mb-4 text-center">
                            aersijun@gmail.com
                        </p>
                        
                        <div className="mb-4">
                            <label className="block text-white/70 text-sm mb-2">
                                Your email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                autoFocus
                            />
                            {error && (
                                <p className="text-red-400 text-xs mt-1">{error}</p>
                            )}
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

