'use client';

import { ArrowDown, ExternalLink, FileText } from 'lucide-react';
import styles from './ProjectFinder.module.css';

export default function EvidenceDocument({ project, file, onOriginal }) {
    return (
        <article className={styles.document} aria-label={`${project.title}: ${file.title}`}>
            <div className={styles.documentEyebrow}><FileText size={14} aria-hidden="true" /> {file.kind}</div>
            <h2>{file.title}</h2>
            <p className={styles.documentLead}>{file.summary}</p>

            {file.diagram && (
                <figure className={styles.diagram} aria-label={`${project.title} architecture reconstruction`}>
                    <ol>
                        {file.diagram.map((node, index) => (
                            <li key={node.title}>
                                <div><span>{String(index + 1).padStart(2, '0')}</span><strong>{node.title}</strong><p>{node.body}</p></div>
                                {index < file.diagram.length - 1 && <ArrowDown size={17} aria-hidden="true" />}
                            </li>
                        ))}
                    </ol>
                    <figcaption>Conceptual reconstruction from the public project description.</figcaption>
                </figure>
            )}

            {file.sections.map(section => (
                <section className={styles.documentSection} key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                </section>
            ))}

            {file.media?.map(media => (
                <figure className={styles.media} key={media.src}>
                    {media.type === 'video' ? (
                        <>
                            <video src={media.src} controls preload="none" aria-label={media.alt}>
                                Your browser does not support this recording.
                            </video>
                            <a href={media.src} target="_blank" rel="noopener noreferrer">Open original recording <ExternalLink size={13} aria-hidden="true" /></a>
                        </>
                    ) : <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />}
                    <figcaption>{media.caption}</figcaption>
                </figure>
            ))}

            {!!file.links?.length && (
                <div className={styles.documentLinks}>
                    {file.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ExternalLink size={14} aria-hidden="true" /></a>)}
                </div>
            )}

            <footer className={styles.documentSource}>
                <p>Source: existing portfolio and résumé descriptions, contribution notes, and project media. Reconstructed reasoning and future proposals are labelled above.</p>
                {onOriginal && <button onClick={onOriginal}>Open full project page <ExternalLink size={13} aria-hidden="true" /></button>}
            </footer>
        </article>
    );
}
