'use client';
import React, { useState, useCallback } from 'react';
import MenuBar from '../components/desktop/MenuBar';
import Dock from '../components/desktop/Dock';
import Terminal from '../components/desktop/Terminal';
import BrowserModal from '../components/desktop/BrowserModal';
import PermissionModal from '../components/desktop/PermissionModal';

export default function Home() {
    const [activeModal, setActiveModal] = useState(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [permissionMessage, setPermissionMessage] = useState(null);
    const [terminalState, setTerminalState] = useState('normal'); // 'closed', 'minimized', 'normal', 'maximized'

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
                onTerminalClick={handleTerminalRestore}
                terminalState={terminalState}
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
        </div>
    );
}

