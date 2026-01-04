'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, Lock, Search, Github } from 'lucide-react';
import ItemCard from './ItemCard';
import { contentData, aboutMeData } from '../../../data/data';

export default function CashShopView({ onClose, onPermissionError, data, commits }) {
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
        setSearchQuery(''); // Clear search when going back
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    return (
        <>
            {/* Browser Chrome */}
            <div className="bg-[#f6f6f6] rounded-t-xl border border-gray-200 border-b-0 shrink-0">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 relative">
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
                    <div className="absolute left-1/2 -translate-x-1/2 text-sm md:text-base text-gray-600 font-medium px-2 truncate max-w-[60%] sm:max-w-none">
                        {selectedProject ? selectedProject.title : 'Projects'}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>

                {/* Navigation & URL Bar */}
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        <button 
                            onClick={handleBackToShop}
                            disabled={!selectedProject}
                            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${!selectedProject ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                            title="Back"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                            disabled
                            className="p-1 sm:p-1.5 rounded-lg transition-colors text-gray-300 cursor-not-allowed"
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
                            className="hidden sm:block p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
                            title="Reload"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center gap-1.5 sm:gap-2 bg-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-1.5 border border-gray-200 min-w-0">
                        <Lock className="w-3 h-3 sm:w-3 sm:h-3 text-gray-400 shrink-0" />
                        <span className="text-sm md:text-base text-gray-600 truncate">
                            portfolio.dev/projects{selectedProject ? `/${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}` : ''}
                        </span>
                    </div>
                </div>

                {/* Projects Header - Only show when no project is selected */}
                {!selectedProject && (
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            {/* Desktop: Title and Stats */}
                            <div className="hidden sm:flex sm:items-center gap-2 sm:gap-6">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Projects</h1>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                                    <span className="text-blue-600 text-xs sm:text-sm font-medium">{commits.toLocaleString()} Commits</span>
                                </div>
                            </div>
                            
                            {/* Mobile: Optimized Layout */}
                            <div className="sm:hidden w-full">
                                <div className="flex flex-col gap-2.5">
                                    {/* Title */}
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-sm font-semibold text-gray-900 leading-tight">Projects</h1>
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <div className="bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-200 text-center flex-1">
                                                <div className="text-gray-500 text-[8px] mb-0.5 leading-tight whitespace-nowrap">Projects</div>
                                                <div className="text-blue-600 text-xs font-semibold leading-tight">{data.items ? data.items.length : 0}</div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-200 text-center flex-1">
                                                <div className="text-gray-500 text-[8px] mb-0.5 leading-tight whitespace-nowrap">Commits</div>
                                                <div className="text-blue-600 text-xs font-semibold leading-tight">{commits.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Search Bar - Full width with better styling */}
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 w-full hover:border-gray-300 transition-colors">
                                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input 
                                            type="text" 
                                            placeholder="Search projects..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="flex-1 bg-transparent text-gray-700 text-xs placeholder:text-gray-400 outline-none min-w-0"
                                        />
                                    </div>
                                    
                                    {/* Go to GitHub Button - Mobile */}
                                    <a 
                                        href="https://github.com/zedithx" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block w-full mt-1.5"
                                    >
                                        <button className="w-full bg-blue-50 active:bg-blue-100 border border-blue-200 active:border-blue-300 rounded-lg px-3 py-2.5 transition-colors flex items-center justify-center gap-2 text-blue-600 active:text-blue-700 font-semibold text-[11px] min-h-[40px] touch-manipulation">
                                            <Github className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">Go to GitHub</span>
                                        </button>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Desktop: Search */}
                            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="bg-transparent text-gray-600 text-sm outline-none w-32"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Projects Content */}
            <div className="flex-1 bg-white rounded-b-xl border border-gray-200 border-t-0 overflow-hidden flex">
                {selectedProject ? (
                    /* Project Detail View */
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                        <button 
                            onClick={handleBackToShop}
                            className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 transition-colors text-xs sm:text-sm md:text-base text-blue-600 hover:text-blue-700"
                        >
                            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span>Back to Projects</span>
                        </button>
                        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                            {selectedProject.content}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
                            {filteredItems !== null ? (
                                /* Search Results */
                                <div>
                                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                        <span>Search Results</span>
                                        <span className="text-sm font-normal text-gray-500">
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
                                            <p className="text-gray-600 text-sm sm:text-base">No items found matching "{searchQuery}"</p>
                                            <p className="text-gray-500 text-xs sm:text-sm mt-2">Try a different search term</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Categorized Items */
                                <>
                                    {/* Popular Items / Featured Projects Section */}
                                    <div className="mb-4 sm:mb-6 md:mb-8">
                                        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                            Featured Projects
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
                                                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">
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
                                        <div>
                                            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">
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
                                </>
                            )}
                        </div>

                        {/* Avatar Sidebar */}
                        <div className="hidden lg:block w-72 xl:w-80 bg-gray-50 border-l border-gray-200 p-4 xl:p-6 overflow-y-auto">
                            <div className="text-center mb-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <a 
                                        href="https://github.com/zedithx" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                                        title="Visit GitHub Profile"
                                    >
                                        <h3 className="font-semibold text-lg">zedithx</h3>
                                    </a>
                                    <a 
                                        href="https://github.com/zedithx" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-900 hover:text-blue-600 transition-colors"
                                        title="Visit GitHub Profile"
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                </div>
                                <a 
                                    href="https://github.com/zedithx" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block cursor-pointer group"
                                    title="Visit GitHub Profile"
                                >
                                    <div className="bg-white rounded-lg p-4 border border-gray-200 transition-colors group-hover:border-blue-300">
                                        <div className="aspect-square relative">
                                            <img 
                                                src="/background/avatars/Tech SiJun.jpg" 
                                                alt="Character Avatar" 
                                                className="w-full h-full object-cover rounded group-hover:opacity-90 transition-opacity"
                                                style={{ objectPosition: 'center 25%' }}
                                            />
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="text-gray-600 text-xs mb-1">Projects</div>
                                    <div className="text-blue-600 text-lg font-semibold">{data.items ? data.items.length : 0}</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="text-gray-600 text-xs mb-1">Total Commits</div>
                                    <div className="text-blue-600 text-lg font-semibold">{commits.toLocaleString()}</div>
                                </div>
                                <a 
                                    href="https://github.com/zedithx" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <button className="w-full rounded-lg p-3 transition-colors flex items-center justify-center gap-2 font-semibold bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700">
                                        <Github className="w-4 h-4" />
                                        <span>Go to GitHub</span>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}



