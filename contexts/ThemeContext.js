'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Load theme from localStorage on mount
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            setTheme(savedTheme);
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

