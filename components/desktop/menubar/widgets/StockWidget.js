'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function StockWidget() {
    const stocks = [
        { symbol: 'DOW', price: '48,493', change: '-217.90', isPositive: false },
        { symbol: 'S&P 500', price: '6,901', change: '-29.07', isPositive: false },
        { symbol: 'AAPL', price: '273.83', change: '+0.43', isPositive: true },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-5 sm:border sm:border-white/10 shadow-xl"
        >
            <div className="space-y-2 sm:space-y-2.5">
                {stocks.map((stock, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <span className="text-white text-xs sm:text-sm md:text-base font-semibold">{stock.symbol}</span>
                        <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] sm:text-xs ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {stock.isPositive ? '▲' : '▼'}
                            </span>
                            <span className="text-white text-xs sm:text-sm md:text-base">{stock.price}</span>
                        </div>
                        <span className={`text-[10px] sm:text-xs ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
