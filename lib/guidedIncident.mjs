import {
  advanceSimulation,
  applyMitigation,
  createSimulation,
  inspectSimulation,
  triggerIncident,
} from './incidentSimulation.mjs';

const inspectCluster = (state) => ['replicas', 'capacity', 'logs']
  .reduce((current, target) => inspectSimulation(current, target), state);

/** A visitor guide over the storage engine, with all safety policy left there. */
export function createGuidedIncident() {
  let state = createSimulation();
  for (let index = 1; index < 20; index += 1) state = advanceSimulation(state);
  return state;
}

export function investigateMachineFault(state) {
  if (state.phase !== 'healthy' || state.scenarioId) return state;
  return inspectCluster(triggerIncident(state, 'machine'));
}

export function beginMachineRecovery(state) {
  if (state.scenarioId !== 'machine' || state.phase === 'resolved'
    || state.shielded || state.operation?.status === 'running') return state;
  return applyMitigation(state, 'shield');
}

export function advanceMachineRecovery(state) {
  if (state.operation?.status !== 'running') return state;
  const next = advanceSimulation(state);
  if (next.operation.type !== 'shield' || next.operation.status !== 'completed') return next;

  // Containment changes the cluster. Inspect that new state before the engine
  // decides whether replacement is safe; replacement starts at 0% this tick.
  return applyMitigation(inspectCluster(next), 'replace');
}

export function verifyMachineRecovery(state) {
  if (state.scenarioId !== 'machine' || state.phase === 'resolved') return state;
  return applyMitigation(inspectCluster(state), 'verify');
}
