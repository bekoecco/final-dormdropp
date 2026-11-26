import { Link } from './router';
import { ADDONS } from './data';
import { money } from './market';
import { Icon } from './icons';
import { FeedbackCard, PageHead } from './components';
import { DeliverScene, HeroScene, ListScene, MatchScene, MoveInScene, PackScene, PickupScene, QualityScene, RoomSetScene, StorageScene } from './scenes';

function HeroArt() {
    return <div className="hero-art">
        <HeroScene />
        <div className="hp-card hp-float hp-qc" aria-hidden="true"><Icon name="shield" size={18} /><div><b>Quality check passed</b><small>Matches photos and listing</small></div></div>
        <div className="hp-card hp-float hp-pay" aria-hidden="true"><Icon name="wallet" size={18} /><div><b>Seller payout $85</b><small>Released on delivery</small></div></div>
    </div>;
}

const JOURNEY = [
    { Art: PackScene, t: 'Pack', d: 'Box it up, or add packing help' },
    { Art: PickupScene, t: 'Pick up', d: 'We collect at move-out' },
    { Art: StorageScene, t: 'Store', d: 'Safe over winter break' },
    { Art: DeliverScene, t: 'Deliver', d: 'Right to the new room' },
    { Art: MoveInScene, t: 'Move in', d: 'Furnished from day one' },
];

export function Home() {
    return <div className="home">
        <section className="hero">
            <div className="hero-copy">
                <p className="eyebrow">Student furniture marketplace · Chicago campuses</p>
                <h1>Move out lighter.<br /><span>Move in furnished.</span></h1>
                <p className="lede">Students moving out pass their furniture to students moving in. We check every piece, then handle pickup, storage, delivery and the payout.</p>
                <div className="role-cards">
                    <Link to="/buy" className="role-card role-buy">
                        <span className="role-ico"><Icon name="search" size={22} /></span>
                        <span><b>I need furniture</b><small>Request pieces, pick a seller offer</small></span>
                        <Icon name="arrow" size={18} className="role-arr" />
                    </Link>
                    <Link to="/sell" className="role-card role-sell">
                        <span className="role-ico"><Icon name="tag" size={22} /></span>
                        <span><b>I'm moving out</b><small>List what you're leaving, get paid</small></span>
                        <Icon name="arrow" size={18} className="role-arr" />
                    </Link>
                </div>
                <ul className="hero-points">
                    <li><Icon name="shield" size={16} />Every piece quality-checked</li>
                    <li><Icon name="truck" size={16} />Pickup and delivery included</li>
                    <li><Icon name="tag" size={16} />Up to 60% under retail</li>
                </ul>
            </div>
            <HeroArt />
        </section>

        <section className="band">
            <div className="band-head">
                <p className="eyebrow">How a trade goes</p>
                <h2>Four steps, and you never haul a thing.</h2>
            </div>
            <ol className="howsteps">
                <li><div className="step-art"><ListScene /></div><span>1</span><h3>Request or list</h3><p>Buyers say what they need and see an instant estimate. Sellers list pieces with photos and condition.</p></li>
                <li><div className="step-art"><MatchScene /></div><span>2</span><h3>Match and deposit</h3><p>The buyer picks one seller offer and holds it with a 20% deposit. The seller confirms pickup.</p></li>
                <li><div className="step-art"><QualityScene /></div><span>3</span><h3>Quality check</h3><p>We compare each piece with its listing. If it's off, the price is renegotiated or the deposit comes back.</p></li>
                <li><div className="step-art"><PickupScene /></div><span>4</span><h3>Pickup to delivery</h3><p>We collect at move-out, store over break if needed, and deliver. Buyer pays the balance, seller gets paid.</p></li>
            </ol>
        </section>

        <section className="journey">
            <div className="band-head">
                <p className="eyebrow">Move-out to move-in</p>
                <h2>Your furniture's winter break.</h2>
                <p className="lede">Pieces leave one room in December and arrive in another in January. We carry, store and deliver everything in between.</p>
            </div>
            <ol className="journey-track">
                {JOURNEY.map(({ Art, t, d }, i) => <li key={t}>
                    <div className="journey-art"><Art /></div>
                    <p className="journey-n">{i + 1}</p>
                    <h3>{t}</h3>
                    <p>{d}</p>
                </li>)}
            </ol>
        </section>

        <Link to="/room-sets" className="roomband">
            <div>
                <span className="tag-new">New · Room sets</span>
                <h2>Your whole room, one better price.</h2>
                <p>Sell everything in your room as one discounted set, or move into a fully furnished room from one student.</p>
                <span className="textlink">Explore room sets<Icon name="arrow" size={16} /></span>
            </div>
            <div className="roomband-art"><RoomSetScene /></div>
        </Link>

        <section className="section-lg">
            <div className="band-head">
                <p className="eyebrow">Moving add-ons</p>
                <h2>More than furniture.</h2>
                <p className="lede">Full-service mover extras, priced for a student budget. Add them when you check out.</p>
            </div>
            <div className="addons">
                {ADDONS.map(a => <div className="addon" key={a.id}>
                    <span className="addon-ico"><Icon name={a.icon} size={20} /></span>
                    <h3>{a.name}</h3>
                    <p>{a.detail}</p>
                    <span className="addon-price">from {money(a.price)}</span>
                </div>)}
            </div>
        </section>

        <section className="trust">
            <div className="trust-item"><Icon name="shield" size={22} /><div><h3>Quality check protects both sides</h3><p>Buyers never pay full price for mislisted furniture. Honest sellers get a guaranteed payout once pieces pass.</p></div></div>
            <div className="trust-item"><Icon name="wallet" size={22} /><div><h3>Money moves through us</h3><p>No cash handoffs, no haggling with strangers. Deposits are held and returned if a deal falls through.</p></div></div>
            <div className="trust-item"><Icon name="calendar" size={22} /><div><h3>Built around semesters</h3><p>Collect in December move-out week, deliver in January move-in week, with storage in between.</p></div></div>
        </section>

        <div className="quicklinks">
            <Link to="/orders" className="quicklink"><Icon name="list" size={18} /><span><b>My orders</b><small>See where each order stands</small></span><Icon name="arrow" size={16} /></Link>
            <Link to="/how-it-works" className="quicklink"><Icon name="spark" size={18} /><span><b>How it works</b><small>Buyer, seller and platform roles</small></span><Icon name="arrow" size={16} /></Link>
            <Link to="/admin" className="quicklink"><Icon name="shield" size={18} /><span><b>Admin view</b><small>Run the platform side of the demo</small></span><Icon name="arrow" size={16} /></Link>
        </div>

        <FeedbackCard />
    </div>;
}

export function HowItWorks() {
    const roles = [
        { icon: 'search', name: 'Buyer', Art: MoveInScene, rows: [
            ['Request', 'Say which pieces you need, preferred colors, and when and where to deliver. You see an estimated price right away.'],
            ['Offer and deposit', 'Pick one seller offer and hold it with a 20% deposit.'],
            ['Delivery', 'Receive the furniture and pay the remaining balance.'],
        ] },
        { icon: 'tag', name: 'Seller', Art: PackScene, rows: [
            ['List', 'Add your furniture with details, photos, condition, and a pickup date and place.'],
            ['Confirm', 'Confirm the order and pickup once a buyer commits.'],
            ['Payout', 'Get 90% of the sale price once the furniture is delivered.'],
        ] },
        { icon: 'shield', name: 'DormDropp', Art: QualityScene, rows: [
            ['Quality check', 'Every piece is compared with its listing, digitally and in person.'],
            ['If something is off', 'Below the listed condition, the buyer gets a lower price to accept or decline. Not the real thing, the order is cancelled and the deposit returned.'],
            ['Moving', 'We pick up, store between semesters if needed, and deliver.'],
        ] },
    ];
    return <div>
        <PageHead eyebrow="How it works" title="A managed marketplace" back="/"
            lede="Buyers and sellers never handle logistics or money directly. DormDropp sits in the middle, checks quality, and moves both the furniture and the payment." />
        <div className="roles">
            {roles.map(r => <div className="role" key={r.name}>
                <div className="role-art"><r.Art /></div>
                <div className="role-top"><span className="role-ico"><Icon name={r.icon} size={18} /></span><h2>{r.name}</h2></div>
                <ol>{r.rows.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ol>
            </div>)}
        </div>
        <div className="money-split">
            <h2>Where the money goes</h2>
            <div className="split-bar" aria-hidden="true"><span style={{ width: '90%' }}>Seller 90%</span><span>10%</span></div>
            <p>On a $100 sale, the seller receives $90 and DormDropp keeps $10 for the quality check and handling. Delivery ($29) and any add-ons are paid by the buyer. Demo figures, not quotes.</p>
        </div>
        <FeedbackCard />
    </div>;
}
