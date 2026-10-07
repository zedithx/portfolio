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
                            subtitle="Site Reliability Engineer / Platform Automation"
                            onToggleToInformal={onToggleToInformal}
                        />

                        {/* Main Content */}
                        <ContentSection isDark={isDark} prefersReducedMotion={prefersReducedMotion}>
                            <div className={`space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>
                                    I'm a Software Engineer (SRE) at ByteDance, with hands-on experience building, operating, and scaling production systems across payments, automation, and large-scale infrastructure. My core strengths are observability, operational automation, and reliability engineering for systems that run in the real world.
                                </p>
                                
                                <p>
                                    I started my software engineering journey during military service, completing Harvard CS50 and Django-focused coursework before joining Reluvate Technologies as a Backend Engineer Intern. There, I worked on a production payment platform supporting 1,860+ merchants in Singapore, including Watsons, Zara, and KOI — gaining early exposure to payments, reliability, and real production constraints.
                                </p>
                                
                                <div className="space-y-2 sm:space-y-3">
                                    <p>
                                        Since then, my experience has progressively deepened into automation, infrastructure, and SRE:
                                    </p>
                                    <ul className={`list-disc list-outside space-y-2 ml-5 sm:ml-6 md:ml-8 pl-1.5 sm:pl-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <li>At Changi Airport Group, I built a chatbot automation tool for optimising our airport operations on serverless, event-driven architectures.</li>
                                        <li>At TSMC, I worked on Telemetry and DevOps/SRE infrastructure at industrial scale.</li>
                                        <li>During my ByteDance internship, I worked on ByteGraph monitoring, automation, and service reliability.</li>
                                        <li>I now work full-time at ByteDance on platform engineering and operational automation for distributed storage, including HBase, ByteKV, and TokaDB. My tooling covers storage expansion in response to utilization alerts, machine replacement, configuration management, infrastructure tracking, and administrative CLI usability.</li>
                                    </ul>
                                </div>

                                <p>
                                    In my current role, I investigate partition and replica-group issues using Grafana, shell tools, jump servers, and Go/Python code, drawing on Raft and RocksDB concepts.
                                </p>
                                
                                <div className="space-y-2 sm:space-y-3">
                                    <p>
                                        During my time at the Singapore University of Technology and Design (SUTD), I was a core contributor to Student Government's Tech Department, where I repeatedly shipped and operated production systems for campus-wide events. This included:
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
                                    Alongside my full-time SRE role, I continue to build and iterate on Tangled as its co-founder and software engineer. Tangled is a live App Store social platform with 4k+ users, bringing together real-time chat, cloud infrastructure, and production operations.
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
