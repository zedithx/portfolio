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
                src: '/projects/bulkify/bulkify.png',
                gradient: 'from-blue-400 to-purple-500'
            },
            techIcons: [
                '/projects/tech-icons/java.webp',
                '/projects/tech-icons/firebase.png'
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
                src: '/projects/enableid/ocr.png',
                gradient: 'from-pink-500 to-rose-600'
            },
            techIcons: [
                '/projects/tech-icons/next.webp',
                '/projects/tech-icons/rubyonrails.png'
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
                src: '/projects/nightfiesta/rfid.png',
                gradient: 'from-indigo-500 to-purple-600'
            },
            techIcons: [
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/django.png'
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
                src: '/projects/monitoring-suite/cicd.png',
                gradient: 'from-blue-500 to-indigo-600'
            },
            techIcons: [
                '/projects/tech-icons/go.png',
                '/projects/tech-icons/grafana.png',
                '/projects/tech-icons/prometheus.png'
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
                src: '/projects/container-networking/container.png',
                gradient: 'from-slate-500 to-slate-700'
            },
            techIcons: [
                '/projects/tech-icons/docker.png',
                '/projects/tech-icons/python.webp',
                '/projects/tech-icons/rubyonrails.png'
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
                title: 'Experience',
                content: (
                    <div className="space-y-4 sm:space-y-5 md:space-y-8">
                        {/* ByteDance */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/bytedance_logo.png" alt="ByteDance" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">ByteDance</h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mt-0.5 sm:mt-1 font-medium leading-snug">Software Engineer (SRE) Intern</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-tight">Data Infrastructure SRE Team</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-tight">Sep 2025 - Dec 2025</p>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mt-2 sm:mt-0">
                                Worked on ByteGraph, ByteDance's distributed graph database, focusing on monitoring, on-call responsibilities, and machine operations for production clusters across Singapore and Europe.
                            </p>
                        </div>

                        {/* Tangled Social */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-4 border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/tangled_logo.jpeg" alt="Tangled Social" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Tangled Social</h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mt-0.5 sm:mt-1 font-medium leading-snug">Co-founder, Software Engineer</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-tight">July 2025 - Current</p>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mt-2 sm:mt-0">
                                Co-founded a social platform, provisioning AWS infrastructure with Terraform and developing a real-time chat system using AWS WebSocket Gateway, Lambda, and DynamoDB. Contributed to ~80% of the codebase.
                            </p>
                        </div>

                        {/* TSMC */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-4 border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/TSMC.png" alt="TSMC" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Taiwan Semiconductor Manufacturing Company (TSMC)</h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mt-0.5 sm:mt-1 font-medium leading-snug">Software Engineer (DevOps) Intern</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-tight">Intelligent Eng-System Mask Team</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-tight">June 2025 - Aug 2025</p>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mt-2 sm:mt-0">
                                Integrated OpenTelemetry tracing with Spring Boot Starter across 10+ TSMC fabrication labs, engineered auto-generation of test scenarios with Grafana Tempo, and built auto sanity check mechanisms using Prometheus metrics.
                            </p>
                        </div>

                        {/* Changi Airport Group */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-4 border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/Changi_Airport_logo.png" alt="Changi Airport Group" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Changi Airport Group</h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mt-0.5 sm:mt-1 font-medium leading-snug">Software Engineer Intern</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-tight">API Gateway and Microservices Team</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-tight">Jan 2025 - May 2025</p>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mt-2 sm:mt-0">
                                Engineered a production-grade, event-driven serverless Slack bot for airport flight operations, implemented centralized CloudWatch log extraction across multiple AWS accounts, and built two production microservices secured behind Apigee API Gateway.
                            </p>
                        </div>

                        {/* ROOTech */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-4 border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/root.jpeg" alt="ROOTech" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">ROOTech - Student Government</h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mt-0.5 sm:mt-1 font-medium leading-snug">Software Engineer</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-tight">Nov 2024 - Mar 2025</p>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mt-2 sm:mt-0">
                                Developed key event webpages and Telegram Bots serving 1,600 students, led the integration of custom RFID bands for a Game Booth Carnival System, and built an AI Chatbot with event pass image generation for Open House 2025 registration, which was used by 1,800 public visitors over 2 days.
                            </p>
                        </div>

                        {/* Reluvate Technologies */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-4 border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-md sm:shadow-lg flex-shrink-0 p-1 sm:p-1.5 md:p-2 border border-gray-200">
                                    <img src="/experience/reluvate_logo.jpeg" alt="Reluvate Technologies" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Reluvate Technologies</h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mt-0.5 sm:mt-1 font-medium leading-snug">Software Engineer Intern</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-tight">Payment Platform Team</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-tight">Feb 2022 – Jul 2022</p>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mt-2 sm:mt-0">
                                Engineered core backend functionalities of a Django-based merchant admin portal for a payment platform used by over 1,860 merchants in Singapore, including major brands like KOI, Watsons, and Zara.
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
        "content": "Hi, I'm Si Jun, a Full-Stack/Devops/Site Reliability Engineer. My coding journey started during my army days, \
        where I decided to try learning coding and I quickly got hooked. I went through Harvard's CS50 course and an Udemy course on the Django framework,\
         which later helped me land an internship at Reluvate Technologies, where Django was used for client projects. During Reluvate, I worked on the backend ofa payment platform\
        which was used by notable merchants such as KOI, Watsons and Zara. Today that Payment Platform is used by over 1,860 merchants in Singapore. \
        By the end of the internship, I realised that I really enjoyed coding and loved the feeling of making changes to products that people actually use in the real world."
    },
    "university": {
        "title": "University Life",
        "content": "At SUTD, being surrounded by many strong software engineers, especially those from polytechnic backgrounds, pushed me to grow quickly. \
        A classmate encouraged me to join the student government's tech department, which at the time felt like a casual decision but ended up becoming \
        one of the most defining parts of my university life. \n\nI went on to build the frontend site for SUTD's largest annual event, Night Fiesta 2024,\
         followed by the websites for Orientation 2024 and LCC 2024, and led the implementation of an RFID-based game carnival system end-to-end\
          (custom RFID bands from a supplier in China, RFID readers, and the supporting software). \
          I also built multiple Telegram bots to run event logistics and engagement. Through these projects, my frontend skills grew rapidly, \
          and I deepened my deployment and backend skills by repeatedly shipping and operating production-facing tools for the school.\
          \n\nI also tend to become hyper-focused when building things. \
          At SUTD, I often treated projects like a full-time job, pulling late nights to get them to a \
          level I was proud of while traditional studying took a backseat. In a few weeks, I picked up hardware and embedded programming from scratch, \
          and in my computer science modules I pushed my teams and myself to ship products that felt polished and real. Across several modules, \
          our projects consistently ranked top three in the cohort and picked up awards."
    },
    "internshipsInUniversity": {
        "title": "Internships in university",
        "content": "In my 3rd year of university, SUTD had a long school break of 8 months after my exchange. \
        I completed internships at Changi Airport Group, TSMC, and ByteDance while juggling my studies, \
         each teaching me different aspects of software engineering. From automation and software engineering at Changi Airport, \
         to DevOps infrastructure and telemetry at TSMC, to finally getting to Site Reliability Engineering at Bytedance - each experience built upon the last."
    },
    "whatsNext": {
        "title": "What's next?",
        "content": "Returning to SUTD to complete my studies, I'm now preparing for the next chapter of my journey. \
        With all the experiences I've gained, I'm ready to take on my full-time job and continue growing in this software domain."
    }
};

