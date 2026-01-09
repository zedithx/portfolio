'use client';
import React from 'react';

export default function TerminalHistory({ isDark, history }) {
    return (
        <>
            {history.map((item, index) => (
                <div key={index} className="mb-2">
                    {item.type === 'input' && (
                        <div className="flex items-start gap-2 mb-1">
                            <span className={`font-medium text-[14px] sm:text-sm whitespace-nowrap leading-5 shrink-0 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                                <span className="hidden sm:inline">(base) zedithx@Yangs-Macbook-Pro ~ %</span>
                                <span className="sm:hidden">(base) zedithx@Macbook ~ %</span>
                            </span>
                            <span className={`text-[14px] sm:text-sm break-all leading-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.content}</span>
                        </div>
                    )}
                    {item.type === 'error' && (
                        <p className={`ml-0 leading-5 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{item.content}</p>
                    )}
                    {item.type === 'success' && (
                        <p className={`ml-0 leading-5 ${isDark ? 'text-green-400' : 'text-blue-700'}`}>{item.content}</p>
                    )}
                </div>
            ))}
        </>
    );
}
