'use client';
import React, { useState, useEffect } from 'react';

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
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex >= messages.length) {
            if (onComplete && !isComplete) {
                setIsComplete(true);
                onComplete();
            }
            return;
        }

        const currentMessage = messages[currentIndex];
        const previousText = messages.slice(0, currentIndex).reduce((acc, msg) => {
            return acc + msg.text + '\n';
        }, '');
        let i = 0;
        
        const interval = setInterval(() => {
            const newText = previousText + currentMessage.text.slice(0, i + 1);
            setDisplayedText(newText);
            i++;
            if (i >= currentMessage.text.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                }, 200);
            }
        }, currentMessage.speed);

        return () => clearInterval(interval);
    }, [currentIndex, messages, onComplete, isComplete]);

    return <span style={{ whiteSpace: 'pre-line' }}>{displayedText}</span>;
};
