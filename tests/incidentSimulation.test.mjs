import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENARIOS, createSimulation, triggerIncident, inspectSimulation, applyMitigation, advanceSimulation, getSafetyChecks, getAvailableActions } from '../lib/incidentSimulation.mjs';
function freeze(value) {
  if (value && typeof value === 'object') { Object.freeze(value); Object.values(value).forEach(freeze); }
  return value;
}
function advance(state, count) { for (let index = 0; index < count; index += 1) state = advanceSimulation(state); return state; }
function inspect(state, targets = ['replicas', 'capacity', 'logs']) { for (const target of targets) state = inspectSimulation(state, target); return state; }
function finish(state) {
  assert.equal(state.operation?.status, 'running');
  for (let count = 0; state.operation.status === 'running'; count += 1) {
    assert.ok(count < 10, 'operation must finish in a bounded number of steps');
    const previousProgress = state.operation.progress;
    state = advanceSimulation(state);
    assert.ok(state.operation.progress > previousProgress);
    assert.equal(state.outcome, null, 'operation completion cannot invent verified recovery');
    assertBounds(state);
  }
  assert.equal(state.operation.progress, 100);
  return state;
}
function assertBounds(state) {
  assert.ok(state.history.length <= 60 && state.events.length <= 35);
  assert.equal(new Set(state.events.map((event) => event.id)).size, state.events.length);
  for (const metrics of [state.metrics, ...state.history]) {
    for (const name of ['latency', 'success', 'storage', 'load']) assert.ok(Number.isFinite(metrics[name]) && metrics[name] >= 0);
    assert.ok(metrics.success <= 100 && metrics.storage <= 100 && metrics.load <= 100);
  }
  for (const node of state.machines) assert.ok(node.storage >= 0 && node.storage <= 100 && node.load >= 0 && node.load <= 100);
  assert.equal(state.metrics.storage, Number((state.machines.reduce((sum, node) => sum + node.storage, 0) / state.machines.length).toFixed(1)), 'storage is the actual mean across machines');
  for (const group of state.replicaGroups) {
    assert.equal(group.total, group.members.length);
    assert.equal(group.healthy, group.members.filter((id) => state.machines.some((node) => node.id === id && node.status === 'healthy')).length);
    assert.ok(group.members.includes(group.leader));
  }
}
test('baseline and reset are fresh, deterministic, and internally consistent', () => {
  const first = createSimulation(); const second = createSimulation();
  assert.deepEqual(first, second); assert.notEqual(first.machines, second.machines);
  assert.equal(first.machines.length, 5); assert.equal(first.replicaGroups.length, 3);
  assert.ok(first.replicaGroups.every((group) => group.total === 3 && group.healthy === 3 && group.required === 2));
  assert.deepEqual(advance(first, 100), advance(second, 100)); assert.deepEqual(createSimulation(), first); assertBounds(first);
});
test('machine workflow requires fresh checks, shields routing, reconstructs replicas, and explicitly verifies', () => {
  let state = triggerIncident(createSimulation(), 'machine');
  const originalMembers = state.replicaGroups.map((group) => [...group.members]);
  const originalLeaders = state.replicaGroups.map((group) => group.leader);
  assert.equal(state.machines.find((node) => node.id === 'node-03').status, 'faulty');
  state = applyMitigation(state, 'shield'); assert.equal(state.phase, 'incident'); assert.match(state.feedback.message, /Inspect/);
  state = inspectSimulation(state, 'replicas'); state = applyMitigation(state, 'shield'); assert.match(state.feedback.message, /capacity/);
  state = inspectSimulation(state, 'capacity'); state = applyMitigation(state, 'replace'); assert.match(state.feedback.message, /Shield/); assert.equal(state.operation, null);
  state = applyMitigation(state, 'shield'); assert.equal(state.phase, 'operating');
  assert.equal(state.machines.find((node) => node.id === 'node-03').status, 'shielded');
  assert.deepEqual(state.replicaGroups.map((group) => group.members), originalMembers, 'shielding retains replication metadata');
  assert.notDeepEqual(state.replicaGroups.map((group) => group.leader), originalLeaders, 'serving moves off the failed leader');
  state = finish(state); assert.equal(state.phase, 'incident'); assert.equal(state.shielded, true);
  assert.deepEqual(state.inspections, { replicas: false, capacity: false, logs: false });
  state = applyMitigation(state, 'verify'); assert.match(state.feedback.message, /containment/);
  state = inspect(state, ['replicas', 'capacity']); state = applyMitigation(state, 'replace');
  assert.equal(state.machines.find((node) => node.id === 'node-06').status, 'replacing');
  state = advanceSimulation(state); assert.ok(state.machines.find((node) => node.id === 'node-06').storage > 0);
  assert.ok(state.replicaGroups.every((group) => group.members.includes('node-03')), 'handoff waits for reconstruction');
  state = finish(state); assert.equal(state.phase, 'verifying'); assert.equal(state.operation.status, 'completed'); assert.equal(state.machines.length, 5);
  assert.ok(state.machines.every((node) => node.id !== 'node-03')); assert.ok(state.replicaGroups.every((group) => group.members.includes('node-06') && group.healthy === 3));
  assert.equal(applyMitigation(state, 'verify').phase, 'verifying'); state = inspect(state, ['replicas', 'capacity']); state = applyMitigation(state, 'verify'); assert.match(state.feedback.message, /logs/);
  state = inspectSimulation(state, 'logs'); state = applyMitigation(state, 'verify'); assert.equal(state.phase, 'resolved'); assert.equal(state.outcome.title, 'Replacement verified'); assert.equal(advanceSimulation(state), state);
});
test('limited redundancy blocks shielding until replica availability is restored', () => {
  let state = inspect(triggerIncident(createSimulation(), 'machine', { limitedRedundancy: true }));
  assert.equal(state.replicaGroups.find((group) => group.id === 'rg-01').healthy, 1); assert.equal(getSafetyChecks(state).find((check) => check.id === 'quorum').status, 'fail');
  assert.ok(getAvailableActions(state).some((action) => action.id === 'repair-replica'));
  const blocked = applyMitigation(state, 'shield'); assert.equal(blocked.phase, 'incident'); assert.equal(blocked.operation, null); assert.match(blocked.feedback.message, /majority/);
  assert.equal(blocked.machines.find((node) => node.id === 'node-03').status, 'faulty');
  state = finish(applyMitigation(blocked, 'repair-replica')); assert.equal(state.machines.find((node) => node.id === 'node-02').status, 'healthy'); assert.ok(state.replicaGroups.every((group) => group.healthy >= group.required));
  state = inspect(state); assert.equal(getSafetyChecks(state).find((check) => check.id === 'quorum').status, 'pass');
  state = finish(applyMitigation(state, 'shield')); state = finish(applyMitigation(inspect(state), 'replace')); state = applyMitigation(inspect(state), 'verify'); assert.equal(state.phase, 'resolved');
});
test('delayed machine recovery retains a safe and reachable replacement workflow', () => {
  for (const limitedRedundancy of [false, true]) {
    let state = advance(triggerIncident(createSimulation(), 'machine', { limitedRedundancy }), 1200);
    state = inspect(state);
    if (limitedRedundancy) state = inspect(finish(applyMitigation(state, 'repair-replica')));
    state = finish(applyMitigation(state, 'shield'));
    state = advance(state, 1200);
    state = inspect(state);
    assert.equal(getSafetyChecks(state).find((check) => check.id === 'headroom').status, 'pass');
    state = finish(applyMitigation(state, 'replace'));
    state = applyMitigation(inspect(state), 'verify');
    assert.equal(state.phase, 'resolved');
  }
});
test('storage expansion adds empty capacity without clearing old pressure; rebalance and verification finish it', () => {
  let state = triggerIncident(createSimulation(), 'capacity'); assert.ok(state.metrics.storage > 85); assert.equal(applyMitigation(state, 'expand').operation, null);
  state = inspect(state); assert.equal(getSafetyChecks(state).find((check) => check.id === 'headroom').status, 'fail'); assert.equal(applyMitigation(state, 'rebalance').operation, null);
  const originalMachines = state.machines.map((node) => ({ ...node })); const oldLatency = state.metrics.latency;
  state = finish(applyMitigation(state, 'expand')); assert.equal(state.phase, 'incident'); assert.equal(state.expanded, true); assert.equal(state.machines.find((node) => node.id === 'node-06').storage, 0);
  assert.ok(state.metrics.storage < 85, 'empty capacity lowers the average'); assert.equal(state.metrics.latency, oldLatency, 'expansion does not fix placement latency'); assert.deepEqual(state.machines.filter((node) => node.id !== 'node-06'), originalMachines);
  state = applyMitigation(inspect(state), 'verify'); assert.equal(state.phase, 'incident'); assert.match(state.feedback.message, /Rebalance/); assert.equal(getSafetyChecks(state).find((check) => check.id === 'machine-pressure').status, 'fail');
  state = finish(applyMitigation(state, 'rebalance')); assert.equal(state.phase, 'verifying'); assert.ok(state.machines.every((node) => node.storage < 85)); assert.ok(state.replicaGroups.some((group) => group.members.includes('node-06'))); assert.ok(state.metrics.latency < 150);
  state = applyMitigation(inspect(state), 'verify'); assert.equal(state.phase, 'resolved'); assert.equal(state.outcome.title, 'Expansion verified');
});
test('hotspot uses existing headroom; optional expansion alone leaves the hotspot', () => {
  let state = inspect(triggerIncident(createSimulation(), 'hotspot')); assert.ok(state.metrics.storage < 60); assert.ok(state.machines.find((node) => node.id === 'node-03').storage > 90);
  assert.equal(getSafetyChecks(state).find((check) => check.id === 'headroom').status, 'pass'); assert.equal(getSafetyChecks(state).find((check) => check.id === 'machine-pressure').status, 'fail'); assert.equal(getAvailableActions(state).find((action) => action.id === 'expand').primary, false);
  const oldLatency = state.metrics.latency; let expanded = finish(applyMitigation(state, 'expand')); assert.equal(expanded.metrics.latency, oldLatency); assert.equal(expanded.machines.find((node) => node.id === 'node-03').storage, 96); assert.equal(applyMitigation(inspect(expanded), 'verify').phase, 'incident');
  expanded = finish(applyMitigation(inspect(expanded), 'rebalance')); assert.equal(applyMitigation(inspect(expanded), 'verify').phase, 'resolved');
  const totalStorage = state.machines.reduce((sum, node) => sum + node.storage, 0); state = finish(applyMitigation(state, 'rebalance')); assert.equal(state.machines.length, 5); assert.ok(state.machines.every((node) => node.storage < 60));
  assert.ok(Math.abs(state.machines.reduce((sum, node) => sum + node.storage, 0) - totalStorage) < 0.2, 'redistribution conserves modeled storage'); assert.ok(state.metrics.latency < 150);
  state = applyMitigation(inspect(state), 'verify'); assert.equal(state.phase, 'resolved'); assert.match(state.outcome.summary, /without adding/);
});
test('operations cannot overlap, accept another injection, or be prematurely verified', () => {
  let state = applyMitigation(inspect(triggerIncident(createSimulation(), 'capacity')), 'expand'); const operationId = state.operation.id;
  const blocked = applyMitigation(state, 'rebalance'); assert.equal(blocked.operation.id, operationId); assert.equal(blocked.operation.progress, 0); assert.match(blocked.feedback.message, /already running/);
  const premature = applyMitigation(state, 'verify'); assert.equal(premature.phase, 'operating'); assert.equal(premature.outcome, null);
  const injection = triggerIncident(state, 'hotspot'); assert.equal(injection.scenarioId, 'capacity'); assert.equal(injection.operation.id, operationId);
  state = inspect(state); state = finish(state); assert.deepEqual(state.inspections, { replicas: false, capacity: false, logs: false }, 'old topology evidence is invalidated');
});
test('unknown IDs are no-ops; recognized mismatched actions give visible feedback', () => {
  const baseline = createSimulation(); const state = triggerIncident(baseline, 'hotspot');
  assert.equal(triggerIncident(state, 'unknown'), state); assert.equal(inspectSimulation(state, 'unknown'), state); assert.equal(applyMitigation(state, 'unknown'), state); assert.equal(applyMitigation(baseline, 'shield'), baseline);
  const mismatched = applyMitigation(state, 'replace'); assert.equal(mismatched.phase, 'incident'); assert.equal(mismatched.operation, null); assert.equal(mismatched.feedback.type, 'warning');
});
test('scenario switches invalidate evidence and restore the correct fictional topology', () => {
  const inspected = inspect(triggerIncident(createSimulation(), 'machine', { limitedRedundancy: true })); const switched = triggerIncident(inspected, 'hotspot');
  assert.deepEqual(switched.inspections, { replicas: false, capacity: false, logs: false }); assert.equal(switched.limitedRedundancy, false); assert.equal(switched.machines.length, 5); assert.ok(switched.replicaGroups.every((group) => group.healthy === 3)); assert.equal(switched.operation, null);
});

test('historical topology samples preserve baseline, machine fault, and degraded replica evidence', () => {
  const baseline = freeze(advance(createSimulation(), 3));
  const before = JSON.stringify(baseline.history);
  const first = baseline.history[0];
  assert.equal(first.offlineMachines, 0);
  assert.equal(first.healthyReplicas, 9);
  assert.equal(first.totalReplicas, 9);
  assert.equal(first.servingLeaders, 3);
  assert.deepEqual(first.machineFaults, { 'node-01': 0, 'node-02': 0, 'node-03': 0, 'node-04': 0, 'node-05': 0 });

  const fault = triggerIncident(baseline, 'machine');
  const sample = fault.history.at(-1);
  assert.equal(sample.offlineMachines, 1);
  assert.equal(sample.healthyReplicas, 6);
  assert.equal(sample.totalReplicas, 9);
  assert.equal(sample.servingLeaders, 1, 'two groups still name the failed node as their leader');
  assert.equal(sample.machineFaults['node-03'], 1);
  assert.equal(sample.machineFaults['node-02'], 0);
  assert.deepEqual(fault.history.slice(0, -1), baseline.history.slice(0, -1), 'earlier ticks remain healthy; the fault does not rewrite their topology');
  assert.equal(JSON.stringify(baseline.history), before);

  const degraded = triggerIncident(baseline, 'machine', { limitedRedundancy: true }).history.at(-1);
  assert.equal(degraded.offlineMachines, 2);
  assert.equal(degraded.healthyReplicas, 5);
  assert.equal(degraded.totalReplicas, 9);
  assert.equal(degraded.servingLeaders, 1);
  assert.equal(degraded.machineFaults['node-02'], 1);
  assert.equal(degraded.machineFaults['node-03'], 1);
});

test('shield and replacement history reflect serving handoff without repairing earlier samples', () => {
  let state = triggerIncident(advance(createSimulation(), 3), 'machine');
  const faultSample = freeze(state.history.at(-1));
  const faultSnapshot = JSON.stringify(faultSample);
  state = applyMitigation(inspect(advanceSimulation(state)), 'shield');
  assert.equal(state.history.at(-1).offlineMachines, 1, 'shielded machines remain counted as offline');
  assert.equal(state.history.at(-1).healthyReplicas, 6, 'routing containment does not reconstruct replicas');
  assert.equal(state.history.at(-1).servingLeaders, 3, 'serving-leader placements move onto healthy nodes');
  assert.equal(state.history.at(-1).machineFaults['node-03'], 1);
  state = finish(state);
  state = applyMitigation(inspect(state), 'replace');
  const reconstructing = state.history.at(-1);
  assert.equal(reconstructing.offlineMachines, 1);
  assert.equal(reconstructing.machineFaults['node-06'], 0, 'a replacing node is not labelled faulty or shielded');
  assert.equal(reconstructing.healthyReplicas, 6, 'new replicas remain unhealthy until placement handoff');
  state = finish(state);
  const completed = state.history.at(-1);
  assert.equal(completed.offlineMachines, 0);
  assert.equal(completed.healthyReplicas, 9);
  assert.equal(completed.totalReplicas, 9);
  assert.equal(completed.servingLeaders, 3);
  assert.equal(completed.machineFaults['node-06'], 0);
  assert.equal(Object.hasOwn(completed.machineFaults, 'node-03'), false, 'retired nodes are absent, so charts can show a gap rather than inventing a value');
  assert.equal(Object.hasOwn(faultSample.machineFaults, 'node-06'), false, 'replacement did not exist in the earlier sample');
  assert.equal(JSON.stringify(faultSample), faultSnapshot);
  assert.deepEqual(state.history.find(sample => sample.tick === faultSample.tick), faultSample);
});

test('replica catch-up and joining are distinct from a machine-fault count', () => {
  let state = applyMitigation(inspect(triggerIncident(createSimulation(), 'machine', { limitedRedundancy: true })), 'repair-replica');
  assert.equal(state.machines.find(node => node.id === 'node-02').status, 'replacing');
  assert.equal(state.history.at(-1).offlineMachines, 1);
  assert.equal(state.history.at(-1).machineFaults['node-02'], 0);
  assert.equal(state.history.at(-1).healthyReplicas, 5, 'a restoring replica is not yet a healthy replica');
  state = finish(state);
  assert.equal(state.history.at(-1).healthyReplicas, 6);
  assert.equal(state.history.at(-1).offlineMachines, 1);

  const baseline = freeze(advance(createSimulation(), 2));
  const oldSample = baseline.history[0];
  state = applyMitigation(inspect(triggerIncident(baseline, 'capacity')), 'expand');
  assert.equal(state.machines.find(node => node.id === 'node-06').status, 'joining');
  assert.equal(state.history.at(-1).offlineMachines, 0);
  assert.equal(state.history.at(-1).machineFaults['node-06'], 0);
  assert.equal(state.history.at(-1).healthyReplicas, 9);
  assert.equal(state.history.at(-1).servingLeaders, 3);
  assert.equal(Object.hasOwn(oldSample.machineFaults, 'node-06'), false);
  assert.deepEqual(state.history[0], oldSample);
});

test('serving-leader snapshots count healthy named leaders, not quorum or consensus', () => {
  const baseline = triggerIncident(createSimulation(), 'machine');
  const lowAvailability = {
    ...baseline,
    machines: baseline.machines.map(node => ({ ...node, status: node.id === 'node-01' ? 'healthy' : 'faulty' })),
    replicaGroups: baseline.replicaGroups.map(group => ({ ...group, leader: group.members.includes('node-01') ? 'node-01' : group.leader })),
  };
  const sampled = advanceSimulation(freeze(lowAvailability));
  assert.ok(sampled.replicaGroups.every(group => group.healthy < group.required));
  assert.equal(sampled.history.at(-1).servingLeaders, 2, 'two named leader machines are healthy even though every group lacks a majority');
  assert.equal(sampled.history.at(-1).healthyReplicas, 2);
  assert.equal(sampled.history.at(-1).totalReplicas, 9);
  assert.equal(sampled.history.at(-1).offlineMachines, 4);
});

for (const scenario of SCENARIOS) {
  test(`${scenario.id}: frozen-input transitions and long-run values stay consistent and bounded`, () => {
    const baseline = freeze(createSimulation()); const state = freeze(triggerIncident(baseline, scenario.id)); const snapshot = JSON.stringify(state);
    let changed = freeze(inspect(state)); changed = freeze(advanceSimulation(changed)); changed = freeze(applyMitigation(changed, scenario.id === 'machine' ? 'shield' : scenario.id === 'capacity' ? 'expand' : 'rebalance')); changed = finish(changed);
    assert.equal(JSON.stringify(state), snapshot); assert.notEqual(changed, state);
    let longRun = triggerIncident(createSimulation(), scenario.id);
    for (let tick = 0; tick < 1200; tick += 1) { longRun = advanceSimulation(longRun); if (tick % 7 === 0) longRun = inspectSimulation(longRun, 'capacity'); assertBounds(longRun); }
    assert.equal(longRun.history.length, 60); assert.equal(longRun.events.length, 35); assert.equal(longRun.outcome, null);
  });
}
