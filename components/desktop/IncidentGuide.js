'use client';

import { Check } from 'lucide-react';
import styles from './IncidentGuide.module.css';

const STEPS = [['start', 'Start'], ['inspect', 'Inspect'], ['respond', 'Respond'], ['verify', 'Verify']];

export default function IncidentGuide({ id, activeStep, status, tone = 'neutral', title, description, facts, children }) {
    const current = activeStep === 'done' ? STEPS.length : STEPS.findIndex(([key]) => key === activeStep);
    return <section id={id} className={styles.guide} data-tone={tone} aria-labelledby={`${id}-title`}>
        <ol className={styles.steps} aria-label="Incident response progress">
            {STEPS.map(([key, label], index) => <li key={key} data-active={index === current} data-complete={index < current} aria-current={index === current ? 'step' : undefined}>
                <span>{index < current ? <Check size={12} aria-hidden="true" /> : index + 1}</span>{label}
            </li>)}
        </ol>
        <div className={styles.body}>
            <div className={styles.decision}>
                <span className={styles.status} role="status"><i aria-hidden="true" />{status}</span>
                <h2 id={`${id}-title`}>{title}</h2>
                <p className={styles.description}>{description}</p>
                {children}
            </div>
            <dl className={styles.facts} aria-label="Current service health">
                {facts.map(fact => <div key={fact.label} data-tone={fact.tone}>
                    <dt>{fact.label}</dt><dd>{fact.value}</dd>
                    {fact.reference && <small>{fact.reference}</small>}
                </div>)}
            </dl>
        </div>
    </section>;
}
