'use client';

import styles from './ChapterContext.module.css';

export default function ChapterContext({ context }) {
    if (!context) return null;

    return <aside className={styles.context} aria-label="Chapter context">
        <div className={styles.facts}>
            <p className={styles.period}>{context.period}</p>
            <p className={styles.tools}><span>Tools</span>{context.tools}</p>
        </div>
        <p className={styles.question}><span>Looking back</span>{context.question}</p>
    </aside>;
}
