import React from 'react';
import { EMPTY_MARKET, Market, Order, STAGE_LABEL, money } from './market';
import { MARKET_KEY, useLocalState } from './router';
import { Icon } from './icons';
import { OpsScene } from './scenes';
import { DemoNote, PageHead } from './components';
import { pillFor } from './orders';

/* Platform side: the quality check with its three outcomes, and pickup/dropoff scheduling.
   Buyers and sellers only see the results as status updates. */

function Column({ title, icon, count, empty, children }: { title: string; icon: string; count: number; empty: string; children: React.ReactNode }) {
    return <section className="col">
        <div className="col-head"><Icon name={icon} size={16} /><h2>{title}</h2><span>{count}</span></div>
        {count === 0 ? <p className="col-empty">{empty}</p> : <div className="col-body">{children}</div>}
    </section>;
}

function Card({ o, children }: { o: Order; children?: React.ReactNode }) {
    return <div className="task">
        <div className="task-top"><span className="ref">{o.id}</span><strong>{money(o.price)}</strong></div>
        <h3>{o.summary}</h3>
        {children}
    </div>;
}

export function AdminView() {
    const [market, setMarket] = useLocalState<Market>(MARKET_KEY, EMPTY_MARKET);
    const [prices, setPrices] = React.useState<Record<string, string>>({});

    const update = (order: Order, patch: Partial<Order>, note?: string) => {
        const updated: Order = { ...order, ...patch, events: note ? [...order.events, { step: 0, note }] : order.events };
        setMarket({ ...market, orders: market.orders.map(o => o.id === order.id ? updated : o) });
    };

    const by = (...s: string[]) => market.orders.filter(o => s.includes(o.stage));
    const quality = by('quality'), logistics = by('logistics'), transit = by('transit');
    const watching = by('awaiting-seller', 'renegotiate', 'delivered'), closed = by('complete', 'cancelled');

    return <div>
        <PageHead eyebrow="Platform side" title="Operations" back="/" art={<OpsScene />}
            lede="Quality checks and logistics for every order. Buyers and sellers only see the outcomes as status updates."
            right={market.orders.length > 0 ? <button className="btn btn-quiet btn-sm" onClick={() => setMarket(EMPTY_MARKET)}>Reset demo data</button> : undefined} />

        <div className="stats">
            <div><span>{quality.length}</span>To check</div>
            <div><span>{logistics.length}</span>To schedule</div>
            <div><span>{transit.length}</span>On the way</div>
            <div><span>{closed.filter(o => o.stage === 'complete').length}</span>Completed</div>
        </div>

        <div className="board">
            <Column title="Quality check" icon="shield" count={quality.length} empty="Nothing waiting for a check.">
                {quality.map(o => <Card o={o} key={o.id}>
                    <p>{o.own === 'buyer' ? 'Seller: ' + o.seller : 'Buyer: ' + o.buyer}. Listed as <b>{o.condition.toLowerCase()}</b>. Compare photos and condition, digitally first, in person at pickup.</p>
                    {o.qcOutcome !== 'mismatch' ? <div className="task-actions">
                        <button className="btn btn-primary btn-sm" onClick={() => update(o, { stage: 'logistics', qcOutcome: 'pass' }, 'Quality check passed: furniture as listed.')}><Icon name="check" size={15} />As listed</button>
                        <button className="btn btn-quiet btn-sm" onClick={() => update(o, { qcOutcome: 'mismatch' })}>Below listing</button>
                        <button className="btn btn-danger btn-sm" onClick={() => update(o, { stage: 'cancelled', qcOutcome: 'fraud' }, 'The furniture did not match the listing at all. Order cancelled and the deposit returned to the buyer (demo).')}>Not the item</button>
                    </div> : <div className="task-reprice">
                        <label className="field"><span>New price for actual condition</span>
                            <div className="money-input"><i>$</i><input type="number" min="1" step="1" inputMode="numeric" value={prices[o.id] || ''} placeholder={String(Math.round(o.price * 0.8))} onChange={e => setPrices({ ...prices, [o.id]: e.target.value })} /></div>
                        </label>
                        <div className="task-actions">
                            <button className="btn btn-primary btn-sm" disabled={!(Number(prices[o.id]) > 0)} onClick={() => update(o, { stage: 'renegotiate', newPrice: Number(prices[o.id]) }, 'Quality below the listing. A new price of ' + money(Number(prices[o.id])) + ' (was ' + money(o.price) + ') was proposed to the buyer.')}>Propose price</button>
                            <button className="btn btn-quiet btn-sm" onClick={() => update(o, { qcOutcome: undefined })}>Cancel</button>
                        </div>
                    </div>}
                </Card>)}
            </Column>

            <Column title="Pickup and delivery" icon="calendar" count={logistics.length} empty="Nothing to schedule.">
                {logistics.map(o => <Card o={o} key={o.id}>
                    <p>Collect {o.pickup} at {o.pickupPlace}. Store over break if needed. Deliver {o.dropoff} to {o.dropoffPlace}.</p>
                    <div className="task-actions"><button className="btn btn-primary btn-sm" onClick={() => update(o, { stage: 'transit' }, 'Pickup and delivery scheduled: ' + o.pickup + ' at ' + o.pickupPlace + ', delivery ' + o.dropoff + ' at ' + o.dropoffPlace + '.')}><Icon name="truck" size={15} />Schedule</button></div>
                </Card>)}
            </Column>

            <Column title="On the way" icon="truck" count={transit.length} empty="Nothing on the truck.">
                {transit.map(o => <Card o={o} key={o.id}>
                    <p>Delivering to {o.dropoffPlace} on {o.dropoff}.</p>
                    <div className="task-actions"><button className="btn btn-primary btn-sm" onClick={() => update(o, { stage: 'delivered' }, 'Furniture delivered to ' + o.dropoffPlace + '. Waiting for the buyer to pay the balance.')}>Mark delivered</button></div>
                </Card>)}
            </Column>
        </div>

        <div className="admin-lists">
            <section>
                <h2>Waiting on buyer or seller <span>{watching.length}</span></h2>
                {watching.length === 0 ? <p className="col-empty">Nothing waiting.</p> : watching.map(o => <div className="row" key={o.id}><span className="ref">{o.id}</span><p>{o.summary}</p><span className={pillFor(o.stage)}>{STAGE_LABEL[o.stage]}</span></div>)}
            </section>
            <section>
                <h2>Closed <span>{closed.length}</span></h2>
                {closed.length === 0 ? <p className="col-empty">No closed orders yet.</p> : closed.map(o => <div className="row" key={o.id}><span className="ref">{o.id}</span><p>{o.summary}</p><span className={pillFor(o.stage)}>{STAGE_LABEL[o.stage]}</span></div>)}
            </section>
        </div>
        <DemoNote>Same browser storage as the buyer and seller views. Open an order in another tab to watch it update.</DemoNote>
    </div>;
}
