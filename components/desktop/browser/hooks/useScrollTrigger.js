'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export function useScrollTrigger(onTrigger, options = {}) {
    const {
        threshold = 0.5, // Trigger when 50% of element is visible
        rootMargin = '0px',
        once = true // Only trigger once
    } = options;

    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef(null);

    // Check for prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // If already triggered and once is true, don't set up observer
        if (hasTriggered && once) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isIntersecting = entry.isIntersecting;
                    setIsVisible(isIntersecting);

                    // Trigger callback when element enters viewport center
                    if (isIntersecting && !hasTriggered) {
                        // Only trigger if not respecting reduced motion, or if explicitly allowed
                        if (!prefersReducedMotion || options.allowOnReducedMotion) {
                            if (onTrigger) {
                                onTrigger();
                            }
                            if (once) {
                                setHasTriggered(true);
                            }
                        }
                    }
                });
            },
            {
                threshold,
                rootMargin
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [onTrigger, threshold, rootMargin, once, hasTriggered, prefersReducedMotion, options.allowOnReducedMotion]);

    return {
        ref: elementRef,
        isVisible,
        hasTriggered
    };
}






