'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PermissionModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-[90%] max-w-[400px] bg-[#1e1e1e]/90 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl p-6 text-center"
                    >
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Permission Denied</h3>
                        <p className="text-white/70 text-sm mb-6">
                            You do not have root access. Please use sudo or contact your administrator.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                        >
                            OK
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

