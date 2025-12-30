'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCw, Lock, Star, Share, Plus, ShoppingCart, Search } from 'lucide-react';

// Project Data organized by category
const projectData = {
    Popular: [
        {
            id: 1,
            title: 'Bulkify',
            commits: 474,
            badge: 'Hot',
            thumbnail: {
                type: 'image',
                src: '/projects/project-icons/bulkify/bulkify.png',
                gradient: 'from-blue-400 to-purple-500'
            },
            techIcons: [
                '/projects/project-icons/tech-icons/java.webp',
                '/projects/project-icons/tech-icons/firebase.png'
            ],
            description: 'A powerful e-commerce bulk operations platform built with modern web technologies. Features include real-time inventory management, bulk product updates, order processing, and a beautiful responsive design.',
            techTags: ['React', 'Node.js', 'MongoDB', 'TypeScript']
        },
        {
            id: 3,
            title: 'EnableID',
            commits: 823,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/project-icons/enableid/refugees.png',
                gradient: 'from-pink-500 to-rose-600'
            },
            techIcons: [
                '/projects/project-icons/tech-icons/next.webp',
                '/projects/project-icons/tech-icons/rubyonrails.png'
            ],
            description: 'A comprehensive platform for refugee identification and support services. Features include secure identity management, document verification, and streamlined access to essential services.',
            techTags: ['Next.js', 'Ruby on Rails']
        }
    ],
    'Student Government': [
        {
            id: 4,
            title: 'Night Fiesta RFID Project',
            commits: 31,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/project-icons/nightfiesta/rfid.png',
                gradient: 'from-indigo-500 to-purple-600'
            },
            techIcons: [
                '/projects/project-icons/tech-icons/python.webp',
                '/projects/project-icons/tech-icons/django.png'
            ],
            description: 'An RFID-based access control and event management system for student government events. Features include contactless check-in, real-time attendance tracking, and secure event access management.',
            techTags: ['Python', 'Django']
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
                src: '/projects/project-icons/monitoring-suite/cicd.png',
                gradient: 'from-blue-500 to-indigo-600'
            },
            techIcons: [
                '/projects/project-icons/tech-icons/go.png',
                '/projects/project-icons/tech-icons/grafana.png',
                '/projects/project-icons/tech-icons/prometheus.png'
            ],
            description: 'A comprehensive DevOps monitoring and CI/CD pipeline management system. Features include real-time infrastructure monitoring, automated deployment pipelines, performance metrics visualization, and alerting systems.',
            techTags: ['Go', 'Grafana', 'Prometheus']
        },
        {
            id: 6,
            title: 'Container Networking',
            commits: 56,
            badge: null,
            thumbnail: {
                type: 'image',
                src: '/projects/project-icons/container-networking/container.png',
                gradient: 'from-slate-500 to-slate-700'
            },
            techIcons: [
                '/projects/project-icons/tech-icons/docker.png',
                '/projects/project-icons/tech-icons/python.webp',
                '/projects/project-icons/tech-icons/rubyonrails.png'
            ],
            description: 'A Docker Compose-based networking solution for managing multi-container applications. Features include service orchestration, network configuration, volume management, and seamless container communication.',
            techTags: ['Docker Compose', 'Python', 'Ruby on Rails']
        }
    ]
};

// Color classes map - moved outside function to avoid recreation
const colorClassesMap = {
    'React': 'bg-blue-100 text-blue-700',
    'Node.js': 'bg-green-100 text-green-700',
    'MongoDB': 'bg-indigo-100 text-indigo-700',
    'TypeScript': 'bg-purple-100 text-purple-700',
    'Next.js': 'bg-blue-100 text-blue-700',
    'Firebase': 'bg-orange-100 text-orange-700',
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
    'Docker Compose': 'bg-blue-100 text-blue-700'
};

// Helper function to generate project content JSX
const generateProjectContent = (project) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
            <p className="text-gray-600 leading-relaxed">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
                {project.techTags.map((tag, idx) => {
                    const className = colorClassesMap[tag] || 'bg-gray-100 text-gray-700';
                    return (
                        <span key={idx} className={`px-3 py-1 ${className} rounded-full text-sm`}>
                            {tag}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// Transform projectData into items format with content
const transformProjectsToItems = () => {
    const items = [];
    Object.keys(projectData).forEach(category => {
        projectData[category].forEach(project => {
            items.push({
                ...project,
                category,
                content: generateProjectContent(project)
            });
        });
    });
    return items;
};

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
        title: 'Cash Shop',
        items: transformProjectsToItems()
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

// Item Card Component with enhanced animations - Memoized for performance
const ItemCard = React.memo(({ item, onClick }) => {
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
            className="relative bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer transition-all shadow-lg hover:shadow-xl hover:shadow-yellow-500/30"
            style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onClick={handleClick}
        >
            
            {/* Glow effect on hover */}
            {isHovered && (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-purple-500/10 pointer-events-none"
                    style={{ willChange: 'opacity' }}
                />
            )}
            
            
            {/* Item thumbnail area with clean MapleStory-style background */}
            <div className={`aspect-square bg-gradient-to-b ${item.thumbnail.gradient} flex items-center justify-center relative overflow-hidden`}>
                {/* Bounce animation for thumbnail - only on hover */}
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
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 z-10">
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
                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/95 rounded-lg flex items-center justify-center overflow-hidden shadow-lg border-2 border-white/50"
                                    title={isImagePath ? tech.split('/').pop() : tech}
                                >
                                    {isImagePath ? (
                                        <img 
                                            src={tech} 
                                            alt={tech.split('/').pop()} 
                                            className="w-full h-full object-contain p-1.5"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="text-lg sm:text-xl">⚙️</span>
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
                        className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-bold rounded-full shadow-lg z-10 ${
                            item.badge === 'Hot' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}
                    >
                        {item.badge}
                    </motion.div>
                )}
            </div>
            
            {/* Bottom info section with darker MapleStory-style background */}
            <div className="p-2 sm:p-3 md:p-4 bg-[#1a1a1a] border-t border-gray-700/50">
                <h3 className="text-white font-bold text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 truncate">{item.title}</h3>
                
                <div className="flex items-center justify-between">
                    <motion.div
                        whileHover={{ scale: 1.15, x: 2 }}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-900/50 border-2 border-yellow-400/60 rounded-lg"
                    >
                        <span className="text-yellow-300 text-[10px] sm:text-xs md:text-sm font-bold flex items-center gap-1 sm:gap-1.5">
                            <span className="text-yellow-400 text-xs sm:text-sm">💎</span>
                            <span className="whitespace-nowrap">{item.commits.toLocaleString()} Commits</span>
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

export default function BrowserModal({ type, onClose, onPermissionError }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    
    // Memoize data access to prevent unnecessary recalculations
    const data = useMemo(() => contentData[type], [type]);
    const isCashShop = useMemo(() => type === 'projects' && data.items, [type, data.items]);
    const totalPages = useMemo(() => data.pages ? data.pages.length : 0, [data.pages]);
    const commits = 1247; // Hardcoded commit count

    // Memoize filtered items to prevent recalculation on every render
    const popularItems = useMemo(() => {
        return isCashShop ? data.items.filter(item => item.category === 'Popular') : [];
    }, [isCashShop, data.items]);

    const studentGovernmentItems = useMemo(() => {
        return isCashShop ? data.items.filter(item => item.category === 'Student Government') : [];
    }, [isCashShop, data.items]);

    const devOpsItems = useMemo(() => {
        return isCashShop ? data.items.filter(item => item.category === 'DevOps Projects') : [];
    }, [isCashShop, data.items]);

    const handleProjectClick = useCallback((project) => {
        setSelectedProject(project);
    }, []);

    const goNext = useCallback(() => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, totalPages]);

    const goPrev = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);

    const handleBackToShop = useCallback(() => {
        setSelectedProject(null);
    }, []);

    // Cash Shop Layout
    if (isCashShop) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-7xl h-full max-h-screen sm:max-h-[95vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Regular Browser Layout (for background, experience, etc.)
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
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

