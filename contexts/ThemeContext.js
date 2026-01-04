'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// Function to get initial theme synchronously (for SSR-safe initialization)
function getInitialTheme() {
    if (typeof window === 'undefined') {
        return 'dark'; // Default to dark for SSR
    }
    try {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
    } catch (e) {
        // localStorage might not be available
    }
    return 'dark'; // Default to dark mode
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        // Ensure theme is synced with localStorage on mount
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
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
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

