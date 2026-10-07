import test from 'node:test';
import assert from 'node:assert/strict';
import { createSimulation, triggerIncident, inspectSimulation } from '../lib/incidentSimulation.mjs';
import {
  createGuidedIncident,
  investigateMachineFault,
  beginMachineRecovery,
  advanceMachineRecovery,
  verifyMachineRecovery,
} from '../lib/guidedIncident.mjs';

function inspect(state) {
  return ['replicas', 'capacity', 'logs'].reduce((current, target) => inspectSimulation(current, target), state);
}

function advance(state, ticks) {
  for (let index = 0; index < ticks; index += 1) state = advanceMachineRecovery(state);
  return state;
}

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
}

test('the guided baseline has twenty real healthy samples and starts no operation', () => {
  const first = createGuidedIncident();
  const second = createGuidedIncident();
  assert.deepEqual(first, second);
  assert.notEqual(first.history, second.history);
  assert.equal(first.phase, 'healthy');
  assert.equal(first.scenarioId, null);
  assert.equal(first.operation, null);
  assert.equal(first.history.length, 20);
  assert.deepEqual(first.history.map((sample) => sample.tick), Array.from({ length: 20 }, (_, index) => index));
  assert.ok(first.history.every((sample) => sample.healthyReplicas === 9 && sample.offlineMachines === 0));
  assert.equal(advanceMachineRecovery(first), first, 'idle guides do not advance the simulation');
});

test('three visitor actions investigate, recover in seven samples, then explicitly verify', () => {
  const baseline = createGuidedIncident();
  const investigated = investigateMachineFault(baseline);
  assert.equal(investigated.phase, 'incident');
  assert.equal(investigated.scenarioId, 'machine');
  assert.deepEqual(investigated.inspections, { replicas: true, capacity: true, logs: true });
  assert.equal(investigated.machines.find((node) => node.id === 'node-03').status, 'faulty');
  assert.ok(investigated.replicaGroups.every((group) => group.healthy === 2));

  let state = beginMachineRecovery(investigated);
  assert.equal(state.operation.type, 'shield');
  assert.equal(state.operation.progress, 0);
  assert.equal(state.machines.find((node) => node.id === 'node-03').status, 'shielded');
  state = advance(state, 3);
  assert.equal(state.shielded, true);
  assert.equal(state.replaced, false);
  assert.equal(state.operation.type, 'replace');
  assert.equal(state.operation.progress, 0);
  assert.equal(state.operation.step, 0);
  assert.ok(state.replicaGroups.every((group) => group.healthy === 2 && group.members.includes('node-03')));
  assert.equal(state.machines.find((node) => node.id === 'node-06').status, 'replacing');
  assert.ok(state.metrics.success < 99.9, 'containment is not full user-facing recovery');

  state = advance(state, 4);
  assert.equal(state.tick, investigated.tick + 7);
  assert.equal(state.phase, 'verifying');
  assert.equal(state.operation.type, 'replace');
  assert.equal(state.operation.status, 'completed');
  assert.equal(state.operation.progress, 100);
  assert.equal(state.outcome, null);
  assert.deepEqual(state.inspections, { replicas: false, capacity: false, logs: false });
  assert.ok(state.replicaGroups.every((group) => group.healthy === 3 && group.members.includes('node-06')));
  assert.ok(state.machines.every((node) => node.status === 'healthy' && node.id !== 'node-03'));
  assert.equal(advanceMachineRecovery(state), state, 'completion cannot silently accept recovery');

  const verified = verifyMachineRecovery(state);
  assert.equal(verified.phase, 'resolved');
  assert.equal(verified.tick, state.tick, 'verification reads evidence without advancing time');
  assert.deepEqual(verified.inspections, { replicas: true, capacity: true, logs: true });
  assert.equal(verified.outcome.title, 'Replacement verified');
});

test('the shield-to-replacement handoff checks changed evidence and consumes no replacement sample', () => {
  let state = beginMachineRecovery(investigateMachineFault(createGuidedIncident()));
  state = advance(state, 2);
  const previousTick = state.tick;
  const previousHistory = state.history;
  assert.equal(state.operation.type, 'shield');
  assert.deepEqual(state.inspections, { replicas: false, capacity: false, logs: false });

  const handoff = advanceMachineRecovery(state);
  assert.equal(handoff.tick, previousTick + 1);
  assert.equal(handoff.operation.type, 'replace');
  assert.equal(handoff.operation.progress, 0);
  assert.equal(handoff.history.length, previousHistory.length + 1);
  assert.deepEqual(handoff.history.slice(0, -1), previousHistory);
  const events = handoff.events.filter((event) => event.tick === handoff.tick);
  const replacementStart = events.findIndex((event) => event.message === 'Replace machine started. Wait for completion, then inspect the changed cluster state.');
  for (const prefix of ['Replica inspection:', 'Capacity inspection:', 'Log inspection:']) {
    const inspectionIndex = events.findIndex((event) => event.message.startsWith(prefix));
    assert.ok(inspectionIndex >= 0 && inspectionIndex < replacementStart, `${prefix} must precede replacement`);
  }
  assert.deepEqual(handoff.inspections, { replicas: false, capacity: false, logs: false }, 'replacement invalidates the handoff checks');
  assert.equal(advanceMachineRecovery(handoff).operation.progress, 25, 'the next call consumes only the first reconstruction sample');
});

test('repeated investigate and recover clicks cannot reset or skip a running operation', () => {
  const incident = investigateMachineFault(createGuidedIncident());
  assert.equal(investigateMachineFault(incident), incident);
  let state = beginMachineRecovery(incident);
  assert.equal(beginMachineRecovery(state), state);
  assert.equal(investigateMachineFault(state), state);
  for (let index = 1; index <= 7; index += 1) {
    const previousTick = state.tick;
    state = advanceMachineRecovery(state);
    assert.equal(state.tick, previousTick + 1);
    assert.equal(beginMachineRecovery(state), state);
    assert.equal(investigateMachineFault(state), state);
    assert.equal(state.outcome, null);
    assert.equal(state.operation.type, index < 3 ? 'shield' : 'replace');
    assert.equal(state.operation.progress, index < 3 ? Math.round(index / 3 * 100) : (index - 3) * 25);
  }
  const resolved = verifyMachineRecovery(state);
  assert.equal(verifyMachineRecovery(resolved), resolved);
  assert.equal(beginMachineRecovery(resolved), resolved);
  assert.equal(investigateMachineFault(resolved), resolved);
  assert.equal(advanceMachineRecovery(resolved), resolved);
});

test('verification before or during repair cannot declare recovery or advance work', () => {
  const baseline = createGuidedIncident();
  assert.equal(verifyMachineRecovery(baseline), baseline);
  let state = investigateMachineFault(baseline);
  let rejected = verifyMachineRecovery(state);
  assert.equal(rejected.phase, 'incident');
  assert.equal(rejected.outcome, null);
  assert.match(rejected.feedback.message, /faulty machine remains/);
  state = beginMachineRecovery(state);
  for (const ticks of [0, 2, 3, 6]) {
    const running = advance(state, ticks);
    rejected = verifyMachineRecovery(running);
    assert.equal(rejected.phase, 'operating');
    assert.equal(rejected.operation, running.operation);
    assert.equal(rejected.tick, running.tick);
    assert.equal(rejected.outcome, null);
    assert.match(rejected.feedback.message, /already running/);
  }
});

test('missing replica or capacity evidence still blocks the first recovery action', () => {
  const incident = triggerIncident(createSimulation(), 'machine');
  let rejected = beginMachineRecovery(incident);
  assert.equal(rejected.operation, null);
  assert.equal(rejected.machines.find((node) => node.id === 'node-03').status, 'faulty');
  assert.match(rejected.feedback.message, /Inspect replicas and capacity/);
  rejected = beginMachineRecovery(inspectSimulation(incident, 'replicas'));
  assert.equal(rejected.operation, null);
  assert.match(rejected.feedback.message, /Inspect capacity/);
});

test('an unhealthy replica majority still blocks shielding despite completed inspections', () => {
  const incident = inspect(triggerIncident(createSimulation(), 'machine', { limitedRedundancy: true }));
  assert.equal(incident.replicaGroups[0].healthy, 1);
  const rejected = beginMachineRecovery(incident);
  assert.equal(rejected.operation, null);
  assert.equal(rejected.phase, 'incident');
  assert.equal(rejected.machines.find((node) => node.id === 'node-03').status, 'faulty');
  assert.match(rejected.feedback.message, /2-of-3 healthy majority/);
  assert.equal(advanceMachineRecovery(rejected), rejected);
});

test('replacement cannot start automatically if receiving capacity became unsafe', () => {
  let state = beginMachineRecovery(investigateMachineFault(createGuidedIncident()));
  state = advance(state, 2);
  // Represent a changed destination layout at the final containment sample.
  const targets = state.operationContext.targetMachines.map((node) => ({ ...node, storage: 95 }));
  state = { ...state, operationContext: { ...state.operationContext, targetMachines: targets } };
  const rejected = advanceMachineRecovery(state);
  assert.equal(rejected.operation.type, 'shield');
  assert.equal(rejected.operation.status, 'completed');
  assert.equal(rejected.replaced, false);
  assert.equal(rejected.phase, 'incident');
  assert.match(rejected.feedback.message, /insufficient destination storage headroom/);
  assert.ok(rejected.machines.every((node) => node.id !== 'node-06'));
});

test('fresh verification still rejects unhealthy user-facing signals after operation completion', () => {
  const completed = advance(beginMachineRecovery(investigateMachineFault(createGuidedIncident())), 7);
  for (const metrics of [{ ...completed.metrics, latency: 900 }, { ...completed.metrics, success: 89 }]) {
    const rejected = verifyMachineRecovery({ ...completed, metrics });
    assert.equal(rejected.phase, 'verifying');
    assert.equal(rejected.outcome, null);
    assert.match(rejected.feedback.message, /User-facing latency or delivery success/);
    assert.deepEqual(rejected.inspections, { replicas: true, capacity: true, logs: true });
  }
});

test('guided transitions preserve frozen earlier state and historical evidence', () => {
  const baseline = freeze(createGuidedIncident());
  const baselineSnapshot = JSON.stringify(baseline);
  const incident = freeze(investigateMachineFault(baseline));
  const incidentSnapshot = JSON.stringify(incident);
  let state = freeze(beginMachineRecovery(incident));
  for (let index = 0; index < 7; index += 1) state = freeze(advanceMachineRecovery(state));
  const verified = verifyMachineRecovery(state);
  assert.equal(verified.phase, 'resolved');
  assert.equal(JSON.stringify(baseline), baselineSnapshot);
  assert.equal(JSON.stringify(incident), incidentSnapshot);
  assert.deepEqual(verified.history.slice(0, baseline.history.length - 1), baseline.history.slice(0, -1));
  assert.equal(verified.history.at(-1).healthyReplicas, 9);
  assert.equal(incident.history.at(-1).healthyReplicas, 6);
});
