'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowUpRight, FileText, Folder, History, Mail, Search, UserRound, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { projectEvidence } from '../../lib/projectEvidence.mjs';
import { buildSpotlightEntries, searchSpotlight } from '../../lib/spotlightSearch.mjs';
import styles from './Spotlight.module.css';

const ICONS = { incident: Activity, project: Folder, experience: FileText, journey: History, about: UserRound, resume: FileText, contact: Mail };
const ENTRIES = buildSpotlightEntries(projectEvidence);

export default function Spotlight({ initialQuery = '', onClose, onNavigate }) {
    const { theme } = useTheme();
    const [query, setQuery] = useState(initialQuery);
    const [selected, setSelected] = useState(0);
    const inputRef = useRef(null);
    const dialogRef = useRef(null);
    const results = useMemo(() => searchSpotlight(ENTRIES, query), [query]);
    const selection = Math.min(selected, Math.max(0, results.length - 1));
    const result = results[selection];
    useEffect(() => {
        const previous = document.activeElement;
        inputRef.current?.focus();
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;
            const controls = [...dialogRef.current.querySelectorAll('input, button')].filter(element => element.getClientRects().length > 0);
            const focusIsOnControl = controls.includes(document.activeElement);
            if (event.shiftKey && (document.activeElement === controls[0] || !focusIsOnControl)) {
                event.preventDefault();
                controls.at(-1)?.focus();
            } else if (!event.shiftKey && (document.activeElement === controls.at(-1) || !focusIsOnControl)) {
                event.preventDefault();
                controls[0]?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
        };
    }, [onClose]);
    useEffect(() => {
        dialogRef.current?.querySelector(`[data-result-index="${selection}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [selection, query]);
    const choose = entry => { if (entry) onNavigate(entry.target); };
    const keyDown = event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setSelected(previous => Math.max(0, Math.min(results.length - 1, previous + (event.key === 'ArrowDown' ? 1 : -1))));
            inputRef.current?.focus();
        }
        if (event.key === 'Enter' && event.target === inputRef.current) { event.preventDefault(); choose(result); }
    };
    return <div className={styles.overlay} data-theme={theme} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
        <section className={styles.window} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="spotlight-title" onKeyDown={keyDown}>
            <div className={styles.searchRow}><Search size={23} /><label className="sr-only" id="spotlight-title" htmlFor="spotlight-query">Spotlight — search portfolio evidence</label><input id="spotlight-query" ref={inputRef} value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} placeholder="Search skills, projects, decisions…" autoComplete="off" autoCapitalize="off" spellCheck={false} role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="spotlight-results" aria-activedescendant={result ? `spotlight-${result.id}` : undefined} /><button onClick={onClose} aria-label="Close Spotlight"><X size={17} /></button></div>
            <div className={styles.resultsHeader}><span>{query.trim() ? `${results.length} matches` : 'Applications & projects'}</span><span>AWS · SRE · RFID · Architecture</span></div>
            <div id="spotlight-results" className={styles.results} role="listbox" aria-label="Portfolio search results">
                {results.length ? results.map((entry, index) => {
                    const Icon = entry.category === 'Project document' ? FileText : ICONS[entry.target.kind] || FileText;
                    return <button key={entry.id} id={`spotlight-${entry.id}`} role="option" aria-selected={index === selection} className={styles.result} data-selected={index === selection} data-result-index={index} onFocus={() => setSelected(index)} onMouseEnter={() => setSelected(index)} onClick={() => choose(entry)}><span className={styles.icon} data-kind={entry.target.kind}><Icon size={21} /></span><span className={styles.resultText}><strong>{entry.title}</strong><small>{entry.subtitle}</small></span><span className={styles.category}>{entry.category}</span><ArrowUpRight size={14} /></button>;
                }) : <div className={styles.empty}><Search size={26} /><strong>No matching evidence yet.</strong><p>Try AWS, SRE, Python, RFID, or a project name.</p><button onClick={() => { setQuery(''); setSelected(0); inputRef.current?.focus(); }}>Browse applications and projects</button></div>}
            </div>
            <footer className={styles.footer}><span><kbd>↑</kbd><kbd>↓</kbd> choose <kbd>↵</kbd> open <kbd>esc</kbd> close</span><span>Portfolio Spotlight <kbd>⌘ / Ctrl K</kbd></span></footer>
        </section>
    </div>;
}
