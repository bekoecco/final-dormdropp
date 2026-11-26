import React from 'react';
import { Link, usePath } from './router';
import { Icon } from './icons';
import { FEEDBACK_URL } from './config';
import logoMark from './mark.webp';
import { CrayonDefs } from './crayon';
import { BoxyBadge, PencilScene, SuccessScene } from './scenes';
import { RM } from './crayon';

/* ---------- Brand + shell ---------- */

export function Logo({ small }: { small?: boolean }) {
    return <Link to="/" className={'logo' + (small ? ' logo-sm' : '')} aria-label="DormDropp home">
        <img src={logoMark} alt="" />
        <span>Dorm<b>Dropp</b></span>
    </Link>;
}

const NAV = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/buy', label: 'Buy', icon: 'search' },
    { to: '/sell', label: 'Sell', icon: 'tag' },
    { to: '/room-sets', label: 'Room sets', icon: 'room' },
    { to: '/orders', label: 'My orders', icon: 'list' },
];

export function Shell({ children }: { children: React.ReactNode }) {
    const path = usePath();
    const active = (to: string) => to === '/' ? path === '/' : path === to || (to === '/orders' && path === '/order');
    return <>
        <CrayonDefs />
        <header className="topbar">
            <div className="wrap topbar-in">
                <Logo />
                <nav className="topnav" aria-label="Main">
                    {NAV.slice(1).map(n => <Link key={n.to} to={n.to} className={active(n.to) ? 'on' : ''}>{n.label}</Link>)}
                </nav>
                <span className="demo-tag" title="Sample data only. Nothing is scheduled or charged.">Early demo</span>
            </div>
        </header>
        <main className="wrap page">{children}</main>
        <footer className="footer">
            <div className="wrap footer-in">
                <div>
                    <Logo small />
                    <p>Early demo, November 2026. Sample data throughout: no real pickups, deliveries, deposits, payouts or accounts. Everything stays in this browser.</p>
                </div>
                <div className="footer-links">
                    <Link to="/how-it-works">How it works</Link>
                    <Link to="/admin">Admin view</Link>
                    <a href={FEEDBACK_URL} target="_blank" rel="noreferrer">Give feedback</a>
                </div>
            </div>
        </footer>
        <nav className="tabbar" aria-label="Main">
            {NAV.map(n => <Link key={n.to} to={n.to} className={active(n.to) ? 'on' : ''}>
                <Icon name={n.icon} size={20} /><span>{n.label === 'My orders' ? 'Orders' : n.label === 'Room sets' ? 'Rooms' : n.label}</span>
            </Link>)}
        </nav>
    </>;
}

/* ---------- Small building blocks ---------- */

export function PageHead({ eyebrow, title, lede, back, right, art }: { eyebrow?: string; title: string; lede?: React.ReactNode; back?: string; right?: React.ReactNode; art?: React.ReactNode }) {
    return <div className={'pagehead' + (art ? ' pagehead-art' : '')}>
        {art && <div className="pagehead-ill">{art}</div>}
        {back && <Link to={back} className="backlink"><Icon name="back" size={16} />Back</Link>}
        <div className="pagehead-row">
            <div>
                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                <h1>{title}</h1>
            </div>
            {right}
        </div>
        {lede && <p className="lede">{lede}</p>}
    </div>;
}

export function Steps({ labels, current }: { labels: string[]; current: number }) {
    return <ol className="steps" aria-label={'Step ' + current + ' of ' + labels.length}>
        {labels.map((l, i) => {
            const n = i + 1;
            const state = n < current ? 'done' : n === current ? 'now' : '';
            return <li key={l} className={state} aria-current={n === current ? 'step' : undefined}>
                <span className="steps-dot">{n < current ? <Icon name="check" size={13} /> : n}</span>
                <span className="steps-label">{l}</span>
            </li>;
        })}
    </ol>;
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return <section className="section">
        <div className="section-head"><h2>{title}</h2>{hint && <p>{hint}</p>}</div>
        {children}
    </section>;
}

export function Qty({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    return <div className="qty" role="group" aria-label={label}>
        <button type="button" aria-label={'Remove one ' + label} disabled={value === 0} onClick={() => onChange(value - 1)}><Icon name="minus" size={15} /></button>
        <span aria-live="polite" key={value} className="qty-n">{value}</span>
        <button type="button" aria-label={'Add one ' + label} onClick={() => onChange(value + 1)}><Icon name="plus" size={15} /></button>
    </div>;
}

export function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
    return <div role="radiogroup" aria-label={label} className="chips">
        {options.map(o => <button key={o} type="button" role="radio" aria-checked={value === o}
            className={'chip' + (value === o ? ' on' : '')} onClick={() => onChange(o)}>{o}</button>)}
    </div>;
}

export function Banner({ tone = 'info', icon, children }: { tone?: 'info' | 'good' | 'warn'; icon?: string; children: React.ReactNode }) {
    return <div className={'banner banner-' + tone}>
        <Icon name={icon || (tone === 'warn' ? 'alert' : tone === 'good' ? 'check' : 'clock')} size={18} />
        <div>{children}</div>
    </div>;
}

export function DemoNote({ children }: { children: React.ReactNode }) {
    return <p className="demo-note"><span>Demo</span>{children}</p>;
}

/* ---------- Motion bits ---------- */

/** Counts up/down to a new "$123" value and pops when it changes. */
export function Money({ value }: { value: string }) {
    const target = value.startsWith('$') || value.startsWith('−$') ? Number(value.replace(/[^0-9.]/g, '')) : NaN;
    const [shown, setShown] = React.useState(target);
    const [bump, setBump] = React.useState(0);
    const from = React.useRef(target);
    React.useEffect(() => {
        if (!Number.isFinite(target)) return;
        const start = from.current;
        if (start === target || RM || !Number.isFinite(start)) { setShown(target); from.current = target; return; }
        setBump(b => b + 1);
        let raf = 0; const t0 = performance.now(), D = 450;
        const tick = (t: number) => {
            const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
            setShown(start + (target - start) * e);
            if (k < 1) raf = requestAnimationFrame(tick); else from.current = target;
        };
        raf = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(raf); from.current = target; };
    }, [target]);
    if (!Number.isFinite(target)) return <>{value}</>;
    return <span key={bump} className={bump ? 'money-pop' : undefined}>{(value.startsWith('−') ? '−' : '') + '$' + Math.round(shown).toLocaleString('en-US')}</span>;
}

/** One-shot confetti burst over the page. */
export function Burst() {
    if (RM) return null;
    const cols = ['#ee6a24', '#2f8f8a', '#f3c344', '#f08fa0', '#3f6fd8', '#4caf6a'];
    return <div className="burst" aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => <i key={i} style={{
            left: (i * 37 % 100) + '%', background: cols[i % cols.length],
            animationDelay: (i % 9) * 60 + 'ms', animationDuration: 1400 + (i * 53 % 900) + 'ms',
            ['--dx' as string]: ((i * 29 % 120) - 60) + 'px', ['--r' as string]: (i * 47 % 720) + 'deg',
        } as React.CSSProperties} />)}
    </div>;
}

export function Tip({ children, mood }: { children: React.ReactNode; mood?: 'happy' | 'sad' | 'wow' }) {
    return <div className="tip">
        <div className="tip-boxy"><BoxyBadge mood={mood} /></div>
        <p className="tip-bubble" key={String(children)}>{children}</p>
    </div>;
}

/* ---------- Flow layout: content + sticky summary (desktop) / bottom bar (mobile) ---------- */

export type Line = { k: string; v: string; muted?: boolean };

export function Summary({ title, lines, totalLabel, total, note, cta, onCta, disabled, onBack, secondary, tip }: {
    title: string; lines: Line[]; totalLabel: string; total: string; note?: string; tip?: React.ReactNode;
    cta?: string; onCta?: () => void; disabled?: boolean; onBack?: () => void; secondary?: React.ReactNode;
}) {
    return <>
        <aside className="summary">
            {tip && <Tip>{tip}</Tip>}
            <div className="summary-card">
                <p className="summary-title">{title}</p>
                {lines.length > 0 && <dl className="summary-lines">
                    {lines.map(l => <div key={l.k} className={'line-in' + (l.muted ? ' muted' : '')}><dt>{l.k}</dt><dd>{l.v}</dd></div>)}
                </dl>}
                <div className="summary-total"><span>{totalLabel}</span><strong><Money value={total} /></strong></div>
                {note && <p className="summary-note">{note}</p>}
                {cta && <button type="button" className="btn btn-primary btn-block" disabled={disabled} onClick={onCta}>{cta}<Icon name="arrow" size={17} /></button>}
                {secondary}
                {onBack && <button type="button" className="btn btn-quiet btn-block" onClick={onBack}>Back</button>}
            </div>
        </aside>
        {cta && <div className="mobilebar">
            {onBack && <button type="button" className="btn btn-quiet mobilebar-back" onClick={onBack} aria-label="Back"><Icon name="back" size={18} /></button>}
            <div className="mobilebar-total"><span>{totalLabel}</span><strong><Money value={total} /></strong></div>
            <button type="button" className="btn btn-primary" disabled={disabled} onClick={onCta}>{cta}</button>
        </div>}
    </>;
}

export function FlowLayout({ children, summary }: { children: React.ReactNode; summary: React.ReactNode }) {
    return <div className="flow"><div className="flow-main">{children}</div>{summary}</div>;
}

export function FeedbackCard() {
    return <div className="feedback">
        <div className="feedback-art"><PencilScene /></div>
        <div className="feedback-copy">
            <h3>Tell us what you think</h3>
            <p>Two minutes, honest answers. This demo exists to learn what students would actually use.</p>
        </div>
        <a className="btn btn-light" href={FEEDBACK_URL} target="_blank" rel="noreferrer">Give feedback<Icon name="external" size={16} /></a>
    </div>;
}

export function Success({ title, refId, art, children }: { title: string; refId: string; art?: React.ReactNode; children: React.ReactNode }) {
    return <div className="success">
        <Burst />
        <div className="success-art">{art || <SuccessScene />}</div>
        <h1>{title}</h1>
        <span className="ref">{refId}</span>
        {children}
    </div>;
}
