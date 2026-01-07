'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, Lock, Search, Github } from 'lucide-react';
import ItemCard from './ItemCard';
import { contentData, aboutMeData } from '../../../data/data';
import { useTheme } from '../../../contexts/ThemeContext';

export default function CashShopView({ onClose, onPermissionError, data, commits }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Search functionality - filters items by title, description, and techTags
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return null; // No search query, return null to show categorized items
        }
        
        const query = searchQuery.toLowerCase().trim();
        return data.items.filter(item => {
            const titleMatch = item.title?.toLowerCase().includes(query);
            const descriptionMatch = item.description?.toLowerCase().includes(query);
            const techTagsMatch = item.techTags?.some(tag => 
                tag.toLowerCase().includes(query)
            );
            const categoryMatch = item.category?.toLowerCase().includes(query);
            
            return titleMatch || descriptionMatch || techTagsMatch || categoryMatch;
        });
    }, [data.items, searchQuery]);

    // Memoize filtered items to prevent recalculation on every render
    const popularItems = useMemo(() => {
        return data.items.filter(item => item.category === 'School Projects');
    }, [data.items]);

    const studentGovernmentItems = useMemo(() => {
        return data.items.filter(item => item.category === 'Student Government');
    }, [data.items]);

    const devOpsItems = useMemo(() => {
        return data.items.filter(item => item.category === 'DevOps Projects');
    }, [data.items]);

    const personalProjectsItems = useMemo(() => {
        return data.items.filter(item => item.category === 'Personal Projects');
    }, [data.items]);

    const handleProjectClick = useCallback((project) => {
        setSelectedProject(project);
    }, []);

    const handleBackToShop = useCallback(() => {
        setSelectedProject(null);
        setSearchQuery(''); // Clear search when going back
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    return (
        <>
            {/* Browser Chrome */}
            <div className={`rounded-t-xl border border-b-0 shrink-0 ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-[#f6f6f6] border-gray-200'}`}>
                {/* Title Bar */}
                <div className={`flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b relative ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button 
                            onClick={onClose} 
                            className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all cursor-pointer touch-manipulation"
                        ></button>
                        <button 
                            onClick={() => onPermissionError && onPermissionError("You cannot minimize when on this page.")} 
                            className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all cursor-pointer touch-manipulation"
                            title="Minimize"
                        />
                        <button 
                            onClick={() => onPermissionError && onPermissionError("You cannot maximize when on this page.")} 
                            className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all cursor-pointer touch-manipulation"
                            title="Maximize"
                        />
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 text-sm md:text-base font-medium px-2 truncate max-w-[60%] sm:max-w-none ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                        {selectedProject ? selectedProject.title : 'Projects'}
                    </div>
                    <button
                        onClick={onClose}
                        className={`transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 rounded ${isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Close
                    </button>
                </div>

                {/* Navigation & URL Bar */}
                <div className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 ${isDark ? 'border-b border-gray-700' : ''}`}>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        <button 
                            onClick={handleBackToShop}
                            disabled={!selectedProject}
                            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${!selectedProject 
                                ? (isDark ? 'text-gray-600/50 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed')
                                : (isDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-200')
                            }`}
                            title="Back"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                            disabled
                            className={`p-1 sm:p-1.5 rounded-lg transition-colors cursor-not-allowed ${isDark ? 'text-gray-600/50' : 'text-gray-300'}`}
                            title="Forward"
                        >
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                            onClick={() => {
                                if (selectedProject) {
                                    handleBackToShop();
                                }
                                // Force a re-render by clearing and resetting state
                                setSearchQuery('');
                                if (selectedProject) {
                                    setSelectedProject(null);
                                }
                            }}
                            className={`hidden sm:block p-1.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                            title="Reload"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className={`flex-1 flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-1.5 border min-w-0 ${isDark ? 'bg-[#2d2d2d] border-gray-600' : 'bg-white border-gray-200'}`}>
                        <Lock className={`w-3 h-3 sm:w-3 sm:h-3 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-sm md:text-base truncate ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                            portfolio.dev/projects{selectedProject ? `/${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}` : ''}
                        </span>
                    </div>
                </div>

                {/* Projects Header - Only show when no project is selected */}
                {!selectedProject && (
                    <div className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            {/* Desktop: Title and Stats */}
                            <div className={`hidden sm:flex sm:items-center ${isDark ? 'gap-2 sm:gap-6' : 'gap-4'}`}>
                                <h1 className={`text-base sm:text-lg md:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Projects</h1>
                                <div className={`px-3 py-1.5 border rounded-lg ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white border border-gray-200'}`}>
                                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-blue-400' : 'text-gray-600'}`}>{commits.toLocaleString()} Commits</span>
                                </div>
                            </div>
                            
                            {/* Mobile: Optimized Layout */}
                            <div className="sm:hidden w-full">
                                <div className={`flex flex-col ${isDark ? 'gap-2.5' : 'gap-3'}`}>
                                    {/* Title */}
                                    <h1 className={`text-sm font-semibold ${isDark ? 'leading-tight' : ''} ${isDark ? 'text-white' : 'text-gray-900'}`}>Projects</h1>
                                    
                                    {/* Stats */}
                                    <div className="flex items-center gap-2">
                                        <div className={`flex-1 rounded-lg px-3 py-2 border text-center ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                                            <div className={`text-[10px] mb-0.5 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Projects</div>
                                            <div className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-gray-900'}`}>{data.items ? data.items.length : 0}</div>
                                        </div>
                                        <div className={`flex-1 rounded-lg px-3 py-2 border text-center ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                                            <div className={`text-[10px] mb-0.5 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Commits</div>
                                            <div className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-gray-900'}`}>{commits.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Search Bar */}
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input 
                                            type="text" 
                                            placeholder="Search projects..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className={`flex-1 bg-transparent text-xs outline-none min-w-0 ${isDark ? 'text-white/80 placeholder:text-gray-500' : 'text-gray-700 placeholder:text-gray-400'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Desktop: Search */}
                            <div className={`hidden sm:flex items-center ${isDark ? 'gap-2 sm:gap-4' : 'gap-2'}`}>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className={`bg-transparent text-sm outline-none w-32 ${isDark ? 'text-white/70' : 'text-gray-600'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Projects Content */}
            <div className={`flex-1 rounded-b-xl border border-t-0 overflow-hidden flex ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                <AnimatePresence mode="wait">
                    {selectedProject ? (
                        /* Project Detail View */
                        <motion.div 
                            key="project-detail"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8"
                        >
                            <motion.button 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                onClick={handleBackToShop}
                                className={`mb-4 sm:mb-6 flex items-center gap-2 transition-colors text-sm sm:text-base ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Back to Projects</span>
                            </motion.button>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                className={`relative rounded-lg border p-4 sm:p-6 md:p-8 min-h-full flex flex-col ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}
                            >
                                {typeof selectedProject.content === 'function' ? selectedProject.content(isDark) : selectedProject.content}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="project-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex-1 flex overflow-hidden"
                        >
                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8">
                            {filteredItems !== null ? (
                                /* Search Results */
                                <div>
                                    <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        <Search className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-blue-400' : 'text-gray-500'}`} />
                                        <span>Search Results</span>
                                        <span className={`text-sm font-normal ${isDark ? 'text-blue-300/70' : 'text-gray-500'}`}>
                                            ({filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'})
                                        </span>
                                    </h2>
                                    {filteredItems.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                            {filteredItems.map((item) => (
                                                <ItemCard 
                                                    key={item.id}
                                                    item={item}
                                                    onClick={handleProjectClick}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No items found matching "{searchQuery}"</p>
                                            <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Try a different search term</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Categorized Items */
                                <>
                                    {/* School Projects Section */}
                                    <div className="mb-4 sm:mb-6 md:mb-8">
                                        <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-5 md:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            School Projects
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
                                                <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-5 md:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Student Government
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
                                        <div className="mb-4 sm:mb-6 md:mb-8">
                                            <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-5 md:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                DevOps Projects
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

                                    {/* Personal Projects Section */}
                                    {personalProjectsItems.length > 0 && (
                                        <div>
                                            <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-5 md:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Personal Projects
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                                {personalProjectsItems.map((item) => (
                                                    <ItemCard 
                                                        key={item.id}
                                                        item={item}
                                                        onClick={handleProjectClick}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Avatar Sidebar */}
                        <div className={`hidden lg:block w-72 xl:w-80 border-l p-6 overflow-y-auto ${isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="space-y-4">
                                {/* Avatar */}
                                <div className="text-center">
                                    <a 
                                        href="https://github.com/zedithx" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block cursor-pointer group"
                                        title="Visit GitHub Profile"
                                    >
                                        <div className={`rounded-lg p-2 border transition-colors mb-3 ${isDark ? 'bg-[#1a1a1a] border-gray-700 group-hover:border-blue-400/50' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                                            <div className="aspect-square relative">
                                                <img 
                                                    src="/background/avatars/Tech SiJun.jpg" 
                                                    alt="Character Avatar" 
                                                    className="w-full h-full object-cover rounded"
                                                    style={{ objectPosition: 'center 25%' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <h3 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>zedithx</h3>
                                            <Github className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                                        </div>
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="space-y-3">
                                    <div className={`rounded-lg p-4 border ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                                        <div className={`text-xs mb-1.5 ${isDark ? 'text-white/70' : 'text-gray-500'}`}>Projects</div>
                                        <div className={`text-xl font-semibold ${isDark ? 'text-blue-400' : 'text-gray-900'}`}>{data.items ? data.items.length : 0}</div>
                                    </div>
                                    <div className={`rounded-lg p-4 border ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                                        <div className={`text-xs mb-1.5 ${isDark ? 'text-white/70' : 'text-gray-500'}`}>Total Commits</div>
                                        <div className={`text-xl font-semibold ${isDark ? 'text-blue-400' : 'text-gray-900'}`}>{commits.toLocaleString()}</div>
                                    </div>
                                    <a 
                                        href="https://github.com/zedithx" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block w-full"
                                    >
                                        <button className={`w-full rounded-lg py-2.5 px-4 transition-colors flex items-center justify-center gap-2 font-medium text-sm ${isDark ? 'bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
                                            <Github className="w-4 h-4" />
                                            <span>Go to GitHub</span>
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}



