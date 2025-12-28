'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCw, Lock, Star, Share, Plus } from 'lucide-react';

const contentData = {
    background: {
        title: 'About Me',
        pages: [{
            title: 'Background',
            content: (
                <div className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl shadow-xl">
                            👨‍💻
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">John Developer</h1>
                            <p className="text-lg text-gray-500 mt-1">Full Stack Developer & Designer</p>
                            <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">React</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Node.js</span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">TypeScript</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                            I'm a passionate developer with 5+ years of experience crafting beautiful, 
                            performant web applications. I specialize in building products that users love, 
                            with a keen eye for design and user experience.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            My journey started when I built my first website at 15. Since then, I've worked 
                            with startups and established companies, helping them bring their visions to life 
                            through code.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-blue-600">50+</div>
                            <div className="text-sm text-blue-600/70 mt-1">Projects Completed</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">5+</div>
                            <div className="text-sm text-green-600/70 mt-1">Years Experience</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-purple-600">30+</div>
                            <div className="text-sm text-purple-600/70 mt-1">Happy Clients</div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>
                        <div className="flex gap-4">
                            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                📧 Email Me
                            </a>
                            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                                💼 LinkedIn
                            </a>
                            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                🐙 GitHub
                            </a>
                        </div>
                    </div>
                </div>
            )
        }]
    },
    projects: {
        title: 'Projects',
        pages: [
            {
                title: 'E-Commerce Platform',
                content: (
                    <div className="space-y-6">
                        <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-8xl shadow-xl">
                            🛒
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">E-Commerce Platform</h2>
                        <p className="text-gray-600 leading-relaxed">
                            A full-featured e-commerce platform built with React, Node.js, and PostgreSQL. 
                            Features include real-time inventory management, payment processing with Stripe, 
                            and a beautiful responsive design.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">React</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Node.js</span>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">PostgreSQL</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Stripe</span>
                        </div>
                    </div>
                )
            },
            {
                title: 'Task Management App',
                content: (
                    <div className="space-y-6">
                        <div className="aspect-video bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-8xl shadow-xl">
                            ✅
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Task Management App</h2>
                        <p className="text-gray-600 leading-relaxed">
                            A collaborative task management application with real-time updates, 
                            drag-and-drop functionality, and team workspaces. Built to help teams 
                            stay organized and productive.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Next.js</span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Firebase</span>
                            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">Tailwind</span>
                        </div>
                    </div>
                )
            },
            {
                title: 'AI Writing Assistant',
                content: (
                    <div className="space-y-6">
                        <div className="aspect-video bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-8xl shadow-xl">
                            🤖
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">AI Writing Assistant</h2>
                        <p className="text-gray-600 leading-relaxed">
                            An AI-powered writing assistant that helps users create better content. 
                            Features include grammar checking, tone adjustment, and content suggestions 
                            powered by GPT-4.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Python</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">OpenAI</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">FastAPI</span>
                        </div>
                    </div>
                )
            }
        ]
    },
    experience: {
        title: 'Experience',
        pages: [
            {
                title: 'Senior Developer at TechCorp',
                content: (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl shadow-lg">
                                🏢
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Senior Full Stack Developer</h2>
                                <p className="text-gray-500">TechCorp Inc. • 2022 - Present</p>
                            </div>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-500 mt-1">▹</span>
                                Led a team of 5 developers in building a new customer portal
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-500 mt-1">▹</span>
                                Reduced page load times by 60% through optimization
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-500 mt-1">▹</span>
                                Implemented CI/CD pipelines reducing deployment time by 80%
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-500 mt-1">▹</span>
                                Mentored junior developers and conducted code reviews
                            </li>
                        </ul>
                    </div>
                )
            },
            {
                title: 'Developer at StartupXYZ',
                content: (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-3xl shadow-lg">
                                🚀
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Full Stack Developer</h2>
                                <p className="text-gray-500">StartupXYZ • 2020 - 2022</p>
                            </div>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-1">▹</span>
                                Built the entire frontend architecture from scratch
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-1">▹</span>
                                Developed RESTful APIs serving 100k+ daily requests
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-1">▹</span>
                                Integrated third-party services including payments and analytics
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 mt-1">▹</span>
                                Helped scale the product from 0 to 10,000 users
                            </li>
                        </ul>
                    </div>
                )
            },
            {
                title: 'Junior Developer at WebAgency',
                content: (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-3xl shadow-lg">
                                💼
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Junior Web Developer</h2>
                                <p className="text-gray-500">WebAgency • 2018 - 2020</p>
                            </div>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="text-purple-500 mt-1">▹</span>
                                Developed responsive websites for 20+ clients
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-purple-500 mt-1">▹</span>
                                Learned modern frameworks and best practices
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-purple-500 mt-1">▹</span>
                                Collaborated with designers to implement pixel-perfect UIs
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-purple-500 mt-1">▹</span>
                                Maintained and updated existing client websites
                            </li>
                        </ul>
                    </div>
                )
            }
        ]
    }
};

export default function BrowserModal({ type, onClose }) {
    const [currentPage, setCurrentPage] = useState(0);
    const data = contentData[type];
    const totalPages = data.pages.length;

    const goNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goPrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-full max-w-4xl h-full max-h-[90vh] md:max-h-[85vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Browser Chrome */}
                    <div className="bg-[#f6f6f6] rounded-t-xl border border-gray-200 border-b-0 shrink-0">
                        {/* Title Bar */}
                        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 relative">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all group flex items-center justify-center">
                                    <X className="w-2 h-2 text-[#ff5f57] group-hover:text-red-800" />
                                </button>
                                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 text-[10px] md:text-sm text-gray-600 font-medium truncate max-w-[150px] md:max-w-none">
                                {data.pages[currentPage].title}
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-gray-400">
                                <Plus className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:text-gray-600" />
                            </div>
                        </div>

                        {/* Navigation & URL Bar */}
                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2">
                            <div className="flex items-center gap-0.5 md:gap-1">
                                <button 
                                    onClick={goPrev}
                                    disabled={currentPage === 0}
                                    className={`p-1 md:p-1.5 rounded-lg transition-colors ${currentPage === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                                <button 
                                    onClick={goNext}
                                    disabled={currentPage === totalPages - 1}
                                    className={`p-1 md:p-1.5 rounded-lg transition-colors ${currentPage === totalPages - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                                <button className="hidden sm:block p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
                                    <RotateCw className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 flex items-center gap-1.5 md:gap-2 bg-white rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-gray-200 min-w-0">
                                <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400 shrink-0" />
                                <span className="text-[10px] md:text-sm text-gray-600 truncate">portfolio.dev/{type}</span>
                            </div>

                            <div className="hidden sm:flex items-center gap-2">
                                <Share className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                                <Star className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center px-2 -mb-px">
                            <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-t-lg border border-gray-200 border-b-white text-[10px] md:text-sm">
                                <span className="text-gray-700">{data.title}</span>
                                <X className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Browser Content */}
                    <div className="flex-1 bg-white rounded-b-xl border border-gray-200 border-t-0 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4 md:p-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPage}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {data.pages[currentPage].content}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Page Indicator */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
                                {data.pages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentPage 
                                                ? 'bg-gray-800 w-6' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

