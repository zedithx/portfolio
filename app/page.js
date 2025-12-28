'use client';
import React, { useState } from 'react';
import MenuBar from '../components/desktop/MenuBar';
import Dock from '../components/desktop/Dock';
import Terminal from '../components/desktop/Terminal';
import BrowserModal from '../components/desktop/BrowserModal';
import PermissionModal from '../components/desktop/PermissionModal';

export default function Home() {
    const [activeModal, setActiveModal] = useState(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

    const handleCommand = (command) => {
        setActiveModal(command);
    };

    const closeModal = () => {
        setActiveModal(null);
        // Dispatch a custom event to clear the terminal
        window.dispatchEvent(new CustomEvent('clear-terminal'));
    };

    const triggerPermissionError = () => {
        setIsPermissionModalOpen(true);
    };

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
            <Terminal onCommand={handleCommand} />
            <Dock onPermissionError={triggerPermissionError} />

            {/* Browser Modal */}
            {activeModal && (
                <BrowserModal 
                    type={activeModal} 
                    onClose={closeModal} 
                />
            )}

            {/* Permission Denied Modal */}
            <PermissionModal 
                isOpen={isPermissionModalOpen} 
                onClose={() => setIsPermissionModalOpen(false)} 
            />
        </div>
    );
}

