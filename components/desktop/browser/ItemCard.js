'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Medal, Award } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

// Item Card Component with enhanced animations - Memoized for performance
const ItemCard = React.memo(({ item, onClick }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isHovered, setIsHovered] = useState(false);
    
    const handleClick = useCallback(() => {
        onClick(item);
    }, [onClick, item]);
    
    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 15,
                delay: item.id * 0.1
            }}
            whileHover={{ 
                scale: 1.08,
                y: -8,
                transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleClick}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${isDark ? 'bg-[#1a1a1a] shadow-lg hover:shadow-xl hover:shadow-yellow-500/30' : 'bg-white shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300'}`}
            style={isDark ? { border: '1px solid rgba(255, 255, 255, 0.2)' } : {}}
        >
            
            {/* Glow effect on hover (desktop only) */}
            {isHovered && (
                <div
                    className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-gradient-to-br from-yellow-400/10 to-purple-500/10' : 'bg-gradient-to-br from-blue-50/50 to-purple-50/50'}`}
                    style={{ willChange: 'opacity' }}
                />
            )}
            
            
            {/* Item thumbnail area with clean MapleStory-style background */}
            <div className={`aspect-square bg-gradient-to-b ${item.thumbnail.gradient} flex items-center justify-center relative overflow-hidden`}>
                {/* Bounce animation for thumbnail - only on hover (desktop) */}
                <motion.div
                    className="relative z-10 w-full h-full flex items-center justify-center"
                    animate={isHovered ? {
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                    } : {
                        y: 0,
                        rotate: 0,
                        scale: 1
                    }}
                    transition={isHovered ? {
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: "easeInOut"
                    } : {
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                    style={{ willChange: isHovered ? 'transform' : 'auto' }}
                >
                    {item.thumbnail.type === 'image' && item.thumbnail.src ? (
                        <img 
                            src={item.thumbnail.src} 
                            alt={item.title}
                            className={`object-contain drop-shadow-2xl ${
                                item.title === 'Container Networking' 
                                    ? 'w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40' 
                                    : item.title === 'Monitoring Suite'
                                    ? 'w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24'
                                    : item.title === 'Tangled'
                                    ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md'
                                    : 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'
                            }`}
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-2xl">
                            {item.thumbnail.emoji}
                        </span>
                    )}
                </motion.div>
                
                {/* Technology Icons - In thumbnail area */}
                {item.techIcons && item.techIcons.length > 0 && (
                    <div className={`absolute bottom-2 left-2 right-2 flex items-center justify-center z-10 gap-1 sm:gap-1.5 md:gap-2`}>
                        {item.techIcons.slice(0, 3).map((tech, idx) => {
                            const isImagePath = typeof tech === 'string' && tech.startsWith('/');
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ 
                                        scale: 1.2, 
                                        rotate: 10, 
                                        y: -5
                                    }}
                                    transition={{ 
                                        delay: item.id * 0.1 + 0.3 + idx * 0.05,
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 25,
                                        scale: { type: "tween", duration: 0.15, ease: "easeOut" },
                                        rotate: { type: "tween", duration: 0.15, ease: "easeOut" },
                                        y: { type: "tween", duration: 0.15, ease: "easeOut" }
                                    }}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center overflow-hidden shadow-lg border-2 ${isDark ? 'bg-white/95 border-white/50' : 'bg-white border-gray-200'}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {isImagePath ? (
                                        <img 
                                            src={tech} 
                                            alt={tech.split('/').pop()} 
                                            className="w-full h-full object-contain p-1 sm:p-1 md:p-1.5"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="text-sm sm:text-base md:text-lg">⚙️</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
                
                {item.badge && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className={`absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full shadow-lg z-10 ${
                            item.badge === 'Hot' ? 'bg-red-500 text-white' :
                            item.badge === '3rd Place' ? 'bg-amber-700 text-white' :
                            item.badge === 'Top 3' ? 'bg-amber-700 text-white' :
                            item.badge === 'Top 2' ? 'bg-gray-400 text-white' :
                            'bg-green-500 text-white'
                        }`}
                    >
                        {(item.badge === '3rd Place' || item.badge === 'Top 3') && <Medal className="w-3.5 h-3.5" />}
                        {item.badge === 'Top 2' && <Award className="w-3.5 h-3.5" />}
                        {item.badge}
                    </motion.div>
                )}
            </div>
            
            {/* Bottom info section */}
            <div className={`p-2 sm:p-3 md:p-4 border-t ${isDark ? 'bg-[#1a1a1a] border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <h3 className={`${isDark ? 'text-white font-bold' : 'text-gray-900 font-semibold'} text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 truncate`}>{item.title}</h3>
                
                <div className="flex items-center justify-between">
                    <motion.div
                        whileHover={{ scale: 1.15, x: 2 }}
                        className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 lg:py-2.5 rounded-lg flex items-center ${isDark ? 'bg-white/10 border border-white/20 hover:bg-white/15' : 'bg-gray-100 border border-gray-300'}`}
                    >
                        <span className={`text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold whitespace-nowrap leading-none block ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                            {item.commits.toLocaleString()} Commits
                        </span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return prevProps.item.id === nextProps.item.id && 
           prevProps.item.commits === nextProps.item.commits;
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;