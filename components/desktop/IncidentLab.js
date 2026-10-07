'use client';

import { useEffect, useRef } from 'react';
import { Activity, CheckCircle2, Clock3, Maximize2, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { FAULT_COPY } from '../../data/sreDashboard';
import GrafanaPanel from './GrafanaPanel';
import styles from './IncidentLab.module.css';

const number = value => Math.round(value).toLocaleString('en-US');
const OPERATION_LABELS = { shield: 'Isolating the faulty machine', replace: 'Rebuilding replicas', expand: 'Adding storage capacity', rebalance: 'Redistributing data' };

export default function IncidentLab({ monitor, onResolve, modalState, onClose, onMinimize, onMaximize }) {
    const { theme } = useTheme();
    const dialogRef = useRef(null);
    const resolveButtonRef = useRef(null);
    const { cluster, faultId, resolving, lastRecovery } = monitor;
    const wasResolvingRef = useRef(resolving);
    const { metrics, operation, replicaGroups } = cluster;
    const visible = modalState !== 'minimized';
    const fault = FAULT_COPY[faultId];
    const healthyReplicas = replicaGroups.reduce((sum, group) => sum + group.healthy, 0);
    const totalReplicas = replicaGroups.reduce((sum, group) => sum + group.total, 0);
    const hottest = Math.max(...cluster.machines.map(machine => machine.storage));
    const history = cluster.history.map(sample => ({ ...sample, errors: Number((100 - sample.success).toFixed(2)) }));
    const events = cluster.events.map(event => ({ ...event, message: event.level === 'success' ? 'Simulated fault resolved' : event.level === 'critical' ? 'Simulated fault detected' : 'Simulated health warning' }));
    const statusTitle = resolving ? 'Resolving fault…' : fault ? fault.title : 'All systems operational';
    const statusCopy = resolving ? fault.recovery : fault ? fault.summary : lastRecovery ? 'Fault resolved. Replicas and request health checked; monitoring continues.' : 'Simulated faults appear occasionally. Resolve one and watch the signals recover.';

    useEffect(() => {
        if (!visible) return;
        const previousFocus = document.activeElement;
        dialogRef.current?.focus();
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                if (event.target.closest?.('[data-grafana-chart]')?.querySelector('[data-chart-tooltip]')) return;
                event.preventDefault(); event.stopPropagation(); onClose(); return;
            }
            if (event.key !== 'Tab') return;
            const controls = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')]
                .filter(element => element.getClientRects().length > 0);
            const first = controls[0]; const last = controls.at(-1);
            if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) {
                event.preventDefault(); last?.focus();
            } else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) {
                event.preventDefault(); first?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
    }, [visible, onClose]);

    useEffect(() => {
        if (wasResolvingRef.current && !resolving && visible) {
            const focused = document.activeElement;
            if (focused === resolveButtonRef.current || focused === document.body || focused === dialogRef.current) {
                dialogRef.current?.focus({ preventScroll: true });
            }
        }
        wasResolvingRef.current = resolving;
    }, [resolving, visible]);

    return <div className={styles.overlay} data-theme={theme} style={visible ? undefined : { display: 'none' }}>
        <section ref={dialogRef} className={`${styles.window} ${modalState === 'maximized' ? styles.maximized : ''}`} role="dialog" aria-modal="true" aria-labelledby="sre-dashboard-title" aria-describedby="sre-dashboard-description" tabIndex={-1} data-fault={faultId || 'none'} data-resolving={resolving} data-tick={cluster.tick}>
            <header className={styles.titlebar}>
                <div className={styles.windowControls} role="group" aria-label="SRE dashboard window controls">
                    <button className={styles.closeControl} onClick={onClose} aria-label="Close SRE dashboard"><X size={11} /></button>
                    <button className={styles.minimizeControl} onClick={onMinimize} aria-label="Minimize SRE dashboard"><span /></button>
                    <button className={styles.maximizeControl} onClick={onMaximize} aria-label={modalState === 'maximized' ? 'Restore SRE dashboard window' : 'Maximize SRE dashboard'}><Maximize2 size={10} /></button>
                </div>
                <strong id="sre-dashboard-title" className={styles.windowTitle}>SRE Dashboard</strong>
                <span className={styles.simulationBadge}><i />Simulation</span>
            </header>
            <p id="sre-dashboard-description" className="sr-only">A Grafana-style dashboard inspired by Si Jun's SRE experience. Random faults, machines, telemetry, and recovery outcomes are simulated.</p>
            <header className={styles.dashboardToolbar}>
                <div className={styles.dashboardBrand}><Activity size={20} aria-hidden="true" /><span>SRE <b>/</b> Distributed storage</span></div>
                <div className={styles.timeControls}><span className={styles.timeRange}><Clock3 size={13} aria-hidden="true" />Last 60 simulated seconds</span><span className={styles.live}><i />Live · 1s</span></div>
            </header>
            <div className={styles.workspace}>
                <div className={styles.content}>
                    <div className={styles.context}><span>From my SRE experience</span><span>Machine health · capacity · replica recovery</span></div>
                    <section className={styles.statusBanner} data-state={resolving ? 'resolving' : fault ? 'fault' : 'healthy'} aria-label="Current simulated alert">
                        {fault ? <TriangleAlert size={20} aria-hidden="true" /> : <CheckCircle2 size={20} aria-hidden="true" />}
                        <div className={styles.statusMessage} role="status" aria-live="polite" aria-atomic="true"><h1>{statusTitle}</h1><p>{statusCopy}</p></div>
                        {fault && <button ref={resolveButtonRef} type="button" className={styles.resolveButton} onClick={onResolve} disabled={resolving}><ShieldCheck size={16} aria-hidden="true" />{resolving ? 'Resolving…' : 'Resolve fault'}</button>}
                    </section>
                    {resolving && operation && <div className={styles.operation}><span>{OPERATION_LABELS[operation.type]}</span><progress value={operation.progress} max="100" aria-label="Current recovery operation" /><span>{operation.progress}%</span></div>}
                    <dl className={styles.metrics} aria-label="Current simulated cluster metrics">
                        <div data-warning={metrics.latency > 150}><dt>Response time</dt><dd>{number(metrics.latency)}<small> ms</small></dd><span>p95 · healthy ≤150 ms</span></div>
                        <div data-warning={metrics.success < 99.9}><dt>Failed requests</dt><dd>{Number((100 - metrics.success).toFixed(2))}<small>%</small></dd><span>Healthy ≤0.1%</span></div>
                        <div data-warning={healthyReplicas < totalReplicas}><dt>Healthy replicas</dt><dd>{healthyReplicas}<small> / {totalReplicas}</small></dd><span>Data copies across partitions</span></div>
                        <div data-warning={hottest > 85}><dt>Storage pressure</dt><dd>{number(hottest)}<small>%</small></dd><span>Most-used machine · limit 85%</span></div>
                    </dl>
                    <div className={styles.chartHeading}><h2>Cluster overview</h2><span>Grafana-style · synthetic telemetry</span></div>
                    <div className={styles.chartGrid}>
                        <GrafanaPanel id="sre-response-time" title="Response time" history={history} events={events} unit="ms" threshold={150} height={180} series={[{ key: 'latency', label: 'p95', color: 'var(--lab-green)', fill: true }]} />
                        <GrafanaPanel id="sre-failed-requests" title="Failed requests" history={history} events={events} unit="%" threshold={0.1} height={180} series={[{ key: 'errors', label: 'Errors', color: 'var(--lab-red)', fill: true }]} />
                        <GrafanaPanel id="sre-replicas" title="Replica availability" history={history} events={events} unit=" copies" max={10} height={180} series={[{ key: 'healthyReplicas', label: 'Healthy', color: 'var(--lab-green)', fill: true }, { key: 'totalReplicas', label: 'Total', color: 'var(--lab-blue)' }]} />
                        <GrafanaPanel id="sre-storage-pressure" title="Storage & resource pressure" history={history} events={events} unit="%" threshold={85} max={100} height={180} series={[{ key: 'peakStorage', label: 'Peak storage', color: 'var(--lab-purple)', fill: true }, { key: 'load', label: 'Resource load', color: 'var(--lab-amber)' }]} />
                    </div>
                    <footer className={styles.footer}><span>Fictional cluster · no production connection</span><span>Si Jun Yang · Platform engineering & SRE</span></footer>
                </div>
            </div>
        </section>
    </div>;
}
