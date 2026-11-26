import React from 'react';
import {
    Bed, Bird, Blink, Box, Boxy, Building, C, Cat, Chair, Cloud, Coin, Confetti, Desk, F, Fall, Flake, Fly, Ground, Heart,
    Lamp, Move, Person, Plant, Reveal, Rot, Scene, Sofa, Spark, Star, S, Tree, Truck, circ, ell, rr,
} from './crayon';

/* All illustrations. Each is a self-contained, animated crayon scene. */

const Wall = ({ w = 320, h = 214 }: { w?: number; h?: number }) => <>
    <F d={rr(10, 18, w - 20, h - 18, 10)} c="#fdf3e3" line={false} o={0.9} />
    <S d={`M10 ${h - 2} H${w - 10}`} c={C.woodLt} w={4} />
</>;
const Window = ({ x, y, w = 62, h = 50, night }: { x: number; y: number; w?: number; h?: number; night?: boolean }) => <g>
    <F d={rr(x, y, w, h, 4)} c={night ? '#5a6fb0' : C.tealLt} />
    <S d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} w={2.2} />
</g>;
const Poster = ({ x, y, c = C.pink, rot = -6, children }: { x: number; y: number; c?: string; rot?: number; children?: React.ReactNode }) =>
    <g transform={`rotate(${rot} ${x + 18} ${y + 22})`}>
        <F d={rr(x, y, 36, 44, 2)} c={c} />
        <F d={circ(x + 18, y + 2, 2.5)} c={C.red} line={false} />
        {children}
    </g>;
const Rug = ({ cx, cy, rx = 70, c = C.orangeLt }: { cx: number; cy: number; rx?: number; c?: string }) =>
    <F d={ell(cx, cy, rx, 9)} c={c} o={0.6} line={false} />;

/** Home hero: a campus street on move-out day. */
export function HeroScene() {
    return <Scene vb="0 0 560 340" label="Move-out day on campus: a student walks a box to the DormDropp truck while a student moving in waves from the dorm">
        <F d={ell(280, 302, 270, 22)} c={C.tealLt} line={false} o={0.35} />
        <path className="cr-sun" d={circ(492, 56, 26)} fill={C.yellow} opacity={0.85} />
        <Blink dur={2.4}><S d="M492 16V6M532 56H542M520 28l7-7M464 28l-7-7M452 56H442" c={C.yellow} w={3} /></Blink>
        <Cloud x={90} y={60} s={0.9} dx={30} dur={11} />
        <Cloud x={330} y={40} s={0.7} dx={-24} dur={9} />
        <Bird path="M-20 90 Q140 50 300 80 T600 60" dur={10} />
        <Bird path="M-40 110 Q150 70 310 100 T620 80" dur={10} delay={0.6} />
        <Tree x={36} y={300} s={1.05} />
        <Tree x={522} y={300} s={0.9} c={C.greenLt} />
        <Building x={404} y={298} w={100} h={156} c={C.blueLt} />
        <S d="M412 132 V160" w={2} />
        <Move dy={-6} dur={1.8}><g>
            <F d="M412 132 h50 l-6 9 l6 9 h-50Z" c={C.orange} w={2} />
            <text x={434} y={146} textAnchor="middle" className="cr-text" fontSize="11">welcome!</text>
        </g></Move>
        <Person x={384} y={300} s={0.92} shirt={C.green} skin={C.skin2} hair={C.hair1} style="curly" hands={[[-18, -52], [24, -124]]} mouth="open" wave={1} />
        <Cat x={472} y={300} s={0.75} c={C.ink} />
        <Truck x={156} y={300} s={1.45} />
        <Box x={196} y={170} w={42} h={32} label="desk" />
        <Box x={244} y={178} w={34} h={24} />
        <Lamp x={296} y={204} h={60} c={C.pink} />
        <Cat x={262} y={178} s={0.55} />
        <Move dx={10} dur={1.8}>
            <Person x={88} y={300} s={1.12} shirt={C.orange} hair={C.hair2} style="long" walk hands={[[-24, -62], [24, -62]]}>
                <Box x={-28} y={-82} w={56} h={36} label="books" />
            </Person>
        </Move>
        <S d="M118 168 Q168 112 218 156" dash="2 8" c={C.orange} w={3} />
        <Fly path="M110 182 Q160 110 214 158" dur={2.6}><Box x={-10} y={-8} w={20} h={16} /></Fly>
        <Blink dur={1.6}><Star x={50} y={146} r={9} /></Blink>
        <Blink dur={2.2} delay={0.5}><Star x={360} y={112} r={6} c={C.orange} /></Blink>
        <Blink dur={1.4} delay={0.3}><Spark x={330} y={178} /></Blink>
        <Ground x1={14} x2={546} y={302} />
    </Scene>;
}

/** Student taping a box in their dorm room; a cat supervises from another box. */
export function PackScene() {
    return <Scene label="A student tapes up moving boxes in their dorm room while a cat peeks out of an open box">
        <Wall />
        <Window x={36} y={42} />
        <Poster x={250} y={40} c={C.tealLt}><text x={268} y={70} textAnchor="middle" className="cr-text" fontSize="14">GO!</text></Poster>
        <Rug cx={170} cy={210} />
        <Box x={180} y={176} w={60} h={38} label="fragile" />
        <Move dy={-2} dur={0.7}><Box x={190} y={140} w={44} h={36} /></Move>
        <Box x={246} y={182} w={50} h={32} open />
        <Move dy={-7} dur={2.2}><Cat x={271} y={194} s={0.6} c={C.ink} /></Move>
        <F d={rr(246, 186, 50, 28, 2)} c={C.box} />
        <Person x={110} y={214} shirt={C.blue} skin={C.skin3} hair={C.hair1} style="short" hands={[[24, -62], [36, -70]]} mouth="open" nod />
        <Rot cx={146} cy={146} a={6} dur={0.7}><F d="M140 146 h14 v-8 h10 v18 h-24Z" c={C.red} w={2} /></Rot>
        <S d="M154 144 Q176 136 196 148" c={C.boxLt} w={4} />
        <Blink dur={0.9}><Spark x={204} y={128} c={C.yellow} /></Blink>
        <Blink dur={1.8} delay={0.4}><Star x={300} y={124} r={6} /></Blink>
        <Fall dy={-30} dur={2.5}><text x={124} y={98} className="cr-text" fontSize="12">rrrip!</text></Fall>
    </Scene>;
}

/** Student photographs an armchair to list it; flash and a swinging price tag. */
export function ListScene() {
    return <Scene label="A student takes a photo of an armchair with a phone to list it, and a price tag swings above it">
        <Wall />
        <Poster x={36} y={40} c={C.yellow} rot={5}><S d="M44 66 l8 -10 l8 10 l8 -14 l6 14" w={1.8} /></Poster>
        <Rug cx={200} cy={210} rx={80} c={C.tealLt} />
        <Chair x={196} y={214} c={C.orange} />
        <Plant x={266} y={214} s={0.9} />
        <Person x={96} y={214} shirt={C.teal} skin={C.skin1} hair={C.hair3} style="bun" hands={[[26, -76], [30, -70]]} glasses />
        <F d={rr(116, 126, 20, 32, 4)} c={C.ink} />
        <F d={rr(119, 130, 14, 22, 2)} c={C.tealLt} line={false} />
        <Blink dur={1.6} min={0}><g>
            <S d="M146 132 L176 120 M146 142 L180 142 M146 152 L176 164" c={C.yellow} w={2.6} draw={false} />
            <F d={circ(140, 128, 5)} c="#fff" line={false} />
        </g></Blink>
        <Blink dur={1.6}><text x={150} y={112} className="cr-text" fontSize="13">click!</text></Blink>
        <S d="M262 40 V58" w={1.8} />
        <Rot cx={262} cy={40} a={10} dur={2.2}><g>
            <F d="M244 58 H280 L288 72 L280 86 H244Z" c={C.yellow} />
            <F d={circ(250, 72, 3)} c={C.cream} w={1.4} />
            <text x={268} y={77} textAnchor="middle" className="cr-text" fontSize="13">$35</text>
        </g></Rot>
        <Blink dur={2} delay={0.7}><Star x={226} y={120} r={8} /></Blink>
    </Scene>;
}

/** Phones linked: a coin hops from buyer to seller, hearts float up. */
export function MatchScene() {
    return <Scene label="Two phones connected: a coin hops from the buyer's phone to the seller's as an offer is accepted">
        <F d={ell(160, 214, 130, 12)} c={C.tealLt} line={false} o={0.3} />
        <Rot cx={90} cy={180} a={3} from={-8} dur={2.4}><g>
            <F d={rr(56, 60, 68, 120, 10)} c={C.ink} />
            <F d={rr(62, 70, 56, 100, 5)} c={C.cream} line={false} />
            <F d={circ(90, 96, 12)} c={C.orange} w={2} />
            <text x={90} y={100} textAnchor="middle" className="cr-text cr-text-w" fontSize="12">M</text>
            <S d="M72 120 H108 M72 132 H100" c={C.gray} w={3} />
            <F d={rr(70, 144, 40, 16, 6)} c={C.orange} w={1.8} />
            <text x={90} y={156} textAnchor="middle" className="cr-text cr-text-w" fontSize="10">pick</text>
        </g></Rot>
        <Rot cx={230} cy={180} a={3} from={8} dur={2.4} delay={0.6}><g>
            <F d={rr(196, 60, 68, 120, 10)} c={C.ink} />
            <F d={rr(202, 70, 56, 100, 5)} c={C.cream} line={false} />
            <F d={circ(230, 104, 18)} c={C.green} w={2} />
            <S d="M221 104 l6 6 l12 -13" c={C.cream} w={3.4} />
            <S d="M212 138 H248 M216 150 H244" c={C.gray} w={3} />
        </g></Rot>
        <S d="M128 92 Q160 54 194 92" dash="3 7" c={C.orange} w={3} />
        <Fly path="M118 104 Q160 40 204 104" dur={1.8}><Coin r={11} /></Fly>
        <Fall dy={-50} dur={2.4}><Heart x={232} y={58} /></Fall>
        <Fall dy={-50} dur={2.4} delay={1.2}><Heart x={250} y={66} s={0.7} c={C.red} /></Fall>
        <Blink dur={2} delay={0.4}><Star x={286} y={52} r={7} c={C.orange} /></Blink>
        <Boxy x={160} y={210} s={0.55} />
    </Scene>;
}

/** Inspector scans a sofa with a magnifier; checklist ticks itself off. */
export function QualityScene() {
    return <Scene label="A DormDropp inspector scans a sofa with a magnifying glass while a checklist ticks itself off">
        <F d={ell(160, 216, 140, 12)} c={C.tealLt} line={false} o={0.3} />
        <Sofa x={150} y={214} w={96} c={C.teal} />
        <F d={rr(250, 112, 52, 72, 4)} c={C.cream} />
        <F d={rr(265, 106, 22, 10, 3)} c={C.gray} w={1.8} />
        <S d="M274 134 H294 M274 150 H294 M274 166 H290" c={C.gray} w={2.2} />
        <Reveal at={0.15}><S d="M258 132 l4 4 l7 -8" c={C.green} w={2.6} draw={false} /></Reveal>
        <Reveal at={0.35}><S d="M258 148 l4 4 l7 -8" c={C.green} w={2.6} draw={false} /></Reveal>
        <Reveal at={0.55}><S d="M258 164 l4 4 l7 -8" c={C.green} w={2.6} draw={false} /></Reveal>
        <Reveal at={0.7}><F d={circ(296, 112, 10)} c={C.green} w={1.8} /><S d="M291 112 l3 3 l6 -6" c={C.cream} w={2.2} draw={false} /></Reveal>
        <Person x={84} y={214} shirt={C.orange} skin={C.skin2} hair={C.hair1} style="cap" hands={[[30, -78], [-16, -48]]} nod />
        <Move dx={44} dy={-4} dur={3}><g>
            <S d="M118 136 L138 156" c={C.ink} w={5} />
            <F d={circ(154, 170, 20)} c={C.tealLt} o={0.45} w={3} />
            <path d="M144 162 q6 -6 12 -4" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g></Move>
        <Blink dur={1.4}><Spark x={190} y={142} c={C.yellow} /></Blink>
        <Blink dur={2.2} delay={0.5}><Star x={226} y={74} r={8} c={C.green} /></Blink>
        <Ground />
    </Scene>;
}

/** Two movers carry a sofa up the ramp; puffs from the truck. */
export function PickupScene() {
    return <Scene label="Two movers carry a sofa up a ramp into the DormDropp truck">
        <F d={ell(160, 216, 150, 12)} c={C.tealLt} line={false} o={0.3} />
        <Cloud x={70} y={50} s={0.55} dx={18} dur={7} />
        <Truck x={170} y={214} s={1.02} />
        <S d="M118 214 L170 172" c={C.wood} w={5} />
        <Move dx={8} dy={-4} dur={1.4}><g>
            <Person x={78} y={214} s={0.95} shirt={C.orange} skin={C.skin1} hair={C.hair2} style="cap" walk speed={0.8} hands={[[20, -64], [26, -60]]} mouth="open" />
            <Person x={140} y={196} s={0.95} flip shirt={C.orange} skin={C.skin3} hair={C.hair1} style="short" walk speed={0.8} hands={[[20, -66], [26, -62]]} />
            <g transform="rotate(-12 110 160)"><Sofa x={72} y={182} w={74} c={C.blue} /></g>
        </g></Move>
        <Fall dy={14} dur={1.4}><F d="M60 104 q-3 6 0 8 q3 -2 0 -8Z" c={C.tealLt} w={1.2} /></Fall>
        <Fall dy={-24} dur={1.6}><text x={34} y={92} className="cr-text" fontSize="13">heave!</text></Fall>
        <Ground />
    </Scene>;
}

/** Boxes asleep on shelves over winter break; snow falls outside. */
export function StorageScene() {
    return <Scene label="Boxes snooze on storage shelves over winter break while snow falls outside the window">
        <Wall />
        <Window x={222} y={40} w={76} h={60} night />
        <Fall dy={52} dur={3}><Flake x={236} y={44} s={0.6} c="#fff" /></Fall>
        <Fall dy={52} dur={3.4} delay={1}><Flake x={258} y={44} s={0.5} c="#fff" /></Fall>
        <Fall dy={52} dur={2.8} delay={1.8}><Flake x={284} y={44} s={0.6} c="#fff" /></Fall>
        <S d="M30 212 V54 M196 212 V54 M30 98 H196 M30 154 H196" c={C.wood} w={5} />
        <Box x={42} y={64} w={46} h={34} label="DD-12" />
        <Box x={100} y={70} w={40} h={28} />
        <Box x={150} y={72} w={36} h={26} />
        <Box x={42} y={120} w={40} h={34} />
        <Lamp x={110} y={154} h={50} c={C.pink} />
        <Box x={136} y={124} w={48} h={30} label="lamp" />
        <Box x={46} y={170} w={66} h={40} label="sofa" />
        <Box x={124} y={180} w={60} h={30} />
        <S d="M52 136 q4 3 8 0 M64 136 q4 3 8 0" w={1.8} draw={false} />
        <S d="M134 192 q4 3 8 0 M150 192 q4 3 8 0" w={1.8} draw={false} />
        <Fall dy={-34} dx={10} dur={2.6}><text x={170} y={176} className="cr-text" fontSize="13">z</text></Fall>
        <Fall dy={-34} dx={12} dur={2.6} delay={1.3}><text x={176} y={176} className="cr-text" fontSize="10">z</text></Fall>
        <F d={rr(220, 118, 78, 70, 6)} c={C.cream} />
        <F d={rr(220, 118, 78, 20, 6)} c={C.red} />
        <text x={259} y={133} textAnchor="middle" className="cr-text cr-text-w" fontSize="11">DEC → JAN</text>
        <Rot cx={259} cy={162} a={8} dur={2}><Flake x={259} y={162} s={1.4} /></Rot>
    </Scene>;
}

/** The truck rolls down the road to the dorm. */
export function DeliverScene() {
    return <Scene label="The DormDropp truck drives down the road toward a dorm building">
        <F d={ell(160, 216, 150, 12)} c={C.tealLt} line={false} o={0.3} />
        <path className="cr-sun" d={circ(60, 50, 18)} fill={C.yellow} opacity={0.85} />
        <Cloud x={140} y={46} s={0.6} dx={-20} dur={8} />
        <Bird path="M-10 70 Q120 40 340 60" dur={7} />
        <Building x={222} y={214} w={78} h={140} c={C.tealLt} />
        <Blink dur={1.4} min={0.2}><F d={rr(234, 96, 13, 13, 2)} c={C.yellow} w={1.6} /></Blink>
        <Tree x={198} y={214} s={0.7} />
        <Move dx={28} dur={2.4}><Truck x={14} y={212} s={0.98} moving /></Move>
        <path d="M20 228 H300" stroke={C.grayLt} strokeWidth={3} strokeDasharray="14 10" fill="none">
            <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="0.8s" repeatCount="indefinite" />
        </path>
        <Ground y={216} />
    </Scene>;
}

/** Student jumping for joy in their freshly furnished room. */
export function MoveInScene() {
    return <Scene label="A student jumps for joy in a freshly furnished dorm room with a bed, desk, lamp and plant">
        <Wall />
        <Window x={180} y={44} w={64} h={52} />
        <Poster x={34} y={40} c={C.purple} rot={-4}><Heart x={52} y={62} c={C.yellow} /></Poster>
        <Confetti x0={70} x1={250} y0={30} n={9} dy={110} />
        <Bed x={24} y={212} w={118} c={C.orangeLt} />
        <Cat x={60} y={182} s={0.55} c={C.ink} />
        <Desk x={196} y={212} w={96} />
        <Lamp x={276} y={160} h={40} c={C.yellow} />
        <Blink dur={2} min={0.3}><path d="M262 140 L290 140 L300 172 L252 172Z" fill={C.yellow} opacity={0.25} /></Blink>
        <F d={rr(216, 140, 30, 20, 2)} c={C.ink} />
        <Blink dur={1.2} min={0.4}><F d={rr(219, 143, 24, 13, 1)} c={C.blueLt} line={false} /></Blink>
        <Person x={160} y={212} s={0.9} shirt={C.purple} skin={C.skin2} hair={C.hair1} style="long" hands={[[-26, -112], [26, -112]]} mouth="open" jump />
        <Rot cx={300} cy={212} a={4} dur={2.6}><Plant x={300} y={212} s={0.7} /></Rot>
        <Blink dur={1.6}><Star x={124} y={84} r={7} /></Blink>
    </Scene>;
}

/** Coins drop from the phone into a piggy bank. */
export function PayoutScene() {
    return <Scene label="A seller waves as coins drop from their phone into a piggy bank">
        <F d={ell(160, 216, 130, 12)} c={C.tealLt} line={false} o={0.3} />
        <Person x={90} y={214} shirt={C.green} skin={C.skin1} hair={C.hair1} style="short" hands={[[34, -84], [-22, -114]]} mouth="open" wave={0} />
        <F d={rr(118, 92, 46, 76, 7)} c={C.ink} />
        <F d={rr(123, 100, 36, 58, 3)} c={C.cream} line={false} />
        <Blink dur={1.2} min={0.4}><text x={141} y={128} textAnchor="middle" className="cr-text" fontSize="13">+$85</text></Blink>
        <S d="M130 142 H152" c={C.green} w={3} />
        <S d="M212 200 V214 M260 200 V214" c={C.pink} w={6} />
        <F d="M196 174 Q196 140 236 140 Q276 140 276 174 Q276 206 236 206 Q196 206 196 174Z" c={C.pink} />
        <F d={ell(278, 172, 8, 10)} c={C.pink} />
        <S d={circ(281, 170, .6) + circ(276, 170, .6)} w={2.6} draw={false} />
        <F d="M218 142 L212 126 L230 138Z" c={C.pink} w={2} />
        <S d="M222 148 H248" w={3} />
        <F d={circ(214, 166, 2.4)} c={C.ink} line={false} />
        <S d="M196 170 q-10 -4 -8 6" c={C.pink} w={3} />
        <Fall dy={58} dur={1.6}><Coin x={235} y={86} r={10} /></Fall>
        <Fall dy={58} dur={1.6} delay={0.8}><Coin x={237} y={86} r={9} /></Fall>
        <Blink dur={1.2}><Spark x={292} y={120} c={C.orange} /></Blink>
        <Blink dur={1.8} delay={0.4}><Star x={190} y={88} r={7} /></Blink>
        <Ground />
    </Scene>;
}

/** Whole room set tied up with a ribbon and one price tag. */
export function RoomSetScene() {
    return <Scene vb="0 0 340 240" label="A whole dorm room set: bed, desk, chair, lamp and dresser tied together with a ribbon and one price tag">
        <F d={ell(170, 216, 156, 14)} c={C.tealLt} line={false} o={0.35} />
        <Bed x={16} y={212} w={104} c={C.tealLt} />
        <Desk x={130} y={212} w={84} />
        <Lamp x={150} y={160} h={36} c={C.pink} />
        <Chair x={182} y={212} c={C.orange} />
        <F d={rr(240, 132, 58, 80, 3)} c={C.woodLt} />
        <S d="M240 158 H298 M240 184 H298 M262 145 H276 M262 171 H276 M262 197 H276" w={2} />
        <Rot cx={316} cy={212} a={4} dur={2.4}><Plant x={316} y={212} s={0.66} /></Rot>
        <S d="M10 120 Q170 96 330 120" c={C.red} w={4} />
        <Rot cx={166} cy={106} a={8} dur={1.6}><g>
            <F d="M156 108 Q140 92 150 86 Q164 90 166 106Z" c={C.red} w={2} />
            <F d="M176 108 Q192 92 182 86 Q168 90 166 106Z" c={C.red} w={2} />
        </g></Rot>
        <Rot cx={166} cy={104} a={8} from={0} dur={2.4}><g>
            <S d="M166 104 Q176 80 186 64" w={1.8} />
            <g transform="rotate(10 210 60)">
                <F d="M180 44 H246 L258 62 L246 80 H180Z" c={C.yellow} />
                <F d={circ(188, 62, 4)} c={C.cream} w={1.6} />
                <text x={222} y={67} textAnchor="middle" className="cr-text" fontSize="15">1 price</text>
            </g>
        </g></Rot>
        <Blink dur={1.8}><Star x={60} y={60} r={8} /></Blink>
        <Blink dur={1.3} delay={0.5}><Spark x={300} y={78} /></Blink>
        <Boxy x={84} y={184} s={0.36} />
    </Scene>;
}

/** Empty open box; a moth flutters out. */
export function EmptyScene() {
    return <Scene vb="0 0 240 180" label="An empty open cardboard box with a moth fluttering out of it">
        <F d={ell(120, 160, 90, 10)} c={C.tealLt} line={false} o={0.35} />
        <Rot cx={74} cy={102} a={5} dur={2}><F d="M74 102 L64 90 L112 90 L120 102Z" c={C.boxLt} /></Rot>
        <Rot cx={166} cy={102} a={5} dur={2} delay={0.5}><F d="M166 102 L176 90 L128 90 L120 102Z" c={C.boxLt} /></Rot>
        <F d={rr(74, 102, 92, 56, 2)} c={C.box} />
        <Fly path="M120 100 Q90 70 120 50 T150 20" dur={4}>
            <F d="M0 0 Q-9 -8 -8 2Z M0 0 Q9 -8 8 2Z" c={C.grayLt} w={1.4} />
        </Fly>
        <Move dy={-6} dur={1.6}><text x={170} y={60} className="cr-text" fontSize="22" fill={C.gray}>?</text></Move>
        <Blink dur={2}><Star x={56} y={70} r={6} c={C.grayLt} /></Blink>
    </Scene>;
}

/** Boxy jumping for joy in confetti. */
export function SuccessScene() {
    return <Scene vb="0 0 240 180" label="Boxy the DormDropp box mascot jumps for joy in falling confetti">
        <F d={ell(120, 166, 80, 9)} c={C.tealLt} line={false} o={0.4} />
        <Confetti x0={20} x1={220} y0={4} n={12} dy={150} seed={3} />
        <Boxy x={120} y={154} s={1.25} jump mood="happy" />
        <Blink dur={1.4}><Star x={34} y={110} r={7} /></Blink>
        <Blink dur={1.8} delay={0.5}><Star x={206} y={104} r={6} c={C.orange} /></Blink>
    </Scene>;
}

/** Sad Boxy; the deposit coin flies back. */
export function CancelScene() {
    return <Scene vb="0 0 240 180" label="Boxy looks sad while the deposit coin flies back to the buyer">
        <F d={ell(100, 166, 70, 9)} c={C.tealLt} line={false} o={0.4} />
        <Boxy x={96} y={156} s={1.1} mood="sad" wave={false} />
        <S d="M146 98 Q170 62 196 90" dash="3 7" c={C.orange} w={3} />
        <Fly path="M140 110 Q170 50 200 96" dur={2.2}><Coin r={12} /></Fly>
        <Fall dy={16} dur={1.8}><F d="M74 96 q-3 6 0 8 q3 -2 0 -8Z" c={C.blueLt} w={1.2} /></Fall>
    </Scene>;
}

/** Pencil writing a note. */
export function PencilScene() {
    return <Scene vb="0 0 160 120" label="A pencil writing a note">
        <F d={rr(34, 30, 84, 70, 4)} c={C.cream} />
        <S d="M46 50 H104 M46 64 H96" c={C.gray} w={2.4} />
        <path d="M46 78 H90" stroke={C.gray} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="44" fill="none">
            <animate attributeName="stroke-dashoffset" values="44;0;0" keyTimes="0;0.6;1" dur="2s" repeatCount="indefinite" />
        </path>
        <Move dx={-34} dy={-2} dur={2}><g transform="rotate(-38 110 70)">
            <F d={rr(80, 64, 64, 12, 2)} c={C.yellow} />
            <F d="M144 64 L158 70 L144 76Z" c={C.woodLt} w={2} />
            <F d={rr(72, 64, 10, 12, 2)} c={C.pink} />
        </g></Move>
        <Blink dur={1.2}><Spark x={30} y={22} c={C.cream} /></Blink>
    </Scene>;
}

/* ---------- Flow-specific scenes ---------- */

/** Student with a wish list; furniture ideas float in thought bubbles. */
export function WishlistScene() {
    const bub = (x: number, y: number, kid: React.ReactNode, delay: number) => <Move dy={-6} dur={2.2} delay={delay}><g>
        <F d={circ(x, y, 24)} c="#fff" w={2} />{kid}</g></Move>;
    return <Scene label="A student holds a wish list while a desk, a lamp and a chair float in thought bubbles">
        <Wall />
        <Rug cx={110} cy={210} rx={70} c={C.tealLt} />
        <Person x={94} y={212} shirt={C.yellow} skin={C.skin2} hair={C.hair2} style="bun" hands={[[20, -64], [28, -58]]} nod />
        <F d={rr(106, 118, 34, 44, 3)} c={C.cream} />
        <F d={rr(116, 114, 14, 7, 2)} c={C.gray} w={1.4} />
        <S d="M120 132 H134 M120 142 H134 M120 152 H130" c={C.gray} w={1.8} />
        <Reveal at={0.2}><S d="M110 131 l2 2 l4 -4" c={C.green} w={2} draw={false} /></Reveal>
        <Reveal at={0.45}><S d="M110 141 l2 2 l4 -4" c={C.green} w={2} draw={false} /></Reveal>
        <Reveal at={0.7}><S d="M110 151 l2 2 l4 -4" c={C.green} w={2} draw={false} /></Reveal>
        <F d={circ(130, 86, 4)} c="#fff" w={1.6} />
        <F d={circ(144, 72, 6)} c="#fff" w={1.6} />
        {bub(178, 58, <S d="M164 54 H192 M168 54 V70 M188 54 V70" c={C.wood} w={3} />, 0)}
        {bub(238, 84, <g><F d="M228 76 L232 68 H244 L248 76Z" c={C.yellow} w={1.6} /><S d="M238 76 V96" w={2} /></g>, 0.6)}
        {bub(282, 140, <g><F d={rr(272, 128, 18, 14, 3)} c={C.orange} w={1.6} /><S d="M281 142 V152 M274 154 H288" w={2} /></g>, 1.2)}
        <Blink dur={1.6}><Star x={300} y={50} r={6} /></Blink>
    </Scene>;
}

const PINS: Record<string, [number, number]> = {
    'Northwestern': [204, 44], 'UIC': [112, 118], 'Illinois Tech': [168, 150], 'UChicago': [206, 200],
};
/** Hand-drawn map of Chicago campuses; the truck drives to (or from) the chosen one. */
export function CampusMapScene({ selected, mode = 'deliver', onPick }: { selected?: string; mode?: 'deliver' | 'pickup'; onPick?: (c: string) => void }) {
    const depot: [number, number] = [50, 196];
    const target = selected ? PINS[selected] : undefined;
    const ctrl = target ? `${(depot[0] + target[0]) / 2 - 24} ${Math.min(depot[1], target[1]) - 44}` : '';
    const route = target ? `M${depot[0]} ${depot[1] - 10} Q${ctrl} ${target[0]} ${target[1] - 6}` : '';
    const motion = target && mode === 'pickup' ? `M${target[0]} ${target[1] - 6} Q${ctrl} ${depot[0]} ${depot[1] - 10}` : route;
    return <Scene label={selected ? `Map of Chicago campuses with a route between DormDropp storage and ${selected}` : 'Hand-drawn map of four Chicago campuses and DormDropp storage'}>
        <F d={rr(10, 10, 300, 220, 10)} c="#fdf3e3" line={false} />
        <F d="M250 10 Q236 70 254 120 Q272 170 262 230 H310 V10Z" c={C.blueLt} o={0.85} line={false} />
        <Move dx={-4} dur={3}><S d="M276 60 q6 -4 12 0 M282 150 q6 -4 12 0 M274 200 q6 -4 12 0" c="#fff" w={2} draw={false} /></Move>
        <text x={284} y={112} textAnchor="middle" className="cr-text" fontSize="11" fill={C.blue} transform="rotate(80 284 112)">Lake Michigan</text>
        <S d="M20 70 H244 M20 136 H250 M76 20 V226 M144 20 V226 M188 20 V226" c={C.grayLt} w={3} draw={false} />
        <S d="M20 100 Q120 90 238 110" c={C.grayLt} w={2} draw={false} />
        <Tree x={116} y={214} s={0.32} />
        <Tree x={236} y={178} s={0.28} />
        <Tree x={40} y={60} s={0.3} />
        <F d={rr(depot[0] - 16, depot[1] - 18, 32, 22, 3)} c={C.orange} />
        <F d={`M${depot[0] - 19} ${depot[1] - 18} L${depot[0]} ${depot[1] - 30} L${depot[0] + 19} ${depot[1] - 18}Z`} c={C.box} />
        <text x={depot[0]} y={depot[1] + 18} textAnchor="middle" className="cr-text" fontSize="11">storage</text>
        {route && <S d={route} dash="3 7" c={C.orange} w={3} />}
        {Object.entries(PINS).map(([name, [x, y]]) => {
            const on = name === selected;
            const pin = <g>
                <F d={`M${x} ${y} C${x - 10} ${y - 14} ${x - 10} ${y - 26} ${x} ${y - 26} C${x + 10} ${y - 26} ${x + 10} ${y - 14} ${x} ${y}Z`} c={on ? C.orange : C.teal} w={2} />
                <F d={circ(x, y - 17, 3.4)} c={C.cream} w={1.2} />
            </g>;
            const act = onPick ? { role: 'button', tabIndex: 0, 'aria-label': 'Choose ' + name, 'aria-pressed': on, className: 'map-pin', onClick: () => onPick(name), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(name); } } } : {};
            return <g key={name} {...act}>
                {onPick && <circle cx={x} cy={y - 8} r={26} fill="transparent" />}
                {on ? <Move dy={-5} dur={0.9}>{pin}</Move> : pin}
                <text x={x} y={y + 13} textAnchor="middle" className="cr-text" fontSize={on ? 13 : 11} fill={on ? C.ink : C.gray}>{name}</text>
            </g>;
        })}
        {target && <Fly key={selected + mode} path={motion} dur={3.2}>
            <g transform="translate(-15 6) scale(0.23)"><Truck x={0} y={0} puff={false} /></g>
        </Fly>}
        {!target && <Move dy={-4} dur={1.6}><text x={130} y={36} textAnchor="middle" className="cr-text" fontSize="15">{onPick ? 'tap a pin!' : 'pick a campus!'}</text></Move>}
    </Scene>;
}

/** The deposit goes into a safe guarded by Boxy. */
export function VaultScene() {
    return <Scene label="A deposit coin drops into a safe with a shield on it while Boxy stands guard">
        <F d={ell(160, 216, 130, 12)} c={C.tealLt} line={false} o={0.3} />
        <F d={rr(130, 92, 112, 120, 8)} c={C.grayLt} />
        <F d={rr(140, 102, 92, 100, 6)} c="#eef0f4" />
        <F d={rr(170, 86, 34, 8, 3)} c={C.ink} />
        <Rot cx={212} cy={176} a={40} dur={3}><g>
            <F d={circ(212, 176, 12)} c={C.cream} w={2.2} />
            <S d="M212 167 V176" w={2.4} />
        </g></Rot>
        <F d="M162 120 Q174 116 180 110 Q186 116 198 120 Q198 144 180 154 Q162 144 162 120Z" c={C.teal} w={2} />
        <S d="M172 132 l6 6 l10 -11" c={C.cream} w={2.8} draw={false} />
        <S d="M146 212 V218 M226 212 V218" w={4} />
        <Fall dy={44} dur={1.8}><Coin x={187} y={38} r={11} /></Fall>
        <Boxy x={82} y={208} s={0.9} mood="wow" />
        <Blink dur={1.3}><Spark x={258} y={100} c={C.yellow} /></Blink>
        <Blink dur={1.9} delay={0.5}><Star x={276} y={150} r={7} c={C.teal} /></Blink>
    </Scene>;
}

/** Ops desk: platform view with screens. */
export function OpsScene() {
    return <Scene label="A DormDropp operator at a desk with screens tracking the truck and a quality checklist">
        <Wall />
        <F d={rr(40, 40, 110, 70, 6)} c={C.ink} />
        <F d={rr(46, 46, 98, 58, 3)} c="#fdf3e3" line={false} />
        <S d="M54 92 Q80 60 100 80 T138 58" dash="3 6" c={C.orange} w={2.4} />
        <Fly path="M54 92 Q80 60 100 80 T138 58" dur={3}><F d={circ(0, 0, 4)} c={C.orange} line={false} /></Fly>
        <F d={rr(170, 40, 110, 70, 6)} c={C.ink} />
        <F d={rr(176, 46, 98, 58, 3)} c="#fdf3e3" line={false} />
        <Reveal at={0.2}><S d="M186 60 l4 4 l7 -8" c={C.green} w={2.4} draw={false} /></Reveal>
        <Reveal at={0.45}><S d="M186 76 l4 4 l7 -8" c={C.green} w={2.4} draw={false} /></Reveal>
        <Reveal at={0.7}><S d="M186 92 l4 4 l7 -8" c={C.green} w={2.4} draw={false} /></Reveal>
        <S d="M204 62 H262 M204 78 H256 M204 94 H248" c={C.gray} w={2.2} />
        <Person x={160} y={212} shirt={C.teal} skin={C.skin1} hair={C.hair3} style="long" hands={[[-24, -50], [24, -50]]} glasses nod />
        <F d={rr(40, 160, 240, 10, 3)} c={C.wood} />
        <S d="M54 170 V212 M266 170 V212" w={3} />
        <F d={rr(96, 146, 14, 14, 3)} c="#fff" />
        <Fall dy={-16} dur={2}><S d="M100 140 q3 -5 0 -10 M106 140 q3 -5 0 -10" c={C.gray} w={1.6} draw={false} /></Fall>
        <Boxy x={250} y={160} s={0.5} />
    </Scene>;
}

/** Tiny Boxy for tips in summaries. */
export function BoxyBadge({ mood = 'happy' }: { mood?: 'happy' | 'sad' | 'wow' }) {
    return <Scene vb="0 0 90 90" label="Boxy, the DormDropp mascot" className="boxy-badge">
        <Boxy x={45} y={80} s={0.95} mood={mood} />
    </Scene>;
}
