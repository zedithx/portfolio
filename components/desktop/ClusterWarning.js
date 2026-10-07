'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ClusterWarning.module.css';

export function useClusterWarning({ faultId, faultSequence, resolving, blocked }) {
    const [hidden, setHidden] = useState(true);
    const [jitterSequence, setJitterSequence] = useState(null);
    const lastPlayed = useRef(null);
    const visible = Boolean(faultId && !blocked && !hidden);

    useEffect(() => {
        const updateVisibility = () => setHidden(document.hidden);
        updateVisibility();
        document.addEventListener('visibilitychange', updateVisibility);
        return () => document.removeEventListener('visibilitychange', updateVisibility);
    }, []);

    useEffect(() => {
        if (!visible || resolving) return;
        if (lastPlayed.current === faultSequence) return;
        lastPlayed.current = faultSequence;
        setJitterSequence(faultSequence);
        const timer = window.setTimeout(() => setJitterSequence(null), 560);
        return () => {
            window.clearTimeout(timer);
            setJitterSequence(null);
        };
    }, [visible, resolving, faultSequence]);

    return { visible, jitterSequence };
}

export default function ClusterWarning({ visible, sequence }) {
    const { theme } = useTheme();
    if (!visible) return null;
    return <div className={styles.warning} data-theme={theme} data-cluster-warning={sequence} aria-hidden="true" />;
}
