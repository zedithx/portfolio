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
            max: 100,
            description: "Developing robust server-side applications and APIs using Node.js, Python, Ruby on Rails, and Go. Building scalable systems that handle real-world traffic.",
            subSkills: ["Node.js", "Python", "Ruby on Rails", "Go", "RESTful APIs", "Database Design"]
        },
        Frontend: {
            baseline: 0,
            max: 100,
            description: "Building modern, responsive user interfaces with React, Next.js, and TypeScript. Creating engaging user experiences that are both beautiful and performant.",
            subSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Responsive Design"]
        },
        Hardware: {
            baseline: 0,
            max: 100,
            description: "Working with physical computing, embedded systems, and hardware integration. Understanding the bridge between software and hardware.",
            subSkills: ["Embedded Systems", "IoT", "Hardware Integration"]
        },
        'Telegram Bots': {
            baseline: 0,
            max: 100,
            description: "Building interactive Telegram bots for automation, customer service, and user engagement. Creating seamless chat-based experiences.",
            subSkills: ["Bot API", "Webhooks", "Chat Automation"]
        },
        Deployment: {
            baseline: 0,
            max: 100,
            description: "Deploying applications to production environments. Managing releases, rollbacks, and ensuring zero-downtime deployments.",
            subSkills: ["CI/CD", "Docker", "Kubernetes", "Release Management"]
        },
        DevOps: {
            baseline: 0,
            max: 100,
            description: "Implementing CI/CD pipelines, monitoring systems, and infrastructure automation. Ensuring reliable deployments and system observability.",
            subSkills: ["CI/CD", "Grafana", "Prometheus", "Monitoring", "Automation"]
        },
        LLMs: {
            baseline: 0,
            max: 100,
            description: "Working with Large Language Models, AI integration, and natural language processing. Building intelligent applications powered by AI.",
            subSkills: ["OpenAI API", "Prompt Engineering", "AI Integration", "NLP"]
        },
        'Cloud Infrastructure': {
            baseline: 0,
            max: 100,
            description: "Designing and managing cloud infrastructure. Working with containerization, orchestration, and distributed systems.",
            subSkills: ["Docker", "Container Orchestration", "Cloud Architecture", "Service Networking"]
        },
        SRE: {
            baseline: 0,
            max: 100,
            locked: true,
            unlockThreshold: { Backend: 70, 'Cloud Infrastructure': 70, DevOps: 70 },
            description: "Site Reliability Engineering - ensuring systems are reliable, scalable, and maintainable. Combining software engineering practices with operations expertise.",
            subSkills: ["System Reliability", "Performance Optimization", "Incident Response", "Capacity Planning"]
        },
        // Non-Technical Skills
        'Product Management': {
            baseline: 0,
            max: 100,
            description: "Leading product development from conception to launch. Balancing user needs, business goals, and technical constraints.",
            subSkills: ["Roadmapping", "User Research", "Stakeholder Management", "Agile"]
        },
        Social: {
            baseline: 50,
            max: 100,
            description: "Building relationships, networking, and collaborating with teams. Effective communication and community engagement.",
            subSkills: ["Networking", "Communication", "Team Collaboration"]
        },
        Recreational: {
            baseline: 100,
            max: 100,
            description: "Personal interests and hobbies that contribute to work-life balance and creative thinking.",
            subSkills: ["Photography", "Gaming", "Reading"]
        }
    },
    journey: [
        {
            id: 1,
            title: "Victoria Secondary School",
            dialogues: [
                {
                    speaker: "hero",
                    text: "My journey began at Victoria Secondary School, where I first discovered my passion for technology and coding."
                },
                {
                    speaker: "hero",
                    text: "This was where I laid the foundation for my future in software development."
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
            skillsGained: { Frontend: 10, Backend: 5 },
            npc: {
                name: "The Teacher",
                avatar: "👨‍🏫",
                position: "right"
            },
            scene: "/background/victoria.jpg"
        },
        {
            id: 2,
            title: "Victoria Junior College",
            dialogues: [
                {
                    speaker: "hero",
                    text: "At Victoria Junior College, I continued to develop my technical skills and began exploring more advanced concepts."
                },
                {
                    speaker: "hero",
                    text: "This period helped me build a stronger foundation in programming and problem-solving."
                },
                {
                    speaker: "npc",
                    name: "The Mentor",
                    avatar: "👨‍💼",
                    text: "You're growing stronger. Keep pushing forward."
                }
            ],
            category: "Education",
            icon: "📚",
            skillsGained: { Frontend: 15, Backend: 10, 'Product Management': 5 },
            npc: {
                name: "The Mentor",
                avatar: "👨‍💼",
                position: "center"
            },
            scene: "/background/vjc.jpeg"
        },
        {
            id: 3,
            title: "Internship at Reluvate Technology",
            dialogues: [
                {
                    speaker: "hero",
                    text: "My first professional experience at Reluvate Technology opened my eyes to real-world software development."
                },
                {
                    speaker: "hero",
                    text: "I learned how to work in a team and deliver production-ready code."
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
            skillsGained: { Frontend: 20, Backend: 20, 'Product Management': 5 },
            npc: {
                name: "The Senior Developer",
                avatar: "👨‍💻",
                position: "right"
            },
            scene: "/background/reluvate.gif"
        },
        {
            id: 4,
            title: "Student Government - Frontend and Backend",
            dialogues: [
                {
                    speaker: "hero",
                    text: "In Student Government, I led technical projects, building both frontend and backend systems."
                },
                {
                    speaker: "hero",
                    text: "I was awarded 3 service awards for my tech contributions, recognizing my impact on the community."
                },
                {
                    speaker: "npc",
                    name: "The Council",
                    avatar: "👥",
                    text: "Your technical leadership has made a real difference. Congratulations on the awards."
                }
            ],
            category: "Student Government",
            icon: "🏛️",
            skillsGained: { Frontend: 25, Backend: 25, 'Product Management': 15, Social: 10 },
            npc: {
                name: "The Council",
                avatar: "👥",
                position: "left"
            },
            scene: "/background/Root-Student-Government.JPG"
        },
        {
            id: 5,
            title: "SUTD Design Thinking Module - Hardware",
            dialogues: [
                {
                    speaker: "hero",
                    text: "The Design Thinking Module at SUTD introduced me to hardware development and physical computing."
                },
                {
                    speaker: "hero",
                    text: "I learned to bridge the gap between software and hardware, creating integrated solutions."
                },
                {
                    speaker: "npc",
                    name: "The Engineer",
                    avatar: "🔧",
                    text: "You've mastered the art of connecting digital and physical worlds."
                }
            ],
            category: "Education",
            icon: "⚙️",
            skillsGained: { Hardware: 30, Frontend: 10, Backend: 10 },
            npc: {
                name: "The Engineer",
                avatar: "🔧",
                position: "right"
            },
            scene: "/background/DesignThinking.JPG"
        },
        {
            id: 6,
            title: "School Project Awards",
            dialogues: [
                {
                    speaker: "hero",
                    text: "I received recognition for my projects: 3rd Singtel Information System Award, Top 3 Dell Cloud Native Finalist, and 3rd Advisors Clique Student Leadership Award."
                },
                {
                    speaker: "hero",
                    text: "These awards validated my technical skills and leadership abilities."
                },
                {
                    speaker: "npc",
                    name: "The Judge",
                    avatar: "🏆",
                    text: "Your work stands out. These awards are well-deserved."
                }
            ],
            category: "Achievements",
            icon: "🏆",
            skillsGained: { 'Cloud Infrastructure': 20, DevOps: 15, 'Product Management': 20, Social: 10 },
            npc: {
                name: "The Judge",
                avatar: "🏆",
                position: "center"
            },
            scene: "/background/SchoolProjectAwards.JPG"
        },
        {
            id: 7,
            title: "DevOps Final Year Master Course",
            dialogues: [
                {
                    speaker: "hero",
                    text: "The DevOps Final Year Master Course deepened my understanding of infrastructure, automation, and cloud technologies."
                },
                {
                    speaker: "hero",
                    text: "I mastered CI/CD pipelines, containerization, and infrastructure as code."
                },
                {
                    speaker: "npc",
                    name: "The Architect",
                    avatar: "🏗️",
                    text: "You've become a true DevOps engineer. The infrastructure is your domain now."
                }
            ],
            category: "Education",
            icon: "🔧",
            skillsGained: { DevOps: 35, 'Cloud Infrastructure': 30, Deployment: 25 },
            npc: {
                name: "The Architect",
                avatar: "🏗️",
                position: "right"
            },
            scene: "/background/devopsMasterCourse.JPG"
        },
        {
            id: 8,
            title: "SUTD Contracted Work - AI Registration Chatbot",
            dialogues: [
                {
                    speaker: "hero",
                    text: "I developed an AI Registration Chatbot for SUTD, combining natural language processing with practical automation."
                },
                {
                    speaker: "hero",
                    text: "This project taught me how to build intelligent systems that interact with users naturally."
                },
                {
                    speaker: "npc",
                    name: "The Client",
                    avatar: "🤖",
                    text: "Your chatbot has transformed our registration process. Excellent work."
                }
            ],
            category: "Projects",
            icon: "🤖",
            skillsGained: { 'Telegram Bots': 30, LLMs: 25, Backend: 20, 'Product Management': 10 },
            npc: {
                name: "The Client",
                avatar: "🤖",
                position: "center"
            },
            scene: "/background/sutdcontractedwork.webp"
        },
        {
            id: 9,
            title: "Changi Airport Internship - Automation/SWE",
            dialogues: [
                {
                    speaker: "hero",
                    text: "At Changi Airport, I worked on automation and software engineering projects that improved operational efficiency."
                },
                {
                    speaker: "hero",
                    text: "I learned to build scalable systems that handle real-world traffic and critical operations."
                },
                {
                    speaker: "npc",
                    name: "The Manager",
                    avatar: "✈️",
                    text: "Your automation solutions have made a significant impact on our operations."
                }
            ],
            category: "Internship",
            icon: "✈️",
            skillsGained: { Backend: 30, DevOps: 20, Deployment: 20, 'Product Management': 15 },
            npc: {
                name: "The Manager",
                avatar: "✈️",
                position: "right"
            },
            scene: "/background/changiairport.webp"
        },
        {
            id: 10,
            title: "TSMC Internship - DevOps",
            dialogues: [
                {
                    speaker: "hero",
                    text: "At TSMC, I worked on DevOps infrastructure, managing complex systems and ensuring high availability."
                },
                {
                    speaker: "hero",
                    text: "This experience taught me how to maintain critical infrastructure at scale."
                },
                {
                    speaker: "npc",
                    name: "The Lead",
                    avatar: "🏭",
                    text: "You've proven yourself capable of handling enterprise-level infrastructure."
                }
            ],
            category: "Internship",
            icon: "🏭",
            skillsGained: { DevOps: 40, 'Cloud Infrastructure': 35, SRE: 20 },
            npc: {
                name: "The Lead",
                avatar: "🏭",
                position: "left"
            },
            scene: "/background/tsmc.webp"
        },
        {
            id: 11,
            title: "Tangled Startup - Project Management",
            dialogues: [
                {
                    speaker: "hero",
                    text: "At Tangled Startup, I took on project management responsibilities, leading cross-functional teams."
                },
                {
                    speaker: "hero",
                    text: "I learned to balance technical execution with business objectives and stakeholder management."
                },
                {
                    speaker: "npc",
                    name: "The Founder",
                    avatar: "🚀",
                    text: "Your leadership has been instrumental in our success. You've grown into a true product manager."
                }
            ],
            category: "Work",
            icon: "🚀",
            skillsGained: { 'Product Management': 40, Backend: 15, Frontend: 10, Social: 15 },
            npc: {
                name: "The Founder",
                avatar: "🚀",
                position: "center"
            },
            scene: "/background/tangled.jpeg"
        },
        {
            id: 12,
            title: "Bytedance Internship - SRE",
            dialogues: [
                {
                    speaker: "hero",
                    text: "At Bytedance, I worked as a Site Reliability Engineer, ensuring the reliability and performance of large-scale systems."
                },
                {
                    speaker: "hero",
                    text: "I mastered observability, incident response, and building resilient systems that serve millions of users."
                },
                {
                    speaker: "npc",
                    name: "The SRE Lead",
                    avatar: "🛡️",
                    text: "You've become a true SRE. Your skills in reliability engineering are exceptional."
                }
            ],
            category: "Internship",
            icon: "🛡️",
            skillsGained: { SRE: 50, DevOps: 30, 'Cloud Infrastructure': 30, Backend: 20 },
            npc: {
                name: "The SRE Lead",
                avatar: "🛡️",
                position: "right"
            },
            scene: "/background/bytedance.webp"
        }
    ],
    recreational: [
        {
            title: "Photography",
            description: "Capturing moments and exploring creative perspectives through the lens.",
            icon: "📸"
        },
        {
            title: "Gaming",
            description: "Enjoying strategy games and exploring virtual worlds in my free time.",
            icon: "🎮"
        },
        {
            title: "Reading",
            description: "Staying updated with tech blogs, system design books, and industry trends.",
            icon: "📚"
        }
    ],
    social: [
        {
            title: "Open Source Contributor",
            description: "Contributing to open source projects and sharing knowledge with the community.",
            icon: "💻"
        },
        {
            title: "Tech Meetups",
            description: "Attending and speaking at local developer meetups and conferences.",
            icon: "🤝"
        },
        {
            title: "Mentoring",
            description: "Helping junior developers grow and sharing experiences from my journey.",
            icon: "👥"
        }
    ]
};

