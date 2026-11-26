import React from 'react';
import { usePath } from './router';
import { Shell } from './components';
import { Home, HowItWorks } from './home';
import { BuyFlow } from './buy';
import { SellFlow } from './sell';
import { OrderDetail, OrdersHub } from './orders';
import { RoomSets } from './roomsets';
import { AdminView } from './admin';
import { ArtGallery } from './art';

const ROUTES: Record<string, [string, () => React.ReactElement | null]> = {
    '/': ['Move out lighter. Move in furnished.', Home],
    '/buy': ['Buy furniture', BuyFlow],
    '/sell': ['Sell furniture', SellFlow],
    '/room-sets': ['Room sets', RoomSets],
    '/orders': ['My orders', OrdersHub],
    '/order': ['Order', OrderDetail],
    '/how-it-works': ['How it works', HowItWorks],
    '/admin': ['Admin', AdminView],
    '/art': ['Illustrations', ArtGallery],
};

export function App() {
    const path = usePath();
    const [title, Page] = ROUTES[path] || ROUTES['/'];
    React.useEffect(() => { document.title = 'DormDropp · ' + title; }, [title]);
    return <Shell><div className="route" key={path}><Page /></div></Shell>;
}
