// Pure search over portfolio evidence. Destinations are local UI actions.
export const DESKTOP_ENTRIES = [
    { id: 'finder', title: 'Project Finder', subtitle: 'Browse demos, architecture, decisions, and results.', category: 'App', tags: ['projects', 'finder', 'architecture', 'decisions', 'results', 'quick look'], target: { kind: 'project' } },
    { id: 'incident', title: 'Incident Lab', subtitle: 'Inspect a simulated fault, choose an action, and verify recovery.', category: 'App', tags: ['sre', 'reliability', 'grafana', 'raft', 'rocksdb', 'storage', 'incident', 'simulation', 'traffic', 'retry'], target: { kind: 'incident' } },
    { id: 'journey', title: 'Journey', subtitle: 'Career chapters, tools, and lessons along the way.', category: 'Page', tags: ['career', 'journey', 'history', 'experience', 'skills'], target: { kind: 'journey', id: 1 } },
    { id: 'about-si-jun', title: 'About Si Jun', subtitle: 'A small desktop info window with résumé and contact shortcuts.', category: 'Utility', tags: ['about', 'si jun', 'yang', 'profile', 'aboutmac'], target: { kind: 'about' } },
    { id: 'contact', title: 'Contact', subtitle: 'Get in touch with Si Jun.', category: 'Utility', tags: ['contact', 'email', 'gmail', 'message', 'si jun'], target: { kind: 'contact' } },
    { id: 'platform', title: 'ByteDance — Platform engineering', subtitle: 'Current SRE role: distributed storage, capacity, machine operations and automation.', category: 'Experience', tags: ['sre', 'platform', 'distributed', 'storage', 'raft', 'rocksdb', 'go', 'python', 'grafana', 'hbase', 'bytekv', 'tokadb', 'bytedance'], target: { kind: 'experience', id: 'bytedance-current' } },
    { id: 'bytegraph', title: 'ByteDance — ByteGraph internship', subtitle: 'Sep–Dec 2025 · monitoring and operational workflows.', category: 'Experience', tags: ['sre', 'go', 'grafana', 'database', 'bytegraph', 'automation', 'bytedance'], target: { kind: 'experience', id: 'bytedance-intern' } },
    { id: 'tsmc', title: 'TSMC — Telemetry & DevOps', subtitle: 'OpenTelemetry, NATS, Prometheus and industrial workflows.', category: 'Experience', tags: ['sre', 'observability', 'telemetry', 'opentelemetry', 'nats', 'prometheus', 'grafana', 'devops', 'kubernetes', 'helm', 'tsmc'], target: { kind: 'experience', id: 'tsmc' } },
    { id: 'cag', title: 'Changi Airport Group — Operational automation', subtitle: 'AWS serverless workflows, CloudWatch aggregation and microservices.', category: 'Experience', tags: ['aws', 'lambda', 'cloudwatch', 'serverless', 'automation', 'python', 'microservices', 'changi', 'cag'], target: { kind: 'experience', id: 'cag' } },
    { id: 'resume', title: 'Résumé', subtitle: 'Current role, shipped products, internships and technical skills.', category: 'Document', tags: ['resume', 'résumé', 'cv', 'experience', 'contact'], target: { kind: 'resume' } },
];

export function buildSpotlightEntries(projects = []) {
    const entries = [...DESKTOP_ENTRIES];
    for (const project of projects) {
        const title = project.title;
        const projectId = project.id;
        const tags = [...(project.tags || []), ...(project.skills || []), ...(project.techTags || [])];
        entries.push({ id: `project-${projectId}`, title, subtitle: project.summary || project.description || 'Explore the project evidence folder.', category: 'Project', tags, target: { kind: 'project', id: projectId } });
        for (const file of project.files || []) {
            entries.push({ id: `project-${projectId}-${file.id}`, title: `${title} / ${file.title || file.name || file.label}`, subtitle: file.summary || file.description || `Quick Look: ${file.title || file.label || file.id}`, category: 'Project document', tags: [...tags, file.id, file.title || file.label || '', ...(file.tags || [])], target: { kind: 'project', id: projectId, fileId: file.id, quickLook: true } });
        }
    }
    return entries;
}

const normalize = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function searchSpotlight(entries, query, limit = 30) {
    const tokens = normalize(query).trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return entries.filter(entry => ['App', 'Project'].includes(entry.category)).slice(0, limit);
    return entries.map((entry, index) => {
        const title = normalize(entry.title);
        const tags = normalize((entry.tags || []).join(' '));
        const rest = normalize(`${entry.subtitle} ${entry.category}`);
        if (!tokens.every(token => `${title} ${tags} ${rest}`.includes(token))) return null;
        const score = tokens.reduce((sum, token) => sum + (title === token ? 30 : title.startsWith(token) ? 15 : title.includes(token) ? 9 : tags.includes(token) ? 6 : 2), 0);
        return { entry, score, index };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, limit).map(result => result.entry);
}
