import React from 'react';
import { DELIVERY_FEE, PAYOUT_PCT } from './data';
import { EMPTY_MARKET, Market, Order, OrderStage, STAGE_LABEL, money } from './market';
import { CURRENT_KEY, Link, MARKET_KEY, useLocalState } from './router';
import { Icon } from './icons';
import { CancelScene, DeliverScene, EmptyScene, MatchScene, MoveInScene, PayoutScene, QualityScene, StorageScene } from './scenes';
import { Banner, DemoNote, PageHead } from './components';

export const pillFor = (s: OrderStage) =>
    'pill ' + (s === 'complete' ? 'pill-good' : s === 'cancelled' ? 'pill-bad' : s === 'renegotiate' || s === 'delivered' ? 'pill-act' : 'pill-wait');

const TRACK = ['Confirmed', 'Quality check', 'Scheduled', 'On the way', 'Delivered'];
const trackIndex = (s: OrderStage) =>
    ({ 'awaiting-seller': 0, quality: 1, renegotiate: 1, logistics: 2, transit: 3, delivered: 4, complete: 5, cancelled: -1 } as Record<OrderStage, number>)[s];

function Tracker({ order }: { order: Order }) {
    const idx = trackIndex(order.stage);
    if (idx < 0) return null;
    return <ol className="tracker">
        {TRACK.map((t, i) => <li key={t} className={i < idx ? 'done' : i === idx ? 'now' : ''}>
            <span className="tracker-dot">{i < idx ? <Icon name="check" size={12} /> : null}</span>
            <span className="tracker-label">{t}</span>
        </li>)}
    </ol>;
}

function StageArt({ order }: { order: Order }) {
    const s = order.stage;
    const [Art, note] =
        s === 'awaiting-seller' ? [MatchScene, order.own === 'buyer' ? 'Matched! Waiting for the seller to confirm.' : 'A buyer picked your offer.'] :
        s === 'quality' || s === 'renegotiate' ? [QualityScene, 'Checking every piece against the listing.'] :
        s === 'logistics' ? [StorageScene, 'Booking the truck and a spot in storage.'] :
        s === 'transit' ? [DeliverScene, 'On the truck and on the way.'] :
        s === 'delivered' ? [MoveInScene, 'Delivered to the new room.'] :
        s === 'complete' ? (order.own === 'seller' ? [PayoutScene, 'Paid out. Nice work.'] : [MoveInScene, 'New room, all furnished.']) :
        [CancelScene, 'This one fell through. Deposit returned.'];
    return <figure className="stage-art"><Art /><figcaption>{note}</figcaption></figure>;
}

export function OrdersHub() {
    const [market] = useLocalState<Market>(MARKET_KEY, EMPTY_MARKET);
    const [, setCurrent] = useLocalState<string>(CURRENT_KEY, '');
    const [tab, setTab] = React.useState<'orders' | 'listings'>('orders');
    const active = market.orders.filter(o => !['complete', 'cancelled'].includes(o.stage)).length;
    return <div>
        <PageHead eyebrow="Your activity" title="My orders" back="/"
            lede={market.orders.length ? active + ' active · ' + (market.orders.length - active) + ' closed' : undefined} />
        <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'orders'} className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>Orders <span>{market.orders.length}</span></button>
            <button role="tab" aria-selected={tab === 'listings'} className={tab === 'listings' ? 'on' : ''} onClick={() => setTab('listings')}>Listings <span>{market.listings.length}</span></button>
        </div>
        {tab === 'orders' && (market.orders.length === 0
            ? <Empty icon="list" title="No orders yet" text="Request furniture as a buyer, or list yours as a seller, to start one." />
            : <div className="cards">
                {market.orders.map(o => <a key={o.id} className="ordercard" href="#order" onClick={() => setCurrent(o.id)}>
                    <div className="ordercard-top">
                        <span className="ref">{o.id}</span>
                        <span className="role-chip">{o.own === 'buyer' ? 'Buying' : 'Selling'}</span>
                        <span className={pillFor(o.stage)}>{STAGE_LABEL[o.stage]}</span>
                    </div>
                    <h3>{o.summary}</h3>
                    <div className="ordercard-foot">
                        <span>{o.own === 'buyer' ? 'From ' + o.seller : 'To ' + o.buyer} · {o.dropoff}</span>
                        <strong>{money(o.price)}</strong>
                    </div>
                </a>)}
            </div>)}
        {tab === 'listings' && (market.listings.length === 0
            ? <Empty icon="tag" title="No listings yet" text="List the furniture you're leaving behind and it shows up as an offer for buyers." />
            : <div className="cards">
                {market.listings.map(l => <div className="ordercard listingcard" key={l.id}>
                    {l.photo && <img src={l.photo} alt="" />}
                    <div>
                        <div className="ordercard-top"><span className="ref">{l.id}</span><span className="pill pill-good">Live</span></div>
                        <h3>{l.items}</h3>
                        <div className="ordercard-foot"><span>{l.condition} · pickup {l.date}, {l.place}</span><strong>{money(l.payout)} payout</strong></div>
                    </div>
                </div>)}
            </div>)}
        <div className="pair">
            <Link className="btn btn-quiet" to="/buy"><Icon name="search" size={16} />Request furniture</Link>
            <Link className="btn btn-quiet" to="/sell"><Icon name="tag" size={16} />Sell furniture</Link>
        </div>
    </div>;
}

function Empty({ icon, title, text }: { icon: string; title: string; text: string }) {
    return <div className="empty" data-icon={icon}><div className="empty-art"><EmptyScene /></div><h3>{title}</h3><p>{text}</p></div>;
}

export function OrderDetail() {
    const [market, setMarket] = useLocalState<Market>(MARKET_KEY, EMPTY_MARKET);
    const [current] = useLocalState<string>(CURRENT_KEY, '');
    const order = market.orders.find(o => o.id === current) || market.orders[0];

    const remaining = order ? order.price - order.deposit + DELIVERY_FEE + (order.addonsTotal || 0) : 0;
    const payout = order ? Math.round(order.price * PAYOUT_PCT) : 0;

    const update = (patch: Partial<Order>, event?: { step: number; note: string }) => {
        if (!order) return;
        const updated: Order = { ...order, ...patch, events: event ? [...order.events, event] : order.events };
        setMarket({ ...market, orders: market.orders.map(o => o.id === order.id ? updated : o) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* The other side of the trade is simulated: a waiting order advances on its own after a short beat.
       Platform steps never advance here; they happen in the admin view. */
    const stageKey = order ? order.id + order.stage : '';
    React.useEffect(() => {
        if (!order) return;
        let t: ReturnType<typeof setTimeout> | undefined;
        if (order.own === 'buyer' && order.stage === 'awaiting-seller') {
            t = setTimeout(() => update({ stage: 'quality' }, { step: 6, note: order.seller + ' confirmed the order and pickup on ' + order.pickup + ', ' + order.pickupPlace + '.' }), 2800);
        } else if (order.own === 'seller' && order.stage === 'renegotiate') {
            t = setTimeout(() => update({ stage: 'logistics', price: order.newPrice, renegotiated: 'accepted' }, { step: 10, note: 'The buyer accepted the new price of ' + money(order.newPrice || order.price) + '.' }), 3200);
        } else if (order.own === 'seller' && order.stage === 'delivered') {
            t = setTimeout(() => update({ stage: 'complete' }, { step: 12, note: 'The buyer received the furniture and paid the remaining ' + money(remaining) + ' (demo).' }), 3200);
        }
        return () => { if (t) clearTimeout(t); };
    }, [stageKey]);

    if (!order) {
        return <div><PageHead title="No order selected" back="/orders" /><div className="empty"><div className="empty-art"><EmptyScene /></div><h3>Nothing to show</h3><p>Open an order from <Link to="/orders">My orders</Link>.</p></div></div>;
    }

    const platformText =
        order.stage === 'quality' ? 'We are checking this furniture against its listing. The outcome shows up here.' :
        order.stage === 'logistics' ? 'Quality check passed. We are scheduling pickup and delivery.' :
        order.stage === 'transit' ? 'The furniture is on the truck.' : '';

    return <div className="detail">
        <PageHead eyebrow={order.own === 'buyer' ? 'You are buying' : 'You are selling'} title={'Order ' + order.id} back="/orders"
            right={<span className={pillFor(order.stage) + ' pill-lg'}>{STAGE_LABEL[order.stage]}</span>} />
        <Tracker order={order} />

        <div className="detail-grid">
            <div className="detail-main">
                <div className="only-mobile"><StageArt order={order} /></div>
                {order.stage === 'cancelled' && <Banner tone="warn">Order cancelled{order.qcOutcome === 'fraud' ? ': the furniture did not match the listing at all' : ''}. The {money(order.deposit)} deposit was returned to the buyer (demo).</Banner>}
                {order.stage === 'complete' && <Banner tone="good">Delivered and paid. The seller received {money(payout)} ({Math.round(PAYOUT_PCT * 100)}% of {money(order.price)}). Demo only: no money moved.</Banner>}
                {order.stage === 'awaiting-seller' && order.own === 'buyer' && <Banner>Waiting for {order.seller} to confirm the order and pickup on {order.pickup}. (Demo: they confirm on their own in a moment.)</Banner>}
                {order.stage === 'renegotiate' && order.own === 'seller' && <Banner>The quality check found the furniture below the listed condition, so we proposed {money(order.newPrice || order.price)}. Waiting for the buyer. (Demo: they decide in a moment.)</Banner>}
                {order.stage === 'delivered' && order.own === 'seller' && <Banner>Delivered to {order.dropoffPlace}. Your {money(payout)} payout is released once the buyer pays the balance (demo).</Banner>}

                {order.stage === 'awaiting-seller' && order.own === 'seller' && <div className="action">
                    <p className="action-tag">Your move</p>
                    <h2>Confirm the order and pickup</h2>
                    <p>{order.buyer} chose your offer and paid a deposit. Pickup: {order.pickup}, {order.pickupPlace}.</p>
                    <button className="btn btn-primary" onClick={() => update({ stage: 'quality' }, { step: 6, note: 'You confirmed the order and pickup on ' + order.pickup + ', ' + order.pickupPlace + '.' })}>Confirm order and pickup<Icon name="arrow" size={17} /></button>
                </div>}

                {order.stage === 'renegotiate' && order.own === 'buyer' && <div className="action">
                    <p className="action-tag">Your move</p>
                    <h2>New price proposed</h2>
                    <p>The quality check found the furniture below the listed condition.</p>
                    <div className="price-change"><s>{money(order.price)}</s><Icon name="arrow" size={18} /><strong>{money(order.newPrice || order.price)}</strong></div>
                    <div className="action-row">
                        <button className="btn btn-primary" onClick={() => update({ stage: 'logistics', price: order.newPrice, renegotiated: 'accepted' }, { step: 10, note: 'You accepted the new price of ' + money(order.newPrice || order.price) + '.' })}>Accept new price</button>
                        <button className="btn btn-quiet" onClick={() => update({ stage: 'cancelled', renegotiated: 'declined' }, { step: 10, note: 'You declined the new price. Order cancelled and the deposit returned (demo).' })}>Decline and get deposit back</button>
                    </div>
                </div>}

                {order.stage === 'delivered' && order.own === 'buyer' && <div className="action">
                    <p className="action-tag">Your move</p>
                    <h2>Pay the remaining balance</h2>
                    <dl className="receipt">
                        <div><dt>Offer price</dt><dd>{money(order.price)}</dd></div>
                        <div><dt>Deposit paid</dt><dd>−{money(order.deposit)}</dd></div>
                        <div><dt>Delivery</dt><dd>{money(DELIVERY_FEE)}</dd></div>
                        {order.addonsTotal ? <div><dt>Add-ons ({order.addons})</dt><dd>{money(order.addonsTotal)}</dd></div> : null}
                        <div className="receipt-total"><dt>Balance</dt><dd>{money(remaining)}</dd></div>
                    </dl>
                    <button className="btn btn-primary" onClick={() => update({ stage: 'complete' }, { step: 12, note: 'You received the furniture and paid the remaining ' + money(remaining) + ' (demo).' })}><Icon name="wallet" size={17} />Pay {money(remaining)} (demo)</button>
                </div>}

                {platformText && <div className="action action-platform">
                    <p className="action-tag">With DormDropp</p>
                    <h2>{order.stage === 'transit' ? 'On the truck' : order.stage === 'quality' ? 'Quality check in progress' : 'Scheduling'}</h2>
                    <p>{platformText}</p>
                    <Link to="/admin" className="textlink">Run the platform side in the admin view<Icon name="arrow" size={15} /></Link>
                </div>}

                <section className="activity">
                    <h2>Activity</h2>
                    <ol>
                        {[...order.events].reverse().map((e, i) => <li key={i} className={i === 0 ? 'latest' : ''}><span /><p>{e.note}</p></li>)}
                    </ol>
                </section>
            </div>

            <aside className="detail-side">
                <div className="only-desktop"><StageArt order={order} /></div>
                <div className="summary-card">
                    <p className="summary-title">Order details</p>
                    <dl className="summary-lines">
                        <div><dt>Items</dt><dd>{order.summary}</dd></div>
                        <div><dt>{order.own === 'buyer' ? 'Seller' : 'Buyer'}</dt><dd>{order.own === 'buyer' ? order.seller : order.buyer}</dd></div>
                        <div><dt>Condition</dt><dd>{order.condition}</dd></div>
                        <div><dt>Pickup</dt><dd>{order.pickup}, {order.pickupPlace}</dd></div>
                        <div><dt>Delivery</dt><dd>{order.dropoff}, {order.dropoffPlace}</dd></div>
                        <div><dt>Deposit</dt><dd>{money(order.deposit)}</dd></div>
                        {order.addons && <div><dt>Add-ons</dt><dd>{order.addons}</dd></div>}
                    </dl>
                    <div className="summary-total"><span>{order.own === 'buyer' ? 'Price' : 'Your payout'}</span><strong>{money(order.own === 'buyer' ? order.price : payout)}</strong></div>
                </div>
            </aside>
        </div>
        <DemoNote>The other side of the trade is simulated. Nothing is scheduled or charged.</DemoNote>
    </div>;
}
