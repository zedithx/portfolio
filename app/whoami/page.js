'use client';
import React, { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { aboutMeData } from '../../components/desktop/browser/data';

// Lazy load AboutMeView for better performance
const AboutMeView = dynamic(
    () => import('../../components/desktop/browser/AboutMeView'),
    { 
        ssr: false,
        loading: () => (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
                <div className="text-yellow-400 text-xl">Loading...</div>
            </div>
        )
    }
);

export default function WhoAmIPage() {
    const router = useRouter();
    const exitButtonRef = useRef(null);

    // Reset sessionStorage on page load to start fresh each time
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('aboutMe_skillProgression');
            sessionStorage.removeItem('aboutMe_processedCards');
        }
    }, []);

    const handleExit = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Use window.location for more reliable navigation
        window.location.href = '/';
    }, []);

    // ESC key to exit
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleExit(e);
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [handleExit]);

    // Attach non-passive touch event listener for exit button
    useEffect(() => {
        const exitButton = exitButtonRef.current;
        
        const handleTouchStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        if (exitButton) {
            exitButton.addEventListener('touchstart', handleTouchStart, { passive: false });
        }

        return () => {
            if (exitButton) {
                exitButton.removeEventListener('touchstart', handleTouchStart);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden">
            {/* Exit Button - High z-index to ensure it's always on top and clickable */}
            <motion.button
                ref={exitButtonRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleExit(e);
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="fixed top-2 right-2 md:right-4 z-[10000] min-h-[36px] min-w-[36px] p-2 rounded-lg flex items-center justify-center touch-manipulation"
                style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid #ffd700',
                    color: '#ffd700',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                    position: 'fixed',
                    pointerEvents: 'auto'
                }}
                whileHover={{ 
                    scale: 1.1, 
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
                    background: 'rgba(0, 0, 0, 0.95)',
                    transition: { duration: 0, ease: 'linear' }
                }}
                transition={{ 
                    duration: 0.3, 
                    delay: 0.5
                }}
                whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0, ease: 'linear' }
                }}
                aria-label="Exit to main page"
            >
                <X className="w-4 h-4" />
            </motion.button>

            <AboutMeView data={aboutMeData} />
        </div>
    );
}

