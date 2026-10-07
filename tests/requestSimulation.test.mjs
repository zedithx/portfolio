import test from 'node:test';
import assert from 'node:assert/strict';
import { applyRequestAction, advanceRequestSimulation, createRequestSimulation, triggerRequestIncident } from '../lib/requestSimulation.mjs';

const tick = (state, count = 1) => {
    for (let index = 0; index < count; index += 1) state = advanceRequestSimulation(state);
    return state;
};
const act = (state, ...actions) => actions.reduce((current, action) => applyRequestAction(current, action), state);

test('healthy baseline is bounded and histories are deterministic', () => {
    const state = createRequestSimulation();
    assert.deepEqual(state, createRequestSimulation());
    assert.equal(state.phase, 'healthy');
    assert.equal(state.metrics.queue, 0);
    assert.ok(state.metrics.errors < 1);
});

test('traffic overload and aggressive retries visibly amplify work', () => {
    const incident = tick(triggerRequestIncident(createRequestSimulation(), 'traffic'), 3);
    const aggressive = tick(applyRequestAction(incident, 'naive'));
    const bounded = tick(applyRequestAction(incident, 'bounded'));
    assert.ok(aggressive.metrics.retries > bounded.metrics.retries);
    assert.ok(aggressive.metrics.queue > bounded.metrics.queue);
    assert.ok(aggressive.metrics.latency > bounded.metrics.latency);
    assert.ok(aggressive.metrics.errors > bounded.metrics.errors);
});

test('traffic recovery needs diagnosis, bounded retries, staged capacity, drain, explicit verification', () => {
    let state = triggerRequestIncident(createRequestSimulation(), 'traffic');
    const guarded = applyRequestAction(state, 'scale');
    assert.equal(guarded.operation, null);
    assert.match(guarded.feedback.message, /Inspect/);
    state = act(state, 'inspect', 'bounded', 'scale');
    assert.equal(state.workers, 2);
    assert.equal(state.operation.progress, 0);
    state = tick(state, 3);
    assert.equal(state.workers, 6);
    assert.equal(state.operation.status, 'completed');
    assert.notEqual(state.phase, 'resolved');
    state = tick(state, 40);
    assert.equal(state.phase, 'verifying');
    state = applyRequestAction(state, 'verify');
    assert.equal(state.phase, 'resolved');
    assert.equal(advanceRequestSimulation(state), state);
});

test('more workers do not repair an unavailable dependency', () => {
    let state = act(triggerRequestIncident(createRequestSimulation(), 'failure'), 'inspect', 'bounded', 'scale');
    state = tick(state, 3);
    assert.equal(state.workers, 6);
    assert.equal(state.serviceReady, false);
    assert.equal(state.metrics.capacity, 0);
    assert.equal(state.metrics.errors, 100);
    assert.notEqual(applyRequestAction(state, 'verify').phase, 'resolved');
    state = tick(applyRequestAction(state, 'restore'), 3);
    assert.equal(state.serviceReady, true);
    state = tick(state, 40);
    assert.equal(applyRequestAction(state, 'verify').phase, 'resolved');
});

test('service restoration with bounded retries drains work without mandatory scale', () => {
    let state = act(triggerRequestIncident(createRequestSimulation(), 'failure'), 'inspect', 'bounded', 'restore');
    state = tick(state, 30);
    assert.equal(state.workers, 2);
    assert.equal(state.phase, 'verifying');
    assert.equal(applyRequestAction(state, 'verify').phase, 'resolved');
});

test('early verification and overlapping operations cannot claim recovery', () => {
    let state = act(triggerRequestIncident(createRequestSimulation(), 'traffic'), 'inspect', 'scale');
    const blocked = applyRequestAction(state, 'bounded');
    assert.equal(blocked.policy, 'naive');
    assert.equal(blocked.operation.id, 'scale');
    state = tick(state, 3);
    assert.notEqual(applyRequestAction(state, 'verify').phase, 'resolved');
    assert.match(applyRequestAction(state, 'verify').feedback.message, /not verified/);
});

test('clicking actions cannot manufacture consecutive healthy time samples', () => {
    let state = act(triggerRequestIncident(createRequestSimulation(), 'failure'), 'inspect', 'bounded', 'restore');
    state = tick(state, 20);
    assert.ok(state.healthyTicks >= 3);
    state = applyRequestAction(state, 'bounded');
    assert.equal(state.healthyTicks, 0);
    state = act(state, 'inspect', 'inspect', 'inspect');
    assert.equal(state.healthyTicks, 0);
    assert.notEqual(applyRequestAction(state, 'verify').phase, 'resolved');
    state = tick(state, 3);
    assert.equal(applyRequestAction(state, 'verify').phase, 'resolved');
});

test('state stays immutable, bounded, and resets all intervention state', () => {
    const original = createRequestSimulation();
    const snapshot = JSON.stringify(original);
    let incident = tick(applyRequestAction(triggerRequestIncident(original, 'failure'), 'naive'), 200);
    assert.equal(JSON.stringify(original), snapshot);
    assert.equal(incident.history.length, 60);
    assert.ok(incident.events.length <= 32);
    assert.ok(incident.metrics.queue <= 12000);
    assert.ok(incident.metrics.latency <= 8000);
    assert.ok(incident.metrics.errors <= 100);
    incident = triggerRequestIncident(incident, 'traffic');
    assert.equal(incident.workers, 2);
    assert.equal(incident.inspected, false);
    assert.equal(incident.operation, null);
    assert.equal(triggerRequestIncident(incident, 'unknown'), incident);
    assert.equal(applyRequestAction(incident, 'unknown'), incident);
});
