import test from 'node:test';
import assert from 'node:assert/strict';
import { CAREER_EPOCHS, advanceJourneyCheckpoint, createJourneyCheckpoint, getCareerEpoch, getEpochSkillProgression } from '../lib/careerTimeline.mjs';

test('career snapshots preserve published dates, concurrent work, and current SRE scope', () => {
    assert.equal(CAREER_EPOCHS.length, 6);
    assert.equal(new Set(CAREER_EPOCHS.map(epoch => epoch.id)).size, CAREER_EPOCHS.length);
    assert.match(CAREER_EPOCHS[0].dateLabel, /2022/);
    assert.match(CAREER_EPOCHS[3].dateLabel, /Tangled from Jul 2025/);
    assert.match(CAREER_EPOCHS.at(-1).dateLabel, /Jul 2026/);
    assert.match(CAREER_EPOCHS.at(-1).focus, /capacity expansion, machine replacement/);
    for (const epoch of CAREER_EPOCHS) {
        assert.ok(epoch.tools.length > 0);
        assert.ok(epoch.wallpaper.startsWith('/'));
        assert.ok(epoch.reflection && epoch.question);
        assert.equal(Object.isFrozen(epoch), true);
        assert.equal(Object.isFrozen(epoch.evidence), true);
    }
});

test('scrubber lookup clamps finite numbers and rejects unknown IDs', () => {
    assert.equal(getCareerEpoch(-200), CAREER_EPOCHS[0]);
    assert.equal(getCareerEpoch(200), CAREER_EPOCHS.at(-1));
    assert.equal(getCareerEpoch(2.1), CAREER_EPOCHS[2]);
    assert.equal(getCareerEpoch('airport-automation'), CAREER_EPOCHS[2]);
    assert.equal(getCareerEpoch('imaginary-role'), null);
    assert.equal(getCareerEpoch(NaN), null);
});

test('journey points use completed source chapters without attributing all internship gains to the first role', () => {
    const journey = [
        { id: 1, skillsGained: { Backend: 40 } },
        { id: 2, skillsGained: { Backend: 20, Frontend: 50 } },
        { id: 3, skillsGained: { Backend: 20, SRE: 40 } },
        { id: 4, skillsGained: {} },
    ];
    const copy = structuredClone(journey);
    const definitions = { Backend: { max: 100 }, SRE: { displayName: 'Site Reliability', max: 100 } };
    const first = getEpochSkillProgression('first-production', journey, definitions);
    const airport = getEpochSkillProgression('airport-automation', journey, definitions);
    const industrial = getEpochSkillProgression('industrial-observability', journey, definitions);
    const late = getEpochSkillProgression('distributed-reliability', journey, definitions);
    assert.equal(first.find(item => item.name === 'Backend').value, 40);
    assert.equal(airport.find(item => item.name === 'Backend').value, 60);
    assert.equal(airport.some(item => item.name === 'SRE'), false);
    assert.deepEqual(industrial, airport);
    assert.equal(late.find(item => item.name === 'SRE').label, 'Site Reliability');
    assert.equal(late.find(item => item.name === 'Backend').value, 80);
    assert.deepEqual(journey, copy);
});

test('invalid gains cannot corrupt bounded skill progression', () => {
    const points = getEpochSkillProgression('platform-engineering', [
        { id: 1, skillsGained: { Backend: 400, Broken: NaN, Negative: -40 } },
        { id: 'invalid', skillsGained: { Other: 80 } },
        { id: 9, skillsGained: { Future: 50 } },
    ], { Backend: { max: 75, baseline: 10 } });
    assert.deepEqual(points, [{ name: 'Backend', label: 'Backend', value: 75, max: 75 }]);
    assert.deepEqual(getEpochSkillProgression('missing', []), []);
    assert.deepEqual(getEpochSkillProgression('first-production', null), []);
});

test('direct chapter entry seeds earlier cards, preserves baselines, and awards each card once', () => {
    const journey = [
        { id: 1, skillsGained: { Backend: 40 } },
        { id: 2, skillsGained: { Frontend: 50, DevOps: 20 } },
        { id: 3, skillsGained: { SRE: 40 } },
        { id: 4, skillsGained: {} },
    ];
    const definitions = {
        Backend: { baseline: 0, max: 100 },
        Frontend: { baseline: 0, max: 100 },
        DevOps: { baseline: 0, max: 100, locked: true, unlockThreshold: { Backend: 1 } },
        SRE: { baseline: 0, max: 100, locked: true, unlockThreshold: { DevOps: 1 } },
    };
    const checkpoint = createJourneyCheckpoint(journey, definitions, 3);
    assert.equal(checkpoint.initialIndex, 2);
    assert.deepEqual(checkpoint.processedCards, [1, 2]);
    assert.equal(checkpoint.skills.Backend.value, 40);
    assert.equal(checkpoint.skills.Backend.baseline, 0);
    assert.equal(checkpoint.skills.SRE.value, 0);
    assert.equal(checkpoint.skills.SRE.locked, false);
    const back = advanceJourneyCheckpoint(checkpoint, 1, journey[0].skillsGained);
    assert.equal(back.updated, false);
    assert.equal(back.checkpoint, checkpoint);
    const finish = advanceJourneyCheckpoint(checkpoint, 3, journey[2].skillsGained);
    assert.equal(finish.checkpoint.skills.SRE.value, 40);
    assert.equal(checkpoint.skills.SRE.value, 0);
    assert.equal(advanceJourneyCheckpoint(finish.checkpoint, 3, journey[2].skillsGained).updated, false);
    assert.equal(createJourneyCheckpoint(journey, definitions, '3').initialIndex, 0);
    assert.deepEqual(createJourneyCheckpoint(journey, definitions, 1).processedCards, []);
});
