'use client';
import { useCallback } from 'react';

export const useJourneyNavigation = ({
    currentIndex,
    journey,
    isTransitioning,
    isAnimating,
    setIsTransitioning,
    setCurrentIndex,
    setShowDialogue,
    setShowSummary,
    setIsAnimating
}) => {
    const goNext = useCallback(() => {
        if (isTransitioning || isAnimating) return;
        
        const isLastSlide = currentIndex === journey.length - 1;
        if (isLastSlide) {
            setIsTransitioning(true);
            setShowDialogue(false);
            setTimeout(() => {
                setShowSummary(true);
                setIsTransitioning(false);
            }, 300);
        } else if (currentIndex < journey.length - 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 300);
        }
    }, [currentIndex, journey.length, isTransitioning, isAnimating, setIsTransitioning, setCurrentIndex, setShowDialogue, setShowSummary]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0 && !isTransitioning && !isAnimating) {
            setIsTransitioning(true);
            setIsAnimating(false);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
            }, 300);
        }
    }, [currentIndex, isTransitioning, isAnimating, setIsTransitioning, setCurrentIndex, setIsAnimating]);

    const goToSlide = useCallback((index) => {
        if (!isTransitioning && index !== currentIndex) {
            setIsTransitioning(true);
            setShowSummary(false);
            setTimeout(() => {
                setCurrentIndex(index);
            }, 300);
        }
    }, [currentIndex, isTransitioning, setIsTransitioning, setCurrentIndex, setShowSummary]);

    const goToSummary = useCallback(() => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setShowDialogue(false);
            setTimeout(() => {
                setShowSummary(true);
                setIsTransitioning(false);
            }, 300);
        }
    }, [isTransitioning, setIsTransitioning, setShowDialogue, setShowSummary]);

    return { goNext, goPrev, goToSlide, goToSummary };
};
