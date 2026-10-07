const commands = new Map([
    ['help', { kind: 'help' }],
    ['labctl help', { kind: 'help' }],
    ['labctl inspect replicas', { kind: 'inspect', target: 'replicas' }],
    ['labctl inspect capacity', { kind: 'inspect', target: 'capacity' }],
    ['labctl inspect logs', { kind: 'inspect', target: 'logs' }],
    ['labctl shield node-03', { kind: 'action', id: 'shield' }],
    ['labctl replace node-03', { kind: 'action', id: 'replace' }],
    ['labctl repair-replica node-02', { kind: 'action', id: 'repair-replica' }],
    ['labctl expand', { kind: 'action', id: 'expand' }],
    ['labctl rebalance', { kind: 'action', id: 'rebalance' }],
    ['labctl verify', { kind: 'action', id: 'verify' }],
]);

/** Parse only the fictional lab's allowed commands; never execute a shell. */
export function parseLabCommand(input) {
    if (typeof input !== 'string' || !input.trim()) {
        return { kind: 'error', message: 'Enter a command. Type labctl help to see the available commands.' };
    }

    if (/[;&|<>`$\\]/.test(input)) {
        return { kind: 'error', message: 'Shell operators are not supported. Type labctl help for the available commands.' };
    }

    const command = commands.get(input.trim().split(/\s+/).join(' '));
    if (!command) {
        return { kind: 'error', message: 'Unknown command or arguments. Type labctl help for the available commands.' };
    }

    return { ...command };
}
