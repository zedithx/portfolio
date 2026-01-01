'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuBar from '../components/desktop/MenuBar';
import Dock from '../components/desktop/Dock';
import Terminal from '../components/desktop/Terminal';
import BrowserModal from '../components/desktop/BrowserModal';
import PermissionModal from '../components/desktop/PermissionModal';
import GmailConfirmModal from '../components/desktop/GmailConfirmModal';
import GmailComposeModal from '../components/desktop/GmailComposeModal';
import SpotifyModal from '../components/desktop/SpotifyModal';

export default function Home() {
    const [activeModal, setActiveModal] = useState(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [permissionMessage, setPermissionMessage] = useState(null);
    const [terminalState, setTerminalState] = useState('normal'); // 'closed', 'minimized', 'normal', 'maximized'
    const [isGmailConfirmOpen, setIsGmailConfirmOpen] = useState(false);
    const [isGmailComposeOpen, setIsGmailComposeOpen] = useState(false);
    const [isGmailSuccessOpen, setIsGmailSuccessOpen] = useState(false);
    const [visitorEmail, setVisitorEmail] = useState('');
    const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
    const [spotifyModalState, setSpotifyModalState] = useState('normal'); // 'closed', 'minimized', 'normal', 'maximized'

    const handleCommand = useCallback((command) => {
        setActiveModal(command);
    }, []);

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

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-black">
            {/* Desktop Wallpaper */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat w-full h-full"
                style={{
                    backgroundImage: 'url("/wallpaper/desktop_wallpaper.jpg")'
                }}
            />

            <MenuBar onPermissionError={triggerPermissionError} />
            {terminalState !== 'closed' && (
                <Terminal 
                    onCommand={handleCommand} 
                    onClose={handleTerminalClose}
                    onMinimize={handleTerminalMinimize}
                    onMaximize={handleTerminalMaximize}
                    terminalState={terminalState}
                />
            )}
            <Dock 
                onPermissionError={triggerPermissionError}
                onGmailClick={handleGmailClick}
                onTerminalClick={handleTerminalRestore}
                onSpotifyClick={handleSpotifyClick}
                terminalState={terminalState}
                spotifyModalState={spotifyModalState}
            />

            {/* Browser Modal */}
            {activeModal && (
                <BrowserModal 
                    type={activeModal} 
                    onClose={closeModal}
                    onPermissionError={triggerPermissionError}
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
                        >
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✓</span>
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
        </div>
    );
}

