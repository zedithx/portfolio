// Project Data organized by category
export const projectData = {
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
                src: '/projects/project-icons/enableid/ocr.png',
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

// Color classes map
export const colorClassesMap = {
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
export const generateProjectContent = (project) => {
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
export const transformProjectsToItems = () => {
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

// About Me Skill Progression Data
export const aboutMeData = {
    hero: {
        name: "Yang Si Jun",
        avatar: "/projects/avatar/avatar.png",
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
            max: 100
        },
        LLMs: {
            baseline: 0,
            max: 100
        },
        'Cloud Infrastructure': {
            baseline: 0,
            max: 100
        },
        SRE: {
            baseline: 0,
            max: 100,
            locked: true,
            unlockThreshold: { Backend: 70, 'Cloud Infrastructure': 70, DevOps: 70 }
        },
        // Non-Technical Skills
        'Product Management': {
            baseline: 0,
            max: 100
        },
        Social: {
            baseline: 50,
            max: 100
        },
        Recreational: {
            baseline: 100,
            max: 100
        }
    },
    journey: [
        {
            id: 1,
            title: "Before Uni - Victoria School and Victoria Junior College",
            dialogues: [
                {
                    speaker: "hero",
                    text: "My journey began at Victoria Secondary School and continued at Victoria Junior College, where I first discovered my passion for technology and coding."
                },
                {
                    speaker: "hero",
                    text: "This period laid the foundation for my future in software development, teaching me the fundamentals of programming and problem-solving."
                },
                {
                    speaker: "npc",
                    name: "The Teacher",
                    avatar: "👨‍🏫",
                    text: "Every expert was once a beginner. Your journey starts here."
                }
            ],
            category: "Education",
            icon: "🎓",
            skillsGained: { Frontend: 15, Backend: 10, Social: 5 },
            npc: {
                name: "The Teacher",
                avatar: "👨‍🏫",
                position: "right"
            },
            scene: "/background/vjc.jpeg"
        },
        {
            id: 2,
            title: "Internship before University - Reluvate Technologies",
            dialogues: [
                {
                    speaker: "hero",
                    text: "My first professional experience at Reluvate Technologies opened my eyes to real-world software development in a startup environment."
                },
                {
                    speaker: "hero",
                    text: "I learned how to work in a fast-paced team, deliver production-ready code, and adapt to the dynamic nature of startup culture."
                },
                {
                    speaker: "npc",
                    name: "The Senior Developer",
                    avatar: "👨‍💻",
                    text: "You've shown great potential. Keep learning and growing."
                }
            ],
            category: "Internship",
            icon: "💼",
            skillsGained: { Frontend: 20, Backend: 20, 'Product Management': 10 },
            npc: {
                name: "The Senior Developer",
                avatar: "👨‍💻",
                position: "right"
            },
            scene: "/background/reluvate.gif"
        },
        {
            id: 3,
            title: "University - SUTD",
            dialogues: [
                {
                    speaker: "hero",
                    text: "At SUTD, I deepened my technical knowledge through rigorous coursework, design thinking modules, and hands-on projects."
                },
                {
                    speaker: "hero",
                    text: "I worked on hardware projects, built AI chatbots, led student government tech initiatives, and received recognition for my work through various awards."
                },
                {
                    speaker: "npc",
                    name: "The Professor",
                    avatar: "👨‍🏫",
                    text: "You've excelled in both technical and leadership roles. Your growth has been remarkable."
                }
            ],
            category: "Education",
            icon: "🏛️",
            skillsGained: { Frontend: 25, Backend: 25, Hardware: 20, 'Telegram Bots': 20, LLMs: 20, DevOps: 15, 'Cloud Infrastructure': 20, 'Product Management': 20, Social: 15 },
            npc: {
                name: "The Professor",
                avatar: "👨‍🏫",
                position: "center"
            },
            scene: "/background/sutdcontractedwork.webp"
        },
        {
            id: 4,
            title: "Internships - Changi Airport Group, TSMC, and Bytedance",
            dialogues: [
                {
                    speaker: "hero",
                    text: "I completed multiple internships at Changi Airport Group, TSMC, and Bytedance, each teaching me different aspects of software engineering."
                },
                {
                    speaker: "hero",
                    text: "From automation and software engineering at Changi Airport, to DevOps infrastructure at TSMC, to Site Reliability Engineering at Bytedance - each experience built upon the last."
                },
                {
                    speaker: "npc",
                    name: "The Mentor",
                    avatar: "👨‍💼",
                    text: "You've gained invaluable experience across different industries and roles. You're ready for what's next."
                }
            ],
            category: "Internship",
            icon: "🌐",
            skillsGained: { Backend: 30, DevOps: 40, 'Cloud Infrastructure': 35, SRE: 30, Deployment: 25, 'Product Management': 15 },
            npc: {
                name: "The Mentor",
                avatar: "👨‍💼",
                position: "right"
            },
            scene: "/background/bytedance.webp"
        },
        {
            id: 5,
            title: "Back to SUTD - Waiting for Full Time Job",
            dialogues: [
                {
                    speaker: "hero",
                    text: "Returning to SUTD to complete my studies, I'm now preparing for the next chapter of my journey."
                },
                {
                    speaker: "hero",
                    text: "With all the experiences I've gained, I'm ready to take on full-time opportunities and continue growing as a software engineer."
                },
                {
                    speaker: "npc",
                    name: "The Future",
                    avatar: "🚀",
                    text: "Your journey has prepared you well. The future holds great opportunities."
                }
            ],
            category: "Future",
            icon: "🚀",
            skillsGained: { Social: 10, 'Product Management': 10 },
            npc: {
                name: "The Future",
                avatar: "🚀",
                position: "center"
            },
            scene: "/background/sutdcontractedwork.webp"
        }
    ]
};

