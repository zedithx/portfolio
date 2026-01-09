'use client';
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import BrowserChrome from './BrowserChrome';
import PageHeader from './PageHeader';
import ContentSection from './ContentSection';
import ContactSection from './ContactSection';

export default function FormalAboutMeView({ onToggleToInformal, onClose }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const prefersReducedMotion = typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        : false;

    return (
        <>
            <BrowserChrome 
                isDark={isDark}
                title="About Me"
                url="portfolio.dev/about-me"
                onClose={onClose}
            />

            {/* Browser Content */}
            <div className={`flex-1 rounded-b-xl border border-t-0 overflow-hidden flex flex-col ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
                        <PageHeader
                            isDark={isDark}
                            title="Si Jun Yang"
                            subtitle="Full-Stack / DevOps / Site Reliability Engineer"
                            onToggleToInformal={onToggleToInformal}
                        />

                        {/* Main Content */}
                        <ContentSection isDark={isDark} prefersReducedMotion={prefersReducedMotion}>
                            <div className={`space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>
                                    I'm a Full-Stack and Site Reliability Engineer with hands-on experience building, operating, and scaling production systems across payments, automation, and large-scale infrastructure. My work spans backend development, cloud infrastructure, and reliability engineering, with a strong focus on systems that run in the real world.
                                </p>
                                
                                <p>
                                    I started my software engineering journey during military service, completing Harvard CS50 and Django-focused coursework before joining Reluvate Technologies as a Backend Engineer Intern. There, I worked on a production payment platform supporting 1,860+ merchants in Singapore, including Watsons, Zara, and KOI — gaining early exposure to payments, reliability, and real production constraints.
                                </p>
                                
                                <div className="space-y-2 sm:space-y-3">
                                    <p>
                                        Since then, my experience has progressively deepened into automation, infrastructure, and SRE:
                                    </p>
                                    <ul className={`list-disc list-outside space-y-2 ml-5 sm:ml-6 md:ml-8 pl-1.5 sm:pl-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <li>At Changi Airport Group, I built Automation and Chatbot Safetyystems on serverless, event-driven architectures.</li>
                                        <li>At TSMC, I worked on Telemetry and DevOps/SRE infrastructure at industrial scale.</li>
                                        <li>At ByteDance, I focused on Site Reliability Engineering, including Monitoring, Automation, and Service Reliability for Large-Scale Systems.</li>
                                    </ul>
                                </div>
                                
                                <div className="space-y-2 sm:space-y-3">
                                    <p>
                                        Alongside internships, I've been a core contributor to Student Government's Tech Department at the Singapore University of Technology and Design (SUTD), where I repeatedly shipped and operated production systems for campus-wide events. This included:
                                    </p>
                                    <ul className={`list-disc list-outside space-y-2 ml-5 sm:ml-6 md:ml-8 pl-1.5 sm:pl-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                        </ContentSection>

                        <ContactSection 
                            isDark={isDark} 
                            prefersReducedMotion={prefersReducedMotion}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

