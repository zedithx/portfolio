'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark'); // Always start with 'dark' for SSR consistency

    useEffect(() => {
        // Only run on client after mount
        setMounted(true);
        
        try {
            const savedTheme = localStorage.getItem('portfolio-theme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setTheme(savedTheme);
            } else {
                // If no saved theme, default to dark and save it
                setTheme('dark');
                localStorage.setItem('portfolio-theme', 'dark');
            }
        } catch (e) {
            // localStorage might not be available, keep default 'dark'
        }
    }, []);

    const toggleTheme = (newTheme) => {
        if (newTheme === 'dark' || newTheme === 'light') {
            setTheme(newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

