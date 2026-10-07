import { getCareerEpoch } from '../../../../lib/careerTimeline.mjs';

// Reuse the verified role metadata without introducing more journey chapters.
// Questions remain retrospective prompts, rather than incident outcome claims.
const first = getCareerEpoch('first-production');
const campus = getCareerEpoch('campus-systems');
const airport = getCareerEpoch('airport-automation');
const telemetry = getCareerEpoch('industrial-observability');
const reliability = getCareerEpoch('distributed-reliability');
const current = getCareerEpoch('platform-engineering');
const tools = values => values.join(' · ');

export const JOURNEY_CHAPTER_CONTEXT = Object.freeze({
    1: Object.freeze({
        period: `${first.organization} · ${first.dateLabel}`,
        tools: tools(first.tools),
        question: first.question,
    }),
    2: Object.freeze({
        period: campus.dateLabel,
        tools: tools(campus.tools.filter(tool => !['Python', 'Django'].includes(tool))),
        question: campus.question,
    }),
    3: Object.freeze({
        period: `Changi · TSMC · ByteDance · ${airport.dateLabel.split(' – ')[0]} – ${reliability.dateLabel.split(' – ').at(-1)}`,
        tools: tools([airport.tools[0], telemetry.tools[0], ...reliability.tools.filter(tool => ['Grafana', 'Go'].includes(tool))]),
        question: telemetry.question,
    }),
    4: Object.freeze({
        period: current.dateLabel,
        tools: tools(current.tools.filter(tool => !['Shell', 'Partitions & replica groups'].includes(tool))),
        question: current.question,
    }),
});
