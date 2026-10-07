import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { EVIDENCE_FILE_IDS, getEvidenceFile, getProjectEvidence, projectEvidence, searchProjectEvidence } from '../lib/projectEvidence.mjs';

test('every existing project has a complete five-document dossier and original ID mapping', () => {
    const source = readFileSync(new URL('../data/data.js', import.meta.url), 'utf8');
    const catalogue = source.slice(source.indexOf('export const projectData ='), source.indexOf('// Color classes map'));
    const existing = [...catalogue.matchAll(/id:\s*(\d+),\s*title:\s*'([^']+)'/g)].map(match => ({ id: Number(match[1]), title: match[2] }));
    assert.equal(existing.length, 13);
    assert.equal(projectEvidence.length, existing.length);
    assert.equal(new Set(projectEvidence.map(project => project.id)).size, existing.length);
    for (const item of existing) {
        const project = getProjectEvidence(item.id);
        assert.equal(project?.title, item.title);
        assert.deepEqual(project.files.map(file => file.id), EVIDENCE_FILE_IDS);
        assert.equal(getProjectEvidence(project.id), project);
        assert.ok(project.skills.length > 0);
        for (const file of project.files) {
            assert.ok(file.summary.length > 30);
            for (const entry of file.sections) assert.ok(entry.body.length > 30);
        }
    }
});

test('AWS evidence finds actual Tangled and Plant Pulse architecture, with conjunctive and category filtering', () => {
    const aws = searchProjectEvidence('AWS');
    assert.ok(aws.some(project => project.id === 'tangled'));
    assert.ok(aws.some(project => project.id === 'plant-pulse'));
    assert.deepEqual(searchProjectEvidence('AWS Terraform').map(project => project.id), ['tangled']);
    assert.ok(searchProjectEvidence('RFID hardware').some(project => project.id === 'night-fiesta-rfid'));
    assert.deepEqual(searchProjectEvidence('Grafana', 'Student Government'), []);
    assert.equal(searchProjectEvidence('  ', 'School Projects').length, 3);
    assert.equal(getEvidenceFile('tangled', 'architecture').id, 'architecture');
    assert.equal(getProjectEvidence('not-a-project'), null);
    assert.equal(getEvidenceFile('tangled', 'missing-file'), null);
});

test('RFID dossier connects real hardware, booth operations, and backend while distinguishing proposals', () => {
    const rfid = getProjectEvidence('night-fiesta-rfid');
    const architecture = getEvidenceFile(rfid.id, 'architecture');
    const text = JSON.stringify(rfid);
    assert.match(text, /wristband/i);
    assert.match(text, /supplier in China/);
    assert.match(text, /booth/i);
    assert.match(text, /Django/);
    assert.match(text, /PostgreSQL/);
    assert.equal(architecture.kind, 'Architecture reconstruction');
    assert.equal(getEvidenceFile(rfid.id, 'decisions').kind, 'Tradeoff analysis');
    assert.equal(getEvidenceFile(rfid.id, 'change').kind, 'Future proposal');
    assert.match(getEvidenceFile(rfid.id, 'results').summary, /Recorded contribution/);
    assert.match(JSON.stringify(getEvidenceFile(rfid.id, 'results')), /60 game booths and 600 visitors/);
    assert.match(JSON.stringify(getEvidenceFile(rfid.id, 'results')), /No scan-throughput/);
});

test('local evidence artifacts exist and external actions use HTTPS', () => {
    for (const project of projectEvidence) {
        for (const file of project.files) {
            for (const media of file.media || []) {
                assert.ok(media.alt.length > 0);
                assert.ok(existsSync(new URL(`../public${media.src}`, import.meta.url)), `${project.title}: missing ${media.src}`);
            }
            for (const link of file.links || []) assert.equal(new URL(link.href).protocol, 'https:');
        }
    }
});
