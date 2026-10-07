'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './GrafanaPanel.module.css';

const valid = value => typeof value === 'number' && Number.isFinite(value);
const format = value => valid(value) ? value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—';
const niceMax = value => {
    if (value <= 1) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(value));
    return ([1, 2, 5, 10].find(step => value <= step * magnitude) || 10) * magnitude;
};

export default function GrafanaPanel({ title, history, events = [], series, unit = '', threshold, min = 0, max, height = 255, legendMode = 'list', className = '', id }) {
    const generatedId = useId().replace(/:/g, '');
    const titleId = `${generatedId}-title`;
    const helpId = `${generatedId}-help`;
    const tooltipId = `${generatedId}-tooltip`;
    const svgRef = useRef(null);
    const [width, setWidth] = useState(360);
    const [hidden, setHidden] = useState([]);
    const [selectedTick, setSelectedTick] = useState(null);
    const [pointerY, setPointerY] = useState(40);
    const keyboardMode = useRef(false);
    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => setWidth(Math.max(160, Math.round(entry.contentRect.width))));
        if (svgRef.current) observer.observe(svgRef.current);
        return () => observer.disconnect();
    }, []);
    const samples = history.length ? history : [{ tick: 0 }];
    const visibleSeries = series.filter(item => !hidden.includes(item.key));
    const first = samples[0].tick;
    const last = samples.at(-1).tick;
    const largest = Math.max(min + 1, threshold || 0, ...visibleSeries.flatMap(item => samples.map(sample => sample[item.key]).filter(valid)));
    const upper = max ?? niceMax(largest * 1.08);
    const left = 44, right = width - 14, top = 18, bottom = height - 29;
    const x = tick => left + (tick - first) / Math.max(1, last - first) * (right - left);
    const y = value => bottom - (Math.max(min, Math.min(upper, value)) - min) / Math.max(.001, upper - min) * (bottom - top);
    const selectedIndex = selectedTick === null ? -1 : samples.reduce((nearest, sample, index) => Math.abs(sample.tick - selectedTick) < Math.abs(samples[nearest].tick - selectedTick) ? index : nearest, 0);
    const selected = selectedIndex >= 0 ? samples[selectedIndex] : null;
    const annotations = events.filter(event => event.tick >= first && event.tick <= last && ['critical', 'warning', 'success'].includes(event.level)).slice(-4);
    const pathFor = item => {
        let connected = false;
        return samples.map(sample => {
            if (!valid(sample[item.key])) { connected = false; return ''; }
            const position = `${x(sample.tick).toFixed(1)},${y(sample[item.key]).toFixed(1)}`;
            const segment = !connected ? `M${position}` : item.step ? `H${x(sample.tick).toFixed(1)}V${y(sample[item.key]).toFixed(1)}` : `L${position}`;
            connected = true;
            return segment;
        }).join(' ');
    };
    const selectPointer = event => {
        keyboardMode.current = false;
        const bounds = svgRef.current.getBoundingClientRect();
        const svgX = (event.clientX - bounds.left) / bounds.width * width;
        const tick = first + Math.max(0, Math.min(1, (svgX - left) / (right - left))) * (last - first);
        const nearest = samples.reduce((result, sample) => Math.abs(sample.tick - tick) < Math.abs(result.tick - tick) ? sample : result, samples[0]);
        setSelectedTick(nearest.tick);
        setPointerY(Math.max(14, Math.min(height - 90, event.clientY - bounds.top)));
    };
    const keyDown = event => {
        if (event.key === 'Escape' && selected) { event.preventDefault(); event.stopPropagation(); setSelectedTick(null); return; }
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        keyboardMode.current = true;
        const current = selectedIndex < 0 ? samples.length - 1 : selectedIndex;
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? samples.length - 1 : Math.max(0, Math.min(samples.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)));
        setSelectedTick(samples[next].tick);
        setPointerY(30);
    };
    const legendButton = item => <button type="button" aria-label={`Toggle ${item.label} series`} aria-pressed={!hidden.includes(item.key)} onClick={() => setHidden(previous => previous.includes(item.key) ? previous.filter(key => key !== item.key) : [...previous, item.key])}><i style={{ background: item.color }} /><span>{item.label}</span></button>;
    const tooltipWidth = Math.min(250, Math.max(132, width - 18));
    const tooltipLeft = selected ? Math.max(8, Math.min(width - tooltipWidth - 8, x(selected.tick) + 12)) : 0;
    return <section id={id} className={`${styles.panel} ${className}`} aria-labelledby={titleId} data-grafana-panel>
        <header className={styles.header}><h3 id={titleId}>{title}</h3><span>{unit || 'count'}</span></header>
        <span id={helpId} className="sr-only">Synthetic samples. Hover or tap to inspect. Left and right arrows choose a sample; Home and End choose the first and last. Escape dismisses the tooltip. Legend buttons toggle each series.</span>
        <div className={styles.body} data-legend-mode={legendMode}>
            <div className={styles.plot} data-grafana-chart>
                <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} style={{ height }} role="img" tabIndex={0} aria-roledescription="Interactive time-series chart" aria-describedby={`${helpId}${selected ? ` ${tooltipId}` : ''}`} aria-label={`${title} from ${first} to ${last} simulated seconds. ${series.map(item => `${item.label}: ${format(samples.at(-1)[item.key])} ${unit}`).join('. ')}`} onPointerMove={selectPointer} onPointerDown={event => { svgRef.current.focus(); selectPointer(event); }} onPointerLeave={event => { if (event.pointerType !== 'touch' && !keyboardMode.current) setSelectedTick(null); }} onFocus={() => { keyboardMode.current = true; setSelectedTick(previous => previous ?? last); }} onBlur={() => setSelectedTick(null)} onKeyDown={keyDown}>
                    {Array.from({ length: 6 }, (_, index) => { const value = min + (upper - min) * index / 5; return <g key={index}><line x1={left} x2={right} y1={y(value)} y2={y(value)} className={styles.gridLine} /><text x={left - 7} y={y(value) + 4} textAnchor="end" className={styles.axis}>{format(value)}</text></g>; })}
                    {Array.from({ length: 5 }, (_, index) => { const tick = first + (last - first) * index / 4; return <g key={index}><line x1={x(tick)} x2={x(tick)} y1={top} y2={bottom} className={styles.gridLine} /><text x={x(tick)} y={height - 7} textAnchor={index === 0 ? 'start' : index === 4 ? 'end' : 'middle'} className={styles.axis}>+{Math.round(tick)}s</text></g>; })}
                    {valid(threshold) && <line x1={left} x2={right} y1={y(threshold)} y2={y(threshold)} className={styles.threshold} />}
                    {annotations.map(event => <line key={event.id} x1={x(event.tick)} x2={x(event.tick)} y1={top} y2={bottom} className={styles.annotation} data-level={event.level}><title>{event.message}</title></line>)}
                    {visibleSeries.map(item => <g key={item.key}>{item.fill && samples.every(sample => valid(sample[item.key])) && <path d={`${pathFor(item)} L${right},${bottom} L${left},${bottom} Z`} fill={item.color} fillOpacity=".24" />}<path d={pathFor(item)} fill="none" stroke={item.color} strokeWidth="1.5" strokeLinejoin="round" data-series-key={item.key} data-series-line="true" /></g>)}
                    {selected && <g><line x1={x(selected.tick)} x2={x(selected.tick)} y1={top} y2={bottom} className={styles.crosshair} />{visibleSeries.filter(item => valid(selected[item.key])).map(item => <circle key={item.key} cx={x(selected.tick)} cy={y(selected[item.key])} r="3" fill={item.color} stroke="var(--lab-panel, #161719)" />)}</g>}
                </svg>
                {!visibleSeries.length && <div className={styles.noSeries}>All series hidden · select a legend to restore</div>}
                {selected && <div id={tooltipId} className={styles.tooltip} role="tooltip" data-chart-tooltip style={{ left: tooltipLeft, top: Math.min(pointerY, Math.max(14, height - 40 - visibleSeries.length * 24)), width: tooltipWidth }}><strong>t + {selected.tick}s <span>simulated</span></strong>{visibleSeries.map(item => <div key={item.key}><i style={{ background: item.color }} /><span>{item.label}</span><b>{format(selected[item.key])}{unit && ` ${unit}`}</b></div>)}</div>}
            </div>
            {legendMode === 'table' ? <table className={styles.legendTable}><thead><tr><th><span className="sr-only">Series</span></th><th>Max</th><th>Current</th></tr></thead><tbody>{series.map(item => { const values = samples.map(sample => sample[item.key]).filter(valid); return <tr key={item.key}><td>{legendButton(item)}</td><td>{format(values.length ? Math.max(...values) : null)}</td><td>{format(samples.at(-1)[item.key])}</td></tr>; })}</tbody></table> : <div className={styles.legend}>{series.map(item => <div key={item.key}>{legendButton(item)}<span>{format(samples.at(-1)[item.key])}{unit}</span></div>)}{valid(threshold) && <small><i />{threshold}{unit} threshold</small>}</div>}
        </div>
    </section>;
}
