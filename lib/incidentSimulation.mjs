/** Fictional storage lab: invented metrics, machines and incidents.
 * A tick is a simulation step. The 2-of-3 guard teaches majority availability;
 * it does not implement Raft or prove real membership-change safety. */
const HISTORY_LIMIT = 60;
const EVENT_LIMIT = 35;
const PRESSURE_THRESHOLD = 85;
const EMPTY_INSPECTIONS = { replicas: false, capacity: false, logs: false };
const WAVE = [0, 1, 2, 1, 0, -1, -2, -1];

export const SCENARIOS = [
  { id: 'machine', title: 'Faulty machine', subtitle: 'Inspect. Shield. Reconstruct. Verify.', description: 'A fictional storage machine starts failing. Check replica availability and capacity before shielding it, then reconstruct its replicas onto a replacement.' },
  { id: 'capacity', title: 'Storage expansion', subtitle: 'New capacity needs a placement plan.', description: 'Storage utilization is high across the cluster. Add an empty machine, redistribute replicas and workload, then verify that the existing machines have recovered.' },
  { id: 'hotspot', title: 'Placement hotspot', subtitle: 'A healthy average can hide one hot machine.', description: 'One machine carries too much storage and workload while the cluster has spare capacity. Inspect replica placement and rebalance the work.' },
];
const ACTIONS = {
  shield: { id: 'shield', label: 'Shield faulty machine', description: 'Remove node-03 from serving routes; retain its replica metadata until reconstruction completes.' },
  replace: { id: 'replace', label: 'Replace machine', description: 'Reconstruct replicas onto node-06 before retiring the shielded machine.' },
  'repair-replica': { id: 'repair-replica', label: 'Restore replica availability', description: 'Restore node-02 first so every affected group has a healthy majority before shielding node-03.' },
  expand: { id: 'expand', label: 'Add storage machine', description: 'Add an empty node-06. Existing replicas stay in place until you explicitly rebalance.' },
  rebalance: { id: 'rebalance', label: 'Rebalance replicas', description: 'Redistribute replicas and serving workload using available storage headroom.' },
  verify: { id: 'verify', label: 'Verify recovery', description: 'Accept recovery only after fresh replica, capacity and log inspections confirm the result.' },
};
const OPERATION_MESSAGES = {
  shield: ['node-03 is excluded from serving routes. Replica membership is retained.', 'Serving leadership moves to healthy replicas; remaining machines absorb the workload.', 'Shielding completed. The failed machine still needs replacement; recheck replicas and capacity.'],
  replace: ['Replacement node-06 is prepared; replica reconstruction starts from healthy peers.', 'Replica data is copying. The shielded machine remains in membership metadata.', 'Reconstructed copies are checked before the simulated placement handoff.', 'Replacement completed. node-06 takes the replica placements and node-03 is retired. Verify recovery separately.'],
  'repair-replica': ['Restoring node-02 from its simulated fault; its replicas are not yet counted as healthy.', 'Replica catch-up is checked before node-02 resumes service.', 'node-02 is healthy again. Inspect the updated majority and capacity before shielding node-03.'],
  expand: ['New storage machine node-06 is joining. Existing replicas have not moved.', 'node-06 passes health checks with empty storage; placement pressure remains on the old machines.', 'Expansion completed. Mean storage utilization falls, but the hottest existing machines still need rebalancing.'],
  rebalance: ['Replica redistribution starts using healthy sources and free destination space.', 'Replica copies are staged while serving routes remain available in this simplified model.', 'Serving leadership and placement move toward the balanced layout.', 'Storage and workload pressure are settling across the machines.', 'Rebalance completed. Inspect replica health, hottest-machine storage and logs before accepting recovery.'],
};

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const rounded = (value, places = 1) => Number(value.toFixed(places));
function machine(id, storage, load, status = 'healthy', detail = 'Storage and serving checks are passing.') {
  return { id, name: id, status, storage: rounded(clamp(storage, 0, 100)), load: rounded(clamp(load, 0, 100)), detail };
}
function baselineMachines() {
  return [machine('node-01', 54, 32), machine('node-02', 58, 36), machine('node-03', 61, 39), machine('node-04', 52, 29), machine('node-05', 57, 33)];
}
function baselineGroups() {
  return [
    { id: 'rg-01', partition: 'partition-01', members: ['node-01', 'node-02', 'node-03'], leader: 'node-03', required: 2, total: 3 },
    { id: 'rg-02', partition: 'partition-02', members: ['node-03', 'node-04', 'node-05'], leader: 'node-04', required: 2, total: 3 },
    { id: 'rg-03', partition: 'partition-03', members: ['node-01', 'node-03', 'node-05'], leader: 'node-03', required: 2, total: 3 },
  ];
}
function updateGroups(groups, machines, moveFailedLeaders = false) {
  const healthy = new Set(machines.filter((node) => node.status === 'healthy').map((node) => node.id));
  return groups.map((group) => ({ ...group, members: [...group.members], healthy: group.members.filter((id) => healthy.has(id)).length, total: group.members.length,
    leader: moveFailedLeaders && !healthy.has(group.leader) ? group.members.find((id) => healthy.has(id)) || group.leader : group.leader }));
}
function metricsFor(machines, latency, success) {
  return { latency: Math.round(clamp(latency, 0, 10000)), success: rounded(clamp(success, 0, 100), 2), storage: rounded(machines.reduce((sum, node) => sum + node.storage, 0) / machines.length), load: rounded(machines.reduce((sum, node) => sum + node.load, 0) / machines.length) };
}
function recordHistory(state) {
  const history = state.history.at(-1)?.tick === state.tick ? state.history.slice(0, -1) : state.history;
  const healthyMachineIds = new Set(state.machines.filter((node) => node.status === 'healthy').map((node) => node.id));
  const machineFaults = Object.fromEntries(state.machines.map((node) => [node.id, Number(node.status === 'faulty' || node.status === 'shielded')]));
  const sample = {
    tick: state.tick,
    ...state.metrics,
    offlineMachines: Object.values(machineFaults).reduce((sum, fault) => sum + fault, 0),
    healthyReplicas: state.replicaGroups.reduce((sum, group) => sum + group.healthy, 0),
    totalReplicas: state.replicaGroups.reduce((sum, group) => sum + group.total, 0),
    machineFaults,
    // This counts the model's healthy serving-leader placements, not consensus.
    servingLeaders: state.replicaGroups.filter((group) => healthyMachineIds.has(group.leader)).length,
  };
  return { ...state, history: [...history, sample].slice(-HISTORY_LIMIT) };
}
function recordEvent(state, level, message) {
  return { ...state, eventSequence: state.eventSequence + 1, events: [...state.events, { id: `event-${state.eventSequence}`, tick: state.tick, level, message }].slice(-EVENT_LIMIT) };
}
function feedback(state, type, message) {
  return recordEvent({ ...state, feedback: { type, message } }, type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info', message);
}
const hasMajority = (state) => state.replicaGroups.every((group) => group.healthy >= group.required);
const hasReceivingHeadroom = (state) => state.metrics.storage <= PRESSURE_THRESHOLD && state.machines.some((node) => node.status === 'healthy' && node.storage < 80);
const hottestMachine = (state) => state.machines.reduce((hottest, node) => node.storage > hottest.storage ? node : hottest, state.machines[0]);
function inspectionGuard(state, targets) {
  const missing = targets.filter((target) => !state.inspections[target]);
  return missing.length ? `Inspect ${missing.join(' and ')} first. Safety evidence must reflect the current cluster state.` : null;
}

export function createSimulation() {
  const machines = baselineMachines();
  return recordHistory({ phase: 'healthy', scenarioId: null, tick: 0, incidentTicks: 0, metrics: metricsFor(machines, 84, 99.98), machines,
    replicaGroups: updateGroups(baselineGroups(), machines), inspections: { ...EMPTY_INSPECTIONS }, operation: null, operationContext: null,
    feedback: null, outcome: null, history: [], events: [{ id: 'event-0', tick: 0, level: 'info', message: 'Fictional cluster ready. Five machines and three replica groups are healthy.' }],
    eventSequence: 1, operationSequence: 0, limitedRedundancy: false, shielded: false, replaced: false, expanded: false, rebalanced: false, verificationReady: false });
}

export function triggerIncident(state, scenarioId, options = {}) {
  if (!SCENARIOS.some((scenario) => scenario.id === scenarioId)) return state;
  if (state.operation?.status === 'running') return feedback(state, 'warning', 'Wait for the running operation to finish before injecting another incident.');
  const limitedRedundancy = scenarioId === 'machine' && options.limitedRedundancy === true;
  let machines = baselineMachines();
  let latency;
  let success;
  if (scenarioId === 'machine') {
    machines = machines.map((node) => node.id === 'node-03' ? machine(node.id, 73, 100, 'faulty', 'Injected fault: serving requests and replica checks are failing.')
      : limitedRedundancy && node.id === 'node-02' ? machine(node.id, 66, 100, 'faulty', 'Second injected fault: this group has insufficient healthy replicas.')
        : machine(node.id, node.storage + 3, node.load + (limitedRedundancy ? 25 : 15)));
    latency = limitedRedundancy ? 1160 : 680; success = limitedRedundancy ? 65 : 89;
  } else if (scenarioId === 'capacity') {
    machines = [machine('node-01', 89, 56), machine('node-02', 91, 59), machine('node-03', 94, 64), machine('node-04', 90, 57), machine('node-05', 92, 60)];
    latency = 420; success = 95.8;
  } else {
    machines = [machine('node-01', 45, 30), machine('node-02', 48, 34), machine('node-03', 96, 91, 'healthy', 'Storage and serving pressure are concentrated on this machine.'), machine('node-04', 44, 28), machine('node-05', 46, 31)];
    latency = 520; success = 96.2;
  }
  const next = { ...state, phase: 'incident', scenarioId, incidentTicks: 0, limitedRedundancy, machines, metrics: metricsFor(machines, latency, success), replicaGroups: updateGroups(baselineGroups(), machines),
    inspections: { ...EMPTY_INSPECTIONS }, operation: null, operationContext: null, feedback: null, outcome: null, shielded: false, replaced: false, expanded: false, rebalanced: false, verificationReady: false };
  const message = scenarioId === 'machine' ? limitedRedundancy ? 'Two machine faults injected. rg-01 has only one healthy replica; shielding is blocked by the majority guard.' : 'node-03 fault injected. Inspect replica availability and storage headroom before shielding.'
    : scenarioId === 'capacity' ? 'Cluster-wide storage pressure injected. Existing machines are close to full.' : 'Placement hotspot injected on node-03. Cluster mean storage utilization still looks healthy.';
  return recordHistory(recordEvent(next, 'critical', message));
}

export function inspectSimulation(state, target) {
  if (!Object.hasOwn(EMPTY_INSPECTIONS, target)) return state;
  let message;
  let type = 'info';
  if (target === 'replicas') {
    message = `Replica inspection: ${state.replicaGroups.map((group) => `${group.id} ${group.healthy}/${group.total} healthy (need ${group.required})`).join('; ')}. ${hasMajority(state) ? 'Every group has the simplified healthy majority.' : 'A group lacks its healthy majority; restore replica availability before shielding.'}`;
    if (!hasMajority(state)) type = 'warning';
  } else if (target === 'capacity') {
    const hottest = hottestMachine(state);
    message = `Capacity inspection: cluster mean ${state.metrics.storage}% storage, hottest machine ${hottest.id} at ${hottest.storage}%. ${state.scenarioId === 'hotspot' && !state.rebalanced ? 'Spare capacity exists; placement, not cluster size, is the problem.' : state.expanded && !state.rebalanced ? 'The new machine is empty; old machine pressure still requires rebalancing.' : hasReceivingHeadroom(state) ? 'Healthy destinations have storage headroom.' : 'Existing machines need additional storage capacity before redistribution.'}`;
    if (hottest.storage > PRESSURE_THRESHOLD) type = 'warning';
  } else {
    message = state.operation?.status === 'running' ? `Log inspection: ${state.operation.label} is still running. Operation progress is not verified recovery.`
      : state.verificationReady ? 'Log inspection: the simulated operation finished and no new request failures are appearing. Check replicas and capacity, then explicitly verify recovery.'
        : state.scenarioId === 'machine' ? 'Log inspection: machine-serving failures remain. Shielding and replica reconstruction are separate steps.'
          : state.scenarioId === 'capacity' || state.scenarioId === 'hotspot' ? 'Log inspection: storage placement pressure is still causing slow requests. An added machine alone does not move replicas.'
            : 'Log inspection: no simulated storage or serving errors.';
  }
  return feedback({ ...state, inspections: { ...state.inspections, [target]: true } }, type, message);
}

export function getAvailableActions(state) {
  if (state.phase === 'healthy' || state.phase === 'resolved' || !state.scenarioId) return [];
  if (state.phase === 'verifying') return [{ ...ACTIONS.verify, primary: true }];
  const actions = [];
  if (state.scenarioId === 'machine') {
    if (!state.shielded) {
      if (state.limitedRedundancy && state.machines.find((node) => node.id === 'node-02')?.status !== 'healthy') actions.push({ ...ACTIONS['repair-replica'], primary: true });
      actions.push({ ...ACTIONS.shield, primary: hasMajority(state) });
    } else if (!state.replaced) actions.push({ ...ACTIONS.replace, primary: true });
  } else {
    if (!state.expanded) actions.push({ ...ACTIONS.expand, primary: state.scenarioId === 'capacity' });
    actions.push({ ...ACTIONS.rebalance, primary: state.scenarioId === 'hotspot' || state.expanded });
  }
  actions.push({ ...ACTIONS.verify, primary: false });
  return actions;
}

export function getSafetyChecks(state) {
  const hottest = hottestMachine(state);
  const replicaEvidence = state.inspections.replicas;
  const capacityEvidence = state.inspections.capacity;
  const minimumHealthy = Math.min(...state.replicaGroups.map((group) => group.healthy));
  return [
    { id: 'replica-inspection', label: 'Replica placement inspected', status: replicaEvidence ? 'pass' : 'unchecked', detail: replicaEvidence ? 'Current membership and healthy replica counts have been inspected.' : 'Inspect replica groups before changing serving or placement.' },
    { id: 'quorum', label: 'Healthy majority in every group', status: !replicaEvidence ? 'unchecked' : hasMajority(state) ? 'pass' : 'fail', detail: `${minimumHealthy}/3 is the smallest healthy replica set; this teaching model requires 2/3. This alone is not a real membership-change safety proof.` },
    { id: 'capacity-inspection', label: 'Storage capacity inspected', status: capacityEvidence ? 'pass' : 'unchecked', detail: capacityEvidence ? `Mean storage ${state.metrics.storage}%; hottest machine ${hottest.id} ${hottest.storage}%.` : 'Inspect mean utilization and the most pressured machine.' },
    { id: 'headroom', label: 'Destination storage headroom', status: !capacityEvidence ? 'unchecked' : hasReceivingHeadroom(state) ? 'pass' : 'fail', detail: hasReceivingHeadroom(state) ? 'The simulated cluster has room to redistribute storage onto healthy destinations.' : 'Existing machines are too full; add storage before redistribution.' },
    { id: 'machine-pressure', label: 'Hottest machine below 85%', status: !capacityEvidence ? 'unchecked' : hottest.storage <= PRESSURE_THRESHOLD ? 'pass' : 'fail', detail: `${hottest.id} is at ${hottest.storage}%. An improved cluster average does not clear a pressured machine.` },
    { id: 'log-inspection', label: 'Runtime logs inspected', status: state.inspections.logs ? 'pass' : 'unchecked', detail: state.inspections.logs ? 'Current simulated runtime logs have been inspected.' : 'Inspect logs again after the operation before verifying recovery.' },
  ];
}

function operationTargets(state, type) {
  let startMachines = state.machines.map((node) => ({ ...node }));
  let targetMachines;
  let latency;
  let success;
  if (type === 'shield') {
    startMachines = startMachines.map((node) => node.id === 'node-03' ? { ...node, status: 'shielded', load: 0, detail: 'Excluded from serving routes; replica metadata is retained pending replacement.' } : node);
    targetMachines = startMachines.map((node) => node.id === 'node-03' ? node : machine(node.id, Math.min(80, node.storage + 3), Math.min(86, node.load + 12), node.status, 'Serving additional workload while node-03 is shielded.'));
    latency = 390; success = 96.8;
  } else if (type === 'replace') {
    startMachines.push(machine('node-06', 0, 8, 'replacing', 'Replacement prepared; replica reconstruction has not completed.'));
    targetMachines = startMachines.filter((node) => node.id !== 'node-03').map((node) => node.id === 'node-06' ? machine(node.id, 59, 34) : machine(node.id, Math.max(50, node.storage - 3), Math.max(28, node.load - 15)));
    latency = 92; success = 99.97;
  } else if (type === 'repair-replica') {
    startMachines = startMachines.map((node) => node.id === 'node-02' ? { ...node, status: 'replacing', detail: 'Restoring replica availability; not yet counted as healthy.' } : node);
    targetMachines = startMachines.map((node) => node.id === 'node-02' ? machine(node.id, 61, 51) : node);
    latency = 680; success = 89;
  } else if (type === 'expand') {
    startMachines.push(machine('node-06', 0, 2, 'joining', 'Empty machine joining; existing replica placements are unchanged.'));
    targetMachines = startMachines.map((node) => node.id === 'node-06' ? machine(node.id, 0, 4, 'healthy', 'Healthy and empty. Rebalance is required to use this capacity.') : node);
    latency = state.metrics.latency; success = state.metrics.success;
  } else {
    const average = state.metrics.storage;
    targetMachines = startMachines.map((node, index) => machine(node.id, average + (index - (startMachines.length - 1) / 2) * 0.6, 36 + (index % 3) * 2));
    latency = state.scenarioId === 'capacity' ? 96 : 94; success = 99.97;
  }
  return { startMachines, targetMachines, startMetrics: metricsFor(startMachines, state.metrics.latency, state.metrics.success), latency, success, duration: OPERATION_MESSAGES[type].length };
}
function startOperation(state, type) {
  const context = operationTargets(state, type);
  const operation = { id: `operation-${state.operationSequence}`, type, label: ACTIONS[type].label, status: 'running', progress: 0, detail: 'Preconditions passed. The simulated operation is starting.', step: 0 };
  const next = { ...state, phase: 'operating', operation, operationContext: context, operationSequence: state.operationSequence + 1, machines: context.startMachines,
    replicaGroups: updateGroups(state.replicaGroups, context.startMachines, type === 'shield'), metrics: context.startMetrics, inspections: { ...EMPTY_INSPECTIONS }, verificationReady: false, outcome: null };
  return recordHistory(feedback(next, 'info', `${operation.label} started. Wait for completion, then inspect the changed cluster state.`));
}
function verificationFailure(state) {
  if (!state.verificationReady) {
    if (state.scenarioId === 'machine') return state.shielded ? 'Shielding is only containment. Reconstruct replicas onto the replacement before verifying recovery.' : 'The faulty machine remains in service. Inspect, safely shield it, and replace it before verifying recovery.';
    return state.expanded ? 'Capacity was added, but existing machines remain pressured. Rebalance replicas before verifying recovery.' : 'Storage placement pressure remains. Complete the appropriate expansion or rebalance workflow before verifying recovery.';
  }
  const missing = inspectionGuard(state, ['replicas', 'capacity', 'logs']);
  if (missing) return missing;
  if (!state.replicaGroups.every((group) => group.healthy === group.total)) return 'Replica reconstruction is incomplete: every group must have all three healthy replicas before accepting recovery.';
  if (state.machines.some((node) => node.status !== 'healthy')) return 'A machine is still faulty, shielded or joining. Do not accept recovery yet.';
  if (hottestMachine(state).storage > PRESSURE_THRESHOLD) return 'The hottest machine is still above 85% storage utilization. A healthy mean alone does not prove recovery.';
  if (state.metrics.latency > 150 || state.metrics.success < 99.9) return 'User-facing latency or delivery success has not recovered. Keep investigating.';
  const healthyIds = new Set(state.machines.map((node) => node.id));
  if (state.replicaGroups.some((group) => !healthyIds.has(group.leader) || !group.members.includes(group.leader))) return 'Serving leadership has not reached a healthy replica placement.';
  return null;
}
function outcomeFor(state) {
  if (state.scenarioId === 'machine') return { title: 'Replacement verified', summary: 'The replacement has healthy replicas, serving has recovered and the storage checks pass in this fictional cluster.', lesson: 'Inspect replica availability and capacity before shielding. Replacement completion is a control-plane milestone; fresh checks and user-facing verification are still required.' };
  if (state.scenarioId === 'capacity') return { title: 'Expansion verified', summary: 'The added capacity now carries redistributed replicas. Both mean utilization and the hottest machine are below the pressure threshold.', lesson: 'An empty machine improves the average immediately but does not relieve existing placements. Expansion requires redistribution and verification to finish the job.' };
  return { title: 'Placement verified', summary: `Storage and serving work are balanced across the fictional cluster${state.expanded ? ', including the optional additional machine' : ' without adding a machine'}.`, lesson: 'A healthy average can conceal a pressured machine. Inspect maximum utilization and placement before choosing between redistribution and more capacity.' };
}

export function applyMitigation(state, actionId) {
  if (!Object.hasOwn(ACTIONS, actionId)) return state;
  if (state.phase === 'healthy' || state.phase === 'resolved') return state;
  if (state.operation?.status === 'running') return feedback(state, 'warning', 'An operation is already running. Wait for it to finish before starting another action or verifying recovery.');
  if (actionId === 'verify') {
    const reason = verificationFailure(state);
    if (reason) return feedback(state, 'warning', reason);
    return feedback({ ...state, phase: 'resolved', outcome: outcomeFor(state) }, 'success', 'Recovery verified: replica health, storage pressure, runtime logs and user-facing metrics all pass the simulated checks.');
  }
  if (state.phase === 'verifying') return feedback(state, 'warning', 'The operation is complete. Inspect replicas, capacity and logs, then verify its result.');
  const machineScenario = state.scenarioId === 'machine';
  if ((machineScenario && ['expand', 'rebalance'].includes(actionId)) || (!machineScenario && ['shield', 'replace', 'repair-replica'].includes(actionId))) return feedback(state, 'warning', 'That action does not address this incident. Inspect the active scenario and choose its relevant workflow.');
  if (actionId === 'expand') {
    const reason = inspectionGuard(state, ['capacity']);
    if (reason) return feedback(state, 'warning', reason);
    if (state.expanded) return feedback(state, 'warning', 'The additional machine already exists. Redistribute replicas onto it rather than starting another expansion.');
    return startOperation(state, actionId);
  }
  const reason = inspectionGuard(state, ['replicas', 'capacity']);
  if (reason) return feedback(state, 'warning', reason);
  if (actionId === 'repair-replica') {
    if (!state.limitedRedundancy || state.machines.find((node) => node.id === 'node-02')?.status !== 'faulty') return feedback(state, 'warning', 'There is no additional failed replica to restore. Inspect the healthy majority and continue with shielding.');
    return startOperation(state, actionId);
  }
  if (!hasMajority(state)) return feedback(state, 'warning', 'Blocked: an affected group lacks its 2-of-3 healthy majority. Restore replica availability before changing serving or placement.');
  if (!hasReceivingHeadroom(state)) return feedback(state, 'warning', 'Blocked: there is insufficient destination storage headroom. Add storage capacity before redistribution.');
  if (actionId === 'shield') {
    if (state.shielded) return feedback(state, 'warning', 'node-03 is already shielded. Replace it to restore the full replica set.');
    if (hottestMachine(state).storage > PRESSURE_THRESHOLD) return feedback(state, 'warning', 'Blocked: remaining machines lack safe storage headroom for the temporary serving shift.');
  } else if (actionId === 'replace') {
    if (!state.shielded) return feedback(state, 'warning', 'Shield node-03 before starting replacement. Routing containment and replica reconstruction are separate steps.');
    if (state.replaced) return feedback(state, 'warning', 'The replacement has already completed. Inspect and verify it.');
  } else if (actionId === 'rebalance') {
    if (state.scenarioId === 'capacity' && !state.expanded) return feedback(state, 'warning', 'Cluster-wide storage pressure requires expansion before the replica redistribution can fit safely.');
    if (state.rebalanced) return feedback(state, 'warning', 'Replica redistribution has completed. Inspect its result and verify recovery.');
  }
  return startOperation(state, actionId);
}

function balancedGroups(state, machines) {
  const groups = state.expanded ? [
    { id: 'rg-01', partition: 'partition-01', members: ['node-01', 'node-02', 'node-06'], leader: 'node-06', required: 2, total: 3 },
    { id: 'rg-02', partition: 'partition-02', members: ['node-02', 'node-03', 'node-04'], leader: 'node-04', required: 2, total: 3 },
    { id: 'rg-03', partition: 'partition-03', members: ['node-01', 'node-05', 'node-06'], leader: 'node-05', required: 2, total: 3 },
  ] : [
    { id: 'rg-01', partition: 'partition-01', members: ['node-01', 'node-02', 'node-04'], leader: 'node-01', required: 2, total: 3 },
    { id: 'rg-02', partition: 'partition-02', members: ['node-02', 'node-03', 'node-05'], leader: 'node-03', required: 2, total: 3 },
    { id: 'rg-03', partition: 'partition-03', members: ['node-01', 'node-04', 'node-05'], leader: 'node-05', required: 2, total: 3 },
  ];
  return updateGroups(groups, machines);
}
function finishOperation(state, machines, metrics, operation) {
  const type = operation.type;
  let groups = state.replicaGroups;
  if (type === 'replace') groups = groups.map((group) => ({ ...group, members: group.members.map((id) => id === 'node-03' ? 'node-06' : id), leader: group.leader === 'node-03' ? 'node-06' : group.leader }));
  groups = type === 'rebalance' ? balancedGroups(state, machines) : updateGroups(groups, machines, true);
  const verificationReady = type === 'replace' || type === 'rebalance';
  return { ...state, machines, metrics, replicaGroups: groups, phase: verificationReady ? 'verifying' : 'incident', operation: { ...operation, status: 'completed' }, operationContext: null,
    inspections: { ...EMPTY_INSPECTIONS }, verificationReady, shielded: state.shielded || type === 'shield', replaced: state.replaced || type === 'replace', expanded: state.expanded || type === 'expand', rebalanced: state.rebalanced || type === 'rebalance', feedback: { type: 'info', message: operation.detail } };
}
function advanceOperation(state) {
  const context = state.operationContext;
  const step = state.operation.step + 1;
  const completed = step >= context.duration;
  const progress = Math.min(1, step / context.duration);
  const targets = new Map(context.targetMachines.map((node) => [node.id, node]));
  let machines = context.startMachines.map((node) => {
    const target = targets.get(node.id);
    if (!target) return { ...node };
    return machine(node.id, node.storage + (target.storage - node.storage) * progress, node.load + (target.load - node.load) * progress, completed ? target.status : node.status,
      completed ? target.detail : state.operation.type === 'replace' && node.id === 'node-06' ? `Replica reconstruction ${Math.round(progress * 100)}% complete; placement handoff is pending.` : node.detail);
  });
  if (completed) machines = context.targetMachines.map((node) => ({ ...node }));
  const metrics = metricsFor(machines, context.startMetrics.latency + (context.latency - context.startMetrics.latency) * progress, context.startMetrics.success + (context.success - context.startMetrics.success) * progress);
  const detail = OPERATION_MESSAGES[state.operation.type][Math.min(step, context.duration) - 1];
  const operation = { ...state.operation, step, progress: Math.round(progress * 100), detail };
  let next = { ...state, tick: state.tick + 1, machines, metrics, operation, replicaGroups: updateGroups(state.replicaGroups, machines, state.operation.type === 'shield') };
  if (completed) next = finishOperation(next, machines, metrics, operation);
  return recordHistory(recordEvent(next, 'info', detail));
}
function advanceIncident(state) {
  const tick = state.tick + 1;
  const incidentTicks = state.incidentTicks + 1;
  const wave = WAVE[tick % WAVE.length];
  const machines = state.machines.map((node) => {
    if (node.status !== 'healthy') return { ...node };
    if (state.scenarioId === 'capacity') return machine(node.id, node.id === 'node-06' ? 0 : Math.min(97, node.storage + 0.16), node.id === 'node-06' ? 4 : Math.min(70, node.load + 0.1), node.status, node.detail);
    if (state.scenarioId === 'hotspot') return machine(node.id, node.id === 'node-03' ? Math.min(98, node.storage + 0.12) : node.storage, node.id === 'node-03' ? Math.min(98, node.load + 0.2) : node.load, node.status, node.detail);
    // A machine-fault exercise must retain replacement headroom even if the
    // visitor pauses here. Capacity exhaustion is a separate scenario.
    return machine(node.id, Math.min(state.shielded ? 78 : 74, node.storage + 0.06), Math.min(86, node.load + 0.12), node.status, node.detail);
  });
  const latency = state.scenarioId === 'machine' ? state.shielded ? 390 + Math.abs(wave) * 5 : (hasMajority(state) ? 680 : 1160) + Math.min(1000, incidentTicks * 25)
    : state.scenarioId === 'capacity' ? 420 + Math.min(1000, incidentTicks * 18) : 520 + Math.min(1000, incidentTicks * 16);
  const success = state.scenarioId === 'machine' ? state.shielded ? 96.8 : (hasMajority(state) ? 89 : 65) - Math.min(15, incidentTicks * 0.3)
    : state.scenarioId === 'capacity' ? 95.8 - Math.min(6, incidentTicks * 0.15) : 96.2 - Math.min(6, incidentTicks * 0.12);
  let next = { ...state, tick, incidentTicks, machines, metrics: metricsFor(machines, latency, success), replicaGroups: updateGroups(state.replicaGroups, machines) };
  if (incidentTicks % 5 === 0) next = recordEvent(next, 'warning', state.scenarioId === 'machine' ? 'The machine incident remains unverified. Check replica availability and finish reconstruction.' : 'Existing placement pressure persists. Additional empty capacity does not redistribute replicas automatically.');
  return recordHistory(next);
}
export function advanceSimulation(state) {
  if (state.phase === 'resolved') return state;
  if (state.phase === 'operating') return advanceOperation(state);
  if (state.phase === 'incident') return advanceIncident(state);
  if (state.phase === 'verifying') return recordHistory({ ...state, tick: state.tick + 1 });
  if (state.phase !== 'healthy') return state;
  const tick = state.tick + 1;
  const wave = WAVE[tick % WAVE.length];
  const machines = baselineMachines().map((node) => machine(node.id, node.storage, node.load + wave));
  return recordHistory({ ...state, tick, machines, metrics: metricsFor(machines, 84 + wave * 2, 99.98 - Math.abs(wave) * 0.01), replicaGroups: updateGroups(state.replicaGroups, machines) });
}
