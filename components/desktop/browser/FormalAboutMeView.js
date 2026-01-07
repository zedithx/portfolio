'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCw, Lock, Briefcase, GraduationCap, Code, TrendingUp, Github, Linkedin, Gamepad2 } from 'lucide-react';
import { journeySummaryContent } from '../../../data/data';
import { useTheme } from '../../../contexts/ThemeContext';

export default function FormalAboutMeView({ onToggleToInformal, onClose }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    const sections = [
        {
            key: 'internshipBeforeUniversity',
            icon: Briefcase,
            title: 'Internship before University',
            content: journeySummaryContent.internshipBeforeUniversity.content
        },
        {
            key: 'university',
            icon: GraduationCap,
            title: 'University Life',
            content: journeySummaryContent.university.content
        },
        {
            key: 'internshipsInUniversity',
            icon: Code,
            title: 'Internships in University',
            content: journeySummaryContent.internshipsInUniversity.content
        },
        {
            key: 'whatsNext',
            icon: TrendingUp,
            title: "What's Next",
            content: journeySummaryContent.whatsNext.content
        }
    ];

    return (
        <>
            {/* Browser Chrome - Exact same as experience page */}
            <div className={`${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-[#f6f6f6] border-gray-200'} rounded-t-xl border border-b-0 shrink-0`}>
                {/* Title Bar */}
                <div className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} relative`}>
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onClose) {
                                    onClose();
                                }
                            }} 
                            className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all group flex items-center justify-center cursor-pointer touch-manipulation"
                        >
                            <X className="w-2.5 h-2.5 md:w-2 md:h-2 text-[#ff5f57] group-hover:text-red-800" />
                        </button>
                        <button 
                            className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all cursor-pointer touch-manipulation" 
                            title="Minimize"
                        />
                        <button 
                            className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all cursor-pointer touch-manipulation" 
                            title="Maximize"
                        />
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 text-sm md:text-base ${isDark ? 'text-white/80' : 'text-gray-600'} font-medium truncate max-w-[150px] md:max-w-none`}>
                        About Me
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onClose) {
                                onClose();
                            }
                        }}
                        className={`${isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors text-xs md:text-sm px-2 md:px-3 py-1 rounded`}
                    >
                        Close
                    </button>
                </div>

                {/* Navigation & URL Bar */}
                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2">
                    <div className="flex items-center gap-0.5 md:gap-1">
                        <button 
                            disabled
                            className={`p-1 md:p-1.5 rounded-lg transition-colors cursor-not-allowed ${isDark ? 'text-gray-600/50' : 'text-gray-300'}`}
                        >
                            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button 
                            disabled
                            className={`p-1 md:p-1.5 rounded-lg transition-colors cursor-not-allowed ${isDark ? 'text-gray-600/50' : 'text-gray-300'}`}
                        >
                            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button 
                            onClick={() => {
                                // Scroll to top
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`hidden sm:block p-1.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                            title="Reload"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className={`flex-1 flex items-center gap-1.5 md:gap-2 rounded-lg px-2 md:px-3 py-1.5 md:py-1.5 border min-w-0 ${isDark ? 'bg-[#2d2d2d] border-gray-600' : 'bg-white border-gray-200'}`}>
                        <Lock className={`w-3 h-3 md:w-3 md:h-3 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-sm md:text-base truncate ${isDark ? 'text-white/70' : 'text-gray-600'}`}>portfolio.dev/about-me</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center px-2 -mb-px">
                    <div className={`flex items-center gap-2 md:gap-2 px-3 md:px-4 py-2 md:py-2 rounded-t-lg border border-b-0 text-sm md:text-base ${isDark ? 'bg-[#2d2d2d] border-gray-700 border-b-[#2d2d2d]' : 'bg-white border-gray-200 border-b-white'}`}>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>About Me</span>
                    </div>
                </div>
            </div>

            {/* Browser Content */}
            <div className={`flex-1 rounded-b-xl border border-t-0 overflow-hidden flex flex-col ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                        {/* Header */}
                        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-2">
                                <div>
                                    <h1 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Si Jun Yang
                                    </h1>
                                    <p className={`text-xs sm:text-sm md:text-base mt-1 leading-snug ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Full-Stack / DevOps / Site Reliability Engineer
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (onToggleToInformal) {
                                            onToggleToInformal();
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border rounded-lg transition-colors w-full sm:w-auto justify-center mt-2 sm:mt-0 ${
                                        isDark 
                                            ? 'text-white/80 hover:text-white border-gray-600 hover:bg-gray-800/50' 
                                            : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>Interactive Journey</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Summary - Key for headhunters */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3 }}
                            className={`rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm border mb-4 sm:mb-5 md:mb-6 lg:mb-8 ${
                                isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-slate-200'
                            }`}
                        >
                            <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Professional Summary</h2>
                            <div className={`space-y-2.5 sm:space-y-3 text-xs sm:text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>
                                    <strong>Full-Stack/DevOps/Site Reliability Engineer</strong> with hands-on experience building production systems used by <strong>1,860+ merchants</strong> in Singapore. 
                                    Specialized in backend development, infrastructure automation, and site reliability engineering.
                                </p>
                                <p>
                                    <strong>Key Experience:</strong> Payment platform development (Reluvate Technologies), DevOps infrastructure (TSMC), 
                                    Site Reliability Engineering (ByteDance), and full-stack development for large-scale student events (SUTD).
                                </p>
                                <p>
                                    <strong>Technical Focus:</strong> Backend systems, DevOps automation, cloud infrastructure, SRE practices, 
                                    and production-facing tooling. Projects consistently ranked top three in cohort and received awards.
                                </p>
                            </div>
                        </motion.div>

                        {/* Experience Sections */}
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <motion.div
                                    key={section.key}
                                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                    transition={prefersReducedMotion ? {} : { duration: 0.3, delay: index * 0.05 }}
                                    className={`rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm border mb-4 sm:mb-5 md:mb-6 lg:mb-8 ${
                                        isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2 sm:mb-3 md:mb-4">
                                        <div className={`p-1 sm:p-1.5 md:p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                        </div>
                                        <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className={`text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {section.content}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Contact & Links */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2 }}
                            className={`rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm border ${
                                isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-slate-200'
                            }`}
                        >
                            <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Connect</h2>
                            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                                <a
                                    href="https://github.com/zedithx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm md:text-base ${
                                        isDark 
                                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    <span>GitHub</span>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/yangsijun"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm md:text-base ${
                                        isDark 
                                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

