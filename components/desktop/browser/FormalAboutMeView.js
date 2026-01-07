'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCw, Lock, Github, Linkedin, Gamepad2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export default function FormalAboutMeView({ onToggleToInformal, onClose }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

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
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className={`text-xl sm:text-2xl md:text-3xl font-semibold leading-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Si Jun Yang
                                    </h1>
                                    <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                                    className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium border rounded-lg transition-colors w-full sm:w-auto justify-center ${
                                        isDark 
                                            ? 'text-white/80 hover:text-white border-gray-600 hover:bg-gray-800/50' 
                                            : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Interactive Journey</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3 }}
                            className={`rounded-lg p-5 sm:p-6 md:p-8 border mb-6 sm:mb-8 ${
                                isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'
                            }`}
                        >
                            <div className={`space-y-5 sm:space-y-6 text-base sm:text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>
                                    I'm a Full-Stack and Site Reliability Engineer with hands-on experience building, operating, and scaling production systems across payments, automation, and large-scale infrastructure. My work spans backend development, cloud infrastructure, and reliability engineering, with a strong focus on systems that run in the real world.
                                </p>
                                
                                <p>
                                    I started my software engineering journey during military service, completing Harvard CS50 and Django-focused coursework before joining Reluvate Technologies as a Backend Engineer Intern. There, I worked on a production payment platform supporting 1,860+ merchants in Singapore, including Watsons, Zara, and KOI — gaining early exposure to payments, reliability, and real production constraints.
                                </p>
                                
                                <div className="space-y-3">
                                    <p>
                                        Since then, my experience has progressively deepened into automation, infrastructure, and SRE:
                                    </p>
                                    <ul className={`list-disc list-outside space-y-2.5 ml-6 sm:ml-7 md:ml-8 pl-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <li>At Changi Airport Group, I built Automation and Chatbot Safetyystems on serverless, event-driven architectures.</li>
                                        <li>At TSMC, I worked on Telemetry and DevOps/SRE infrastructure at industrial scale.</li>
                                        <li>At ByteDance, I focused on Site Reliability Engineering, including Monitoring, Automation, and Service Reliability for Large-Scale Systems.</li>
                                    </ul>
                                </div>
                                
                                <div className="space-y-3">
                                    <p>
                                        Alongside internships, I've been a core contributor to Student Government's Tech Department at the Singapore University of Technology and Design (SUTD), where I repeatedly shipped and operated production systems for campus-wide events. This included:
                                    </p>
                                    <ul className={`list-disc list-outside space-y-2.5 ml-6 sm:ml-7 md:ml-8 pl-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <li>Frontend event pages for major events (Night Fiesta, Orientation, LCC)</li>
                                        <li>An end-to-end RFID-based game carnival system, covering hardware sourcing, readers, backend services managing 60 game booths and 600 visitors</li>
                                        <li>Multiple Telegram bots for event operations and engagement such as Voting and Lucky Draws</li>
                                    </ul>
                                </div>
                                
                                <p>
                                    These experiences strengthened my ability to own systems end-to-end, from development to deployment to monitoring and system reliability.
                                </p>
                                
                                <p>
                                    I'm currently completing my final phase of studies at SUTD and preparing for a full-time role in Site Reliability Engineering. In parallel, I'm continuing to build and iterate on Tangled, a social startup, ahead of my full-time start.
                                </p>
                            </div>
                        </motion.div>

                        {/* Contact & Links */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2 }}
                            className={`rounded-lg p-5 sm:p-6 md:p-8 border ${
                                isDark ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'
                            }`}
                        >
                            <h2 className={`text-lg sm:text-xl font-semibold mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Connect</h2>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://github.com/zedithx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                                        isDark 
                                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>GitHub</span>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/yangsijun"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                                        isDark 
                                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
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

