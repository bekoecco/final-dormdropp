import React from 'react';
import { CAMPUSES, CONDITIONS, PAYOUT_PCT, PIECES } from './data';
import { DatePicker, fmtDate } from './calendar';
import { EMPTY_MARKET, Listing, Market, Order, go, makeRef, money, readPhoto } from './market';
import { CURRENT_KEY, MARKET_KEY, useLocalState } from './router';
import { Icon } from './icons';
import { CampusMapScene, ListScene, PayoutScene, PickupScene } from './scenes';
import { Banner, Chips, DemoNote, FlowLayout, PageHead, Qty, Section, Steps, Success, Summary } from './components';
import { subtotalOf, summarize } from './buy';

export function SellFlow() {
    const [market, setMarket] = useLocalState<Market>(MARKET_KEY, EMPTY_MARKET);
    const [, setCurrent] = useLocalState<string>(CURRENT_KEY, '');
    const [step, setStep] = React.useState(1);
    const [items, setItems] = React.useState<Record<string, number>>({});
    const [condition, setCondition] = React.useState('Good');
    const [photo, setPhoto] = React.useState('');
    const [place, setPlace] = React.useState('');
    const [date, setDate] = React.useState('');
    const [saved, setSaved] = React.useState<Listing | null>(null);

    const count = Object.values(items).reduce((a, b) => a + b, 0);
    const asking = subtotalOf(items);
    const payout = Math.round(asking * PAYOUT_PCT);
    const [dir, setDir] = React.useState<'fwd' | 'back'>('fwd');
    const next = (n: number) => { setDir(n < step ? 'back' : 'fwd'); setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const view = (node: React.ReactNode) => <div key={step} className={'stepview ' + dir}>{node}</div>;

    const saveListing = () => {
        const listing: Listing = { id: makeRef('L'), items: summarize(items), condition, photo: photo || undefined, place, date: fmtDate(date), asking, payout };
        setMarket({ ...market, listings: [listing, ...market.listings] });
        setSaved(listing);
        next(3);
    };

    const simulateOrder = () => {
        if (!saved) return;
        const deposit = Math.max(5, Math.round(saved.asking * 0.2));
        const order: Order = {
            id: makeRef('DD'), buyer: 'Maya R.', seller: 'You', own: 'seller',
            summary: saved.items, price: saved.asking, deposit,
            pickup: saved.date, pickupPlace: saved.place,
            dropoff: 'Tue 12 Jan 2027', dropoffPlace: 'UIC',
            condition: saved.condition, stage: 'awaiting-seller',
            events: [
                { step: 3, note: 'You listed ' + saved.items + ' (' + saved.condition.toLowerCase() + ' condition).' },
                { step: 4, note: 'You requested pickup on ' + saved.date + ' at ' + saved.place + '.' },
                { step: 5, note: 'Maya R. chose your offer and placed a ' + money(deposit) + ' deposit (demo).' },
            ],
        };
        setMarket({ ...market, orders: [order, ...market.orders] });
        setCurrent(order.id);
        go('/order');
    };

    if (step === 3 && saved) {
        return <Success title="Your listing is live" refId={saved.id} art={<PayoutScene />}>
            <p className="lede">Buyers can now see it as an offer (in this browser, for the demo).</p>
            {saved.photo && <img className="success-photo" src={saved.photo} alt="Your furniture" />}
            <dl className="receipt">
                <div><dt>Items</dt><dd>{saved.items}</dd></div>
                <div><dt>Condition</dt><dd>{saved.condition}</dd></div>
                <div><dt>Pickup</dt><dd>{saved.date}, {saved.place}</dd></div>
                <div><dt>Estimated payout</dt><dd>{money(saved.payout)}</dd></div>
            </dl>
            <Banner>When a buyer picks your offer and pays a deposit, you confirm the order and pickup. We check quality, deliver, and release your payout.</Banner>
            <div className="success-actions">
                <button className="btn btn-primary" onClick={simulateOrder}>Simulate a buyer order<Icon name="arrow" size={17} /></button>
                <button className="btn btn-quiet" onClick={() => go('/orders')}>My listings and orders</button>
            </div>
            <DemoNote>Nothing is shared with other students. No real pickup or payout.</DemoNote>
        </Success>;
    }

    return <>
        <PageHead eyebrow="Sell furniture" back="/" art={step === 1 ? <ListScene /> : <PickupScene />}
            title={step === 1 ? "What are you leaving behind?" : 'When should we pick it up?'}
            lede={step === 1 ? 'Add your pieces, their condition and a photo. We show you what they typically sell for.' : 'We collect during move-out week. Pick your campus and a date.'} />
        <Steps labels={['Pieces', 'Pickup', 'Live']} current={step} />
        {step === 1 && view(<FlowLayout summary={
            <Summary title="Your listing" totalLabel="Estimated payout" total={money(payout)}
                lines={count ? [
                    ...PIECES.filter(p => items[p.id]).map(p => ({ k: p.name + (items[p.id] > 1 ? ' ×' + items[p.id] : ''), v: money(p.resale * items[p.id]) })),
                    { k: 'DormDropp share (10%)', v: '−' + money(asking - payout), muted: true },
                ] : []}
                note={count ? 'Paid after delivery, once the buyer pays.' : 'Add at least one piece to continue.'}
                cta="Continue" disabled={count === 0} onCta={() => next(2)}
                tip={count === 0 ? 'Hi, I\'m Boxy! What are you leaving behind?' : photo ? 'Great photo. Listings with photos get picked first.' : 'Add a photo so buyers know what they\'re getting.'} />
        }>
            <Section title="Pieces">
                <div className="catalog">
                    {PIECES.map(p => <div className={'piece' + (items[p.id] ? ' on' : '')} key={p.id}>
                        <span className="piece-ico"><Icon name={p.icon} size={24} /></span>
                        <div className="piece-info">
                            <h3>{p.name}</h3>
                            <p>{p.note}</p>
                            <p className="piece-price"><small>Sells for about</small> {money(p.resale)}</p>
                        </div>
                        <Qty label={p.name} value={items[p.id] || 0} onChange={v => setItems({ ...items, [p.id]: v })} />
                    </div>)}
                </div>
            </Section>
            <Section title="Condition" hint="Be honest: the quality check compares it at pickup.">
                <Chips label="Condition" options={CONDITIONS} value={condition} onChange={setCondition} />
            </Section>
            <Section title="Photo" hint="Optional. Buyers and the quality check see it.">
                <label className="upload">
                    <span className="upload-thumb">{photo ? <img src={photo} alt="Your furniture" /> : <Icon name="camera" size={26} />}</span>
                    <span><b>{photo ? 'Photo added' : 'Add a photo'}</b><small>{photo ? 'Tap to replace. It stays in this browser.' : 'JPG or PNG. It stays in this browser.'}</small></span>
                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files && e.target.files[0]; if (f) readPhoto(f, setPhoto); }} />
                </label>
            </Section>
        </FlowLayout>)}
        {step === 2 && view(<FlowLayout summary={
            <Summary title="Estimated payout" totalLabel="You receive" total={money(payout)}
                lines={[
                    { k: 'Resale value (' + count + ' item' + (count === 1 ? '' : 's') + ')', v: money(asking) },
                    { k: 'DormDropp share (10%)', v: '−' + money(asking - payout) },
                ]}
                note="If the pieces don't match the listing at pickup, the price can be renegotiated or the order cancelled."
                cta="Publish listing" disabled={!place || !date} onCta={saveListing} onBack={() => next(1)}
                tip={!place ? 'Which campus? Tap a pin and I\'ll plan the route.' : !date ? 'Pick a day during move-out week.' : 'All set. We\'ll collect it straight to storage.'} />
        }>
            <Section title="Pickup campus" hint="Tap a pin or a name.">
                <div className="mapbox"><CampusMapScene selected={place || undefined} mode="pickup" onPick={setPlace} /></div>
                <Chips label="Pickup campus" options={CAMPUSES} value={place} onChange={setPlace} />
            </Section>
            <Section title="Pickup date">
                <DatePicker label="Pickup date" value={date} onChange={setDate} />
            </Section>
        </FlowLayout>)}
    </>;
}
