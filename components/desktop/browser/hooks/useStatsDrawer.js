'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

export function useStatsDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef(null);
    const touchStartY = useRef(null);
    const touchStartTime = useRef(null);

    const openDrawer = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Handle swipe down to close
    useEffect(() => {
        const drawer = drawerRef.current;
        if (!drawer || !isOpen) return;

        const handleTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
            touchStartTime.current = Date.now();
        };

        const handleTouchMove = (e) => {
            if (touchStartY.current === null) return;
            
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - touchStartY.current;
            
            // Only allow downward swipe
            if (deltaY > 0) {
                drawer.style.transform = `translateY(${deltaY}px)`;
            }
        };

        const handleTouchEnd = (e) => {
            if (touchStartY.current === null) return;
            
            const currentY = e.changedTouches[0].clientY;
            const deltaY = currentY - touchStartY.current;
            const deltaTime = Date.now() - (touchStartTime.current || 0);
            const velocity = deltaY / deltaTime;
            
            // Close if swiped down more than 100px or with sufficient velocity
            if (deltaY > 100 || velocity > 0.3) {
                closeDrawer();
            }
            
            // Reset transform
            drawer.style.transform = '';
            touchStartY.current = null;
            touchStartTime.current = null;
        };

        drawer.addEventListener('touchstart', handleTouchStart);
        drawer.addEventListener('touchmove', handleTouchMove);
        drawer.addEventListener('touchend', handleTouchEnd);

        return () => {
            drawer.removeEventListener('touchstart', handleTouchStart);
            drawer.removeEventListener('touchmove', handleTouchMove);
            drawer.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isOpen, closeDrawer]);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            const drawer = drawerRef.current;
            if (drawer && !drawer.contains(e.target)) {
                // Check if click is on the backdrop (not on the floating button)
                const floatingButton = document.querySelector('[data-stats-button]');
                if (floatingButton && floatingButton.contains(e.target)) {
                    return; // Don't close if clicking the button
                }
                closeDrawer();
            }
        };

        // Use capture phase to catch clicks on backdrop
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen, closeDrawer]);

    return {
        isOpen,
        openDrawer,
        closeDrawer,
        drawerRef
    };
}


