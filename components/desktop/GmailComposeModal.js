'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RATE_LIMIT_SECONDS = 60; // 1 minute cooldown between submissions
const LAST_SUBMISSION_KEY = 'gmail_last_submission';

export default function GmailComposeModal({ isOpen, onClose, visitorEmail, onPermissionError, onSuccess }) {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const getTimeUntilNextSubmission = () => {
        if (typeof window === 'undefined') return 0;
        const lastSubmission = localStorage.getItem(LAST_SUBMISSION_KEY);
        if (!lastSubmission) return 0;
        
        const timeSinceLastSubmission = (Date.now() - parseInt(lastSubmission)) / 1000;
        const timeRemaining = RATE_LIMIT_SECONDS - timeSinceLastSubmission;
        return Math.max(0, timeRemaining);
    };
    
    const handleSend = async () => {
        if (!body.trim()) {
            setError('Please enter a message');
            return;
        }
        
        // Check rate limit
        const timeRemaining = getTimeUntilNextSubmission();
        if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = Math.floor(timeRemaining % 60);
            if (minutes > 0) {
                setError(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''} before sending another message.`);
            } else {
                setError(`Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before sending another message.`);
            }
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: visitorEmail,
                    subject: subject,
                    message: body,
                }),
            });
            
            if (response.ok) {
                // Store submission timestamp in localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LAST_SUBMISSION_KEY, Date.now().toString());
                }
                
                onClose();
                setSubject('');
                setBody('');
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                setError('Failed to send message. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSubject('');
            setBody('');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Add ESC key handler
    useEffect(() => {
        if (!isOpen) return;
        
        const handleEscape = (e) => {
            if (e.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, isSubmitting, onClose]);
    
    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
                    onClick={(e) => {
                        // Click outside to close (only if not submitting)
                        if (!isSubmitting && e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-3xl h-full max-h-[90vh] flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Title Bar */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onClose} 
                                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"
                                ></button>
                                <button 
                                    onClick={() => onPermissionError && onPermissionError("You cannot minimize when on this page.")} 
                                    className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all"
                                />
                                <button 
                                    onClick={() => onPermissionError && onPermissionError("You cannot maximize when on this page.")} 
                                    className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all"
                                />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 text-sm text-gray-700 font-medium">
                                New Message
                            </div>
                            <div className="w-12"></div>
                        </div>
                        
                        {/* Subject and Message Box */}
                        <div className="flex-1 overflow-auto bg-white flex flex-col">
                            <div className="px-4 pt-4 pb-2 border-b border-gray-200">
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => {
                                        setSubject(e.target.value);
                                        setError('');
                                    }}
                                    className="w-full px-2 py-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
                                    placeholder="Subject"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <textarea
                                value={body}
                                onChange={(e) => {
                                    setBody(e.target.value);
                                    setError('');
                                }}
                                className="flex-1 w-full p-4 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none"
                                placeholder="Type your message here..."
                                style={{ minHeight: '300px' }}
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        {/* Error Messages */}
                        {error && (
                            <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        
                        {/* Send Button */}
                        <div className="flex items-center justify-end px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={handleSend}
                                disabled={isSubmitting}
                                className={`px-6 py-2 ${
                                    isSubmitting 
                                        ? 'bg-[#1a73e8]/50 cursor-not-allowed' 
                                        : 'bg-[#1a73e8] hover:bg-[#1557b0]'
                                } text-white rounded-md text-sm font-medium transition-colors`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

