import React from 'react';
import { ADDONS, CAMPUSES, COLORS, DELIVERY_FEE, DEMO_SELLERS, DEPOSIT_PCT, PIECES } from './data';
import { DatePicker, fmtDate } from './calendar';
import { EMPTY_MARKET, Market, Order, go, makeRef, money } from './market';
import { CURRENT_KEY, MARKET_KEY, useLocalState } from './router';
import { Icon } from './icons';
import { CampusMapScene, DeliverScene, MatchScene, VaultScene, WishlistScene } from './scenes';
import { Chips, DemoNote, FlowLayout, PageHead, Qty, Section, Steps, Success, Summary } from './components';

export type Offer = {
    id: string; seller: string; campus: string; price: number;
    condition: string; pickup: string; pickupPlace: string; summary: string; own?: boolean;
};

export const summarize = (items: Record<string, number>) =>
    PIECES.filter(p => items[p.id] > 0).map(p => p.name + (items[p.id] > 1 ? ' ×' + items[p.id] : '')).join(', ');

export const subtotalOf = (items: Record<string, number>) =>
    PIECES.reduce((sum, p) => sum + (items[p.id] || 0) * p.resale, 0);

const retailOf = (items: Record<string, number>) =>
    PIECES.reduce((sum, p) => sum + (items[p.id] || 0) * p.retail, 0);

const depositOf = (price: number) => Math.max(5, Math.round(price * DEPOSIT_PCT));

function buildOffers(items: Record<string, number>, market: Market): Offer[] {
    const subtotal = subtotalOf(items);
    const summary = summarize(items);
    const offers: Offer[] = DEMO_SELLERS.map((s, i) => ({
        id: 'demo-' + i, seller: s.name, campus: s.campus,
        price: Math.max(10, Math.round(subtotal * s.factor)),
        condition: s.condition, pickup: 'Sat 19 Dec 2026', pickupPlace: s.campus, summary,
    }));
    market.listings.forEach(l => offers.unshift({
        id: 'own-' + l.id, seller: 'Your listing', campus: l.place, price: l.asking,
        condition: l.condition, pickup: l.date, pickupPlace: l.place, summary: l.items, own: true,
    }));
    return offers;
}

const STEPS = ['Items', 'Delivery', 'Offers', 'Deposit'];

export function BuyFlow() {
    const [market, setMarket] = useLocalState<Market>(MARKET_KEY, EMPTY_MARKET);
    const [, setCurrent] = useLocalState<string>(CURRENT_KEY, '');
    const [step, setStep] = React.useState(1);
    const [items, setItems] = React.useState<Record<string, number>>({});
    const [color, setColor] = React.useState('Any color');
    const [place, setPlace] = React.useState('');
    const [date, setDate] = React.useState('');
    const [addons, setAddons] = React.useState<Record<string, boolean>>({});
    const [offers, setOffers] = React.useState<Offer[]>([]);
    const [picked, setPicked] = React.useState<Offer | null>(null);
    const [done, setDone] = React.useState<Order | null>(null);

    const count = Object.values(items).reduce((a, b) => a + b, 0);
    const subtotal = subtotalOf(items);
    const retail = retailOf(items);
    const addonList = ADDONS.filter(a => addons[a.id]);
    const addonsTotal = addonList.reduce((s, a) => s + a.price, 0);
    const estimate = subtotal + DELIVERY_FEE + addonsTotal;

    const [dir, setDir] = React.useState<'fwd' | 'back'>('fwd');
    const next = (n: number) => { setDir(n < step ? 'back' : 'fwd'); setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const view = (node: React.ReactNode) => <div key={step} className={'stepview ' + dir}>{node}</div>;

    const placeDeposit = () => {
        if (!picked) return;
        const deposit = depositOf(picked.price);
        const order: Order = {
            id: makeRef('DD'), buyer: 'You', seller: picked.seller, own: 'buyer',
            summary: picked.summary + (color !== 'Any color' ? ' (' + color.toLowerCase() + ' preferred)' : ''),
            price: picked.price, deposit,
            pickup: picked.pickup, pickupPlace: picked.pickupPlace,
            dropoff: fmtDate(date), dropoffPlace: place,
            condition: picked.condition,
            addons: addonList.length ? addonList.map(a => a.name).join(', ') : undefined,
            addonsTotal: addonsTotal || undefined,
            stage: 'awaiting-seller',
            events: [
                { step: 1, note: 'You requested furniture: ' + picked.summary + '.' },
                { step: 2, note: 'You accepted the estimated price.' },
                { step: 5, note: 'You accepted ' + picked.seller + "'s offer and placed a " + money(deposit) + ' deposit (demo).' + (addonList.length ? ' Add-ons: ' + addonList.map(a => a.name).join(', ') + '.' : '') },
            ],
        };
        setMarket({ ...market, orders: [order, ...market.orders] });
        setCurrent(order.id);
        setDone(order);
        window.scrollTo({ top: 0 });
    };

    if (done) {
        return <Success title="Deposit placed" refId={done.id}>
            <p className="lede">{done.seller} has your order. Next, the seller confirms pickup, then DormDropp runs the quality check.</p>
            <dl className="receipt">
                <div><dt>Items</dt><dd>{done.summary}</dd></div>
                <div><dt>Offer price</dt><dd>{money(done.price)}</dd></div>
                <div><dt>Deposit paid (demo)</dt><dd>{money(done.deposit)}</dd></div>
                <div><dt>Pickup</dt><dd>{done.pickup}, {done.pickupPlace}</dd></div>
                <div><dt>Delivery</dt><dd>{done.dropoff}, {done.dropoffPlace}</dd></div>
            </dl>
            <div className="success-actions">
                <button className="btn btn-primary" onClick={() => go('/order')}>Track this order<Icon name="arrow" size={17} /></button>
                <button className="btn btn-quiet" onClick={() => go('/orders')}>All my orders</button>
            </div>
            <DemoNote>No payment was made and nothing was scheduled.</DemoNote>
        </Success>;
    }

    const head = <>
        <PageHead eyebrow="Buy furniture" back="/" art={step === 1 ? <WishlistScene /> : step === 2 ? <DeliverScene /> : step === 3 ? <MatchScene /> : <VaultScene />} title={
            step === 1 ? 'What do you need?' : step === 2 ? 'Where and when?' : step === 3 ? 'Pick a seller offer' : 'Hold it with a deposit'
        } lede={
            step === 1 ? 'Add the pieces you need. Prices are typical resale for each item, well under retail.' :
            step === 2 ? 'Choose a delivery campus and date, and any moving help you want.' :
            step === 3 ? 'These students have what you asked for. Pick one offer to hold.' :
            'The deposit holds the offer while we check the furniture. It comes back if the order is cancelled.'
        } />
        <Steps labels={STEPS} current={step} />
    </>;

    if (step === 1) return view(<>{head}<FlowLayout summary={
        <Summary title="Your request" totalLabel="Estimated total" total={money(estimate)}
            lines={count ? [
                ...PIECES.filter(p => items[p.id]).map(p => ({ k: p.name + (items[p.id] > 1 ? ' ×' + items[p.id] : ''), v: money(p.resale * items[p.id]) })),
                { k: 'Delivery', v: money(DELIVERY_FEE), muted: true },
            ] : []}
            note={count ? 'You save about ' + money(retail - subtotal) + ' vs. buying new.' : 'Add at least one piece to continue.'}
            cta="Continue" disabled={count === 0} onCta={() => next(2)}
            tip={count === 0 ? 'Hi, I\'m Boxy! Tap + on anything you need.' : count < 3 ? 'Nice pick! Most rooms need a bed, desk and chair.' : 'Look at that, ' + money(retail - subtotal) + ' saved vs. new!'} />
    }>
        <Section title="Pieces">
            <div className="catalog">
                {PIECES.map(p => <div className={'piece' + (items[p.id] ? ' on' : '')} key={p.id}>
                    <span className="piece-ico"><Icon name={p.icon} size={24} /></span>
                    <div className="piece-info">
                        <h3>{p.name}</h3>
                        <p>{p.note}</p>
                        <p className="piece-price">{money(p.resale)} <s>{money(p.retail)}</s></p>
                    </div>
                    <Qty label={p.name} value={items[p.id] || 0} onChange={v => setItems({ ...items, [p.id]: v })} />
                </div>)}
            </div>
        </Section>
        <Section title="Preferred color" hint="We'll pass this on to sellers.">
            <Chips label="Preferred color" options={COLORS} value={color} onChange={setColor} />
        </Section>
    </FlowLayout></>);

    if (step === 2) return view(<>{head}<FlowLayout summary={
        <Summary title="Your estimate" totalLabel="Estimated total" total={money(estimate)}
            lines={[
                { k: 'Furniture (' + count + ' item' + (count === 1 ? '' : 's') + ')', v: money(subtotal) },
                ...addonList.map(a => ({ k: a.name, v: money(a.price) })),
                { k: 'Delivery', v: money(DELIVERY_FEE) },
            ]}
            note="Rough estimate from sample resale prices. Your final price is the seller offer you pick next."
            cta="Accept estimate, see offers" disabled={!place || !date}
            onCta={() => { setOffers(buildOffers(items, market)); next(3); }} onBack={() => next(1)}
            tip={!place ? 'Where are you moving in? Tap a pin on the map.' : !date ? 'Now pick a day. Move-in week is the busiest.' : addonList.length ? 'Good call. We\'ll handle the heavy lifting.' : 'Want help carrying? Add-ons are paid on delivery.'} />
    }>
        <Section title="Delivery campus" hint="Tap a pin or a name.">
            <div className="mapbox"><CampusMapScene selected={place || undefined} onPick={setPlace} /></div>
            <Chips label="Delivery campus" options={CAMPUSES} value={place} onChange={setPlace} />
        </Section>
        <Section title="Delivery date" hint="From 20 Dec, after move-out pickups. Move-in week is usually best.">
            <DatePicker label="Delivery date" value={date} onChange={setDate} min="2026-12-20" />
        </Section>
        <Section title="Moving add-ons" hint="Optional. Paid on delivery.">
            <div className="options">
                {ADDONS.map(a => <button type="button" key={a.id} aria-pressed={!!addons[a.id]} className={'option' + (addons[a.id] ? ' on' : '')}
                    onClick={() => setAddons({ ...addons, [a.id]: !addons[a.id] })}>
                    <span className="option-ico"><Icon name={a.icon} size={20} /></span>
                    <span className="option-text"><b>{a.name}</b><small>{a.detail}</small></span>
                    <span className="option-price">{money(a.price)}</span>
                    <span className="option-check"><Icon name="check" size={13} /></span>
                </button>)}
            </div>
        </Section>
    </FlowLayout></>);

    if (step === 3) return view(<>{head}<FlowLayout summary={
        <Summary title="Delivering to" totalLabel="Your estimate" total={money(estimate)}
            lines={[{ k: 'Campus', v: place }, { k: 'Date', v: fmtDate(date) }, { k: 'Items', v: String(count) }]}
            note="Offers can be above or below the estimate, based on each seller's pieces and condition."
            onBack={() => next(2)} tip="Cheapest isn't always best. Check the condition too!" />
    }>
        <div className="offers">
            {offers.map((o, i) => {
                const best = !o.own && o.price === Math.min(...offers.filter(x => !x.own).map(x => x.price));
                return <div className={'offer' + (o.own ? ' offer-own' : '')} key={o.id}>
                    <div className="offer-top">
                        <span className={'avatar avatar-' + (i % 3)}>{o.own ? 'Y' : o.seller[0]}</span>
                        <div className="offer-who">
                            <h3>{o.seller}{best && <span className="pill pill-good">Best price</span>}{o.own && <span className="pill pill-wait">From this browser</span>}</h3>
                            <p>{o.campus} · {o.condition} condition · photos on file</p>
                        </div>
                        <strong className="offer-price">{money(o.price)}</strong>
                    </div>
                    <p className="offer-items">{o.summary}</p>
                    <div className="offer-foot">
                        <span><Icon name="calendar" size={15} />Pickup {o.pickup}</span>
                        <button className="btn btn-primary" onClick={() => { setPicked(o); next(4); }}>Choose offer<Icon name="arrow" size={16} /></button>
                    </div>
                </div>;
            })}
        </div>
    </FlowLayout></>);

    if (step === 4 && picked) {
        const deposit = depositOf(picked.price);
        const due = picked.price - deposit + DELIVERY_FEE + addonsTotal;
        return view(<>{head}<FlowLayout summary={
            <Summary title="Payment" totalLabel="Due now (demo)" total={money(deposit)}
                lines={[
                    { k: picked.seller + "'s offer", v: money(picked.price) },
                    { k: 'Deposit (20%)', v: '−' + money(deposit) },
                    { k: 'Delivery', v: money(DELIVERY_FEE) },
                    ...(addonsTotal ? [{ k: 'Add-ons', v: money(addonsTotal) }] : []),
                    { k: 'Due on delivery', v: money(due), muted: true },
                ]}
                note="Demo payment: no card is charged."
                cta={'Pay ' + money(deposit) + ' deposit'} onCta={placeDeposit} onBack={() => next(3)}
                tip="I'll guard your deposit. It comes back if anything's off." />
        }>
            <div className="review">
                <div className="review-row"><span className="avatar avatar-0">{picked.seller[0]}</span><div><h3>{picked.seller}</h3><p>{picked.campus} · {picked.condition} condition</p></div></div>
                <dl className="receipt">
                    <div><dt>Items</dt><dd>{picked.summary}</dd></div>
                    <div><dt>Pickup</dt><dd>{picked.pickup}, {picked.pickupPlace}</dd></div>
                    <div><dt>Delivery</dt><dd>{fmtDate(date)}, {place}</dd></div>
                    {addonList.length > 0 && <div><dt>Add-ons</dt><dd>{addonList.map(a => a.name).join(', ')}</dd></div>}
                </dl>
            </div>
            <div className="protect">
                <Icon name="shield" size={20} />
                <div><h3>Your deposit is protected</h3><p>If the quality check finds the furniture below its listing, you get a lower price to accept or decline. If it's not what was listed at all, the order is cancelled and the deposit returned.</p></div>
            </div>
        </FlowLayout></>);
    }
    return null;
}
