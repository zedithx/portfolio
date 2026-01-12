'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Zoomable Image Component
const ZoomableImage = ({ src, alt, isDark = false }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <>
            <div 
                className="relative w-full overflow-hidden cursor-pointer group"
                onClick={() => setIsZoomed(true)}
            >
                <img 
                    src={src} 
                    alt={alt}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                        maxHeight: 'min(75vh, 700px)',
                        objectFit: 'contain',
                        display: 'block'
                    }}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 rounded-lg ${isDark ? 'bg-white/20 text-white' : 'bg-black/50 text-white'} text-sm font-medium`}>
                        Click to zoom
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setIsZoomed(false)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomed(false);
                            }}
                            className={`absolute top-4 right-4 p-2 rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 text-white'} transition-colors`}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Project Data organized by category
export const projectData = {
    'School Projects': [
        {
            id: 1,
            title: 'Bulkify',
            commits: 144,
            badge: '3rd Place',
            thumbnail: {
                type: 'image',
                src: '/projects/bulkify/bulkify.png',
                gradient: 'from-blue-500 to-indigo-600'
            },
            techIcons: [
                '/projects/tech-icons/java.webp',
                '/projects/tech-icons/firebase.png'
            ],
            description: 'A mobile app enabling organizations to bulk purchase items together for cost savings with centralized delivery and smart payment processing.',
            techTags: ['Java', 'Firebase', 'Stripe', 'Stream.io', 'Algolia'],
            githubUrl: 'https://github.com/zedithx/JavaAndroidFE',
            blogUrl: null // Add blog post URL if available
        },
        {
            id: 2,
            title: 'Plant Pulse',
            commits: 51,
            badge: 'Top 3',
            thumbnail: {
                type: 'image',
                src: '/projects/plantpulse/plantpulse.png',
                gradient: 'from-green-400 to-emerald-500'
            },
            techIcons: [
                '/projects/tech-icons/next.webp',
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/dynamodb.svg'
            ],
            description: 'A cloud-based IoT infrastructure for monitoring plant health with real-time sensor data and machine learning predictions.',
            techTags: ['Python', 'Next.js', 'TypeScript', 'DynamoDB', 'Jupyter Notebook', 'Cloud Computing', 'IoT'],
            githubUrl: 'https://github.com/zedithx/Cloud-Iot-Infra',
            blogUrl: null
        },
        {
            id: 3,
            title: 'EnableID',
            commits: 312,
            badge: 'Top 2',
            thumbnail: {
                type: 'image',
                src: '/projects/enableid/ocr.png',
                gradient: 'from-pink-500 to-rose-600'
            },
            techIcons: [
                '/projects/tech-icons/next.webp',
                '/projects/tech-icons/rubyonrails.png',
                '/projects/tech-icons/postgresql.webp'
            ],
            description: 'A comprehensive platform for refugee identification and support services with secure identity management and document verification.',
            techTags: ['Next.js', 'Ruby on Rails', 'PostgreSQL', 'RSpec', 'Cypress', 'Tesseract', 'Google Dialogflow', 'Google Cloud Trigger', 'Google Gemini LLM', 'AWS Rekognition'],
            githubUrl: 'https://github.com/Service-Design-Studio/1d-final-project-summer-2024-SDS-2024-Team-14?tab=readme-ov-file',
            blogUrl: null // Add blog post URL if available
        }
    ],
    'Student Government': [
        {
            id: 4,
            title: 'Night Fiesta RFID System',
            commits: 31,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/nightfiestarfid/rfid.png',
                gradient: 'from-indigo-500 to-purple-600'
            },
            techIcons: [
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/django.png',
                '/projects/tech-icons/postgresql.webp'
            ],
            description: 'An RFID-based access control system for student government events with contactless check-in and real-time attendance tracking.',
            techTags: ['Python', 'Django', 'PostgreSQL']
        },
        {
            id: 9,
            title: 'Open House AI Chatbot',
            commits: 44,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/openhouse2025/openhouse.png',
                gradient: 'from-cyan-400 to-blue-500'
            },
            techIcons: [
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/firebase.png'
            ],
            description: 'Website and backend system for SUTD Open House 2025 event with interactive features and event information.',
            techTags: ['Python', 'Firebase'],
            githubUrl: 'https://github.com/zedithx/insight-telegram-repo',
            blogUrl: null
        },
        {
            id: 7,
            title: 'LCC 2025 Website',
            commits: 77,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/lcc2025/lcc.png',
                gradient: 'from-blue-500 to-indigo-600'
            },
            techIcons: [
                '/projects/tech-icons/next.webp',
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/firebase.png'
            ],
            description: 'Website for SUTD LCC 2024 event where seniors shared internship and exchange experiences with juniors.',
            techTags: ['Next.js', 'Python', 'Firebase', 'Digital Ocean'],
            githubUrl: 'https://github.com/zedithx/LCC_website',
            blogUrl: null
        },
        {
            id: 8,
            title: 'Orientation 2024 Website',
            commits: 26,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/orientation2024/ori.webp',
                gradient: 'from-sky-400 to-blue-500'
            },
            techIcons: [
                '/projects/tech-icons/next.webp'
            ],
            description: 'Website for SUTD\'s 2023 Orientation event providing information and engagement for incoming students.',
            techTags: ['Next.js'],
            githubUrl: 'https://github.com/zedithx/Ori_website',
            blogUrl: null
        },
        
        {
            id: 12,
            title: 'Night Fiesta 2023 Website',
            commits: 20,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/nightfiesta2023/night_fiesta.png',
                gradient: 'from-indigo-600 to-purple-700'
            },
            techIcons: [
                '/projects/tech-icons/next.webp'
            ],
            description: 'Website for SUTD\'s Night Fiesta 2023 event providing event information and an engaging experience for participants.',
            techTags: ['Next.js'],
            githubUrl: null,
            blogUrl: null
        }
    ],
    'DevOps Projects': [
        {
            id: 5,
            title: 'Monitoring Suite',
            commits: 11,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/monitoring-suite/cicd.png',
                gradient: 'from-blue-500 to-indigo-600'
            },
            techIcons: [
                '/projects/tech-icons/go.png',
                '/projects/tech-icons/grafana.png',
                '/projects/tech-icons/prometheus.png'
            ],
            description: 'A DevOps monitoring and CI/CD pipeline system built on Golang with Docker optimization and Azure Cloud deployment.',
            techTags: ['Go', 'Grafana', 'Prometheus', 'Azure Cloud', 'Docker Compose']
        },
        {
            id: 6,
            title: 'Container Networking',
            commits: 56,
            badge: 'Full Marks',
            thumbnail: {
                type: 'image',
                src: '/projects/container-networking/container.png',
                gradient: 'from-slate-500 to-slate-700'
            },
            techIcons: [
                '/projects/tech-icons/docker.png',
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/rubyonrails.png'
            ],
            description: 'A containerized multi-service system with CI/CD, test-driven development, and microservices architecture.',
            techTags: ['Docker Compose', 'Python', 'Ruby', 'NGINX', 'GitLab CI', 'TDD', 'REST APIs'],
            githubUrl: 'https://github.com/zedithx/contdevdep-ex',
            blogUrl: null
        }
    ],
    'Personal Projects': [
        {
            id: 10,
            title: 'Trading Bot',
            commits: 69,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/tradingbot/trading_bot.png',
                gradient: 'from-amber-500 to-orange-600'
            },
            techIcons: [
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/cloudstorage.png'
            ],
            description: 'An automated trading bot using the Schwab API integrated with Discord and Telegram bots for real-time interaction and control.',
            techTags: ['Python', 'Cloud Storage'],
            githubUrl: null,
            blogUrl: null
        },
        {
            id: 11,
            title: 'Tangled',
            commits: 231,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/experience/tangled_logo.jpeg',
                gradient: 'from-orange-400 to-pink-500'
            },
            techIcons: [
                '/projects/tech-icons/expo.png',
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/terraform.png'
            ],
            description: 'A social platform co-founded with real-time chat capabilities, AWS infrastructure, and cloud-native architecture.',
            techTags: ['Expo', 'Python', 'Terraform'],
            githubUrl: null,
            blogUrl: null
        },
        {
            id: 13,
            title: '3DC Admin Website',
            commits: 26,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/3dcadmin/3dc_logo.png',
                gradient: 'from-slate-600 to-slate-800'
            },
            techIcons: [
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/django.png',
                '/projects/tech-icons/render.png'
            ],
            description: 'Admin website for 3DC built with Django and Python for reliable hosting and management of administrative functions.',
            techTags: ['Python', 'Django', 'Render'],
            githubUrl: 'https://github.com/zedithx/3dc_admin/tree/main/dc_admin',
            blogUrl: null
        }
    ]
};

// Color classes map
export const colorClassesMap = {
    'React': 'bg-blue-100 text-blue-700',
    'Node.js': 'bg-green-100 text-green-700',
    'MongoDB': 'bg-indigo-100 text-indigo-700',
    'TypeScript': 'bg-purple-100 text-purple-700',
    'Next.js': 'bg-blue-100 text-blue-700',
    'Tailwind': 'bg-pink-100 text-pink-700',
    'Python': 'bg-purple-100 text-purple-700',
    'OpenAI': 'bg-green-100 text-green-700',
    'FastAPI': 'bg-blue-100 text-blue-700',
    'Django': 'bg-green-100 text-green-700',
    'Ruby on Rails': 'bg-red-100 text-red-700',
    'Golang': 'bg-cyan-100 text-cyan-700',
    'Grafana': 'bg-orange-100 text-orange-700',
    'Prometheus': 'bg-red-100 text-red-700',
    'Go': 'bg-cyan-100 text-cyan-700',
    'Docker Compose': 'bg-blue-100 text-blue-700',
    'Tesseract': 'bg-teal-100 text-teal-700',
    'Google Dialogflow': 'bg-blue-100 text-blue-700',
    'RSpec': 'bg-purple-100 text-purple-700',
    'Cypress': 'bg-emerald-100 text-emerald-700',
    'Cloud Run': 'bg-blue-100 text-blue-700',
    'Google Cloud Trigger': 'bg-blue-100 text-blue-700',
    'Google Gemini LLM': 'bg-indigo-100 text-indigo-700',
    'AWS Rekognition': 'bg-orange-100 text-orange-700',
    'Java': 'bg-orange-100 text-orange-700',
    'Firebase': 'bg-yellow-100 text-yellow-700',
    'Stripe': 'bg-indigo-100 text-indigo-700',
    'Stream.io': 'bg-blue-100 text-blue-700',
    'Algolia': 'bg-purple-100 text-purple-700',
    'TypeScript': 'bg-blue-100 text-blue-700',
    'Jupyter Notebook': 'bg-orange-100 text-orange-700',
    'Cloud Computing': 'bg-blue-100 text-blue-700',
    'IoT': 'bg-green-100 text-green-700',
    'DynamoDB': 'bg-blue-100 text-blue-700',
    'PostgreSQL': 'bg-blue-100 text-blue-700',
    'Digital Ocean': 'bg-blue-100 text-blue-700',
    'Cloud Storage': 'bg-blue-100 text-blue-700',
    'Azure Cloud': 'bg-cyan-100 text-cyan-700',
    'NGINX': 'bg-green-100 text-green-700',
    'GitLab CI': 'bg-orange-100 text-orange-700',
    'TDD': 'bg-purple-100 text-purple-700',
    'REST APIs': 'bg-blue-100 text-blue-700',
    'Ruby': 'bg-red-100 text-red-700',
    'Expo': 'bg-blue-100 text-blue-700',
    'Terraform': 'bg-indigo-100 text-indigo-700',
    'Render': 'bg-orange-100 text-orange-700'
};

// Helper function to generate sticky action buttons
const generateStickyButtons = (project, isDark = false) => {
    const hasGithub = project.githubUrl && project.githubUrl.trim() !== '';
    const hasBlog = project.blogUrl && project.blogUrl.trim() !== '';
    
    return (
        <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-2 md:gap-2.5 w-fit">
            <button
                disabled={!hasGithub}
                onClick={hasGithub ? () => window.open(project.githubUrl, '_blank', 'noopener,noreferrer') : undefined}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2 rounded-lg shadow-lg transition-all whitespace-nowrap ${hasGithub ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'} ${isDark 
                    ? hasGithub 
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md' 
                        : 'bg-white/5 text-white/30 border border-white/10'
                    : hasGithub
                        ? 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-700'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
            >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-[10px] sm:text-xs md:text-sm">GitHub</span>
            </button>
            
            <button
                disabled={!hasBlog}
                onClick={hasBlog ? () => window.open(project.blogUrl, '_blank', 'noopener,noreferrer') : undefined}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2 rounded-lg shadow-lg transition-all whitespace-nowrap ${hasBlog ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'} ${isDark 
                    ? hasBlog 
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md' 
                        : 'bg-white/5 text-white/30 border border-white/10'
                    : hasBlog
                        ? 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-700'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
            >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="font-medium text-[10px] sm:text-xs md:text-sm">Blog Post</span>
            </button>
        </div>
    );
};

// Helper function to generate project content JSX
export const generateProjectContent = (project, isDark = false) => {
    // Custom content for specific projects
    if (project.title === 'EnableID') {
        return (
            <div className="space-y-8">
                <div className="relative">
                    <div className="mb-2 pr-0 sm:pr-24 md:pr-32">
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                        <p className={`text-xs sm:text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Webapp • School Project • Top 2
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 hidden sm:flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex sm:hidden mb-3 gap-2">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {project.techTags.map((tag, idx) => {
                            const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                            const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                            return (
                                <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className={`space-y-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                        <p className="leading-relaxed text-base">
                            Enable ID allows refugees to digitally store their personal information securely, verify their identity in host countries, manage their identification documents, and find missing family and friends. Enable ID endeavors to provide a comprehensive support system that empowers refugees.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Achievement</h3>
                        <p className="leading-relaxed text-base">
                            This project was one of the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>two projects showcased in Open House annually</span> for the module, showcasing its impact and innovation in addressing refugee identification and support challenges. Additionally, our team was the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>only team out of 13 other teams that obtained full marks for every sprint</span> by the client.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Background & Context</h3>
                        <p className="leading-relaxed text-base mb-3">
                            As part of the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>60.004 Service Design Studio</span> module, my team designed and developed a <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>software service platform</span> for <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Gebirah</span>, a humanitarian organisation, to support their operational workflows.
                        </p>
                        <p className="leading-relaxed text-base mb-3">
                            The system was built using <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>agile methodologies</span>, with <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>biweekly client sprint reviews</span> to validate requirements and iterate on functionality. We implemented <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>RESTful APIs</span> following a <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>microservice architecture</span>, focusing on scalability, maintainability, and clear separation of concerns.
                        </p>
                        <p className="leading-relaxed text-base mb-3">
                            To ensure software quality, we practiced <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Test-Driven Development (TDD)</span> and <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Behavior-Driven Development (BDD)</span> using automated test suites, achieving reliable test coverage across core features. A <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>CI/CD pipeline</span> was set up to automate testing and deployment, enabling consistent integration and rapid delivery of changes.
                        </p>
                        <p className="leading-relaxed text-base">
                            Throughout the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>8-week development cycle</span>, we emphasized clean code, version control, and continuous feedback, delivering a <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>production-ready service</span> aligned with real client needs.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Key Features</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Face Authentication</h4>
                                <p className="leading-relaxed text-base">
                                    Face Authentication allows the user to verify their identity, expediting the refugee verification process. This also allows users to search for missing family and friends registered and verified in the app. Facial authentication is achieved through implementation of AWS Recognition API.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Digital Identification Card</h4>
                                <p className="leading-relaxed text-base">
                                    The digital identity card provides an intuitive interface for users to access their refugee identity card and relevant personal information. Each approved refugee identity card has a QR code where NGO officials can access their public information from. The home page also provides navigation links to other useful services.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Document Scanner & Upload</h4>
                                <p className="leading-relaxed text-base">
                                    Users can upload their personal documents to be verified by officials. The refugees can then use these verified documents to access healthcare and employment services. These verified documents are processed by OCR and translated into English for relevant authorities to easily understand. The Document Manager serves as a digital repository to record their important document records in their refuge journey.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Missing Person Finder</h4>
                                <p className="leading-relaxed text-base">
                                    Missing Person Finder lets users add information about their missing loved ones, and using AWS Rekognition, finds potential matching users in our database. Users can then send a match request to reunite with their loved ones.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Chatbot</h4>
                                <p className="leading-relaxed text-base">
                                    Helpbot is online 24/7 and answers user queries with the power of AI. Helpbot is trained with the website's interface and can answer queries in English, Arabic, Malay, and Burmese.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Role</h3>
                        <p className="leading-relaxed text-base mb-3">
                            As the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Lead</span>, I <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>led a 6-person team</span> in technical implementation, client communication, and scrum timelines/product direction. I set up the entire project infrastructure and gained hands-on experience with all tools used throughout the development process.
                        </p>
                        <p className="leading-relaxed text-base mb-3">
                            This included working across the full stack with both <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>frontend and backend</span> development, implementing testing frameworks such as <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>RSpec</span> and <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cypress</span>, achieving <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>80% code coverage</span>, and setting up the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>CI/CD pipeline with Google Cloud Trigger</span> for automated testing and deployment.
                        </p>
                        <p className="leading-relaxed text-base mb-3">
                            For feature development, I implemented an <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Chatbot with Google Dialog Flow</span>, <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>face recognition with AWS Rekognition</span>, and <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>OCR with Tesseract</span>, including language support.
                        </p>
                        <p className="leading-relaxed text-base">
                            Additionally, I <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>reviewed every single person's pull request</span> before merging it, ensuring the code was valid and maintained high quality standards throughout the project.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Links</h3>
                        <div className="space-y-3">
                            <div>
                                <a 
                                    href="https://sites.google.com/view/sds-2024-team-14/home?authuser=0" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Google Site</span>
                                </a>
                            </div>
                            <div>
                                <a 
                                    href="https://docs.google.com/document/d/1jCgIEbSquIWM2TcBFJDTQyb8psk419NHWv1tpFA85a8/edit?tab=t.0" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Design Workbook</span>
                                </a>
                            </div>
                            <div>
                                <a 
                                    href="https://www.figma.com/board/BWnYolkVdRS5E9WQAdX91t/Brainstorming-Team-14?node-id=0-1&p=f" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Figma Documentation</span>
                                </a>
                            </div>
                            <div>
                                <a 
                                    href="https://www.figma.com/proto/PD059qNKRolmF4y4GT4MEs/SDS-Team-14?node-id=0-1&t=UQxFjPjveyWirL78-1" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Figma Prototype</span>
                                </a>
                            </div>
                            <div>
                                <a 
                                    href="https://github.com/Service-Design-Studio/1d-final-project-summer-2024-SDS-2024-Team-14?tab=readme-ov-file" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    <span>GitHub Repository</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Final Presentation Video</h3>
                        <div className="flex justify-center -mx-5">
                            <div className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src="https://www.youtube.com/embed/videoseries?list=PLJbt3DXk5ylPv0ERKu7ZMFzzH54UEJ2Xd"
                                    title="Enable ID Tutorial Videos"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (project.title === 'Bulkify') {
        return (
            <div className="space-y-8">
                <div className="relative">
                    <div className="mb-2 pr-0 sm:pr-24 md:pr-32">
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                        <p className={`text-xs sm:text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Mobile App • School Project • 3rd Place Winner
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 hidden sm:flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex sm:hidden mb-3 gap-2">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {project.techTags.map((tag, idx) => {
                            const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                            const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                            return (
                                <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className={`space-y-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                        <p className="leading-relaxed text-base">
                            Bulkify is a mobile app that enables organizations to bulk purchase items together for a more convenient and cost-saving experience. Unlike existing solutions that rely on manual management through Google Sheets and multiple delivery locations, Bulkify targets organizations and schools to eliminate these issues by centralizing delivery to a single location, maximizing cost savings for customers.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Achievement</h3>
                        <p className="leading-relaxed text-base">
                            The project achieved <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>3rd place out of 30 teams</span>, judged by Singtel Engineers.
                        </p>
                        <div className="mt-6 -mx-5">
                            <ZoomableImage 
                                src="/projects/bulkify/bulkify_poster.png" 
                                alt="Bulkify Project Poster"
                                isDark={isDark}
                            />
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Background & Context</h3>
                        <p className="leading-relaxed text-base">
                            This app was developed for the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>50.001 Information Systems & Programming</span> module. We learned how to develop an Android app in <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Java</span> and were tasked to develop it in <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>6 weeks</span>, before having to demo in real life and get judged by <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Singtel Engineers</span>.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Key Features</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Payment Processing</h4>
                                <p className="leading-relaxed text-base">
                                    Integrated Stripe to withhold bulk buy payments until orders reach the minimum required amount. This ensures that bulk purchases only proceed when enough participants join, protecting both buyers and sellers while maximizing cost savings.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Hardware Locker Integration</h4>
                                <p className="leading-relaxed text-base">
                                    Built a hardware locker system integrated into the app. Sellers scan a QR code to unlock and place items inside an assigned locker. Buyers are notified and can scan the QR code generated in the application to unlock their assigned locker and retrieve purchased items, achieving trust and convenience for both buyers and merchants.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Real-Time Communication</h4>
                                <p className="leading-relaxed text-base">
                                    Integrated <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Stream.io</span> to enable real-time communications between buyers and sellers, facilitating instant messaging, order updates, and coordination throughout the bulk purchase process.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 -mx-5">
                            <div className="relative w-full overflow-hidden">
                                <img 
                                    src="/projects/bulkify/bulkify_locker.png" 
                                    alt="Bulkify Hardware Locker" 
                                    className="w-full h-auto"
                                    style={{ 
                                        maxHeight: 'min(75vh, 700px)',
                                        objectFit: 'contain',
                                        display: 'block'
                                    }}
                                    loading="lazy"
                                />
                            </div>
                            </div>
                        </div>
                </div>

                <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Demo</h3>
                    <div className="flex justify-center -mx-5">
                        <div className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/ccrcRkjByKM"
                                title="Bulkify Project Demo"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (project.title === 'Plant Pulse') {
        return (
            <div className="space-y-8">
                <div className="relative">
                    <div className="mb-2 pr-0 sm:pr-24 md:pr-32">
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                        <p className={`text-xs sm:text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            IoT System • School Project • Top 3 Finalist
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 hidden sm:flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex sm:hidden mb-3 gap-2">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {project.techTags.map((tag, idx) => {
                            const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                            const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                            return (
                                <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className={`space-y-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                        <p className="leading-relaxed text-base">
                            PlantPulse is an intelligent IoT plant monitoring system that provides near real-time environmental data, AI-powered disease detection, autonomous healing functions, and proactive alerts—all at an affordable price point accessible to everyday plant enthusiasts.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Achievement</h3>
                        <p className="leading-relaxed text-base">
                            After presenting our project to our professor, we were selected as one of the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>top three finalists</span> and invited to showcase our solution to <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>experienced engineers from Dell Technologies</span>. Our team came very close to securing the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dell Cloud Native Award</span>.
                        </p>
                            </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Background & Context</h3>
                        <p className="leading-relaxed text-base">
                            For our <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>50.046 Cloud Computing and Internet of Things</span> module, we were tasked with developing a product that applied <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>cloud-native principles</span> and <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>IoT technologies</span> to address a real business need. Despite the very tight <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>2–3 week development timeframe</span>, our team was able to make the most of the opportunity and deliver a functional solution.
                        </p>
                        </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Key Features</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Seamless IoT Device Pairing</h4>
                                <p className="leading-relaxed text-base">
                                    Effortless onboarding of IoT devices through QR code scanning, enabling secure and instant pairing between hardware and the web application without manual configuration.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Real-Time Environmental Monitoring</h4>
                                <p className="leading-relaxed text-base">
                                    Continuous streaming of sensor data—including temperature, soil moisture, and light intensity (lux)—to a centralized cloud dashboard for real-time visibility and analysis.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Self-Healing Automation</h4>
                                <p className="leading-relaxed text-base">
                                    Autonomous control logic that dynamically adjusts environmental conditions by triggering actuators when deviations are detected, ensuring optimal plant health without manual intervention.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Granular Environment Control</h4>
                                <p className="leading-relaxed text-base">
                                    Fine-grained control over individual environmental variables, allowing users to set and modify target thresholds for temperature, moisture, and light at any time.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>AI-Powered Disease Detection</h4>
                                <p className="leading-relaxed text-base">
                                    Machine learning pipeline that processes leaf images to generate a disease risk confidence score, enabling early detection and preventative action.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Intelligent Alerts & Notifications</h4>
                                <p className="leading-relaxed text-base">
                                    Automated email notifications triggered by critical events such as empty water tanks or elevated disease risk, ensuring timely user awareness and response.
                                </p>
                            </div>
                    </div>
                </div>

                <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cloud Architecture</h3>
                        <p className={`leading-relaxed text-base mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            On a side note, looking back, I would have added message queues like SQS along the way to ensure resistance to failure and handle retries during the data ingestion and processing pipelines.
                        </p>
                        <div className="mt-4 -mx-5">
                            <ZoomableImage
                                src="/projects/plantpulse/Cloud Architecture.png"
                                alt="Plant Pulse Cloud Architecture"
                                isDark={isDark}
                            />
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Promotion Video</h3>
                    <div className="flex justify-center -mx-5">
                        <div className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                    src="https://www.youtube.com/embed/PUh46XgGfsg"
                                    title="Plant Pulse Promotion Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Links</h3>
                        <div className="space-y-3">
                            <div>
                                <a 
                                    href="https://docs.google.com/document/d/1hXYXPb0br34YvCvnrzgg8_Sd3zwBD_oNgQVYdwIXkZc/edit?usp=sharing" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Report</span>
                                </a>
                            </div>
                            <div>
                                <a 
                                    href="https://drive.google.com/file/d/1P_Z6k1_fxg4zwUK9r08_n3Hej3NwgSay/view?usp=sharing" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Cloud Infrastructure Diagram</span>
                                </a>
                            </div>
                            <div>
                                <a 
                                    href="https://drive.google.com/file/d/1xuaPK-kBsIjrf7rCsgqnU0gbQYspYBX3/view?usp=sharing" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Final Presentation Slides</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (project.title === 'LCC 2025 Website') {
        return (
            <div className="space-y-8">
                <div className="relative">
                    <div className="mb-2 pr-0 sm:pr-24 md:pr-32">
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                        <p className={`text-xs sm:text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Website • Telegram Bot • Student Government Project
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 hidden sm:flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex sm:hidden mb-3 gap-2">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {project.techTags.map((tag, idx) => {
                            const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                            const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                            return (
                                <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className={`space-y-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                        <p className="leading-relaxed text-base">
                            Software development for SUTD LCC 2024 event, which was an event where seniors shared about their internship and exchange experiences with juniors. Built with Next.js to provide an engaging and interactive experience for participants.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Background & Context</h3>
                        <p className="leading-relaxed text-base">
                            The LCC (Learning, Career, and Community) event is an annual SUTD event where seniors share their internship and exchange experiences with juniors, helping them make informed decisions about their academic and career paths.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Key Features</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Telegram Voting Bot</h4>
                                <p className="leading-relaxed text-base">
                                    A Telegram bot developed for voting purposes, allowing participants to cast votes directly through the messaging platform for a seamless and accessible voting experience.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Lucky Draw System</h4>
                                <p className="leading-relaxed text-base">
                                    A lucky draw query system that enables fair and transparent random selection of winners during the event, enhancing participant engagement.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Frontend Website</h4>
                                <p className="leading-relaxed text-base">
                                    A modern, interactive frontend website built with Next.js that provides event information, schedules, and an engaging user interface for participants to navigate and explore the event content.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Demo</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Website Demo</h4>
                                <div className="mt-3 -mx-5">
                                    <img 
                                        src="/projects/lcc2025/lccwebsite.gif" 
                                        alt="LCC 2025 Website Demo"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                        style={{ maxHeight: '600px', objectFit: 'contain' }}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Telegram Bot Demo</h4>
                                <div className="mt-3 -mx-5">
                                    <video 
                                        src="/projects/lcc2025/lcctelegrambot.mov"
                                        controls
                                        className="w-full h-auto rounded-lg shadow-lg"
                                        style={{ maxHeight: '600px' }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Links</h3>
                        <div className="space-y-3">
                            <div>
                                <a 
                                    href="https://github.com/zedithx/LCC_telebot" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    <span>Telegram Bot Repo</span>
                                </a>
                            </div>
                            <div>
                                <a 
                                    href="https://github.com/zedithx/LCC_FirebaseQuery" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    <span>Lucky Draw Query Repo</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (project.title === 'Orientation 2024 Website') {
        return (
            <div className="space-y-8">
                <div className="relative">
                    <div className="mb-2 pr-0 sm:pr-24 md:pr-32">
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                        <p className={`text-xs sm:text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Website • Student Government Project
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 hidden sm:flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex sm:hidden mb-3 gap-2">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {project.techTags.map((tag, idx) => {
                            const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                            const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                            return (
                                <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className={`space-y-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                        <p className="leading-relaxed text-base">
                            {project.description}
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Demo</h3>
                        <div className="mt-3 -mx-5">
                            <img 
                                src="/projects/orientation2024/orientationwebsite.gif" 
                                alt="Orientation 2024 Website Demo"
                                className="w-full h-auto rounded-lg shadow-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain' }}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (project.title === 'Tangled') {
        return (
            <div className="space-y-8">
                <div className="relative">
                    <div className="mb-2 pr-0 sm:pr-24 md:pr-32">
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                        <p className={`text-xs sm:text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Social Platform • Personal Project
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 hidden sm:flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex sm:hidden mb-3 gap-2">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {project.techTags.map((tag, idx) => {
                            const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                            const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                            return (
                                <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className={`space-y-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                        <p className="leading-relaxed text-base mb-4">
                            {project.description}
                        </p>
                        <div className="mt-4 -mx-5">
                            <img 
                                src="/projects/tangled/TangledMockup.jpeg" 
                                alt="Tangled Project Mockup"
                                className="w-full h-auto rounded-lg shadow-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain' }}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (project.title === 'Container Networking') {
        return (
            <div className="space-y-8">
                <div className="relative">
                    <div className="mb-2 pr-0 sm:pr-24 md:pr-32">
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                        <p className={`text-xs sm:text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            CI/CD & Microservices • Exchange Project • Tampere University
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 hidden sm:flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex sm:hidden mb-3 gap-2">
                        {generateStickyButtons(project, isDark)}
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {project.techTags.map((tag, idx) => {
                            const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                            const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                            return (
                                <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className={`space-y-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                        <p className="leading-relaxed text-base">
                            This project demonstrates a containerized multi-service system with CI/CD, test-driven development, and a microservices architecture. I implemented two services in different languages (Python & Ruby) with distinct networking roles: the Python service is an exposed service accessible from outside the Docker network, while the Ruby service operates as a private service only accessible within the Docker Compose network. The system is managed via an NGINX API Gateway with selective authentication for monitoring, state management, and load balancing.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Achievement</h3>
                        <p className="leading-relaxed text-base">
                            I achieved the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>maximum marks possible</span> for this project, scoring myself in the <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>top 10% of final year master students</span> in the course.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Background & Context</h3>
                        <p className="leading-relaxed text-base">
                            This was a 2nd year master course final project at Tampere University during my exchange in Finland. The course had a 50% pass rate and a high dropout rate, making it one of the most challenging courses in the program. I spent <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>50 hours</span> on the entire project, including other earlier exercises in other branches. Successfully completing this project, with its focus on containerization, microservices, and DevOps practices, led me to pursue a DevOps internship and deepen my interest in infrastructure and reliability engineering.
                        </p>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>What I Built</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Multi-Service System</h4>
                                <p className="leading-relaxed text-base">
                                    Services communicate over Docker network; API Gateway exposes REST endpoints for system state, container info, and request handling.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>System States & Monitoring</h4>
                                <p className="leading-relaxed text-base">
                                    Handles INIT, RUNNING, PAUSED, and SHUTDOWN states. SHUTDOWN was particularly tricky—it required stopping multiple container replicas, including the one issuing the command, which I solved using a Python background subprocess to run a bash script.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>State Synchronization</h4>
                                <p className="leading-relaxed text-base">
                                    With 3 replicas of Service 1, I had to synchronize state and logs using shared volumes to ensure consistency across round-robin requests.
                                </p>
                            </div>
                            <div>
                                <h4 className={`font-semibold mb-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Advanced NGINX Configuration</h4>
                                <p className="leading-relaxed text-base">
                                    Implemented selective authentication per request method and per system state using auth_request and rewrite directives.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Testing & CI/CD</h3>
                        <div className="space-y-3">
                            <p className="leading-relaxed text-base">
                                Tests had to be carefully mocked for shutdown and request endpoints to handle environment-specific behavior.
                            </p>
                            <p className="leading-relaxed text-base">
                                Created a separate Docker Compose setup with temporary shared volumes for testing without affecting production state.
                            </p>
                            <p className="leading-relaxed text-base">
                                CI/CD pipeline with a local GitLab runner automated building, testing, and deployment.
                            </p>
                        </div>
                    </div>

                    <div className={`rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} p-5 border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Links</h3>
                        <div className="space-y-3">
                            <div>
                                <a
                                    href="https://drive.google.com/file/d/1dvmot5dbdu8mVUcx_vDbFvow9ddy0Kkz/view?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 text-base hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>End Report</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Default content for other projects
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                    <p className={`leading-relaxed mt-2 whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {project.description}
                    </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                    {generateStickyButtons(project, isDark)}
                </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {project.techTags.map((tag, idx) => {
                    const defaultClasses = isDark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-gray-100 text-gray-700 border border-gray-200';
                    const className = colorClassesMap[tag] ? (isDark ? `${colorClassesMap[tag]} opacity-80 border border-white/20` : `${colorClassesMap[tag]} border`) : defaultClasses;
                    return (
                        <span key={idx} className={`px-3.5 py-1.5 ${className} rounded-md text-sm font-medium transition-all hover:scale-105`}>
                            {tag}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// Transform projectData into items format with content
export const transformProjectsToItems = () => {
    const items = [];
    Object.keys(projectData).forEach(category => {
        projectData[category].forEach(project => {
            items.push({
                ...project,
                category,
                content: (isDark = false) => generateProjectContent(project, isDark)
            });
        });
    });
    return items;
};

export const contentData = {
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
        title: 'Cash Shop',
        items: transformProjectsToItems()
    },
    experience: {
        title: 'Experience',
        pages: [
            {
                title: 'Experience',
                content: (isDark = false) => (
                    <div className="space-y-4 sm:space-y-5 md:space-y-8">
                        {/* ByteDance */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/bytedance_logo.png" alt="ByteDance" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>ByteDance</h2>
                                    <p className={`text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 font-medium leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Software Engineer (SRE) Intern</p>
                                    <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Data Infrastructure SRE Team</p>
                                    <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Sep 2025 - Dec 2025</p>
                                </div>
                            </div>
                            <p className={`text-xs sm:text-sm md:text-base leading-relaxed mt-2 sm:mt-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                At ByteDance, I worked on ByteGraph, a distributed graph database powering production clusters across Singapore and Europe. I focused on automation, operational workflows, and monitoring pipelines to improve system reliability. This role gave me hands-on experience operating global-scale production systems and implementing SRE best practices.
                            </p>
                            <p className={`text-[10px] sm:text-xs md:text-sm mt-1.5 sm:mt-2 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                <span className="font-medium">Tech:</span> Golang, Grafana, Machine Operations, Distributed Graph Database
                            </p>
                        </div>

                        {/* Tangled Social */}
                        <div className={`space-y-2 sm:space-y-3 md:space-y-4 border-t pt-3 sm:pt-4 md:pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/tangled_logo.jpeg" alt="Tangled Social" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Tangled Social</h2>
                                    <p className={`text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 font-medium leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Co-founder & Software Engineer</p>
                                    <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>July 2025 - Present</p>
                                </div>
                            </div>
                            <p className={`text-xs sm:text-sm md:text-base leading-relaxed mt-2 sm:mt-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                I co-founded a social platform and built the majority of the codebase, including a real-time chat system using AWS WebSocket Gateway, Lambda, and DynamoDB. I provisioned production-grade infrastructure with Terraform and implemented end-to-end monitoring and reliability features. This project sharpened my skills in cloud architecture, serverless systems, and production operations.
                            </p>
                            <p className={`text-[10px] sm:text-xs md:text-sm mt-1.5 sm:mt-2 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                <span className="font-medium">Tech:</span> AWS (Lambda, DynamoDB, WebSocket Gateway, ECS rolling deployment), Terraform, Python, Expo, Sentry
                            </p>
                        </div>

                        {/* TSMC */}
                        <div className={`space-y-2 sm:space-y-3 md:space-y-4 border-t pt-3 sm:pt-4 md:pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/TSMC.png" alt="TSMC" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>TSMC</h2>
                                    <p className={`text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 font-medium leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Software Engineer (DevOps) Intern</p>
                                    <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Intelligent Eng-System Mask Team</p>
                                    <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>June 2025 - Aug 2025</p>
                                </div>
                            </div>
                            <p className={`text-xs sm:text-sm md:text-base leading-relaxed mt-2 sm:mt-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                At TSMC, I integrated OpenTelemetry tracing with NATS MQ compatibility across 10+ fabrication labs, enabling automated test scenario generation and system sanity checks using Prometheus metrics. This reduced manual toil and strengthened reliability of critical industrial-scale workflows. I gained experience with Site Reliability and DevOps at Industrial Scale.
                            </p>
                            <p className={`text-[10px] sm:text-xs md:text-sm mt-1.5 sm:mt-2 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                <span className="font-medium">Tech:</span> Spring Boot, OpenTelemetry, NATS, Prometheus, Grafana, Tempo, ArgoCD, ES, Azure CI/CD, Kubernetes, Helm, Chaos Engineering, Auto Sanity Check
                            </p>
                        </div>

                        {/* Changi Airport Group */}
                        <div className={`space-y-2 sm:space-y-3 md:space-y-4 border-t pt-3 sm:pt-4 md:pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/Changi_Airport_logo.png" alt="Changi Airport Group" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Changi Airport Group</h2>
                                    <p className={`text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 font-medium leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Software Engineer Intern</p>
                                    <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>API Gateway and Microservices Team</p>
                                    <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Jan 2025 - May 2025</p>
                                </div>
                            </div>
                            <p className={`text-xs sm:text-sm md:text-base leading-relaxed mt-2 sm:mt-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                I built event-driven serverless systems to automate operational tasks, including a production Slack bot, multi-account CloudWatch log aggregation, and secure microservices behind Apigee API Gateway. This role developed my expertise in serverless architectures, observability, and operational automation in production environments.
                            </p>
                            <p className={`text-[10px] sm:text-xs md:text-sm mt-1.5 sm:mt-2 leading-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                <span className="font-medium">Tech:</span> AWS (Cloudwatch, EventBridge, SQS, STS, SSM, S3, Api Gateway, Secrets Manager), Lambda Layers, Power Automate, Apigee Gateway, Python, Node.js, AWS SAM as IaC
                            </p>
                        </div>
                    </div>
                )
            }
        ]
    }
};

// About Me Skill Progression Data
export const aboutMeData = {
    hero: {
        name: "Si Jun",
        avatar: "/background/avatars/Tech SiJun.jpg",
        primaryTrait: "Full Stack Developer",
        ctaText: "Start Journey"
    },
    skills: {
        // Technical Skills
        Backend: {
            baseline: 0,
            max: 100
        },
        Frontend: {
            baseline: 0,
            max: 100
        },
        Hardware: {
            baseline: 0,
            max: 100
        },
        'Telegram Bots': {
            baseline: 0,
            max: 100
        },
        Deployment: {
            baseline: 0,
            max: 100
        },
        DevOps: {
            baseline: 0,
            max: 100,
            locked: true,
            unlockThreshold: { Backend: 1 }
        },
        LLMs: {
            baseline: 0,
            max: 100
        },
        'Cloud Infrastructure': {
            baseline: 0,
            max: 100,
            locked: true,
            unlockThreshold: { Backend: 1 }
        },
        SRE: {
            baseline: 0,
            max: 100,
            locked: true,
            unlockThreshold: { DevOps: 1 },
            displayName: 'Site Reliability'
        },
        // Non-Technical Skills
        'Product Management': {
            baseline: 0,
            max: 100
        }
    },
    journey: [
        {
            id: 1,
            title: "Internship before University",
            dialogues: [
                {
                    speaker: "hero",
                    text: "Hi, I'm Si Jun, a Full-Stack/Devops/Site Reliability Engineer. My coding journey started during my army days, where I decided to try learning coding and I quickly got hooked. I went through Harvard's CS50 course and an Udemy course on the Django framework, which later helped me land an internship at Reluvate Technologies, where Django was used for client projects."
                },
                {
                    speaker: "hero",
                    text: "During Reluvate, I worked on the backend of a payment platform which was used by notable merchants such as KOI, Watsons and Zara. Today that Payment Platform is used by over 1,860 merchants in Singapore."
                },
                {
                    speaker: "hero",
                    text: "By the end of the internship, I realised that I really enjoyed coding and loved the feeling of making changes to products that people actually use in the real world."
                }
            ],
            category: "Internship",
            icon: "💼",
            skillsGained: { Backend: 40, 'Product Management': 10 },
            scene: "/background/reluvate.gif"
        },
        {
            id: 2,
            title: "University",
            dialogues: [
                {
                    speaker: "hero",
                    text: "At SUTD, being surrounded by many strong software engineers, especially those from polytechnic backgrounds, pushed me to grow quickly. A classmate encouraged me to join the student government's tech department, which at the time felt like a casual decision but ended up becoming one of the most defining parts of my university life."
                },
                {
                    speaker: "hero",
                    text: "I went on to build the frontend site for SUTD's largest annual event, Night Fiesta 2024, followed by the websites for Orientation 2024 and LCC 2024, and led the implementation of an RFID-based game carnival system end-to-end (custom RFID bands from a supplier in China, RFID readers, and the supporting software). I also built multiple Telegram bots to run event logistics and engagement."
                },
                {
                    speaker: "hero",
                    text: "Through these projects, my frontend skills grew rapidly, and I deepened my deployment and backend skills by repeatedly shipping and operating production-facing tools for the school."
                },
                {
                    speaker: "hero",
                    text: "I also tend to become hyper-focused when building things. At SUTD, I often treated projects like a full-time job, pulling late nights to get them to a level I was proud of while traditional studying took a backseat. In a few weeks, I picked up hardware and embedded programming from scratch, and in my computer science modules I pushed my teams and myself to ship products that felt polished and real.",
                    scene: "/background/SchoolProjectAwards.JPG"
                },
                {
                    speaker: "hero",
                    text: "Across several modules, our projects consistently ranked top three in the cohort and picked up awards.",
                    scene: "/background/SchoolProjectAwards.JPG"
                }
            ],
            category: "Education",
            icon: "🏛️",
            skillsGained: { Frontend: 50, Backend: 20, Hardware: 30, 'Telegram Bots': 60, Deployment: 40, LLMs: 30, Devops: 20, 'Product Management': 40 },
            scene: "/background/DesignThinking.JPG"
        },
        {
            id: 3,
            title: "Internships in university",
            dialogues: [
                {
                    speaker: "hero",
                    text: "In my 3rd year of university, SUTD had a long school break of 8 months after my exchange. I completed internships at Changi Airport Group, TSMC, and ByteDance while juggling my studies, each teaching me different aspects of software engineering."
                },
                {
                    speaker: "hero",
                    text: "From automation and software engineering at Changi Airport, to DevOps infrastructure and telemetry at TSMC, to finally getting to Site Reliability Engineering at Bytedance - each experience built upon the last."
                }
            ],
            category: "Internship",
            icon: "💼",
            skillsGained: { Backend: 20, DevOps: 40,  'Cloud Infrastructure': 60,  SRE: 40, Deployment: 20, 'Product Management': 20 },
            scene: "/background/bytedance.webp"
        },
        {
            id: 4,
            title: "What's next?",
            dialogues: [
                {
                    speaker: "hero",
                    text: "Returning to SUTD to complete my studies, I'm now preparing for the next chapter of my journey. With all the experiences I've gained, I'm ready to take on my full-time job and continue growing in this software domain."
                }
            ],
            category: "Future",
            icon: "⭐",
            skillsGained: {},
            scene: "/background/sutd.webp"
        }
    ]
};

// Summary content for journey summary page
export const journeySummaryContent = {
    "internshipBeforeUniversity": {
        "title": "Internship before university",
        "content": "Reluvate Technologies — Backend Engineer Intern\n\n• Began software engineering journey during military service; completed Harvard CS50 and Django-focused coursework\n• Joined Reluvate Technologies as a backend intern working on a production payment platform\n• Contributed to backend systems supporting 1,860+ merchants in Singapore, including Watsons, Zara, and KOI\n• Gained first exposure to real-world production systems, payments, and reliability concerns"
    },
    "university": {
        "title": "University Life",
        "content": "Singapore University of Technology and Design (SUTD)\n\n• Core contributor to Student Government Tech, delivering production systems for campus-wide events\n• Built and operated frontend websites for Night Fiesta 2024, Orientation 2024, and LCC 2024\n• Led end-to-end implementation of an RFID-based game carnival system (hardware sourcing, readers, backend, and frontend)\n• Developed multiple Telegram bots for event operations and engagement\n• Repeatedly shipped and maintained production-facing tools, strengthening frontend, backend, and deployment skills\n• Academic and project teams consistently ranked top three in cohort, receiving multiple awards"
    },
    "internshipsInUniversity": {
        "title": "Internships in university",
        "content": "• Changi Airport Group (CAG): Automation and event-driven systems\n• TSMC: DevOps, telemetry, and SRE infrastructure at industrial scale\n• ByteDance: Site Reliability Engineering — monitoring, automation, and service reliability at scale\n\nEach role built progressively deeper exposure to automation, infrastructure, and reliability engineering."
    },
    "whatsNext": {
        "title": "What's next?",
        "content": "• Completing the final phase of studies at SUTD\n• Preparing for a full-time role in Site Reliability Engineering\n• Continue building and iterating on Tangled, a social startup, ahead of full-time start"
    }
};

