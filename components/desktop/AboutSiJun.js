'use client';

import { useCallback, useEffect, useRef } from 'react';
import { FileText, Mail, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './AboutSiJun.module.css';

export default function AboutSiJun({ onClose, onNavigate, onNotificationHostChange }) {
    const { theme } = useTheme();
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const setDialogHost = useCallback(element => {
        dialogRef.current = element;
        onNotificationHostChange?.(element);
    }, [onNotificationHostChange]);

    useEffect(() => {
        const previousFocus = document.activeElement;
        closeRef.current?.focus();
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;
            const controls = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter(control => control.getClientRects().length > 0);
            const first = controls[0];
            const last = controls.at(-1);
            const focusNeedsBoundary = document.activeElement === dialogRef.current || !dialogRef.current.contains(document.activeElement);
            if (event.shiftKey && (document.activeElement === first || focusNeedsBoundary)) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && (document.activeElement === last || focusNeedsBoundary)) {
                event.preventDefault();
                first?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
    }, [onClose]);

    const navigate = target => {
        onClose();
        onNavigate(target);
    };

    return <div ref={setDialogHost} className={styles.overlay} data-theme={theme} role="dialog" aria-modal="true" aria-labelledby="about-si-jun-title" aria-describedby="about-si-jun-description" tabIndex={-1} onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
    }}>
        <section className={styles.window}>
            <header className={styles.titlebar}>
                <button ref={closeRef} className={styles.closeButton} type="button" aria-label="Close About Si Jun" onClick={onClose}><span><X size={10} aria-hidden="true" /></span></button>
                <h2 id="about-si-jun-title">About Si Jun</h2>
                <span className={styles.titlebarSpacer} aria-hidden="true" />
            </header>
            <div className={styles.content}>
                <div className={styles.hero}>
                    <div className={styles.portraitFrame}><img src="/background/avatars/Tech%20SiJun.jpg" alt="Si Jun Yang" width="88" height="88" /></div>
                    <h3>Si Jun Yang</h3>
                    <p id="about-si-jun-description">A Mac-inspired home for my work.</p>
                </div>
                <dl className={styles.specs} aria-label="Portfolio system information">
                    <div><dt>System</dt><dd>SiJunOS</dd></div>
                    <div><dt>Focus</dt><dd>Build. Operate. Improve.</dd></div>
                    <div><dt>Contact</dt><dd><a href="mailto:aersijun@gmail.com">aersijun@gmail.com</a></dd></div>
                </dl>
                <div className={styles.actions}>
                    <button type="button" onClick={() => navigate({ kind: 'resume' })}><FileText size={16} aria-hidden="true" />Résumé</button>
                    <button type="button" onClick={() => navigate({ kind: 'contact' })}><Mail size={16} aria-hidden="true" />Contact</button>
                </div>
            </div>
        </section>
    </div>;
}
