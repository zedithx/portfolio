// Role dates and scope come from the published portfolio and résumé. Reflections
// are a retrospective synthesis, kept separate from the factual work summaries.
export const CAREER_EPOCHS = Object.freeze([
    {
        id: 'first-production', label: '2022', dateLabel: 'Feb – Jul 2022',
        title: 'First production systems', organization: 'Reluvate Technologies',
        role: 'Software Engineer Intern', chapter: 'Before university',
        wallpaper: '/wallpaper/desktop_wallpaper_light.webp', wallpaperPosition: 'center', tint: '#a6ccf2',
        focus: 'Backend work for a production payment platform: merchant administration, Django features, and unit testing.',
        reflection: 'A working endpoint is only the starting point. Payment workflows bring questions about correctness, testing, and the people who depend on a change.',
        question: 'How do I check that a change is safe for its users?',
        tools: ['Python', 'Django', 'Unit testing'], projectIds: [],
        evidence: [{ kind: 'journey', id: 1, label: 'Read the backend journey chapter' }],
        journeyStep: 1,
    },
    {
        id: 'campus-systems', label: 'University', dateLabel: 'SUTD · Aug 2022 – May 2026',
        title: 'Systems people use together', organization: 'SUTD & Student Government',
        role: 'Campus technology & project teams', chapter: 'University projects',
        wallpaper: '/background/Root-Student-Government.JPG', wallpaperPosition: 'center 42%', tint: '#c7b4ed',
        focus: 'Campus websites, Telegram bots, and an RFID carnival system spanning wristbands, readers, backend software, and event operations.',
        reflection: 'An end-to-end system includes the booth, the operator, and the hardware. A useful design has to survive those handoffs as well as the happy path in code.',
        question: 'Does the whole workflow work when real people use it?',
        tools: ['Next.js', 'Python', 'Django', 'PostgreSQL', 'RFID', 'Telegram Bots'],
        projectIds: [4, 1, 2, 3],
        evidence: [
            { kind: 'project', id: 4, label: 'Night Fiesta RFID System' },
            { kind: 'project', id: 2, label: 'Plant Pulse' },
            { kind: 'project', id: 3, label: 'EnableID' },
        ], journeyStep: 2,
    },
    {
        id: 'airport-automation', label: 'Early 2025', dateLabel: 'Jan – May 2025',
        title: 'Automation with operational context', organization: 'Changi Airport Group',
        role: 'Software Engineer Intern', chapter: 'Production automation',
        wallpaper: '/background/changiairport.webp', wallpaperPosition: 'center', tint: '#8ccfdc',
        focus: 'Event-driven serverless workflows, a production Slack bot, multi-account CloudWatch log aggregation, and microservices behind Apigee.',
        reflection: 'Automation should shorten a real operational workflow. Its interfaces, permissions, logs, and failure handling belong in the design from the beginning.',
        question: 'What does the operator need when the workflow fails?',
        tools: ['AWS Lambda', 'CloudWatch', 'EventBridge', 'SQS', 'Python', 'Apigee'],
        projectIds: [],
        evidence: [{ kind: 'experience', id: 'changi', label: 'Read the airport automation work' }],
        journeyStep: 2,
    },
    {
        id: 'industrial-observability', label: 'Mid 2025', dateLabel: 'Jun – Aug 2025 · Tangled from Jul 2025',
        title: 'Following signals across systems', organization: 'TSMC · Tangled alongside work',
        role: 'DevOps Intern · Co-founder & Software Engineer', chapter: 'Telemetry & a shipped product',
        wallpaper: '/background/tsmc.webp', wallpaperPosition: 'center', tint: '#add0a3',
        focus: 'OpenTelemetry tracing and NATS context propagation, Prometheus sanity checks, and test-scenario generation. Alongside work, Tangled began in July 2025.',
        reflection: 'A metric tells me that something changed; connected traces and system context help explain where. Building a product adds another question: which signals represent the user experience?',
        question: 'Can I connect a symptom to the dependency behind it?',
        tools: ['OpenTelemetry', 'NATS', 'Prometheus', 'Grafana Tempo', 'Spring Boot', 'Terraform'],
        projectIds: [11],
        evidence: [
            { kind: 'experience', id: 'tsmc', label: 'Read the telemetry experience' },
            { kind: 'project', id: 11, label: 'Tangled · a parallel product chapter' },
        ], journeyStep: 2,
    },
    {
        id: 'distributed-reliability', label: 'Late 2025', dateLabel: 'Sep – Dec 2025',
        title: 'Reliability across a distributed platform', organization: 'ByteDance · ByteGraph',
        role: 'Software Engineer (SRE) Intern', chapter: 'Distributed systems operations',
        wallpaper: '/background/bytedance.webp', wallpaperPosition: 'center', tint: '#99bfe4',
        focus: 'ByteGraph monitoring, machine operations, automation, and operational workflows for production clusters across Singapore and Europe.',
        reflection: 'A machine-level action has cluster-level consequences. Monitoring and automation are most useful when they make dependencies, capacity, and completion visible to the operator.',
        question: 'What else changes when I operate on this machine?',
        tools: ['Go', 'Grafana', 'Machine operations', 'Distributed databases'], projectIds: [11],
        evidence: [{ kind: 'experience', id: 'bytedance-internship', label: 'Read the ByteGraph internship' }],
        journeyStep: 3,
    },
    {
        id: 'platform-engineering', label: 'Now', dateLabel: 'ByteDance · Jul 2026 – Present',
        title: 'Understand. Act. Verify.', organization: 'ByteDance · Tangled alongside work',
        role: 'Software Engineer (SRE) · Co-founder', chapter: 'The current chapter',
        wallpaper: '/wallpaper/desktop_wallpaper.jpg', wallpaperPosition: 'center', tint: '#96dac6',
        focus: 'Platform engineering and operational automation for distributed storage: capacity expansion, machine replacement, configuration, infrastructure tracking, and administrative CLI usability.',
        reflection: 'An operational action is a hypothesis about the system. I want enough evidence to choose it safely, and a separate check that confirms what happened afterward.',
        question: 'Is the action safe, and what evidence confirms completion?',
        tools: ['Go', 'Python', 'Grafana', 'Shell', 'Raft', 'RocksDB', 'Partitions & replica groups'],
        projectIds: [11],
        evidence: [
            { kind: 'incident', label: 'Try the incident simulation' },
            { kind: 'project', id: 11, label: 'Explore Tangled' },
            { kind: 'experience', id: 'bytedance-current', label: 'Read the current role' },
        ], journeyStep: 4,
    },
].map(epoch => Object.freeze({
    ...epoch,
    tools: Object.freeze(epoch.tools),
    projectIds: Object.freeze(epoch.projectIds),
    evidence: Object.freeze(epoch.evidence.map(item => Object.freeze(item))),
})));

export function getCareerEpoch(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return CAREER_EPOCHS[Math.min(CAREER_EPOCHS.length - 1, Math.max(0, Math.round(value)))];
    }
    return CAREER_EPOCHS.find(epoch => epoch.id === value) || null;
}

// The internship chapter spans three roles. Its existing story points appear
// after that chapter, rather than inventing an allocation to individual roles.
export function getEpochSkillProgression(epochId, journey, definitions = {}) {
    const epoch = getCareerEpoch(epochId);
    if (!epoch || !Array.isArray(journey)) return [];
    const values = new Map();
    for (const card of journey) {
        if (!Number.isFinite(card.id) || card.id > epoch.journeyStep) continue;
        for (const [name, gain] of Object.entries(card.skillsGained || {})) {
            if (Number.isFinite(gain) && gain > 0) values.set(name, (values.get(name) || 0) + gain);
        }
    }
    return [...values.entries()].map(([name, value]) => {
        const definition = definitions[name] || {};
        const max = Number.isFinite(definition.max) && definition.max > 0 ? definition.max : 100;
        const baseline = Number.isFinite(definition.baseline) && definition.baseline > 0 ? definition.baseline : 0;
        return { name, label: definition.displayName || name, value: Math.min(max, baseline + value), max };
    }).sort((a, b) => b.value / b.max - a.value / a.max || a.name.localeCompare(b.name));
}

function unlockCheckpointSkills(skills) {
    const unlockedSkills = [];
    for (const [name, skill] of Object.entries(skills)) {
        if (!skill.locked || !skill.unlockThreshold) continue;
        if (Object.entries(skill.unlockThreshold).every(([required, threshold]) => (skills[required]?.value || 0) >= threshold)) {
            skills[name] = { ...skill, locked: false };
            unlockedSkills.push(name);
        }
    }
    return unlockedSkills;
}

export function createJourneyCheckpoint(journey, definitions, requestedCardId) {
    const cards = Array.isArray(journey) ? journey : [];
    const foundIndex = cards.findIndex(card => card.id === requestedCardId);
    const initialIndex = Math.max(0, foundIndex);
    const skills = Object.fromEntries(Object.entries(definitions || {}).map(([name, definition]) => [name, {
        ...definition,
        value: Number.isFinite(definition.baseline) ? definition.baseline : 0,
    }]));
    const processedCards = [];
    for (const card of cards.slice(0, initialIndex)) {
        for (const [name, gain] of Object.entries(card.skillsGained || {})) {
            if (!skills[name] || !Number.isFinite(gain) || gain <= 0) continue;
            skills[name] = { ...skills[name], value: Math.min(skills[name].max || 100, skills[name].value + gain) };
        }
        unlockCheckpointSkills(skills);
        processedCards.push(card.id);
    }
    return { initialCardId: cards[initialIndex]?.id ?? null, initialIndex, skills, processedCards };
}

export function advanceJourneyCheckpoint(checkpoint, cardId, skillDeltas) {
    if (checkpoint.processedCards.includes(cardId)) return { checkpoint, updated: false, unlockedSkills: [] };
    const skills = { ...checkpoint.skills };
    for (const [name, gain] of Object.entries(skillDeltas || {})) {
        if (!skills[name] || !Number.isFinite(gain) || gain <= 0) continue;
        skills[name] = { ...skills[name], value: Math.min(skills[name].max || 100, skills[name].value + gain) };
    }
    const unlockedSkills = unlockCheckpointSkills(skills);
    return {
        checkpoint: { ...checkpoint, skills, processedCards: [...checkpoint.processedCards, cardId] },
        updated: true, unlockedSkills,
    };
}
