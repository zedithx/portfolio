// A deterministic teaching model of idempotent storage reads with binary availability.
// All telemetry and recovery steps are synthetic; no network health probe is modeled.
// Retry tradeoff: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
export const REQUEST_SCENARIOS = [
    { id: 'traffic', title: 'Traffic spike', description: 'New requests exceed worker capacity. Immediate retries add more work to the same overloaded path.' },
    { id: 'failure', title: 'Storage service unavailable', description: 'Storage reads time out. More workers cannot restore storage availability; limit retries while the fictional service recovers.' },
];

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const round = value => Math.round(value * 10) / 10;
const addEvent = (state, level, message) => ({ ...state, events: [...state.events, { id: state.nextEvent, tick: state.tick, level, message }].slice(-32), nextEvent: state.nextEvent + 1 });
const feedback = (state, type, message) => addEvent({ ...state, feedback: { type, message } }, type === 'warning' ? 'warning' : type, message);

function sample(state, advanceQueue = true, countHealthy = true) {
    const capacity = state.serviceReady ? state.workers * 120 : 0;
    const factor = state.policy === 'aggressive' ? 3 : state.policy === 'naive' ? 1.1 : .12 * [.7, 1, .85][state.tick % 3];
    const retries = Math.round(state.incoming * state.metrics.errors / 100 * factor);
    const attempts = state.incoming + retries;
    const queue = advanceQueue ? clamp(state.metrics.queue + attempts - capacity, 0, 12000) : state.metrics.queue;
    const errors = !capacity ? 100 : clamp(.2 + Math.max(0, (attempts - capacity) / attempts * 100) + Math.min(25, queue / 400), .2, 99.9);
    const latency = !capacity ? 5000 : clamp(70 + queue / capacity * 350 + Math.max(0, attempts / capacity - 1) * 450, 70, 8000);
    const metrics = { incoming: state.incoming, retries, attempts, capacity, queue: Math.round(queue), errors: round(errors), latency: Math.round(latency) };
    const healthy = state.serviceReady && state.policy === 'bounded' && metrics.queue < 25 && metrics.errors < 1 && metrics.latency < 250 && capacity > attempts;
    const healthyTicks = healthy ? state.healthyTicks + (countHealthy ? 1 : 0) : 0;
    const phase = state.scenarioId ? (healthyTicks >= 3 ? 'verifying' : healthy ? 'recovering' : 'incident') : 'healthy';
    return { ...state, metrics, healthyTicks, phase: state.operation?.status === 'running' ? 'operating' : phase, history: [...state.history, { tick: state.tick, ...metrics }].slice(-60) };
}

export function createRequestSimulation() {
    let state = {
        tick: 0, phase: 'healthy', scenarioId: null, incoming: 120, workers: 2, serviceReady: true, policy: 'bounded', inspected: false,
        healthyTicks: 0, operation: null, feedback: null, history: [], events: [], nextEvent: 1,
        metrics: { incoming: 120, retries: 0, attempts: 120, capacity: 240, queue: 0, errors: .2, latency: 70 },
    };
    for (let tick = 0; tick < 30; tick += 1) state = sample({ ...state, tick });
    return addEvent(state, 'info', 'Baseline: two workers, 120 new requests/s, bounded retries. All values are synthetic.');
}

export function triggerRequestIncident(previous, id) {
    if (!REQUEST_SCENARIOS.some(scenario => scenario.id === id)) return previous;
    const baseline = createRequestSimulation();
    const state = sample({ ...baseline, scenarioId: id, incoming: id === 'traffic' ? 560 : 120, serviceReady: id !== 'failure', policy: 'naive', healthyTicks: 0, tick: baseline.tick + 1 });
    return feedback(state, 'warning', id === 'traffic' ? 'Traffic jumped to 560 requests/s against 240 attempts/s of capacity. Watch retry amplification and pending attempts.' : 'The fictional storage service is unavailable. Storage reads time out; immediate retries create additional queued work.');
}

export function advanceRequestSimulation(previous) {
    if (previous.phase === 'resolved') return previous;
    let state = { ...previous, tick: previous.tick + 1 };
    if (previous.operation?.status === 'running') {
        const step = previous.operation.step + 1;
        const completed = step >= 3;
        state.operation = { ...previous.operation, step, progress: Math.min(100, Math.round(step / 3 * 100)), status: completed ? 'completed' : 'running' };
        if (completed) {
            if (previous.operation.id === 'scale') state.workers = 6;
            if (previous.operation.id === 'restore') state.serviceReady = true;
            state = feedback(state, 'success', previous.operation.id === 'scale' ? 'Four additional workers are ready. Capacity is now 720 attempts/s when storage reads respond; pending attempts still need to drain.' : 'Three simulated availability steps are complete: storage reads respond again. Watch the queue drain and verify request recovery.');
        }
    }
    return sample(state);
}

export function applyRequestAction(previous, id) {
    if (!['inspect', 'naive', 'bounded', 'scale', 'restore', 'verify'].includes(id)) return previous;
    if (!previous.scenarioId || previous.phase === 'resolved') return feedback(previous, 'warning', 'Choose a new incident before acting.');
    if (previous.operation?.status === 'running') return feedback(previous, 'warning', 'An operation is still running. Wait for its simulated steps to complete before starting another action.');
    if (id === 'inspect') return feedback({ ...previous, inspected: true }, 'info', previous.scenarioId === 'traffic' ? 'Storage reads respond in this model, but incoming work exceeds capacity. Immediate retries amplify overload. Bound retries and add enough processing capacity.' : 'Storage reads time out in this model: the service is unavailable. Bounded retries reduce amplification; restore storage availability before verifying recovery.');
    if (id === 'naive') return feedback(sample({ ...previous, policy: 'aggressive', healthyTicks: 0 }, false, false), 'warning', 'Retry limit increased to ×3 with no wait. More attempts compete for the same capacity; latency and errors can worsen.');
    if (id === 'bounded') return feedback(sample({ ...previous, policy: 'bounded', healthyTicks: 0 }, false, false), 'info', 'Retry budget capped at 12% of new traffic, with backoff and staggered arrival in this model. This protects capacity but does not fix the underlying fault.');
    if (id === 'verify') {
        if (previous.healthyTicks < 3) return feedback(previous, 'warning', 'Recovery is not verified: require responding storage reads, bounded retries, queue below 25, errors below 1%, and latency below 250 ms for three consecutive samples.');
        return feedback({ ...previous, phase: 'resolved' }, 'success', 'Recovery verified across three samples: queue drained, errors below 1%, latency below 250 ms, and retry budget bounded.');
    }
    if (!previous.inspected) return feedback(previous, 'warning', 'Inspect the request path first so the action addresses the bottleneck.');
    if (id === 'scale' && previous.workers === 6) return feedback(previous, 'warning', 'Additional workers are already online. Inspect storage read responses and pending attempts instead.');
    if (id === 'restore' && previous.serviceReady) return feedback(previous, 'warning', 'Storage reads already respond in this model. The remaining issue is request pressure, retry amplification, or queued work.');
    return feedback({ ...previous, phase: 'operating', operation: { id, label: id === 'scale' ? 'Provisioning four workers' : 'Simulating storage recovery', progress: 0, status: 'running', step: 0 }, healthyTicks: 0 }, 'info', id === 'scale' ? 'Workers are provisioning. This adds cost and cannot restore unavailable storage.' : 'This models availability only: after three simulated steps, storage reads respond again. No health probe or production recovery sequence runs. Completion still requires request verification.');
}
