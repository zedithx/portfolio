'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { advanceSreMonitor, beginFaultResolution, createSreMonitor, getFaultDelayMs, injectRandomFault } from '../lib/ambientSreSimulation.mjs';

export default function useSreMonitor() {
    const [monitor, setMonitor] = useState(createSreMonitor);
    const remainingRef = useRef(null);
    const hasRecovered = Boolean(monitor.lastRecovery);

    useEffect(() => {
        const interval = window.setInterval(() => {
            if (!document.hidden) setMonitor(advanceSreMonitor);
        }, 1000);
        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        if (monitor.faultId || monitor.resolving) {
            remainingRef.current = null;
            return;
        }
        if (remainingRef.current === null) remainingRef.current = getFaultDelayMs(Math.random, hasRecovered);
        let timer = null;
        let startedAt = null;
        const pause = () => {
            if (timer !== null) window.clearTimeout(timer);
            if (startedAt !== null) remainingRef.current = Math.max(0, remainingRef.current - (performance.now() - startedAt));
            timer = null;
            startedAt = null;
        };
        const resume = () => {
            if (document.hidden || timer !== null) return;
            startedAt = performance.now();
            timer = window.setTimeout(() => {
                timer = null;
                startedAt = null;
                remainingRef.current = null;
                setMonitor(injectRandomFault);
            }, remainingRef.current);
        };
        const onVisibility = () => document.hidden ? pause() : resume();
        document.addEventListener('visibilitychange', onVisibility);
        resume();
        return () => { pause(); document.removeEventListener('visibilitychange', onVisibility); };
    }, [monitor.faultId, monitor.resolving, hasRecovered]);

    const resolveFault = useCallback(() => setMonitor(beginFaultResolution), []);
    return { monitor, resolveFault };
}
