'use client';
import React from 'react';

export default function MenuItem({ item, onClick }) {
    if (item.type === 'divider') {
        return <div className="h-[1px] bg-white/10 my-1 mx-1" />;
    }

    if (item.type === 'disabled') {
        return (
            <div className="px-4 py-1 text-white/30 text-[13px] cursor-default">
                {item.label}
            </div>
        );
    }

    return (
        <div
            onClick={() => onClick && onClick(item)}
            className={`px-4 py-1 text-white text-[13px] hover:bg-blue-600 cursor-default flex justify-between items-center ${
                item.checked ? 'flex items-center gap-2' : ''
            }`}
        >
            <div className="flex items-center gap-2">
                {item.checked && <span className="text-[10px]">✓</span>}
                <span>{item.label}</span>
            </div>
            {item.badge && (
                <span className="bg-white/10 px-2 rounded-full text-[11px] text-white/50">
                    {item.badge}
                </span>
            )}
            {item.shortcut && (
                <span className="text-white/40 text-[11px]">{item.shortcut}</span>
            )}
            {item.arrow && (
                <span className="text-white/40">›</span>
            )}
        </div>
    );
}
