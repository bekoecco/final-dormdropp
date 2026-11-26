import React from 'react';
import { DELIVERY_FEE } from './data';
import { EMPTY_MARKET, Market, Order, go, makeRef, money } from './market';
import { CURRENT_KEY, MARKET_KEY, ROOMSET_KEY, useLocalState } from './router';
import { Icon } from './icons';
import { RoomSetScene } from './scenes';
import { Banner, DemoNote, PageHead } from './components';

type SetListing = { title: string; contents: string; individual: number; price: number };
const SAMPLE: SetListing = { title: 'Complete student room', contents: 'Desk, desk chair, floor lamp, full bed frame, mattress, nightstand, dresser and bookshelf. Sample listing from one moving-out student.', individual: 325, price: 260 };
const pct = (s: SetListing) => Math.round((1 - s.price / s.individual) * 100);

export function RoomSets() {
    const [listing, setListing] = useLocalState<SetListing | null>(ROOMSET_KEY, null);
    const [market, setMarket] = useLocalState<Market>(MARKET_KEY, EMPTY_MARKET);
    const [, setCurrent] = useLocalState<string>(CURRENT_KEY, '');
    const [tab, setTab] = React.useState<'buy' | 'sell'>('buy');
    const [title, setTitle] = React.useState('My entire room set');
    const [contents, setContents] = React.useState('Desk, desk chair, floor lamp, full bed frame, mattress, nightstand, dresser and bookshelf');
    const [individual, setIndividual] = React.useState('325');
    const [price, setPrice] = React.useState('260');
    const [notice, setNotice] = React.useState(false);
    const [selected, setSelected] = React.useState<SetListing | null>(null);
    const [reserved, setReserved] = React.useState(false);

    const ind = Number(individual), pr = Number(price);
    const valid = !!title.trim() && !!contents.trim() && Number.isFinite(ind) && Number.isFinite(pr) && ind > 0 && pr > 0 && pr < ind;

    const save = () => {
        if (!valid) return;
        setListing({ title: title.trim(), contents: contents.trim(), individual: ind, price: pr });
        setNotice(true); setTab('buy'); window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const reserve = (s: SetListing) => {
        const deposit = Math.max(5, Math.round(s.price * 0.2));
        const order: Order = {
            id: makeRef('DD'), buyer: 'You', seller: 'Student seller', own: 'buyer',
            summary: 'Whole-room set: ' + s.title, price: s.price, deposit,
            pickup: 'Sat 19 Dec 2026', pickupPlace: 'Campus pickup point',
            dropoff: 'Mon 11 Jan 2027', dropoffPlace: 'Campus delivery point',
            condition: 'Good', stage: 'awaiting-seller',
            events: [
                { step: 1, note: 'You reserved the whole-room set "' + s.title + '": ' + s.contents },
                { step: 2, note: 'You accepted the set price of ' + money(s.price) + ' (demo).' },
                { step: 5, note: 'Deposit of ' + money(deposit) + ' placed on the room set (demo).' },
            ],
        };
        setMarket({ ...market, orders: [order, ...market.orders] });
        setCurrent(order.id);
        setReserved(true);
    };

    const sets = [...(listing ? [{ ...listing, own: true }] : []), { ...SAMPLE, own: false }];

    return <div>
        <PageHead eyebrow="Room sets" title="One room. One set. Less hassle." back="/" art={<RoomSetScene />}
            lede="Moving out? Sell your room's furniture together at a discount. Moving in? Get a complete set from one student, delivered in one trip." />
        <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'buy'} className={tab === 'buy' ? 'on' : ''} onClick={() => { setTab('buy'); setSelected(null); }}>Buy a room set</button>
            <button role="tab" aria-selected={tab === 'sell'} className={tab === 'sell' ? 'on' : ''} onClick={() => { setTab('sell'); setSelected(null); }}>Sell my whole room</button>
        </div>

        {tab === 'sell' && <div className="flow">
            <div className="flow-main">
                <div className="form">
                    <label className="field"><span>Room set name</span><input maxLength={90} value={title} onChange={e => setTitle(e.target.value)} /></label>
                    <label className="field"><span>What's included?</span><textarea maxLength={1000} rows={4} value={contents} onChange={e => setContents(e.target.value)} /></label>
                    <div className="field-row">
                        <label className="field"><span>Total if sold separately</span><div className="money-input"><i>$</i><input type="number" min="1" step="1" inputMode="numeric" value={individual} onChange={e => setIndividual(e.target.value)} /></div></label>
                        <label className="field"><span>Whole-room price</span><div className="money-input"><i>$</i><input type="number" min="1" step="1" inputMode="numeric" value={price} onChange={e => setPrice(e.target.value)} /></div></label>
                    </div>
                    {!valid && <p className="field-error" role="status">Set a whole-room price above $0 and below the separate-item total.</p>}
                    <p className="hint">Starting values are examples. Delivery ({money(DELIVERY_FEE)}) is paid by the buyer. This price is not a payout quote.</p>
                </div>
            </div>
            <aside className="summary">
                <div className="summary-card">
                    <p className="summary-title">Buyer sees</p>
                    <p className="set-price">{valid ? money(pr) : '–'} {valid && <s>{money(ind)}</s>}</p>
                    {valid && <p className="save-tag">Save {money(ind - pr)} ({Math.round((1 - pr / ind) * 100)}%)</p>}
                    <button className="btn btn-primary btn-block" disabled={!valid} onClick={save}>Publish demo listing<Icon name="arrow" size={17} /></button>
                </div>
            </aside>
        </div>}

        {tab === 'buy' && <>
            {notice && <Banner tone="good">Your room set is listed below. It's saved only in this browser.</Banner>}
            {selected ? <div className="flow">
                <div className="flow-main">
                    <div className="setcard setcard-lg">
                        <span className="set-eyebrow">Entire room · one seller</span>
                        <h2>{selected.title}</h2>
                        <p>{selected.contents}</p>
                        {reserved
                            ? <Banner tone="good">Reservation placed (demo). It's in My orders now, and you can walk it through the full flow.</Banner>
                            : <p className="hint">The set stays together: no pieces are removed or sold separately. Prices are sample estimates.</p>}
                    </div>
                    <button className="btn btn-quiet" onClick={() => setSelected(null)}><Icon name="back" size={16} />Back to room sets</button>
                </div>
                <aside className="summary">
                    <div className="summary-card">
                        <p className="summary-title">{reserved ? 'Reserved' : 'Reserve this set'}</p>
                        <dl className="summary-lines">
                            <div><dt>Room-set price</dt><dd>{money(selected.price)}</dd></div>
                            <div><dt>Delivery</dt><dd>{money(DELIVERY_FEE)}</dd></div>
                            <div className="muted"><dt>Deposit now (20%)</dt><dd>{money(Math.max(5, Math.round(selected.price * 0.2)))}</dd></div>
                        </dl>
                        <div className="summary-total"><span>Total estimate</span><strong>{money(selected.price + DELIVERY_FEE)}</strong></div>
                        {reserved
                            ? <button className="btn btn-primary btn-block" onClick={() => go('/order')}>Track this order<Icon name="arrow" size={17} /></button>
                            : <button className="btn btn-primary btn-block" onClick={() => reserve(selected)}>Reserve full set (demo)<Icon name="arrow" size={17} /></button>}
                    </div>
                </aside>
            </div> : <div className="sets">
                {sets.map((s, i) => <article className="setcard" key={i}>
                    <span className="set-eyebrow">{s.own ? 'Your demo listing' : 'Sample student listing'} · entire room</span>
                    <h2>{s.title}</h2>
                    <p>{s.contents}</p>
                    <div className="set-foot">
                        <div>
                            <p className="set-price">{money(s.price)} <s>{money(s.individual)}</s></p>
                            <p className="save-tag">Save {money(s.individual - s.price)} ({pct(s)}%)</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => { setSelected(s); setReserved(false); }}>View set<Icon name="arrow" size={16} /></button>
                    </div>
                    {s.own && <button className="btn btn-link" onClick={() => { setListing(null); setNotice(false); }}>Remove my listing</button>}
                </article>)}
            </div>}
        </>}
        <DemoNote>Listings stay in this browser, aren't shared with other students, and don't create a real pickup, sale or payment.</DemoNote>
    </div>;
}
