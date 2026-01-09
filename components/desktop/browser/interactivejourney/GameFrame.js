'use client';
import React from 'react';

export default function GameFrame({ children, className = '', style = {} }) {
    const defaultStyle = {
        background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
        border: '3px solid #ffd700',
        borderRadius: '16px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.5)'
    };

    return (
        <div className={`relative ${className}`} style={{ ...defaultStyle, ...style }}>
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-400 opacity-60" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-400 opacity-60" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-400 opacity-60" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-400 opacity-60" />
            {children}
        </div>
    );
}
