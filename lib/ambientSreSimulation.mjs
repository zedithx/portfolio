import {
  advanceSimulation,
  applyMitigation,
  createSimulation,
  inspectSimulation,
  triggerIncident,
} from './incidentSimulation.mjs';

const FAULTS = ['machine', 'capacity', 'hotspot'];
const HISTORY_LIMIT = 60;
const inspectCluster = (cluster) => ['replicas', 'capacity', 'logs']
  .reduce((current, target) => inspectSimulation(current, target), cluster);
const peakStorage = (cluster) => Math.max(...cluster.machines.map((node) => node.storage));

function randomFraction(random) {
  const value = Number(random());
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function annotateCurrentSample(cluster) {
  const sample = cluster.history.at(-1);
  if (!sample || sample.tick !== cluster.tick) return cluster;
  return { ...cluster, history: [...cluster.history.slice(0, -1), { ...sample, peakStorage: peakStorage(cluster) }] };
}

function currentMetrics(cluster) {
  return { ...cluster.metrics, peakStorage: peakStorage(cluster) };
}

function advanceHealthyCluster(cluster) {
  const tick = cluster.tick + 1;
  const healthyIds = new Set(cluster.machines.filter((node) => node.status === 'healthy').map((node) => node.id));
  const machineFaults = Object.fromEntries(cluster.machines.map((node) => [node.id, Number(node.status === 'faulty' || node.status === 'shielded')]));
  const sample = {
    tick,
    ...currentMetrics(cluster),
    offlineMachines: Object.values(machineFaults).reduce((sum, count) => sum + count, 0),
    healthyReplicas: cluster.replicaGroups.reduce((sum, group) => sum + group.healthy, 0),
    totalReplicas: cluster.replicaGroups.reduce((sum, group) => sum + group.total, 0),
    machineFaults,
    servingLeaders: cluster.replicaGroups.filter((group) => healthyIds.has(group.leader)).length,
  };
  // The engine's healthy tick recreates its fixture. Monitoring instead keeps
  // the recovered machines and replica placements until the next scenario.
  return { ...cluster, tick, history: [...cluster.history, sample].slice(-HISTORY_LIMIT) };
}

function nextAction(cluster) {
  if (cluster.scenarioId === 'machine') {
    if (!cluster.shielded) return 'shield';
    if (!cluster.replaced) return 'replace';
  } else if (cluster.scenarioId === 'capacity') {
    if (!cluster.expanded) return 'expand';
    if (!cluster.rebalanced) return 'rebalance';
  } else if (cluster.scenarioId === 'hotspot' && !cluster.rebalanced) {
    return 'rebalance';
  }
  return 'verify';
}

function continueResolution(state) {
  if (!state.faultId || state.cluster.operation?.status === 'running') return state;
  const action = nextAction(state.cluster);
  // Every handoff uses evidence from the changed cluster. The engine owns
  // majority, headroom, operation and final user-facing verification guards.
  const cluster = annotateCurrentSample(applyMitigation(inspectCluster(state.cluster), action));
  if (cluster.phase !== 'resolved') {
    return { ...state, cluster, resolving: cluster.operation?.status === 'running' };
  }

  const lastRecovery = {
    id: `recovery-${state.faultSequence}`,
    faultId: state.faultId,
    startedTick: state.faultStartedAt,
    resolvedTick: cluster.tick,
    ...cluster.outcome,
    before: { ...state.faultStartMetrics },
    after: currentMetrics(cluster),
  };
  return {
    ...state,
    faultId: null,
    faultStartedAt: null,
    faultStartMetrics: null,
    resolving: false,
    lastRecovery,
    cluster: {
      ...cluster,
      phase: 'healthy',
      scenarioId: null,
      incidentTicks: 0,
      inspections: { replicas: false, capacity: false, logs: false },
      operation: null,
      operationContext: null,
      outcome: null,
      limitedRedundancy: false,
      shielded: false,
      replaced: false,
      expanded: false,
      rebalanced: false,
      verificationReady: false,
    },
  };
}

/** Fictional monitoring state; all operation policy stays in the storage engine. */
export function createSreMonitor() {
  let cluster = annotateCurrentSample(createSimulation());
  for (let index = 1; index < 20; index += 1) cluster = annotateCurrentSample(advanceSimulation(cluster));
  return { cluster, faultId: null, resolving: false, faultSequence: 0, faultStartedAt: null, faultStartMetrics: null, lastRecovery: null };
}

export function injectRandomFault(state, random = Math.random) {
  if (state.faultId || state.resolving || state.cluster.phase !== 'healthy'
    || state.cluster.operation?.status === 'running') return state;
  const faultId = FAULTS[Math.min(FAULTS.length - 1, Math.floor(randomFraction(random) * FAULTS.length))];
  // Each incident is an independent fictional five-machine fixture. Earlier
  // samples and event/tick sequences survive; recovered topology persists idle.
  // A new tick preserves the last healthy sample rather than overwriting it.
  const cluster = annotateCurrentSample(triggerIncident({ ...state.cluster, tick: state.cluster.tick + 1 }, faultId));
  return {
    ...state,
    cluster,
    faultId,
    faultSequence: state.faultSequence + 1,
    faultStartedAt: cluster.tick,
    faultStartMetrics: currentMetrics(cluster),
    resolving: false,
  };
}

export function beginFaultResolution(state) {
  if (!state.faultId || state.resolving || state.cluster.operation?.status === 'running') return state;
  return continueResolution(state);
}

export function advanceSreMonitor(state) {
  if (!state.faultId && state.cluster.operation?.status !== 'running') {
    return { ...state, cluster: advanceHealthyCluster(state.cluster) };
  }
  const cluster = annotateCurrentSample(advanceSimulation(state.cluster));
  const next = { ...state, cluster };
  // Starting the next operation consumes no extra tick: its progress is 0%
  // until the next call, so containment and reconstruction remain distinct.
  return state.resolving && cluster.operation?.status !== 'running' ? continueResolution(next) : next;
}

/** UI counts eligible visible time; this module owns no wall-clock timers. */
export function getFaultDelayMs(random = Math.random, hasRecovered = false) {
  const minimum = hasRecovered ? 90_000 : 30_000;
  const maximum = hasRecovered ? 150_000 : 45_000;
  return Math.round(minimum + (maximum - minimum) * randomFraction(random));
}
