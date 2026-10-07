'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Activity, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { FAULT_COPY } from '../../data/sreDashboard';
import styles from './IncidentNotification.module.css';

export default function IncidentNotification({ monitor, blocked, dashboardOpen, portalHost, onOpen }) {
    const { theme } = useTheme();
    const [dismissedFault, setDismissedFault] = useState(null);
    const previousFocusRef = useRef(null);
    const lastShownRef = useRef(null);
    const notificationRef = useRef(null);
    const { faultId, faultSequence, resolving } = monitor;
    const fault = FAULT_COPY[faultId];
    const shown = Boolean(fault && !resolving && !blocked && dismissedFault !== faultSequence);

    useEffect(() => {
        if (dashboardOpen && fault) setDismissedFault(faultSequence);
    }, [dashboardOpen, fault, faultSequence]);

    useEffect(() => {
        if (shown && lastShownRef.current !== faultSequence) {
            previousFocusRef.current = document.activeElement;
            lastShownRef.current = faultSequence;
        }
    }, [shown, faultSequence]);

    const dismiss = () => {
        const restoreFocus = notificationRef.current?.contains(document.activeElement);
        setDismissedFault(faultSequence);
        if (restoreFocus) {
            const previous = previousFocusRef.current;
            if (previous instanceof HTMLElement && previous.isConnected && (!portalHost || portalHost.contains(previous))) {
                previous.focus({ preventScroll: true });
            } else if (portalHost) {
                const controls = [...portalHost.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]')];
                const fallback = controls.find(control => control.getClientRects().length && !notificationRef.current?.contains(control));
                (fallback || portalHost).focus({ preventScroll: true });
            }
        }
    };
    const open = () => { dismiss(); onOpen(); };

    if (!shown) return null;
    const notice = <aside ref={notificationRef} className={styles.notification} data-theme={theme} data-cluster-notification={faultSequence} aria-label="Simulated storage alert">
        <header className={styles.header}>
            <span className={styles.icon}><Activity size={18} aria-hidden="true" /></span>
            <div className={styles.sender}><strong>Cluster issue</strong><span>SRE Dashboard · Simulated alert</span></div>
            <button type="button" className={styles.dismiss} onClick={dismiss} aria-label="Dismiss simulated storage alert"><X size={15} aria-hidden="true" /></button>
        </header>
        <div className={styles.message} role="status">
            <h2>{fault.title}</h2><p>{fault.summary}</p>
        </div>
        <button type="button" className={styles.open} onClick={open}>View dashboard<ArrowRight size={14} aria-hidden="true" /></button>
    </aside>;
    return portalHost ? createPortal(notice, portalHost) : notice;
}
