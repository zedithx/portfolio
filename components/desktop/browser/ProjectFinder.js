'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AppWindow, ChevronLeft, ChevronRight, Eye, FileText, Folder, FolderOpen, Grid2X2, Search, Star, X } from 'lucide-react';
import { getProjectEvidence, searchProjectEvidence } from '../../../lib/projectEvidence.mjs';
import EvidenceDocument from './EvidenceDocument';
import ProjectQuickLook from './ProjectQuickLook';
import styles from './ProjectFinder.module.css';

const CATEGORIES = ['All projects', 'Featured Project', 'Student Government', 'School Projects', 'DevOps Projects', 'Personal Projects'];

export default function ProjectFinder({ items, isDark, onClose, onGallery, onOriginal, projectTarget, initialProjectId }) {
    const { projectId: targetProjectId, fileId: targetFileId, quickLook: targetQuickLook, nonce: targetNonce } = projectTarget || {};
    const [selectedProjectId, setSelectedProjectId] = useState(() => getProjectEvidence(projectTarget?.projectId || initialProjectId)?.id || null);
    const [fileId, setFileId] = useState('demo');
    const [quickLook, setQuickLook] = useState(false);
    const [category, setCategory] = useState('All projects');
    const [query, setQuery] = useState('');
    const rootRef = useRef(null);
    const searchId = useId();
    const fileRefs = useRef({});
    const projectRefs = useRef({});
    const selectedProject = getProjectEvidence(selectedProjectId);
    const selectedFile = selectedProject?.files.find(file => file.id === fileId) || selectedProject?.files[0];
    const itemIds = useMemo(() => new Set(items.map(item => item.id)), [items]);
    const projects = useMemo(() => searchProjectEvidence(query, category).filter(project => itemIds.has(project.sourceId)), [category, itemIds, query]);

    useEffect(() => {
        if (!targetProjectId) return;
        const project = getProjectEvidence(targetProjectId);
        if (!project || !itemIds.has(project.sourceId)) return;
        const targetFile = project.files.find(file => file.id === targetFileId) || project.files[0];
        setSelectedProjectId(project.id);
        setFileId(targetFile.id);
        setQuickLook(Boolean(targetQuickLook));
        setCategory('All projects');
        setQuery('');
    }, [targetProjectId, targetFileId, targetQuickLook, targetNonce, itemIds]);

    const openProject = useCallback(id => {
        setSelectedProjectId(id);
        setFileId('demo');
        setQuickLook(false);
        requestAnimationFrame(() => fileRefs.current.demo?.focus());
    }, []);

    const backToFolders = useCallback(() => {
        const previousId = selectedProjectId;
        setSelectedProjectId(null);
        setQuickLook(false);
        requestAnimationFrame(() => projectRefs.current[previousId]?.focus());
    }, [selectedProjectId]);

    const openOriginal = useCallback(() => {
        setQuickLook(false);
        const item = items.find(item => item.id === selectedProject?.sourceId);
        if (item) onOriginal(item);
    }, [items, onOriginal, selectedProject]);

    const handleFileKey = (event, index) => {
        if (event.key === ' ' || event.code === 'Space') {
            event.preventDefault(); event.stopPropagation(); setFileId(selectedProject.files[index].id); setQuickLook(true);
            return;
        }
        let next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = Math.min(index + 1, selectedProject.files.length - 1);
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = Math.max(index - 1, 0);
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = selectedProject.files.length - 1;
        if (next !== undefined) {
            event.preventDefault();
            const nextFile = selectedProject.files[next];
            setFileId(nextFile.id); fileRefs.current[nextFile.id]?.focus();
        }
    };

    return (
        <section className={styles.finder} data-theme={isDark ? 'dark' : 'light'} ref={rootRef} aria-label="Project Finder">
            <header className={styles.titlebar}>
                <div className={styles.windowControls}>
                    <button className={styles.closeControl} onClick={onClose} aria-label="Close Projects"><span /></button>
                    <span className={styles.inactiveControl} aria-hidden="true" />
                    <span className={styles.inactiveControl} aria-hidden="true" />
                </div>
                <div className={styles.windowTitle}><FolderOpen size={16} aria-hidden="true" />{selectedProject?.title || 'Projects'}</div>
                <button className={styles.galleryButton} onClick={onGallery}><Grid2X2 size={15} aria-hidden="true" /><span>Gallery</span></button>
            </header>

            <div className={styles.toolbar}>
                <button onClick={backToFolders} disabled={!selectedProject} className={styles.iconButton} aria-label="Back to project folders"><ChevronLeft size={20} aria-hidden="true" /></button>
                <nav className={styles.breadcrumb} aria-label="Project path">
                    <button onClick={backToFolders}>Projects</button>
                    {selectedProject && <><ChevronRight size={13} aria-hidden="true" /><span>{selectedProject.title}</span></>}
                </nav>
                {selectedProject ? (
                    <button className={styles.previewButton} onClick={() => setQuickLook(true)}><Eye size={16} aria-hidden="true" />Quick Look</button>
                ) : (
                    <div className={styles.search}>
                        <Search size={16} aria-hidden="true" /><label className={styles.srOnly} htmlFor={searchId}>Search projects and evidence</label>
                        <input id={searchId} placeholder="Search projects & skills" value={query} onChange={event => setQuery(event.target.value)} />
                        {query && <button onClick={() => setQuery('')} aria-label="Clear project search"><X size={15} aria-hidden="true" /></button>}
                    </div>
                )}
            </div>

            <div className={styles.finderBody}>
                <aside className={styles.sidebar}>
                    <span className={styles.sidebarLabel}>Favorites</span>
                    {CATEGORIES.map(label => <button key={label} className={category === label && !selectedProject ? styles.sidebarSelected : ''} onClick={() => { setCategory(label); setSelectedProjectId(null); setQuickLook(false); }} aria-pressed={category === label && !selectedProject}>
                        {label === 'Featured Project' ? <Star size={16} aria-hidden="true" /> : <Folder size={16} aria-hidden="true" />}<span>{label === 'Featured Project' ? 'Featured' : label}</span>
                    </button>)}
                    <div className={styles.sidebarNote}><FileText size={19} aria-hidden="true" /><strong>See how I think</strong><p>Explore demos, architecture, tradeoffs, results, and next steps.</p></div>
                </aside>

                {selectedProject ? (
                    <div className={styles.projectContents}>
                        <header className={styles.folderIntro}>
                            <div className={styles.folderStamp}><FolderOpen size={28} aria-hidden="true" /></div>
                            <div><h1>{selectedProject.title}</h1><p>{selectedProject.summary}</p></div>
                        </header>
                        <div className={styles.dossierLayout}>
                            <div className={styles.fileColumn}>
                                <div className={styles.fileList} aria-label={`${selectedProject.title} evidence files`}>
                                    {selectedProject.files.map((file, index) => <button
                                        key={file.id} ref={node => { fileRefs.current[file.id] = node; }}
                                        className={`${styles.fileRow} ${file.id === selectedFile.id ? styles.fileSelected : ''}`}
                                        aria-pressed={file.id === selectedFile.id}
                                        onClick={() => setFileId(file.id)} onDoubleClick={() => { setFileId(file.id); setQuickLook(true); }}
                                        onKeyDown={event => handleFileKey(event, index)}
                                    ><span className={styles.fileIcon}><FileText size={21} aria-hidden="true" /></span><span><strong>{file.title}</strong><small>{file.kind}</small></span><ChevronRight size={14} aria-hidden="true" /></button>)}
                                </div>
                                <p className={styles.keyboardHint}>Select a file · press <kbd>Space</kbd> to preview.<br />Or use the Quick Look button.</p>
                                <div className={styles.skillTags}>{selectedProject.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
                                <button className={styles.originalButton} onClick={openOriginal}><AppWindow size={15} aria-hidden="true" />Full project page</button>
                            </div>
                            <div className={styles.inspector} key={`${selectedProject.id}/${selectedFile.id}`}>
                                <div className={styles.inspectorToolbar}><span>Preview</span><button onClick={() => setQuickLook(true)}><Eye size={15} aria-hidden="true" />Quick Look {selectedFile.title}</button></div>
                                <EvidenceDocument project={selectedProject} file={selectedFile} onOriginal={openOriginal} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.folderContents}>
                        <header className={styles.projectsIntro}>
                            <div><span className={styles.eyebrow}>An engineer’s workspace</span><h1>Projects, with the thinking inside.</h1><p>Open a folder to explore the build and the decisions behind it.</p></div>
                            <label className={styles.mobileCategory}>Folder category<select value={category} onChange={event => setCategory(event.target.value)}>{CATEGORIES.map(label => <option key={label}>{label}</option>)}</select></label>
                        </header>
                        <div className={styles.folderGrid}>
                            {projects.map(project => {
                                const item = items.find(item => item.id === project.sourceId);
                                return <button key={project.id} ref={node => { projectRefs.current[project.id] = node; }} className={styles.folderCard} onClick={() => openProject(project.id)} aria-label={`Open ${project.title} project folder`}>
                                    <div className={styles.folderGraphic}><Folder size={95} strokeWidth={1} fill="currentColor" aria-hidden="true" />{item?.thumbnail?.src && <img src={item.thumbnail.src} alt="" loading="lazy" decoding="async" />}{project.id === 'tangled' && <span className={styles.featuredStar}><Star size={11} fill="currentColor" aria-hidden="true" /></span>}</div>
                                    <strong>{project.title}</strong><span>{project.category === 'Featured Project' ? 'Live product' : project.category}</span><small>5 evidence files</small>
                                </button>;
                            })}
                        </div>
                        {!projects.length && <div className={styles.empty}><Search size={30} aria-hidden="true" /><h2>No matching folders</h2><p>Try another skill or view all projects.</p><button onClick={() => { setQuery(''); setCategory('All projects'); }}>Show all projects</button></div>}
                    </div>
                )}
            </div>

            <footer className={styles.statusbar}><span>{selectedProject ? `5 files · ${selectedFile.kind}` : `${projects.length} project folders`}</span><span>{selectedProject ? selectedProject.category : 'Original project gallery available above'}</span></footer>
            {quickLook && selectedProject && <ProjectQuickLook project={selectedProject} fileId={selectedFile.id} isDark={isDark} onFileChange={setFileId} onClose={() => setQuickLook(false)} onOriginal={openOriginal} />}
        </section>
    );
}
