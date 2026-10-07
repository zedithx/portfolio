'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import EvidenceDocument from './EvidenceDocument';
import styles from './ProjectFinder.module.css';

export default function ProjectQuickLook({ project, fileId, isDark, onFileChange, onClose, onOriginal }) {
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    const titleId = useId();
    const index = Math.max(0, project.files.findIndex(file => file.id === fileId));
    const file = project.files[index];

    useEffect(() => {
        const previousFocus = document.activeElement;
        closeRef.current?.focus();
        return () => { if (previousFocus?.isConnected) previousFocus.focus(); };
    }, []);

    useEffect(() => {
        const handleKey = event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopImmediatePropagation();
                onClose();
                return;
            }
            if ((event.key === ' ' || event.code === 'Space') && !event.target.closest('button, a, input, textarea, select, video')) {
                event.preventDefault();
                event.stopImmediatePropagation();
                onClose();
                return;
            }
            if (!event.target.closest('input, textarea, select, video') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                const next = index + (event.key === 'ArrowRight' ? 1 : -1);
                if (next >= 0 && next < project.files.length) onFileChange(project.files[next].id);
            }
            if (event.key === 'Tab') {
                const controls = [...panelRef.current.querySelectorAll('button:not(:disabled), a[href], video[controls], [tabindex="0"]')].filter(control => control.getClientRects().length);
                const first = controls[0];
                const last = controls.at(-1);
                if (event.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
                    event.preventDefault(); last?.focus();
                } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) {
                    event.preventDefault(); first?.focus();
                }
            }
        };
        window.addEventListener('keydown', handleKey, true);
        return () => window.removeEventListener('keydown', handleKey, true);
    }, [index, onClose, onFileChange, project]);

    return createPortal(
        <div className={styles.quickLookOverlay} data-project-quick-look data-theme={isDark ? 'dark' : 'light'} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
            <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.quickLook}>
                <header className={styles.quickLookHeader}>
                    <button ref={closeRef} onClick={onClose} aria-label="Close Quick Look"><X size={18} aria-hidden="true" /></button>
                    <div><strong id={titleId}>{file.title}</strong><span>{project.title}</span></div>
                    <div className={styles.quickLookNavigation}>
                        <button disabled={index === 0} onClick={() => onFileChange(project.files[index - 1].id)} aria-label="Previous evidence file"><ChevronLeft size={18} aria-hidden="true" /></button>
                        <span>{index + 1} / {project.files.length}</span>
                        <button disabled={index === project.files.length - 1} onClick={() => onFileChange(project.files[index + 1].id)} aria-label="Next evidence file"><ChevronRight size={18} aria-hidden="true" /></button>
                    </div>
                </header>
                <div className={styles.quickLookContent} tabIndex={0} aria-label="Quick Look document">
                    <EvidenceDocument project={project} file={file} onOriginal={onOriginal} />
                </div>
                <footer className={styles.quickLookFooter}>Arrow keys browse files · Escape closes the preview</footer>
            </div>
        </div>, document.body,
    );
}
