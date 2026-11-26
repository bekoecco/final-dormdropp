import React from 'react';

/* Crayon toolkit: grainy, wobbly strokes and hatched fills drawn in SVG.
   CrayonDefs is mounted once (in the Shell); every scene references its filters and patterns. */

export const C = {
    ink: '#22304d', orange: '#f0732a', orangeLt: '#f6a26b', teal: '#3aa5a0', tealLt: '#8fd0cb',
    blue: '#3f6fd8', blueLt: '#8eaaf0', yellow: '#f3c344', red: '#e2553f', pink: '#f08fa0',
    green: '#4caf6a', greenLt: '#9bd49f', wood: '#c98a4b', woodLt: '#e2b27d', box: '#d9a066', boxLt: '#ecc493',
    cream: '#fbf6ea', paper: '#f7f2e7', gray: '#9aa3b2', grayLt: '#d5d9e0', purple: '#8a6fd1',
    skin1: '#f3cba8', skin2: '#d39a70', skin3: '#9a6442', hair1: '#2b2224', hair2: '#6b3f24', hair3: '#c9762f',
};

export function CrayonDefs() {
    return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
            {/* wobble + waxy grain for strokes */}
            <filter id="cr" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="warp" />
                <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="wob" />
                <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="11" result="grain" />
                <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.62" result="mask" />
                <feComposite in="wob" in2="mask" operator="in" />
            </filter>
            {/* softer grain for big fills */}
            <filter id="crf" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="9" result="warp" />
                <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" result="wob" />
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="2" result="grain" />
                <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.38" result="mask" />
                <feComposite in="wob" in2="mask" operator="in" />
            </filter>
            {/* paper-colored diagonal strokes laid over fills so they look scribbled in */}
            <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
                <path d="M0 1.5 H7" stroke={C.paper} strokeWidth="1.3" opacity="0.75" />
                <path d="M0 5 H7" stroke={C.paper} strokeWidth="0.6" opacity="0.4" />
            </pattern>
        </defs>
    </svg>;
}

/* ---------- geometry helpers (return path strings) ---------- */
export const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
export const ell = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
export const rr = (x: number, y: number, w: number, h: number, r = 3) =>
    `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;

/* ---------- primitives ---------- */
type SP = { d: string; c?: string; w?: number; dash?: string; o?: number; draw?: boolean };
/** crayon stroke */
export const S = ({ d, c = C.ink, w = 2.6, dash, o = 1, draw = true }: SP) =>
    <path className={dash ? 'cr-dash' : draw ? 'cr-s' : undefined} d={d} fill="none" stroke={c} strokeWidth={w}
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} opacity={o} pathLength={dash ? undefined : 100} />;
/** crayon fill with hatch texture, optional outline */
export const F = ({ d, c, line = true, o = 0.92, w = 2.4 }: { d: string; c: string; line?: boolean; o?: number; w?: number }) => <g className="cr-f">
    <path d={d} fill={c} opacity={o} />
    <path d={d} fill="url(#hatch)" />
    {line && <S d={d} w={w} />}
</g>;

/* ---------- motion helpers (SMIL, so they work inside nested transforms) ---------- */
export const RM = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = { calcMode: 'spline' as const, keyTimes: '0;0.5;1', keySplines: '.45 0 .55 1;.45 0 .55 1' };
type Kids = { children?: React.ReactNode };
/** rock back and forth around a point */
export function Rot({ cx, cy, a = 6, from = 0, dur = 2, delay = 0, children }: { cx: number; cy: number; a?: number; from?: number; dur?: number; delay?: number } & Kids) {
    return <g>{!RM && <animateTransform attributeName="transform" type="rotate" values={`${from - a} ${cx} ${cy};${from + a} ${cx} ${cy};${from - a} ${cx} ${cy}`} dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" {...ease} />}{children}</g>;
}
/** drift to an offset and back */
export function Move({ dx = 0, dy = 0, dur = 2, delay = 0, children }: { dx?: number; dy?: number; dur?: number; delay?: number } & Kids) {
    return <g>{!RM && <animateTransform attributeName="transform" type="translate" values={`0 0;${dx} ${dy};0 0`} dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" {...ease} />}{children}</g>;
}
/** full turn (wheels) */
export function Spin({ cx, cy, dur = 1, children }: { cx: number; cy: number; dur?: number } & Kids) {
    return <g>{!RM && <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur={dur + 's'} repeatCount="indefinite" />}{children}</g>;
}
/** follow a path; children drawn around 0,0 */
export function Fly({ path, dur = 3, delay = 0, rotate, children }: { path: string; dur?: number; delay?: number; rotate?: boolean } & Kids) {
    if (RM) return null;
    return <g opacity="0">
        <animateMotion path={path} dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" rotate={rotate ? 'auto' : undefined} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" />
        {children}
    </g>;
}
/** fall (or rise, with negative dy) and fade, looping */
export function Fall({ dy = 60, dx = 0, dur = 3, delay = 0, children }: { dy?: number; dx?: number; dur?: number; delay?: number } & Kids) {
    if (RM) return <g>{children}</g>;
    return <g opacity="0">
        <animateTransform attributeName="transform" type="translate" values={`0 0;${dx} ${dy}`} dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.7;1" dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" />
        {children}
    </g>;
}
/** twinkle in and out */
export function Blink({ dur = 2, delay = 0, min = 0, children }: { dur?: number; delay?: number; min?: number } & Kids) {
    return <g>{!RM && <animate attributeName="opacity" values={`1;${min};1`} dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" />}{children}</g>;
}
/** appear one after another, then hold (sequential checkmarks) */
export function Reveal({ dur = 4, at = 0, children }: { dur?: number; at?: number } & Kids) {
    if (RM) return <g>{children}</g>;
    const a = Math.min(0.9, Math.max(0, at)), b = Math.min(0.95, a + 0.06);
    return <g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${a};${b};0.92;1`} dur={dur + 's'} repeatCount="indefinite" />{children}</g>;
}

/* ---------- reusable things ---------- */
type PersonP = {
    x: number; y: number; s?: number; flip?: boolean;
    shirt: string; pants?: string; skin?: string; hair?: string;
    style?: 'short' | 'long' | 'bun' | 'curly' | 'cap';
    hands?: [number, number][]; legs?: 'stand' | 'walk' | 'sit';
    mouth?: 'smile' | 'open' | 'o';
    wave?: number; walk?: boolean; jump?: boolean; nod?: boolean; speed?: number;
    glasses?: boolean;
    children?: React.ReactNode; // drawn between body and arms (things held)
};
export function Person({ x, y, s = 1, flip, shirt, pants = '#34466e', skin = C.skin1, hair = C.hair1, style = 'short', hands = [[-18, -50], [18, -50]], legs = 'stand', mouth = 'smile', wave, walk, jump, nod, speed = 1, glasses, children }: PersonP) {
    const sit = legs === 'sit';
    const legPaths = sit ? ['M-6 -46 L14 -44 L14 -4', 'M6 -46 L24 -44 L24 -4'] : legs === 'walk' && !walk ? ['M-5 -46 L-15 -1', 'M5 -46 L13 -3'] : ['M-6 -46 L-7 -1', 'M6 -46 L7 -1'];
    const feet = sit ? [[17, -2], [27, -2]] : legs === 'walk' && !walk ? [[-17, 0], [15, -2]] : [[-9, 0], [9, 0]];
    const hairD = {
        short: 'M-13.5 -103 Q-14 -119 0 -118 Q14 -119 13.5 -103 Q8 -111 -2 -110 Q-9 -109 -13.5 -103Z',
        long: 'M-14 -102 Q-15 -120 0 -119 Q15 -120 14 -102 L15 -88 Q12 -86 10 -90 L10 -106 Q0 -111 -10 -106 L-10 -90 Q-12 -86 -15 -88Z',
        bun: 'M-13.5 -103 Q-14 -119 0 -118 Q14 -119 13.5 -103 Q4 -112 -13.5 -103Z ' + circ(0, -122, 6),
        curly: circ(-9, -112, 6) + circ(0, -116, 7) + circ(9, -112, 6) + circ(-13, -104, 4) + circ(13, -104, 4),
        cap: 'M-14 -104 Q-13 -120 0 -119 Q13 -120 14 -104Z M10 -105 L24 -103 Q22 -100 12 -101Z',
    }[style];
    const sh: [number, number][] = [[-12, -82], [12, -82]];
    const d = 0.9 / speed;
    const legEl = (i: number) => {
        const leg = <g><S d={legPaths[i]} c={pants} w={9} /><F d={ell(feet[i][0], feet[i][1], 6, 3)} c={C.ink} line={false} /></g>;
        return walk ? <Rot key={i} cx={0} cy={-46} a={16} dur={d} delay={i ? -d / 2 : 0}>{leg}</Rot> : <g key={i}>{leg}</g>;
    };
    const upper = <>
        <F d="M-14 -84 Q-17 -62 -14 -43 L14 -43 Q17 -62 14 -84 Q0 -91 -14 -84Z" c={shirt} />
        {children}
        {hands.map(([hx, hy], i) => {
            const [sx, sy] = sh[i] || sh[0];
            const ex = (sx + hx) / 2 + (i ? 4 : -4), ey = (sy + hy) / 2 + 6;
            const arm = <g><S d={`M${sx} ${sy} Q${ex} ${ey} ${hx} ${hy}`} c={shirt} w={8} /><F d={circ(hx, hy, 4.2)} c={skin} w={1.8} /></g>;
            return wave === i ? <Rot key={'a' + i} cx={sx} cy={sy} a={14} dur={0.7}>{arm}</Rot> : <g key={'a' + i}>{arm}</g>;
        })}
        <S d="M0 -88 V-92" c={skin} w={6} />
        {(() => {
            const head = <g>
                <F d={circ(0, -102, 13)} c={skin} />
                <F d={hairD} c={hair} w={2} />
                <g className="cr-eyes"><S d={circ(-5, -102, 0.6)} w={3} draw={false} /><S d={circ(5, -102, 0.6)} w={3} draw={false} /></g>
                {glasses && <S d={circ(-5, -102, 4) + circ(5, -102, 4) + 'M-1 -102 H1'} w={1.5} draw={false} />}
                <path d={circ(-8.5, -97, 2.4) + circ(8.5, -97, 2.4)} fill={C.pink} opacity={0.45} />
                {mouth === 'smile' && <S d="M-4.5 -96.5 Q0 -92.5 4.5 -96.5" w={1.8} />}
                {mouth === 'open' && <F d="M-4.5 -97 Q0 -90 4.5 -97Z" c={C.red} w={1.6} />}
                {mouth === 'o' && <F d={circ(0, -95.5, 2.2)} c={C.red} w={1.4} />}
            </g>;
            return nod ? <Rot cx={0} cy={-90} a={5} dur={1.4}>{head}</Rot> : head;
        })()}
    </>;
    const body = <>
        {legEl(0)}{legEl(1)}
        {walk ? <Move dy={-2.5} dur={d / 2}>{upper}</Move> : <Move dy={-1.4} dur={2.6} delay={(x % 7) / 7}>{upper}</Move>}
    </>;
    return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
        {jump ? <Move dy={-12} dur={0.9}>{body}</Move> : body}
    </g>;
}

export function Box({ x, y, w = 44, h = 34, open, label, tape = true }: { x: number; y: number; w?: number; h?: number; open?: boolean; label?: string; tape?: boolean }) {
    return <g>
        {open && <>
            <F d={`M${x} ${y} L${x - 10} ${y - 12} L${x + w * 0.42} ${y - 12} L${x + w * 0.5} ${y}Z`} c={C.boxLt} />
            <F d={`M${x + w} ${y} L${x + w + 10} ${y - 12} L${x + w * 0.58} ${y - 12} L${x + w * 0.5} ${y}Z`} c={C.boxLt} />
        </>}
        <F d={rr(x, y, w, h, 2)} c={C.box} />
        {tape && !open && <F d={rr(x + w / 2 - 4, y, 8, h * 0.45, 0)} c={C.boxLt} line={false} o={0.9} />}
        {!open && <S d={`M${x} ${y + 1} H${x + w}`} w={1.6} />}
        {label && <text x={x + w / 2} y={y + h * 0.72} textAnchor="middle" className="cr-text" fontSize={Math.min(11, w / 4)}>{label}</text>}
    </g>;
}

function Wheel({ cx, cy, spin }: { cx: number; cy: number; spin?: boolean }) {
    const spokes = <S d={`M${cx - 6} ${cy} H${cx + 6} M${cx} ${cy - 6} V${cy + 6}`} c={C.grayLt} w={1.8} draw={false} />;
    return <g>
        <F d={circ(cx, cy, 10)} c={C.ink} />
        {spin ? <Spin cx={cx} cy={cy} dur={0.5}>{spokes}</Spin> : spokes}
        <F d={circ(cx, cy, 3)} c={C.grayLt} w={1.4} />
    </g>;
}
export function Truck({ x, y, s = 1, moving, puff = true }: { x: number; y: number; s?: number; moving?: boolean; puff?: boolean }) {
    const body = <>
        <F d={rr(0, -66, 92, 52, 4)} c={C.cream} />
        <F d={rr(10, -56, 26, 30, 3)} c={C.orange} w={2} />
        <path d="M14 -40 L23 -50 L32 -40 V-30 H14Z" fill={C.cream} opacity={0.9} />
        <text x={64} y={-35} textAnchor="middle" className="cr-text" fontSize="11">DormDropp</text>
        <F d="M92 -50 H114 Q120 -50 124 -42 L132 -28 V-14 H92Z" c={C.orange} />
        <F d="M98 -45 H112 L119 -31 H98Z" c={C.tealLt} w={2} />
        <F d={rr(126, -24, 7, 5, 2)} c={C.yellow} w={1.4} />
    </>;
    return <g transform={`translate(${x} ${y}) scale(${s})`}>
        {moving && <>
            <Blink dur={0.6}><S d="M-34 -40 H-14" dash="5 6" c={C.gray} w={2.4} /></Blink>
            <Blink dur={0.6} delay={0.2}><S d="M-44 -24 H-16" dash="5 6" c={C.gray} w={2.4} /></Blink>
            <Blink dur={0.6} delay={0.4}><S d="M-30 -8 H-14" dash="5 6" c={C.gray} w={2.4} /></Blink>
        </>}
        {puff && <>
            <Fall dy={-26} dx={-18} dur={2.2}><F d={circ(-4, -12, 5)} c={C.grayLt} line={false} o={0.8} /></Fall>
            <Fall dy={-30} dx={-24} dur={2.2} delay={1.1}><F d={circ(-4, -12, 4)} c={C.grayLt} line={false} o={0.8} /></Fall>
        </>}
        {moving ? <Move dy={-1.6} dur={0.35}>{body}</Move> : body}
        <Wheel cx={24} cy={-12} spin={moving} />
        <Wheel cx={108} cy={-12} spin={moving} />
    </g>;
}

export function Sofa({ x, y, w = 90, c = C.teal }: { x: number; y: number; w?: number; c?: string }) {
    return <g>
        <F d={rr(x + 8, y - 44, w - 16, 26, 8)} c={c} />
        <F d={rr(x + 8, y - 22, w - 16, 14, 4)} c={c} />
        <F d={rr(x, y - 32, 14, 26, 6)} c={c} />
        <F d={rr(x + w - 14, y - 32, 14, 26, 6)} c={c} />
        <S d={`M${x + w / 2} ${y - 40} V${y - 22}`} w={1.8} />
        <S d={`M${x + 6} ${y - 6} V${y}`} w={3} />
        <S d={`M${x + w - 6} ${y - 6} V${y}`} w={3} />
    </g>;
}

export function Lamp({ x, y, h = 70, c = C.yellow }: { x: number; y: number; h?: number; c?: string }) {
    return <g>
        <F d={`M${x - 14} ${y - h + 18} L${x - 8} ${y - h} H${x + 8} L${x + 14} ${y - h + 18}Z`} c={c} />
        <S d={`M${x} ${y - h + 18} V${y - 2}`} w={2.6} />
        <F d={ell(x, y - 2, 10, 3)} c={C.ink} line={false} />
    </g>;
}

export function Plant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
    return <g transform={`translate(${x} ${y}) scale(${s})`}>
        <F d="M-6 -30 Q-22 -42 -16 -58 Q-2 -48 -6 -30Z" c={C.green} w={2} />
        <F d="M4 -30 Q20 -40 18 -60 Q2 -52 4 -30Z" c={C.greenLt} w={2} />
        <F d="M0 -30 Q-4 -56 6 -72 Q12 -52 0 -30Z" c={C.green} w={2} />
        <F d="M-11 -28 H11 L8 0 H-8Z" c={C.orange} />
    </g>;
}

export function Chair({ x, y, c = C.blue }: { x: number; y: number; c?: string }) {
    return <g>
        <F d={rr(x + 4, y - 62, 30, 30, 6)} c={c} />
        <F d={rr(x, y - 34, 38, 9, 3)} c={c} />
        <S d={`M${x + 19} ${y - 25} V${y - 10}`} w={3} />
        <S d={`M${x + 5} ${y - 4} L${x + 19} ${y - 10} L${x + 33} ${y - 4}`} w={2.6} />
        <F d={circ(x + 5, y - 2, 2.5)} c={C.ink} line={false} />
        <F d={circ(x + 33, y - 2, 2.5)} c={C.ink} line={false} />
    </g>;
}

export function Desk({ x, y, w = 80 }: { x: number; y: number; w?: number }) {
    return <g>
        <F d={rr(x, y - 52, w, 8, 2)} c={C.wood} />
        <S d={`M${x + 6} ${y - 44} V${y}`} w={3} />
        <F d={rr(x + w - 30, y - 44, 26, 30, 2)} c={C.woodLt} />
        <S d={`M${x + w - 21} ${y - 30} H${x + w - 13}`} w={2} />
        <S d={`M${x + w - 6} ${y - 14} V${y}`} w={3} />
    </g>;
}

export function Bed({ x, y, w = 110, c = C.blueLt }: { x: number; y: number; w?: number; c?: string }) {
    return <g>
        <F d={rr(x, y - 58, 12, 58, 3)} c={C.wood} />
        <F d={rr(x + 10, y - 30, w - 10, 18, 3)} c={C.cream} />
        <F d={`M${x + 34} ${y - 30} Q${x + 60} ${y - 40} ${x + w} ${y - 30} V${y - 12} H${x + 34}Z`} c={c} />
        <F d={rr(x + 14, y - 40, 22, 11, 5)} c={C.cream} />
        <F d={rr(x + 8, y - 14, w - 4, 6, 2)} c={C.wood} />
        <S d={`M${x + w} ${y - 10} V${y}`} w={3} />
    </g>;
}

export function Building({ x, y, w = 80, h = 110, c = C.blueLt }: { x: number; y: number; w?: number; h?: number; c?: string }) {
    const wins: React.ReactNode[] = [];
    for (let r = 0; r < Math.floor((h - 40) / 24); r++)
        for (let k = 0; k < 3; k++)
            wins.push(<F key={r + '-' + k} d={rr(x + 10 + k * ((w - 20) / 3), y - h + 14 + r * 24, (w - 20) / 3 - 8, 13, 2)} c={(r + k) % 3 === 0 ? C.yellow : C.cream} w={1.8} />);
    return <g>
        <F d={rr(x, y - h, w, h, 3)} c={c} />
        <F d={`M${x - 6} ${y - h} L${x + w / 2} ${y - h - 22} L${x + w + 6} ${y - h}Z`} c={C.orange} />
        {wins}
        <F d={rr(x + w / 2 - 10, y - 26, 20, 26, 2)} c={C.wood} />
    </g>;
}

export const Star = ({ x, y, r = 7, c = C.yellow }: { x: number; y: number; r?: number; c?: string }) =>
    <F d={`M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z`} c={c} w={1.8} />;

export const Spark = ({ x, y, c = C.orange }: { x: number; y: number; c?: string }) =>
    <S d={`M${x} ${y - 7}V${y - 3}M${x} ${y + 3}V${y + 7}M${x - 7} ${y}H${x - 3}M${x + 3} ${y}H${x + 7}`} c={c} w={2.2} />;

export const Ground = ({ x1 = 10, x2 = 310, y = 214 }: { x1?: number; x2?: number; y?: number }) =>
    <S d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + 3} ${x2} ${y - 1}`} c={C.gray} w={2.2} />;

/* ---------- Scene wrapper: draws in when scrolled into view ---------- */
export function Scene({ vb = '0 0 320 240', label, className, children }: { vb?: string; label: string; className?: string; children: React.ReactNode }) {
    const ref = React.useRef<SVGSVGElement>(null);
    const [on, setOn] = React.useState(false);
    React.useEffect(() => {
        const el = ref.current;
        if (!el || !('IntersectionObserver' in window)) { setOn(true); return; }
        const io = new IntersectionObserver(es => {
            const vis = es.some(e => e.isIntersecting);
            if (vis) setOn(true);
            try { vis ? el.unpauseAnimations() : el.pauseAnimations(); } catch { /* ignore */ }
        }, { threshold: 0.05 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return <svg ref={ref} className={'scene' + (on ? ' in' : '') + (className ? ' ' + className : '')} viewBox={vb} role="img" aria-label={label}>
        <g filter="url(#cr)">{children}</g>
    </svg>;
}

export function Cat({ x, y, s = 1, c = C.hair3, flip }: { x: number; y: number; s?: number; c?: string; flip?: boolean }) {
    return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
        <Rot cx={12} cy={-6} a={14} dur={1.8}><S d="M12 -6 Q30 -8 28 -26 Q27 -32 22 -30" c={c} w={5} /></Rot>
        <F d="M-12 0 Q-14 -24 0 -26 Q14 -24 12 0Z" c={c} />
        <F d="M-11 -30 L-12 -44 L-4 -36 L4 -36 L12 -44 L11 -30 Q12 -20 0 -19 Q-12 -20 -11 -30Z" c={c} />
        <Blink dur={3.4} min={0}><S d={circ(-4.5, -30, .5) + circ(4.5, -30, .5)} w={3} draw={false} /></Blink>
        <S d="M-2 -26 Q0 -24 2 -26 M-12 -27 H-18 M12 -27 H18" w={1.3} draw={false} />
    </g>;
}

/** Boxy, the DormDropp box mascot */
export function Boxy({ x, y, s = 1, mood = 'happy', wave = true, jump, children }: { x: number; y: number; s?: number; mood?: 'happy' | 'sad' | 'wow'; wave?: boolean; jump?: boolean; children?: React.ReactNode }) {
    const body = <g>
        <S d="M-12 -2 V8 M12 -2 V8" w={4} />
        <F d={ell(-13, 9, 6, 3)} c={C.ink} line={false} />
        <F d={ell(13, 9, 6, 3)} c={C.ink} line={false} />
        <F d="M-28 -50 L-36 -62 L-2 -62 L0 -50Z" c={C.boxLt} />
        <F d="M28 -50 L36 -62 L2 -62 L0 -50Z" c={C.boxLt} />
        <F d={rr(-28, -50, 56, 50, 3)} c={C.box} />
        <F d={rr(-6, -50, 12, 14, 0)} c={C.boxLt} line={false} />
        <S d="M-28 -18 Q-40 -26 -42 -36" c={C.box} w={5} />
        {wave ? <Rot cx={28} cy={-18} a={18} from={-10} dur={0.8}><S d="M28 -18 Q40 -30 42 -44" c={C.box} w={5} /></Rot> : <S d="M28 -18 Q40 -12 42 -4" c={C.box} w={5} />}
        <Blink dur={3.2} min={0}><g>
            {mood === 'sad' ? <S d="M-12 -28 l5 2 M12 -28 l-5 2" w={2.6} draw={false} /> : null}
            <F d={circ(-9, -24, 2.6)} c={C.ink} line={false} />
            <F d={circ(9, -24, 2.6)} c={C.ink} line={false} />
        </g></Blink>
        <path d={circ(-16, -17, 3) + circ(16, -17, 3)} fill={C.pink} opacity={0.55} />
        {mood === 'happy' && <F d="M-7 -16 Q0 -7 7 -16Z" c={C.red} w={1.8} />}
        {mood === 'wow' && <F d={circ(0, -13, 3.6)} c={C.red} w={1.6} />}
        {mood === 'sad' && <S d="M-6 -10 Q0 -16 6 -10" w={2} />}
        {children}
    </g>;
    return <g transform={`translate(${x} ${y}) scale(${s})`}>
        {jump ? <Move dy={-14} dur={0.8}>{body}</Move> : <Move dy={-3} dur={1.6}>{body}</Move>}
    </g>;
}

export function Bird({ path, dur = 9, delay = 0, c = C.ink }: { path: string; dur?: number; delay?: number; c?: string }) {
    return <Fly path={path} dur={dur} delay={delay}>
        <path d="M-7 0 Q-3 -5 0 0 Q3 -5 7 0" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round">
            {!RM && <animate attributeName="d" values="M-7 0 Q-3 -5 0 0 Q3 -5 7 0;M-7 -3 Q-3 2 0 0 Q3 2 7 -3;M-7 0 Q-3 -5 0 0 Q3 -5 7 0" dur="0.5s" repeatCount="indefinite" />}
        </path>
    </Fly>;
}

export const Cloud = ({ x, y, s = 1, dx = 24, dur = 9 }: { x: number; y: number; s?: number; dx?: number; dur?: number }) =>
    <Move dx={dx} dur={dur}><g transform={`translate(${x} ${y}) scale(${s})`}>
        <F d="M-26 6 Q-30 -6 -18 -8 Q-14 -20 0 -18 Q12 -24 18 -10 Q30 -10 28 4 Q26 10 18 10 H-18 Q-26 10 -26 6Z" c="#ffffff" o={0.95} w={2} />
    </g></Move>;

export const Tree = ({ x, y, s = 1, c = C.green }: { x: number; y: number; s?: number; c?: string }) =>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
        <S d="M0 0 V-34" c={C.wood} w={6} />
        <Rot cx={0} cy={-30} a={3} dur={3}><g>
            <F d={circ(0, -52, 22)} c={c} />
            <F d={circ(-14, -40, 12)} c={C.greenLt} />
            <F d={circ(14, -42, 12)} c={c} />
        </g></Rot>
    </g>;

export const Coin = ({ x = 0, y = 0, r = 10 }: { x?: number; y?: number; r?: number }) => <g>
    <F d={circ(x, y, r)} c={C.yellow} w={2} />
    <text x={x} y={y + r * 0.38} textAnchor="middle" className="cr-text" fontSize={r * 1.1}>$</text>
</g>;

export const Flake = ({ x, y, s = 1, c = C.blue }: { x: number; y: number; s?: number; c?: string }) =>
    <S d={`M${x - 5 * s} ${y - 5 * s} l${10 * s} ${10 * s} M${x + 5 * s} ${y - 5 * s} l${-10 * s} ${10 * s} M${x} ${y - 7 * s} v${14 * s} M${x - 7 * s} ${y} h${14 * s}`} c={c} w={1.8} draw={false} />;

export const Heart = ({ x, y, s = 1, c = C.pink }: { x: number; y: number; s?: number; c?: string }) =>
    <F d={`M${x} ${y + 6 * s} C${x - 10 * s} ${y - 2 * s} ${x - 6 * s} ${y - 10 * s} ${x} ${y - 4 * s} C${x + 6 * s} ${y - 10 * s} ${x + 10 * s} ${y - 2 * s} ${x} ${y + 6 * s}Z`} c={c} w={1.6} />;

const CONF = [C.orange, C.teal, C.yellow, C.pink, C.blue, C.green];
export function Confetti({ x0, x1, y0, n = 10, dy = 120, seed = 1 }: { x0: number; x1: number; y0: number; n?: number; dy?: number; seed?: number }) {
    const items = Array.from({ length: n }, (_, i) => {
        const r = (Math.sin((i + 1) * 99.7 * seed) + 1) / 2;
        return { x: x0 + (x1 - x0) * ((i + r) / n), d: 2 + r * 2, delay: -r * 3, c: CONF[i % CONF.length], rot: r * 90 };
    });
    return <g>{items.map((p, i) => <Fall key={i} dy={dy} dx={(i % 2 ? 1 : -1) * 10} dur={p.d} delay={p.delay}>
        <rect x={p.x} y={y0} width={6} height={10} rx={1.5} fill={p.c} transform={`rotate(${p.rot} ${p.x + 3} ${y0 + 5})`} />
    </Fall>)}</g>;
}
