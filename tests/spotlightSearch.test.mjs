import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSpotlightEntries, searchSpotlight } from '../lib/spotlightSearch.mjs';
import { getProjectEvidence, projectEvidence } from '../lib/projectEvidence.mjs';
const entries = buildSpotlightEntries([{ id: 11, title: 'Tangled', skills: ['AWS', 'Terraform'], files: [{ id: 'architecture', title: 'Architecture', summary: 'WebSocket, Lambda and DynamoDB.' }] }]);
test('AWS finds both work and architecture evidence', () => {
    const results = searchSpotlight(entries, 'AWS');
    assert.ok(results.some(entry => entry.target.id === 'cag'));
    assert.ok(results.some(entry => entry.target.id === 11 && entry.target.fileId === 'architecture'));
});
test('SRE finds experience and the incident lab', () => {
    const results = searchSpotlight(entries, 'SRE');
    assert.ok(results.some(entry => entry.target.kind === 'incident'));
    assert.ok(results.some(entry => entry.target.id === 'bytedance-current'));
});
test('multiword search requires every token and returns the document destination', () => {
    assert.equal(searchSpotlight(entries, 'AWS architecture')[0].target.fileId, 'architecture');
    assert.deepEqual(searchSpotlight(entries, 'AWS nonexistent'), []);
});
test('empty search leads with the two flagship apps and contains no retired routes', () => {
    assert.deepEqual(searchSpotlight(entries, '').slice(0, 2).map(entry => entry.target.kind), ['project', 'incident']);
    assert.ok(entries.every(entry => !['tour', 'time-machine'].includes(entry.target.kind)));
    assert.equal(searchSpotlight(entries, 'journey')[0].target.kind, 'journey');
    assert.equal(searchSpotlight(entries, 'RESUME')[0].target.kind, 'resume');
    assert.equal(searchSpotlight(entries, 'contact')[0].target.kind, 'contact');
});
test('real portfolio search destinations resolve to existing evidence files', () => {
    const actualEntries = buildSpotlightEntries(projectEvidence);
    const awsArchitecture = searchSpotlight(actualEntries, 'AWS architecture');
    assert.ok(awsArchitecture.some(entry => getProjectEvidence(entry.target.id)?.sourceId === 11));
    assert.ok(awsArchitecture.some(entry => getProjectEvidence(entry.target.id)?.sourceId === 2));
    for (const entry of actualEntries.filter(entry => entry.target.kind === 'project' && entry.target.id)) {
        const project = getProjectEvidence(entry.target.id);
        assert.ok(project, `Existing project for ${entry.title}`);
        if (entry.target.fileId) assert.ok(project.files.some(file => file.id === entry.target.fileId));
    }
});
