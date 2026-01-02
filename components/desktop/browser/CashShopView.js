'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, Lock, Star, Share, ShoppingCart, Search } from 'lucide-react';
import ItemCard from './ItemCard';
import { contentData } from './data';

export default function CashShopView({ onClose, onPermissionError, data, commits }) {
    const [selectedProject, setSelectedProject] = useState(null);

    // Memoize filtered items to prevent recalculation on every render
    const popularItems = useMemo(() => {
        return data.items.filter(item => item.category === 'Popular');
    }, [data.items]);

    const studentGovernmentItems = useMemo(() => {
        return data.items.filter(item => item.category === 'Student Government');
    }, [data.items]);

    const devOpsItems = useMemo(() => {
        return data.items.filter(item => item.category === 'DevOps Projects');
    }, [data.items]);

    const handleProjectClick = useCallback((project) => {
        setSelectedProject(project);
    }, []);

    const handleBackToShop = useCallback(() => {
        setSelectedProject(null);
    }, []);

    return (
        <>
            {/* Browser Chrome */}
            <div className="bg-[#1a1a1a] rounded-t-xl border border-gray-700 border-b-0 shrink-0">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-700 relative">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"></button>
                        <button 
                            onClick={() => onPermissionError && onPermissionError("You cannot minimize when on this page.")} 
                            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all"
                        />
                        <button 
                            onClick={() => onPermissionError && onPermissionError("You cannot maximize when on this page.")} 
                            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all"
                        />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm text-white/80 font-medium px-2 truncate max-w-[60%] sm:max-w-none">
                        {selectedProject ? selectedProject.title : 'Cash Shop'}
                    </div>
                    <div className="w-12 sm:w-12"></div>
                </div>

                {/* Navigation & URL Bar */}
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 border-b border-gray-700">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        <button 
                            onClick={handleBackToShop}
                            disabled={!selectedProject}
                            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${!selectedProject ? 'text-gray-600/50 cursor-not-allowed' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                            title="Back"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                            disabled
                            className="p-1 sm:p-1.5 rounded-lg transition-colors text-gray-600/50 cursor-not-allowed"
                            title="Forward"
                        >
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                            onClick={() => {
                                if (selectedProject) {
                                    handleBackToShop();
                                }
                            }}
                            className="hidden sm:block p-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            title="Reload"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center gap-1.5 sm:gap-2 bg-[#2d2d2d] rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-600 min-w-0">
                        <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500 shrink-0" />
                        <span className="text-[10px] sm:text-sm text-white/70 truncate">
                            portfolio.dev/projects{selectedProject ? `/${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}` : ''}
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <Share className="w-4 h-4 text-white/50 cursor-pointer hover:text-white/70" />
                        <Star className="w-4 h-4 text-white/50 cursor-pointer hover:text-white/70" />
                    </div>
                </div>

                {/* Cash Shop Header - Only show when no project is selected */}
                {!selectedProject && (
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#1a1a1a] border-b border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            {/* Desktop: Title and Commits Row */}
                            <div className="hidden sm:flex sm:items-center gap-2 sm:gap-6">
                                <h1 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400">Cash Shop</h1>
                                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                                    <span className="text-yellow-400 text-xs sm:text-sm">💎</span>
                                    <span className="text-yellow-300 text-xs sm:text-sm font-semibold">{commits.toLocaleString()} Commits</span>
                                </div>
                            </div>
                            
                            {/* Mobile: Left (Search/Commits/Cart) and Right (Avatar/Stats) */}
                            <div className="sm:hidden w-full">
                                <div className="flex flex-col gap-2 sm:gap-3">
                                    {/* Title */}
                                    <h1 className="text-sm sm:text-base font-bold text-yellow-400">Cash Shop</h1>
                                    
                                    {/* Main content: Left and Right sections */}
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        {/* Left Side: Commits, Cart, then Search */}
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                            {/* Commits Counter and Cart Row - Responsive size */}
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                {/* Commits Counter - Responsive */}
                                                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg min-w-0">
                                                    <span className="text-yellow-400 text-xs sm:text-sm flex-shrink-0">💎</span>
                                                    <span className="text-yellow-300 text-xs sm:text-sm font-semibold truncate">
                                                        {commits.toLocaleString()}
                                                        <span className="hidden min-[340px]:inline"> Commits</span>
                                                    </span>
                                                </div>
                                                {/* Shopping Cart - Responsive */}
                                                <button className="relative p-2.5 sm:p-3.5 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex-shrink-0">
                                                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                                                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full text-[10px] sm:text-xs text-white flex items-center justify-center">0</span>
                                                </button>
                                            </div>
                                            {/* Search Bar - Responsive width and size */}
                                            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 bg-gray-800 rounded-lg border border-gray-700 w-40 sm:w-48">
                                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Search..." 
                                                    className="flex-1 bg-transparent text-white/70 text-sm sm:text-base outline-none"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Right Side: Avatar and Stats */}
                                        <div className="flex items-start gap-1.5 sm:gap-2 ml-auto">
                                            {/* Avatar - Responsive size */}
                                            <div className="bg-[#1a1a1a] rounded-lg p-1.5 sm:p-2 border border-gray-700 flex-shrink-0 self-stretch flex items-center justify-center">
                                                <div className="w-12 h-full sm:w-16 relative flex items-center justify-center">
                                                    <img 
                                                        src="/projects/avatar/avatar.png" 
                                                        alt="Character Avatar" 
                                                        className="w-full h-full object-contain max-h-full"
                                                    />
                                                </div>
                                            </div>
                                            {/* Stats - Responsive */}
                                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                                <div className="bg-[#1a1a1a] rounded-lg p-1.5 sm:p-2 border border-gray-700 text-center min-w-[50px] sm:min-w-[60px]">
                                                    <div className="text-white/70 text-[9px] sm:text-[10px] mb-0.5">Projects</div>
                                                    <div className="text-yellow-400 text-xs sm:text-sm font-bold">{data.items ? data.items.length : 0}</div>
                                                </div>
                                                <div className="bg-[#1a1a1a] rounded-lg p-1.5 sm:p-2 border border-gray-700 text-center min-w-[50px] sm:min-w-[60px]">
                                                    <div className="text-white/70 text-[9px] sm:text-[10px] mb-0.5">Commits</div>
                                                    <div className="text-yellow-400 text-xs sm:text-sm font-bold">{commits.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Desktop: Search and Cart */}
                            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search items..." 
                                        className="bg-transparent text-white/70 text-sm outline-none w-32"
                                    />
                                </div>
                                <button className="relative p-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">0</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Cash Shop Content */}
            <div className="flex-1 bg-[#1a1a1a] rounded-b-xl border border-gray-700 border-t-0 overflow-hidden flex">
                {selectedProject ? (
                    /* Project Detail View */
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                        <button 
                            onClick={handleBackToShop}
                            className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm md:text-base"
                        >
                            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span>Back to Shop</span>
                        </button>
                        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                            {selectedProject.content}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
                            {/* Popular Items Section */}
                            <div className="mb-4 sm:mb-6 md:mb-8">
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl">⭐</span>
                                    <span>Popular Items</span>
                                    <span className="text-lg sm:text-xl">✨</span>
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                    {popularItems.map((item) => (
                                        <ItemCard 
                                            key={item.id}
                                            item={item}
                                            onClick={handleProjectClick}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Student Government Section */}
                            {studentGovernmentItems.length > 0 && (
                                <div className="mb-4 sm:mb-6 md:mb-8">
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">🎓</span>
                                        <span>Student Government</span>
                                        <span className="text-lg sm:text-xl">📚</span>
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                        {studentGovernmentItems.map((item) => (
                                            <ItemCard 
                                                key={item.id}
                                                item={item}
                                                onClick={handleProjectClick}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* DevOps Projects Section */}
                            {devOpsItems.length > 0 && (
                                <div>
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">⚙️</span>
                                        <span>DevOps Projects</span>
                                        <span className="text-lg sm:text-xl">🔧</span>
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                        {devOpsItems.map((item) => (
                                            <ItemCard 
                                                key={item.id}
                                                item={item}
                                                onClick={handleProjectClick}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Avatar Sidebar */}
                        <div className="hidden lg:block w-72 xl:w-80 bg-[#2d2d2d] border-l border-gray-700 p-4 xl:p-6 overflow-y-auto">
                            <div className="text-center mb-4">
                                <h3 className="text-white font-bold text-lg mb-2">zedithx</h3>
                                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-700">
                                    <div className="aspect-square relative">
                                        <img 
                                            src="/projects/avatar/avatar.png" 
                                            alt="Character Avatar" 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-gray-700">
                                    <div className="text-white/70 text-xs mb-1">Projects</div>
                                    <div className="text-yellow-400 text-lg font-bold">{data.items ? data.items.length : 0}</div>
                                </div>
                                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-gray-700">
                                    <div className="text-white/70 text-xs mb-1">Total Commits</div>
                                    <div className="text-yellow-400 text-lg font-bold">{commits.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}


