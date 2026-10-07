import test from 'node:test';
import assert from 'node:assert/strict';
import { triggerIncident } from '../lib/incidentSimulation.mjs';
import {
  createSreMonitor,
  injectRandomFault,
  beginFaultResolution,
  advanceSreMonitor,
  getFaultDelayMs,
} from '../lib/ambientSreSimulation.mjs';

function advance(state, ticks) {
  for (let index = 0; index < ticks; index += 1) state = advanceSreMonitor(state);
  return state;
}

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
}

function assertHealthyTopology(cluster) {
  const ids = new Set(cluster.machines.map((node) => node.id));
  assert.ok(cluster.machines.every((node) => node.status === 'healthy'));
  for (const group of cluster.replicaGroups) {
    assert.equal(group.healthy, 3);
    assert.equal(group.total, 3);
    assert.ok(group.members.every((id) => ids.has(id)));
    assert.ok(group.members.includes(group.leader));
  }
}

function assertFreshHandoff(cluster, actionLabel) {
  const events = cluster.events.filter((event) => event.tick === cluster.tick);
  const start = events.findLastIndex((event) => event.message.startsWith(`${actionLabel} started.`));
  assert.ok(start >= 0);
  for (const prefix of ['Replica inspection:', 'Capacity inspection:', 'Log inspection:']) {
    assert.ok(events.slice(0, start).some((event) => event.message.startsWith(prefix)), `${prefix} must precede the operation`);
  }
  assert.deepEqual(cluster.inspections, { replicas: false, capacity: false, logs: false }, 'a new operation invalidates its precondition evidence');
}

test('baseline has twenty measured samples, and healthy monitoring advances without resetting topology', () => {
  const state = createSreMonitor();
  assert.deepEqual(state, createSreMonitor());
  assert.equal(state.faultId, null);
  assert.equal(state.lastRecovery, null);
  assert.equal(state.cluster.history.length, 20);
  assert.deepEqual(state.cluster.history.map((sample) => sample.tick), Array.from({ length: 20 }, (_, tick) => tick));
  assert.ok(state.cluster.history.every((sample) => sample.peakStorage === 61 && sample.healthyReplicas === 9 && sample.offlineMachines === 0));
  const next = advanceSreMonitor(freeze(state));
  assert.equal(next.cluster.tick, 20);
  assert.deepEqual(next.cluster.machines, state.cluster.machines);
  assert.deepEqual(next.cluster.replicaGroups, state.cluster.replicaGroups);
  assert.deepEqual(next.cluster.history.slice(0, -1), state.cluster.history);
  assert.equal(next.cluster.history.at(-1).peakStorage, 61);
});

test('machine resolution takes three containment ticks and four replacement ticks before verified recovery', () => {
  const baseline = createSreMonitor();
  const fault = injectRandomFault(freeze(baseline), () => 0);
  assert.equal(fault.faultId, 'machine');
  assert.equal(fault.faultStartedAt, baseline.cluster.tick + 1);
  assert.deepEqual(fault.cluster.history.slice(0, -1), baseline.cluster.history);
  assert.equal(fault.cluster.history.at(-1).offlineMachines, 1);
  assert.equal(fault.cluster.history.at(-1).healthyReplicas, 6);
  const initialSample = fault.cluster.history.at(-1);
  let state = beginFaultResolution(freeze(fault));
  assert.equal(state.resolving, true);
  assert.equal(state.cluster.operation.type, 'shield');
  assert.equal(state.cluster.operation.progress, 0);
  assertFreshHandoff(state.cluster, 'Shield faulty machine');
  state = advance(state, 2);
  assert.equal(state.cluster.operation.progress, 67);
  assert.equal(state.lastRecovery, null);
  state = advanceSreMonitor(state);
  assert.equal(state.cluster.operation.type, 'replace');
  assert.equal(state.cluster.operation.progress, 0);
  assert.equal(state.cluster.tick, fault.cluster.tick + 3);
  assert.ok(state.cluster.replicaGroups.every((group) => group.healthy === 2));
  assert.equal(state.cluster.history.at(-1).offlineMachines, 1);
  assertFreshHandoff(state.cluster, 'Replace machine');
  state = advance(state, 3);
  assert.equal(state.cluster.operation.progress, 75);
  assert.equal(state.faultId, 'machine');
  assert.equal(state.lastRecovery, null);
  assert.ok(state.cluster.replicaGroups.every((group) => group.healthy === 2));
  state = advanceSreMonitor(state);
  assert.equal(state.cluster.tick, fault.cluster.tick + 7);
  assert.equal(state.faultId, null);
  assert.equal(state.resolving, false);
  assert.equal(state.cluster.phase, 'healthy');
  assert.equal(state.cluster.operation, null);
  assert.equal(state.lastRecovery.title, 'Replacement verified');
  assert.equal(state.lastRecovery.before.latency, 680);
  assert.equal(state.lastRecovery.after.latency, 92);
  assert.equal(state.cluster.history.at(-1).offlineMachines, 0);
  assert.equal(state.cluster.history.at(-1).healthyReplicas, 9);
  assertHealthyTopology(state.cluster);
  assert.deepEqual(fault.cluster.history.at(-1), initialSample, 'starting and completing recovery never rewrites the saved fault state');
  const topology = { machines: state.cluster.machines, groups: state.cluster.replicaGroups };
  state = advance(state, 5);
  assert.deepEqual(state.cluster.machines, topology.machines);
  assert.deepEqual(state.cluster.replicaGroups, topology.groups);
  assert.ok(!state.cluster.machines.some((node) => node.id === 'node-03'), 'healthy ticks cannot revive the retired machine');
});

test('capacity recovery adds capacity first, then spends five ticks redistributing existing pressure', () => {
  const fault = injectRandomFault(createSreMonitor(), () => 0.5);
  let state = beginFaultResolution(fault);
  assert.equal(state.cluster.operation.type, 'expand');
  assertFreshHandoff(state.cluster, 'Add storage machine');
  state = advance(state, 3);
  assert.equal(state.cluster.operation.type, 'rebalance');
  assert.equal(state.cluster.operation.progress, 0);
  assert.equal(state.cluster.machines.length, 6);
  assert.equal(state.cluster.metrics.storage, 76);
  assert.equal(state.cluster.history.at(-1).peakStorage, 94, 'the mean improves while old machines remain hot');
  assert.equal(state.lastRecovery, null);
  assertFreshHandoff(state.cluster, 'Rebalance replicas');
  state = advance(state, 4);
  assert.equal(state.cluster.operation.progress, 80);
  assert.equal(state.faultId, 'capacity');
  state = advanceSreMonitor(state);
  assert.equal(state.cluster.tick, fault.cluster.tick + 8);
  assert.equal(state.lastRecovery.title, 'Expansion verified');
  assert.ok(state.lastRecovery.after.peakStorage <= 85);
  assertHealthyTopology(state.cluster);
  const machines = state.cluster.machines;
  const groups = state.cluster.replicaGroups;
  state = advance(state, 70);
  assert.equal(state.cluster.machines.length, 6, 'idle ticks retain added capacity');
  assert.deepEqual(state.cluster.machines, machines);
  assert.deepEqual(state.cluster.replicaGroups, groups);
  assert.equal(state.cluster.history.length, 60);
  assert.ok(state.cluster.history.every((sample) => sample.peakStorage === 77.5));
});

test('a placement hotspot is visible in the peak series and resolves without adding machines', () => {
  const fault = injectRandomFault(createSreMonitor(), () => 1);
  assert.equal(fault.faultId, 'hotspot');
  assert.equal(fault.cluster.metrics.storage, 55.8);
  assert.equal(fault.cluster.history.at(-1).peakStorage, 96);
  let state = beginFaultResolution(fault);
  assert.equal(state.cluster.operation.type, 'rebalance');
  state = advance(state, 4);
  assert.equal(state.cluster.operation.progress, 80);
  assert.equal(state.lastRecovery, null);
  state = advanceSreMonitor(state);
  assert.equal(state.cluster.tick, fault.cluster.tick + 5);
  assert.equal(state.lastRecovery.title, 'Placement verified');
  assert.equal(state.cluster.machines.length, 5);
  assertHealthyTopology(state.cluster);
});

test('duplicate Resolve and new faults cannot interrupt an incident or a running recovery', () => {
  const baseline = createSreMonitor();
  assert.equal(beginFaultResolution(baseline), baseline);
  let state = injectRandomFault(baseline, () => 0);
  const forbiddenRandom = () => { throw new Error('blocked injections must not draw a new scenario'); };
  assert.equal(injectRandomFault(state, forbiddenRandom), state);
  state = beginFaultResolution(state);
  for (let tick = 0; tick < 7; tick += 1) {
    assert.equal(beginFaultResolution(state), state);
    assert.equal(injectRandomFault(state, forbiddenRandom), state);
    const previousTick = state.cluster.tick;
    state = advanceSreMonitor(state);
    assert.equal(state.cluster.tick, previousTick + 1);
  }
  assert.equal(beginFaultResolution(state), state);
});

test('Resolve respects the engine majority guard rather than bypassing an unsafe fixture', () => {
  let state = injectRandomFault(createSreMonitor(), () => 0);
  state = { ...state, cluster: triggerIncident(state.cluster, 'machine', { limitedRedundancy: true }) };
  const blocked = beginFaultResolution(state);
  assert.equal(blocked.faultId, 'machine');
  assert.equal(blocked.resolving, false);
  assert.equal(blocked.cluster.operation, null);
  assert.equal(blocked.lastRecovery, null);
  assert.match(blocked.cluster.feedback.message, /2-of-3 healthy majority/);
  assert.deepEqual(blocked.cluster.inspections, { replicas: true, capacity: true, logs: true });
});

test('handoff rechecks changed capacity and cannot start unsafe replacement', () => {
  let state = beginFaultResolution(injectRandomFault(createSreMonitor(), () => 0));
  state = advance(state, 2);
  state = { ...state, cluster: { ...state.cluster, operationContext: {
    ...state.cluster.operationContext,
    targetMachines: state.cluster.operationContext.targetMachines.map((node) => ({ ...node, storage: 95 })),
  } } };
  state = advanceSreMonitor(state);
  assert.equal(state.cluster.operation.type, 'shield');
  assert.equal(state.cluster.operation.status, 'completed');
  assert.equal(state.resolving, false);
  assert.equal(state.faultId, 'machine');
  assert.equal(state.lastRecovery, null);
  assert.match(state.cluster.feedback.message, /insufficient destination storage headroom/);
});

test('operation completion still cannot claim recovery if final pressure fails verification', () => {
  let state = beginFaultResolution(injectRandomFault(createSreMonitor(), () => 1));
  state = { ...state, cluster: { ...state.cluster, operationContext: {
    ...state.cluster.operationContext,
    targetMachines: state.cluster.operationContext.targetMachines.map((node, index) => index === 0 ? { ...node, storage: 95 } : node),
  } } };
  state = advance(state, 4);
  assert.equal(state.resolving, true);
  assert.equal(state.lastRecovery, null);
  state = advanceSreMonitor(state);
  assert.equal(state.cluster.phase, 'verifying');
  assert.equal(state.cluster.operation.status, 'completed');
  assert.equal(state.faultId, 'hotspot');
  assert.equal(state.resolving, false);
  assert.equal(state.lastRecovery, null);
  assert.match(state.cluster.feedback.message, /hottest machine is still above 85%/);
  const retry = beginFaultResolution(state);
  assert.equal(retry.faultId, 'hotspot');
  assert.equal(retry.lastRecovery, null);
});

test('repeated fictional scenarios retain historical ticks and events but start an independent fixture', () => {
  let state = createSreMonitor();
  let previousRecovery;
  for (const [random, duration] of [[0.5, 8], [0, 7], [1, 5], [0, 7]]) {
    const previousHistory = state.cluster.history;
    const previousTick = state.cluster.tick;
    const previousSequence = state.cluster.eventSequence;
    const previousFaultSequence = state.faultSequence;
    state = injectRandomFault(freeze(state), () => random);
    assert.equal(state.cluster.tick, previousTick + 1);
    assert.equal(state.cluster.machines.length, 5, 'a new fictional scenario starts the documented fixture');
    assert.deepEqual(state.cluster.history.slice(0, -1), previousHistory.slice(-59));
    assert.ok(state.cluster.eventSequence > previousSequence);
    assert.equal(state.faultSequence, previousFaultSequence + 1);
    assert.equal(state.lastRecovery, previousRecovery ?? null, 'prior recovery remains visible until a new one is actually verified');
    state = advance(beginFaultResolution(state), duration);
    assert.equal(state.faultId, null);
    assertHealthyTopology(state.cluster);
    assert.notEqual(state.lastRecovery.id, previousRecovery?.id);
    previousRecovery = state.lastRecovery;
    state = advance(state, 3);
    const ticks = state.cluster.history.map((sample) => sample.tick);
    assert.ok(ticks.every((tick, index) => index === 0 || tick === ticks[index - 1] + 1));
    assert.ok(state.cluster.history.length <= 60);
    assert.ok(state.cluster.history.every((sample) => Number.isFinite(sample.peakStorage) && sample.peakStorage >= 0 && sample.peakStorage <= 100));
    const eventIds = state.cluster.events.map((event) => event.id);
    assert.equal(new Set(eventIds).size, eventIds.length);
  }
});

test('original incident metrics survive a long pending alert beyond the chart window', () => {
  let state = injectRandomFault(createSreMonitor(), () => 0);
  const before = state.faultStartMetrics;
  const startedTick = state.faultStartedAt;
  state = advance(state, 65);
  assert.ok(state.cluster.history.every((sample) => sample.tick > startedTick));
  assert.equal(state.cluster.history.length, 60);
  assert.equal(state.lastRecovery, null);
  state = advance(beginFaultResolution(state), 7);
  assert.equal(state.faultId, null);
  assert.deepEqual(state.lastRecovery.before, before);
  assert.equal(state.lastRecovery.startedTick, startedTick);
  assert.ok(state.lastRecovery.resolvedTick > startedTick + 65);
});

test('random choice and visible-time delays are bounded, including malformed RNG outputs', () => {
  assert.equal(injectRandomFault(createSreMonitor(), () => -1).faultId, 'machine');
  assert.equal(injectRandomFault(createSreMonitor(), () => 2).faultId, 'hotspot');
  assert.equal(injectRandomFault(createSreMonitor(), () => NaN).faultId, 'machine');
  assert.equal(getFaultDelayMs(() => 0), 30_000);
  assert.equal(getFaultDelayMs(() => 0.5), 37_500);
  assert.equal(getFaultDelayMs(() => 1), 45_000);
  assert.equal(getFaultDelayMs(() => 0, true), 90_000);
  assert.equal(getFaultDelayMs(() => 0.5, true), 120_000);
  assert.equal(getFaultDelayMs(() => 1, true), 150_000);
  assert.equal(getFaultDelayMs(() => -5), 30_000);
  assert.equal(getFaultDelayMs(() => 5, true), 150_000);
  assert.equal(getFaultDelayMs(() => NaN, true), 90_000);
});
