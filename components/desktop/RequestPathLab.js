'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Database, Pause, Play, RotateCcw, Search, Server, SkipForward, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { REQUEST_SCENARIOS, advanceRequestSimulation, applyRequestAction, createRequestSimulation, triggerRequestIncident } from '../../lib/requestSimulation.mjs';
import IncidentGuide from './IncidentGuide';
import GrafanaPanel from './GrafanaPanel';
import styles from './RequestPathLab.module.css';

const POLICIES = { naive: 'Immediate retries', aggressive: 'Immediate retries ×3', bounded: 'Limited retries with backoff' };
const EXPERIMENTS = [
    { id: 'naive', label: 'Retry harder (×3)', description: 'Adds repeated attempts to the same request path.', caution: true },
    { id: 'bounded', label: 'Bound retries + back off', description: 'Limits repeated attempts; requests may take longer.' },
    { id: 'scale', label: 'Add four workers', description: 'Adds capacity and cost. Cannot restore unavailable storage.' },
    { id: 'restore', label: 'Restore storage service', description: 'Models storage availability returning after three simulated steps.' },
];
const formatted = value => Number(value).toLocaleString('en-US');

function nextGuide(state) {
    if (!state.scenarioId) return { step: 'start', tone: 'neutral', status: 'Ready to start', title: 'Get requests flowing again', description: 'Choose a fictional incident. Inspect the cause, choose a response, and check that it worked.', action: 'start', label: 'Start incident' };
    if (state.phase === 'resolved') return { step: 'done', tone: 'success', status: 'Recovery verified', title: 'Requests are healthy again', description: state.scenarioId === 'traffic' ? 'You limited repeated work, added capacity, and confirmed that queued work drained.' : 'You restored simulated storage availability, limited repeated work, and confirmed that requests recovered.', action: 'reset', label: 'Try another incident' };
    if (!state.inspected) return { step: 'inspect', tone: 'warning', status: 'Incident started · inspect first', title: state.scenarioId === 'traffic' ? 'Traffic has jumped above capacity' : 'Storage reads are timing out', description: 'Inspect the request path. Is worker capacity insufficient, or is the fictional storage service unavailable?', action: 'inspect', label: 'Inspect request path' };
    if (state.operation?.status === 'running') return { step: 'respond', tone: 'working', status: 'Recovery operation running', title: state.operation.id === 'scale' ? 'New workers are starting' : 'Storage availability is recovering', description: state.operation.id === 'scale' ? 'This operation has three simulated stages. Completion is followed by a check of request health.' : 'After three simulated steps, storage reads respond again. Then check errors, response time, and queued work.', action: 'advance', label: 'Advance 5 simulated seconds' };
    if (state.policy !== 'bounded') return { step: 'respond', tone: 'warning', status: 'Cause inspected', title: 'Limit repeated requests first', description: 'Immediate retries add more work when requests fail. Limit retries and spread them out before fixing the cause.', action: 'bounded', label: 'Limit retries' };
    if (state.scenarioId === 'traffic' && state.workers < 6) return { step: 'respond', tone: 'warning', status: 'Retries limited · more capacity needed', title: 'Add capacity for the traffic spike', description: 'Storage reads respond, but two workers cannot keep up. Add four workers, then watch queued work drain.', action: 'scale', label: 'Add four workers' };
    if (!state.serviceReady) return { step: 'respond', tone: 'warning', status: 'Retries limited · storage unavailable', title: 'Restore storage availability', description: 'More workers cannot fix this fault. Simulate storage reads responding again, then verify request recovery.', action: 'restore', label: 'Restore storage service' };
    if (state.healthyTicks >= 3) return { step: 'verify', tone: 'success', status: 'Ready to verify', title: 'Confirm that recovery holds', description: 'Three consecutive healthy samples have arrived. Verify the result before declaring the incident resolved.', action: 'verify', label: 'Verify request recovery' };
    return { step: 'verify', tone: 'working', status: 'Watching request recovery', title: state.metrics.queue >= 25 ? 'Let queued work drain' : 'Check that healthy requests last', description: state.metrics.queue >= 25 ? 'The operation completed, but queued work still needs to drain. Watch request health as simulated time advances.' : 'Requests look healthier. Collect three consecutive healthy samples before verifying recovery.', action: 'advance', label: 'Advance 5 simulated seconds' };
}

export default function RequestPathLab({ active = true }) {
    const { theme } = useTheme();
    const [state, setState] = useState(createRequestSimulation);
    const [paused, setPaused] = useState(true);
    const [timeRange, setTimeRange] = useState(60);
    const [incidentChoice, setIncidentChoice] = useState('traffic');
    const [incidentStart, setIncidentStart] = useState(null);
    const actionDescriptionId = useId();
    const autoAdvance = useRef(false);
    const { metrics, operation, feedback, phase } = state;
    const busy = operation?.status === 'running';
    const scenario = REQUEST_SCENARIOS.find(item => item.id === state.scenarioId);
    const choice = REQUEST_SCENARIOS.find(item => item.id === incidentChoice);
    const history = state.history.filter(sample => sample.tick >= state.tick - timeRange);
    const guide = nextGuide(state);
    const facts = [
        { label: 'Failed requests', value: `${metrics.errors}%`, reference: 'Target: under 1%', tone: metrics.errors < 1 ? 'success' : 'warning' },
        { label: 'Response time', value: `${formatted(metrics.latency)} ms`, reference: '95th percentile · target: under 250 ms', tone: metrics.latency < 250 ? 'success' : 'warning' },
        { label: 'Queued work', value: formatted(metrics.queue), reference: 'Waiting attempts · target: under 25', tone: metrics.queue < 25 ? 'success' : 'warning' },
    ];
    autoAdvance.current = active && !paused && phase !== 'resolved';

    useEffect(() => {
        if (!active || paused || phase === 'resolved') return;
        const timer = window.setInterval(() => {
            if (autoAdvance.current && !document.hidden) setState(advanceRequestSimulation);
        }, 1000);
        return () => window.clearInterval(timer);
    }, [active, paused, phase]);

    useEffect(() => {
        if (phase === 'verifying') {
            autoAdvance.current = false;
            setPaused(true);
        }
    }, [phase]);

    const reset = () => {
        autoAdvance.current = false;
        setPaused(true);
        setIncidentStart(null);
        setState(createRequestSimulation());
    };
    const choose = () => {
        const next = triggerRequestIncident(state, incidentChoice);
        autoAdvance.current = false;
        setPaused(true);
        setIncidentStart({ tick: next.tick, ...next.metrics });
        setState(next);
    };
    const act = id => {
        if (id === 'inspect' || id === 'bounded' || id === 'naive') {
            autoAdvance.current = false;
            setPaused(true);
        } else if ((id === 'scale' || id === 'restore') && state.inspected && !busy && phase !== 'resolved') {
            autoAdvance.current = active;
            setPaused(false);
        }
        setState(previous => applyRequestAction(previous, id));
    };
    const step = () => setState(previous => {
        let next = previous;
        for (let tick = 0; tick < 5; tick += 1) next = advanceRequestSimulation(next);
        return next;
    });
    const togglePaused = () => {
        autoAdvance.current = active && paused && phase !== 'resolved';
        setPaused(!paused);
    };
    const primaryAction = () => {
        if (guide.action === 'start') choose();
        else if (guide.action === 'reset') reset();
        else if (guide.action === 'advance') step();
        else act(guide.action);
    };
    const PrimaryIcon = guide.action === 'inspect' ? Search : guide.action === 'verify' || guide.action === 'reset' ? CheckCircle2 : guide.action === 'advance' ? SkipForward : ArrowRight;

    return <div className={styles.lab} data-theme={theme} aria-label="Request path incident simulation" data-phase={phase}>
        <div className={styles.toolbar} aria-label="Request simulation controls">
            <span className={styles.simulated}>Simulated request service</span><time>t + {state.tick}s</time>
            <button type="button" disabled={phase === 'resolved'} onClick={togglePaused} aria-label={phase === 'resolved' ? 'Request simulation complete' : paused ? 'Resume request simulation' : 'Pause request simulation'}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}{phase === 'resolved' ? 'Complete' : paused ? 'Resume' : 'Pause'}</button>
            <button type="button" onClick={reset} aria-label="Reset request simulation"><RotateCcw size={14} aria-hidden="true" />Reset</button>
        </div>

        <IncidentGuide id="request-guide" activeStep={guide.step} status={guide.status} tone={guide.tone} title={guide.title} description={guide.description} facts={facts}>
            <div className={styles.guideAction}>
                {!scenario && <label className={styles.scenarioControl}><span>Choose an incident</span><select aria-label="Request incident scenario" value={incidentChoice} onChange={event => setIncidentChoice(event.target.value)}>{REQUEST_SCENARIOS.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>}
                {busy && <div className={styles.operation} data-status={operation.status}><strong>{operation.label}</strong><div role="progressbar" aria-label={operation.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={operation.progress}><span style={{ width: `${operation.progress}%` }} /></div><span>{operation.progress}% · simulated {operation.id === 'restore' ? 'availability step' : 'stage'} {Math.min(3, operation.step + 1)} of 3</span></div>}
                {guide.step === 'verify' && guide.action === 'advance' && <div className={styles.sampleProgress}><span>Consecutive healthy samples</span><strong>{Math.min(3, state.healthyTicks)} / 3</strong></div>}
                {phase === 'resolved' && incidentStart && <div className={styles.outcome} aria-label="Request recovery before and after"><p>Incident start → verified recovery</p><dl><div><dt>Failed requests</dt><dd>{incidentStart.errors}% <ArrowRight size={12} aria-hidden="true" />{metrics.errors}%</dd></div><div><dt>Response time</dt><dd>{formatted(incidentStart.latency)} ms <ArrowRight size={12} aria-hidden="true" />{formatted(metrics.latency)} ms</dd></div><div><dt>Queued work</dt><dd>{formatted(incidentStart.queue)} <ArrowRight size={12} aria-hidden="true" />{formatted(metrics.queue)}</dd></div></dl></div>}
                <button type="button" className={styles.primaryButton} onClick={primaryAction} aria-label={guide.action === 'start' ? `Start ${choice.title.toLowerCase()}` : guide.label}><PrimaryIcon size={17} aria-hidden="true" />{guide.label}</button>
                {state.inspected && phase !== 'resolved' && <div className={styles.evidence} aria-label="Inspected request evidence"><span><Users size={13} aria-hidden="true" />{formatted(metrics.incoming)} new requests/s · {formatted(metrics.capacity)} capacity/s</span><span data-healthy={state.serviceReady}><Database size={13} aria-hidden="true" />Storage reads: {state.serviceReady ? 'responding' : 'timing out'} · simulated</span></div>}
                {scenario && state.policy === 'bounded' && phase !== 'resolved' && state.healthyTicks < 3 && <p className={styles.retryHint}>Retries now have a limit. Errors and response time may rise while queued work waits for capacity or storage availability.</p>}
                <p className={styles.actionHint}>{guide.action === 'advance' ? paused ? 'Advance five simulated seconds to collect more samples.' : 'Time is running: one sample per second. You can also advance five simulated seconds.' : guide.action === 'start' ? 'Synthetic telemetry. No live systems are connected.' : guide.action === 'scale' ? 'More capacity adds cost. Completion still needs a recovery check.' : guide.action === 'restore' ? 'This models availability returning. Check requests afterward.' : guide.action === 'verify' ? 'Check: responding storage reads, limited retries, and three healthy request samples.' : guide.action === 'reset' ? 'Compared with the moment you started this incident.' : paused ? 'Time is paused for your next decision.' : 'Time is running. Pause to inspect without added pressure.'}</p>
                {feedback?.type === 'warning' && state.inspected && <div className={styles.feedback} role="status">{feedback.message}</div>}
            </div>
        </IncidentGuide>

        <div className={styles.healthCharts} aria-label="Request health charts">
            <GrafanaPanel id="request-latency" title="Response time (P95)" history={history} events={state.events} unit="ms" threshold={250} height={215} series={[{ key: 'latency', label: 'P95', color: 'var(--rq-green)', fill: true }]} />
            <GrafanaPanel id="request-errors" title="Failed requests" history={history} events={state.events} unit="%" threshold={1} max={100} height={215} series={[{ key: 'errors', label: 'Errors', color: 'var(--rq-amber)' }]} />
        </div>

        <details className={styles.details}>
            <summary>Technical details <span>Request path, retry comparison, queue, and event log</span></summary>
            <div className={styles.detailsContent}>
                <div className={styles.path} aria-label="Simplified request path"><span><Users size={14} aria-hidden="true" />Clients</span><ArrowRight size={12} aria-hidden="true" /><span><Server size={14} aria-hidden="true" />{state.workers} workers</span><ArrowRight size={12} aria-hidden="true" /><span data-warning={!state.serviceReady}><Database size={14} aria-hidden="true" />Storage service: {state.serviceReady ? 'available' : 'unavailable'}</span></div>
                <div className={styles.currentValues}><span>New requests <strong>{formatted(metrics.incoming)}/s</strong></span><span>All attempts <strong>{formatted(metrics.attempts)}/s</strong></span><span>Retry policy <strong>{POLICIES[state.policy]}</strong></span></div>
                <label className={styles.rangeControl}><span>Chart history</span><select value={timeRange} onChange={event => setTimeRange(Number(event.target.value))} aria-label="Request chart time range"><option value={30}>Last 30 simulated seconds</option><option value={60}>Last 60 simulated seconds</option></select></label>
                <div className={styles.detailCharts}>
                    <GrafanaPanel id="request-traffic" title="Traffic and retries" history={history} events={state.events} unit="/s" height={235} series={[{ key: 'incoming', label: 'New requests', color: 'var(--rq-blue)' }, { key: 'retries', label: 'Retry attempts', color: 'var(--rq-orange)' }, { key: 'capacity', label: 'Serving capacity', color: 'var(--rq-green)', fill: true }]} />
                    <GrafanaPanel id="request-queue" title="Queued work" history={history} events={state.events} unit=" attempts" height={235} legendMode="table" series={[{ key: 'queue', label: 'Pending attempts', color: 'var(--rq-purple)' }]} />
                </div>
                <section className={styles.experiments} aria-label="Optional request decisions"><h3>Compare other decisions</h3><p>After inspection, try an alternative and watch what changes. These actions use the same model and recovery checks.</p><div className={styles.experimentActions}>{EXPERIMENTS.map(action => <button type="button" key={action.id} aria-label={`Experiment: ${action.label}`} aria-describedby={`${actionDescriptionId}-${action.id}`} disabled={!scenario || !state.inspected || busy || phase === 'resolved' || (action.id === 'scale' && state.workers === 6) || (action.id === 'restore' && state.serviceReady)} data-caution={action.caution} onClick={() => act(action.id)}><strong>{action.label}</strong><small id={`${actionDescriptionId}-${action.id}`}>{action.description}</small></button>)}</div><div className={styles.secondaryActions}><button type="button" disabled={!scenario || busy || phase === 'resolved'} onClick={() => act('inspect')}>Reinspect request path</button><button type="button" disabled={!scenario || busy || phase === 'resolved'} onClick={() => act('verify')}>Check recovery now</button><button type="button" disabled={phase === 'resolved'} onClick={step}>Advance 5 simulated seconds</button></div>{feedback && <p className={styles.technicalFeedback} role="status">{feedback.message}</p>}</section>
                <section className={styles.events} aria-label="Request simulation event log"><h3>Event log</h3><p>Latest first · simulated time · synthetic events</p><table><thead><tr><th scope="col">Time</th><th scope="col">Level</th><th scope="col">Event</th></tr></thead><tbody>{state.events.slice(-6).reverse().map(event => <tr key={event.id} data-level={event.level}><td><time>t + {event.tick}s</time></td><td>{event.level}</td><td>{event.message}</td></tr>)}</tbody></table></section>
                <footer className={styles.footer}><span>This fictional path models idempotent storage reads and binary availability. Serving capacity is zero when storage is unavailable, even with workers online. No network probes, partial failures, or production recovery sequence are modeled. Backoff limits repeated work; availability and all telemetry are simulated.</span><a href="https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" target="_blank" rel="noopener noreferrer">Read the retry design principle ↗</a></footer>
            </div>
        </details>
    </div>;
}
