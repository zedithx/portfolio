'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Medal, Award, Settings } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

// Item Card Component with enhanced animations - Memoized for performance
const ItemCard = React.memo(({ item, onClick }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isHovered, setIsHovered] = useState(false);
    const isFeatured = Boolean(item.featured);
    const thumbnailBackgroundClass = isFeatured
        ? 'bg-gradient-to-br from-[#F7F3EC] via-[#FCFAF5] to-[#ECE6DD]'
        : `bg-gradient-to-b ${item.thumbnail.gradient}`;
    const techIconContainerClass = isFeatured
        ? 'bg-white/95 border-[#DED6CC]'
        : (isDark ? 'bg-white/95 border-white/50' : 'bg-white border-gray-200');
    const cardChromeClass = isDark
        ? (isFeatured ? 'bg-[#1a1a1a] shadow-lg hover:shadow-xl hover:shadow-[#67A2B9]/20' : 'bg-[#1a1a1a] shadow-lg hover:shadow-xl hover:shadow-yellow-500/30')
        : (isFeatured ? 'bg-white shadow-md hover:shadow-lg border border-[#EEE7DF]' : 'bg-white shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300');
    const hoverGlowClass = isFeatured
        ? (isDark ? 'bg-[#67A2B9]/5' : 'bg-gradient-to-br from-[#67A2B9]/8 via-[#F5BB00]/8 to-[#FF7337]/8')
        : (isDark ? 'bg-gradient-to-br from-yellow-400/10 to-purple-500/10' : 'bg-gradient-to-br from-blue-50/50 to-purple-50/50');
    const cardStyle = isDark
        ? { border: isFeatured ? '1px solid rgba(103, 162, 185, 0.35)' : '1px solid rgba(255, 255, 255, 0.2)', transition: 'transform 0s ease-out' }
        : { transition: 'transform 0s ease-out' };
    const featuredRingClass = isFeatured ? (isDark ? 'ring-1 ring-[#67A2B9]/45' : 'ring-1 ring-[#67A2B9]/25') : '';
    const thumbnailContentClass = isFeatured ? 'relative z-10 w-full h-full flex items-center justify-center pb-14' : 'relative z-10 w-full h-full flex items-center justify-center';
    const techIconRowClass = isFeatured
        ? 'absolute bottom-3 left-3 right-3 flex items-center justify-center z-10 gap-2'
        : 'absolute bottom-2 left-2 right-2 flex items-center justify-center z-10 gap-1 sm:gap-1.5 md:gap-2';
    const techIconSizeClass = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16';
    const entranceDelay = isFeatured ? 0.02 : Math.min(item.id * 0.035, 0.24);
    const techIconDelayBase = isFeatured ? 0.06 : entranceDelay + 0.18;
    
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
                delay: entranceDelay,
                scale: { type: 'tween', duration: 0 },
                y: { type: 'tween', duration: 0 }
            }}
            whileHover={{ 
                scale: isFeatured ? 1.03 : 1.08,
                y: isFeatured ? -4 : -8,
                transition: { type: 'tween', duration: 0.2, ease: 'easeOut' }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleClick}
            className={`relative rounded-lg overflow-hidden cursor-pointer flex flex-col ${cardChromeClass} ${featuredRingClass}`}
            style={cardStyle}
        >
            
            {/* Glow effect on hover (desktop only) */}
            {isHovered && (
                <div
                    className={`absolute inset-0 pointer-events-none ${hoverGlowClass}`}
                    style={{ willChange: 'opacity' }}
                />
            )}
            
            
            {/* Item thumbnail area with clean MapleStory-style background */}
            <div className={`aspect-square ${thumbnailBackgroundClass} flex items-center justify-center relative overflow-hidden`}>
                {isFeatured && (
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                        <img
                            src="/experience/tangled_green_stroke.svg"
                            alt=""
                            className="absolute -left-14 -top-8 h-40 w-28 rotate-[-18deg] opacity-35"
                            loading="eager"
                            decoding="async"
                        />
                        <img
                            src="/experience/tangled_yellow_stroke.svg"
                            alt=""
                            className="absolute -right-14 -top-10 h-44 w-32 rotate-[12deg] opacity-35"
                            loading="eager"
                            decoding="async"
                        />
                        <div className="absolute -left-12 bottom-5 h-28 w-40 rotate-[22deg] rounded-[999px] border-[5px] border-[#67A2B9]/28 border-r-transparent border-t-transparent" />
                        <div className="absolute -right-12 bottom-7 h-24 w-36 rotate-[-18deg] rounded-[999px] border-[5px] border-[#FF7337]/30 border-l-transparent border-t-transparent" />
                    </div>
                )}
                {/* Bounce animation for thumbnail - only on hover (desktop) */}
                <motion.div
                    className={thumbnailContentClass}
                    animate={isHovered && !isFeatured ? {
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
                        duration: 0,
                        ease: "easeOut"
                    }}
                    style={{ willChange: isHovered ? 'transform' : 'auto' }}
                >
                    {item.thumbnail.type === 'image' && item.thumbnail.src ? (
                        <img 
                            src={item.thumbnail.src} 
                            alt={item.title}
                            className={`drop-shadow-2xl ${
                                item.title === 'Container Networking' 
                                    ? 'w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain' 
                                    : item.title === 'Monitoring Suite'
                                    ? 'w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 object-contain'
                                    : item.title === 'Tangled'
                                    ? 'w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 object-contain rounded-xl shadow-[0_18px_34px_-24px_rgba(16,24,40,0.65)]'
                                    : item.title === '3DC Admin Website'
                                    ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain rounded-md'
                                    : 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain'
                            }`}
                            loading={isFeatured ? 'eager' : 'lazy'}
                            fetchPriority={isFeatured ? 'high' : 'auto'}
                            decoding="async"
                        />
                    ) : (
                        <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-2xl">
                            {item.thumbnail.emoji}
                        </span>
                    )}
                </motion.div>
                
                {/* Technology Icons - In thumbnail area */}
                {item.techIcons && item.techIcons.length > 0 && (
                    <div className={techIconRowClass}>
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
                                        delay: techIconDelayBase + idx * 0.04,
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 25,
                                        scale: { type: "tween", duration: 0.15, ease: "easeOut" },
                                        rotate: { type: "tween", duration: 0.15, ease: "easeOut" },
                                        y: { type: "tween", duration: 0.15, ease: "easeOut" }
                                    }}
                                    className={`${techIconSizeClass} rounded-lg flex items-center justify-center overflow-hidden shadow-lg border-2 ${techIconContainerClass}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {isImagePath ? (
                                        <img 
                                            src={tech} 
                                            alt={tech.split('/').pop()} 
                                            className="w-full h-full object-contain p-1.5"
                                            loading={isFeatured ? 'eager' : 'lazy'}
                                            fetchPriority={isFeatured ? 'high' : 'auto'}
                                            decoding="async"
                                        />
                                    ) : (
                                        <Settings className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
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
                            item.badge === 'Full Marks' ? 'bg-yellow-500 text-white' :
                            item.badge === '4k+ users' ? 'bg-[#67A2B9] text-white' :
                            'bg-green-500 text-white'
                        }`}
                    >
                        {(item.badge === '3rd Place' || item.badge === 'Top 3') && <Medal className="w-3.5 h-3.5" />}
                        {item.badge === 'Top 2' && <Award className="w-3.5 h-3.5" />}
                        {item.badge === 'Full Marks' && <Award className="w-3.5 h-3.5" />}
                        {item.badge}
                    </motion.div>
                )}
            </div>
            
            {/* Bottom info section - flex column to ensure commits button aligns */}
            <div className={`p-2 sm:p-3 md:p-4 border-t flex flex-col flex-1 ${isDark ? 'bg-[#1a1a1a] border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <h3 className={`${isDark ? 'text-white font-bold' : 'text-gray-900 font-semibold'} text-xs sm:text-sm md:text-base mb-1 sm:mb-1.5 truncate`}>{item.title}</h3>
                
                {/* Description - summary with fixed min-height to balance cards */}
                <div className="flex-1 min-h-[2.5rem] sm:min-h-[2.75rem] md:min-h-[3rem] mb-2 sm:mb-2.5">
                    {item.description && (
                        <p className={`text-[10px] sm:text-[11px] md:text-xs leading-tight ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                            {item.description}
                        </p>
                    )}
                </div>
                
                <div className="flex items-center justify-between mt-auto">
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
