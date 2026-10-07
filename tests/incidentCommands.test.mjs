import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLabCommand } from '../lib/incidentCommands.mjs';

test('accepted fictional commands return only their intended operation', () => {
    const accepted = [
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
    ];

    for (const [input, expected] of accepted) {
        assert.deepEqual(parseLabCommand(input), expected, input);
    }
});

test('leading, trailing, and repeated whitespace is accepted', () => {
    assert.deepEqual(parseLabCommand('  labctl\t inspect   replicas \n'), { kind: 'inspect', target: 'replicas' });
    assert.deepEqual(parseLabCommand('\nhelp\t'), { kind: 'help' });
});

test('empty or non-text input produces an actionable error without throwing', () => {
    for (const input of ['', ' \n\t', undefined, null, 12, {}]) {
        const result = parseLabCommand(input);
        assert.equal(result.kind, 'error');
        assert.match(result.message, /labctl help/);
    }
});

test('unknown commands, targets, and node arguments are rejected', () => {
    for (const input of [
        'expand', 'labctl', 'labctl restart', 'labctl inspect',
        'labctl inspect cpu', 'labctl shield', 'labctl replace',
        'labctl shield node-02', 'labctl replace node-01',
        'labctl repair-replica node-03', 'labctl repair-replica',
        'LABCTL expand', 'labctl Shield node-03',
    ]) {
        assert.equal(parseLabCommand(input).kind, 'error', input);
    }
});

test('every otherwise valid command rejects additional arguments', () => {
    for (const command of [
        'help', 'labctl help', 'labctl inspect replicas', 'labctl inspect capacity',
        'labctl inspect logs', 'labctl shield node-03', 'labctl replace node-03',
        'labctl repair-replica node-02', 'labctl expand', 'labctl rebalance', 'labctl verify',
    ]) {
        assert.equal(parseLabCommand(`${command} --force`).kind, 'error', command);
        assert.equal(parseLabCommand(`${command} node-03`).kind, 'error', command);
    }
});

test('shell syntax, chained commands, and substitutions are rejected', () => {
    for (const input of [
        'labctl expand; labctl verify', 'labctl expand && labctl verify',
        'labctl expand || labctl verify', 'labctl inspect logs | cat',
        'labctl expand > output', 'labctl inspect logs < input',
        'labctl replace node-03 &', 'labctl expand$(echo hi)',
        'labctl expand `echo hi`', 'labctl \\expand',
        'labctl "expand"', "labctl 'expand'", 'labctl expand\nlabctl verify',
    ]) {
        assert.equal(parseLabCommand(input).kind, 'error', input);
    }
});

test('mutating a parsed result does not change later commands', () => {
    const result = parseLabCommand('labctl expand');
    result.id = 'verify';
    assert.deepEqual(parseLabCommand('labctl expand'), { kind: 'action', id: 'expand' });
});
