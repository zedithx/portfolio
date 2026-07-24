'use client';
import React, { useState, useEffect, useRef } from 'react';

export const Typewriter = ({ text, delay = 0, onComplete, speed = 20 }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        let timeout;
        if (delay > 0) {
            timeout = setTimeout(() => {
                let i = 0;
                const interval = setInterval(() => {
                    setDisplayedText(text.slice(0, i + 1));
                    i++;
                    if (i >= text.length) {
                        clearInterval(interval);
                        if (onComplete) onComplete();
                    }
                }, speed);
            }, delay);
        } else {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, speed);
        }
        return () => {
            clearTimeout(timeout);
            if (timeout) clearTimeout(timeout);
        };
    }, [text, delay, speed, onComplete]);

    return <span>{displayedText}</span>;
};

export const SequentialTypewriter = ({ messages, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const onCompleteRef = useRef(onComplete);
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (currentIndex >= messages.length) {
            if (!hasCompletedRef.current) {
                hasCompletedRef.current = true;
                onCompleteRef.current?.();
            }
            return;
        }

        const currentMessage = messages[currentIndex];
        const previousText = messages.slice(0, currentIndex).map(msg => msg.text).join(' ');
        let i = 0;
        let advanceTimeout = null;
        
        const interval = setInterval(() => {
            const separator = previousText ? ' ' : '';
            const newText = previousText + separator + currentMessage.text.slice(0, i + 1);
            setDisplayedText(newText);
            i++;
            if (i >= currentMessage.text.length) {
                clearInterval(interval);
                advanceTimeout = setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                }, 200);
            }
        }, currentMessage.speed);

        return () => {
            clearInterval(interval);
            if (advanceTimeout) clearTimeout(advanceTimeout);
        };
    }, [currentIndex, messages]);

    return <span>{displayedText}</span>;
};
