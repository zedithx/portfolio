'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import MenuBar from '../components/desktop/MenuBar';
import Dock from '../components/desktop/Dock';
import Terminal from '../components/desktop/Terminal';
import BrowserModal from '../components/desktop/BrowserModal';
import PermissionModal from '../components/desktop/PermissionModal';
import GmailConfirmModal from '../components/desktop/GmailConfirmModal';
import GmailComposeModal from '../components/desktop/GmailComposeModal';
import SpotifyModal from '../components/desktop/SpotifyModal';
import PDFViewer from '../components/desktop/PDFViewer';
import { Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import IncidentNotification from '../components/desktop/IncidentNotification';
import useSreMonitor from '../hooks/useSreMonitor';
import ClusterWarning, { useClusterWarning } from '../components/desktop/ClusterWarning';
import clusterWarningStyles from '../components/desktop/ClusterWarning.module.css';

const IncidentLab = dynamic(() => import('../components/desktop/IncidentLab'));
const AboutSiJun = dynamic(() => import('../components/desktop/AboutSiJun'));

export default function Home() {
    const { theme, mounted } = useTheme();
    // Always use dark mode until mounted to prevent hydration mismatch
    const isDark = mounted ? theme === 'dark' : true;
    const [activeModal, setActiveModal] = useState(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [permissionMessage, setPermissionMessage] = useState(null);
    const [terminalState, setTerminalState] = useState('normal'); // 'closed', 'minimized', 'normal', 'maximized'
    const [isGmailConfirmOpen, setIsGmailConfirmOpen] = useState(false);
    const [isGmailComposeOpen, setIsGmailComposeOpen] = useState(false);
    const [isGmailSuccessOpen, setIsGmailSuccessOpen] = useState(false);
    const [visitorEmail, setVisitorEmail] = useState('');
    const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
    const [spotifyModalState, setSpotifyModalState] = useState('closed'); // 'closed', 'minimized', 'normal', 'maximized'
    const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
    const [incidentLabState, setIncidentLabState] = useState('closed');
    const [aboutOpen, setAboutOpen] = useState(false);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [browserNotificationHost, setBrowserNotificationHost] = useState(null);
    const [aboutNotificationHost, setAboutNotificationHost] = useState(null);
    const [pdfNotificationHost, setPdfNotificationHost] = useState(null);
    const notificationHost = isPDFViewerOpen ? pdfNotificationHost : aboutOpen ? aboutNotificationHost : activeModal ? browserNotificationHost : null;
    // Browsing always counts. Only defer the visual cue during short menus/forms.
    const presentationBlocked = Boolean(isPermissionModalOpen || isGmailConfirmOpen || isGmailComposeOpen || isGmailSuccessOpen || isMenuActive);
    const { monitor, resolveFault } = useSreMonitor();
    const { visible: clusterWarningVisible, jitterSequence } = useClusterWarning({
        faultId: monitor.faultId,
        faultSequence: monitor.faultSequence,
        resolving: monitor.resolving,
        blocked: presentationBlocked,
    });

    const handleCommand = useCallback((command) => {
        setAboutOpen(false);
        setIncidentLabState(previous => previous === 'normal' || previous === 'maximized' ? 'minimized' : previous);
        setActiveModal(command);
    }, []);

    const openSreDashboard = useCallback(() => {
        setAboutOpen(false);
        setActiveModal(null);
        setIsPDFViewerOpen(false);
        setIncidentLabState('normal');
    }, []);

    const openAboutSiJun = useCallback(() => {
        setActiveModal(null);
        setIsPDFViewerOpen(false);
        setIncidentLabState(previous => previous === 'normal' || previous === 'maximized' ? 'minimized' : previous);
        setAboutOpen(true);
    }, []);
    const closeAbout = useCallback(() => setAboutOpen(false), []);
    const handleIncidentLabClick = useCallback(() => {
        if (incidentLabState === 'normal' || incidentLabState === 'maximized') setIncidentLabState('minimized');
        else openSreDashboard();
    }, [incidentLabState, openSreDashboard]);
    const closeIncidentLab = useCallback(() => setIncidentLabState('closed'), []);
    const minimizeIncidentLab = useCallback(() => setIncidentLabState('minimized'), []);
    const maximizeIncidentLab = useCallback(() => setIncidentLabState(previous => previous === 'maximized' ? 'normal' : 'maximized'), []);

    const closeModal = useCallback(() => {
        setActiveModal(null);
        // Dispatch a custom event to restore the welcome screen
        window.dispatchEvent(new CustomEvent('restore-terminal'));
    }, []);

    const triggerPermissionError = useCallback((message) => {
        setPermissionMessage(message);
        setIsPermissionModalOpen(true);
    }, []);

    const handleTerminalClose = useCallback(() => {
        setTerminalState('closed');
    }, []);

    const handleTerminalMinimize = useCallback(() => {
        setTerminalState('minimized');
    }, []);

    const handleTerminalMaximize = useCallback(() => {
        setTerminalState(prevState => prevState === 'maximized' ? 'normal' : 'maximized');
    }, []);

    const handleTerminalRestore = useCallback(() => {
        setTerminalState(prevState => {
            if (prevState === 'normal' || prevState === 'maximized') {
                return 'minimized';
            } else {
                return 'normal';
            }
        });
    }, []);

    const closePermissionModal = useCallback(() => {
        setIsPermissionModalOpen(false);
        setPermissionMessage(null);
    }, []);

    const handleGmailClick = useCallback(() => {
        setIsGmailConfirmOpen(true);
    }, []);

    const handleGmailConfirm = useCallback((email) => {
        setVisitorEmail(email);
        setIsGmailConfirmOpen(false);
        setIsGmailComposeOpen(true);
    }, []);

    const handleGmailCancel = useCallback(() => {
        setIsGmailConfirmOpen(false);
    }, []);

    const closeGmailCompose = useCallback(() => {
        setIsGmailComposeOpen(false);
        setVisitorEmail('');
    }, []);

    const handleGmailSuccess = useCallback(() => {
        setIsGmailSuccessOpen(true);
    }, []);

    const closeGmailSuccess = useCallback(() => {
        setIsGmailSuccessOpen(false);
    }, []);

    const handleSpotifyClick = useCallback(() => {
        setIsSpotifyOpen(true);
        setSpotifyModalState(prevState => {
            if (prevState === 'minimized' || prevState === 'closed') {
                return 'normal';
            }
            return prevState;
        });
    }, []);

    const closeSpotifyModal = useCallback(() => {
        setIsSpotifyOpen(false);
        setSpotifyModalState('closed');
    }, []);

    const handleSpotifyMinimize = useCallback(() => {
        setSpotifyModalState('minimized');
    }, []);

    const handleSpotifyMaximize = useCallback(() => {
        setSpotifyModalState(prevState => prevState === 'maximized' ? 'normal' : 'maximized');
    }, []);

    const handleOpenPDF = useCallback(() => {
        setIsPDFViewerOpen(true);
    }, []);

    const handleClosePDF = useCallback(() => {
        setIsPDFViewerOpen(false);
        // Dispatch a custom event to restore the welcome screen
        window.dispatchEvent(new CustomEvent('restore-terminal'));
    }, []);

    const handleAboutNavigate = useCallback(target => {
        setAboutOpen(false);
        if (target.kind === 'resume') handleOpenPDF();
        if (target.kind === 'contact') handleGmailClick();
    }, [handleOpenPDF, handleGmailClick]);

    return (
        <main className={`min-h-screen w-full relative overflow-hidden bg-black ${jitterSequence !== null ? clusterWarningStyles.jitter : ''}`} data-cluster-jitter={jitterSequence ?? undefined} role="application" aria-label="Yang Si Jun's Portfolio — macOS Desktop">
            <h1 className="sr-only">Yang Si Jun — Software Developer Portfolio</h1>
            <ClusterWarning visible={clusterWarningVisible} sequence={monitor.faultSequence} />
            {/* Desktop Wallpaper */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat w-full h-full"
                style={{
                    backgroundImage: isDark ? 'url("/wallpaper/desktop_wallpaper.jpg")' : 'url("/wallpaper/desktop_wallpaper_light.webp")',
                    imageRendering: 'auto',
                    WebkitImageRendering: 'auto',
                    backgroundAttachment: 'fixed'
                }}
            />

            <MenuBar onPermissionError={triggerPermissionError} onAboutSiJun={openAboutSiJun} onMenuActivityChange={setIsMenuActive} />
            <IncidentNotification
                blocked={presentationBlocked || incidentLabState === 'normal' || incidentLabState === 'maximized'}
                monitor={monitor}
                portalHost={notificationHost}
                dashboardOpen={incidentLabState === 'normal' || incidentLabState === 'maximized'}
                onOpen={openSreDashboard}
            />
            {terminalState !== 'closed' && (
                <Terminal 
                    onCommand={handleCommand} 
                    onClose={handleTerminalClose}
                    onMinimize={handleTerminalMinimize}
                    onMaximize={handleTerminalMaximize}
                    terminalState={terminalState}
                    onOpenPDF={handleOpenPDF}
                />
            )}
            <Dock 
                onPermissionError={triggerPermissionError}
                onGmailClick={handleGmailClick}
                onTerminalClick={handleTerminalRestore}
                onSpotifyClick={handleSpotifyClick}
                terminalState={terminalState}
                spotifyModalState={spotifyModalState}
                onIncidentLabClick={handleIncidentLabClick}
                incidentLabState={incidentLabState}
                sreFaultActive={Boolean(monitor.faultId)}
                sreResolving={monitor.resolving}
            />

            {incidentLabState !== 'closed' && (
                <IncidentLab monitor={monitor} onResolve={resolveFault} modalState={incidentLabState} onClose={closeIncidentLab} onMinimize={minimizeIncidentLab} onMaximize={maximizeIncidentLab} />
            )}
            {aboutOpen && <AboutSiJun onClose={closeAbout} onNavigate={handleAboutNavigate} onNotificationHostChange={setAboutNotificationHost} />}

            {/* Browser Modal */}
            {activeModal && (
                <BrowserModal 
                    type={activeModal} 
                    onClose={closeModal}
                    onPermissionError={triggerPermissionError}
                    onNotificationHostChange={setBrowserNotificationHost}
                />
            )}

            {/* Permission Denied Modal */}
            <PermissionModal 
                isOpen={isPermissionModalOpen} 
                onClose={closePermissionModal}
                message={permissionMessage}
            />

            {/* Gmail Confirm Modal */}
            <GmailConfirmModal
                isOpen={isGmailConfirmOpen}
                onConfirm={handleGmailConfirm}
                onCancel={handleGmailCancel}
            />

            {/* Gmail Compose Modal */}
            <GmailComposeModal
                isOpen={isGmailComposeOpen}
                onClose={closeGmailCompose}
                visitorEmail={visitorEmail}
                onPermissionError={triggerPermissionError}
                onSuccess={handleGmailSuccess}
            />

            {/* Gmail Success Modal */}
            <AnimatePresence>
                {isGmailSuccessOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-[90%] max-w-[400px] bg-[#1e1e1e]/90 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl p-6 text-center"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Message sent successfully"
                        >
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-6 h-6 text-green-400" aria-hidden="true" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
                            <p className="text-white/70 text-sm mb-6">
                                Message sent successfully! I'll get back to you soon.
                            </p>
                            <button
                                onClick={closeGmailSuccess}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                            >
                                OK
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Spotify Modal */}
            <SpotifyModal
                isOpen={isSpotifyOpen}
                onClose={closeSpotifyModal}
                onPermissionError={triggerPermissionError}
                onMinimize={handleSpotifyMinimize}
                onMaximize={handleSpotifyMaximize}
                modalState={spotifyModalState}
            />

            {/* PDF Viewer */}
            <PDFViewer
                isOpen={isPDFViewerOpen}
                onNotificationHostChange={setPdfNotificationHost}
                onClose={handleClosePDF}
                pdfUrl="/resume/Yang Si Jun Resume.pdf"
                title="Yang Si Jun's Resume"
            />
        </main>
    );
}
