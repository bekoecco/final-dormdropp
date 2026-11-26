import React from 'react';

/* Hash routing so the app works on GitHub Pages. */

const RouteCtx = React.createContext<string>('/');
const currentPath = () => '/' + window.location.hash.replace(/^#\/?/, '').split('?')[0];
export const hrefFor = (to: string) => '#' + to.replace(/^\//, '');

export function Router({ children }: { children: React.ReactNode }) {
    const [path, setPath] = React.useState(currentPath());
    React.useEffect(() => {
        const on = () => { setPath(currentPath()); window.scrollTo({ top: 0 }); };
        window.addEventListener('hashchange', on);
        return () => window.removeEventListener('hashchange', on);
    }, []);
    return <RouteCtx.Provider value={path}>{children}</RouteCtx.Provider>;
}

export const usePath = () => React.useContext(RouteCtx);

export function Link({ to, children, ...rest }: { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <a href={hrefFor(to)} {...rest}>{children}</a>;
}

/* localStorage-backed state, shared across components on the same page via a custom event. */
const EVT = 'dd-store';
export function useLocalState<T>(key: string, initial: T): [T, (v: T) => void] {
    const read = (): T => {
        try { const raw = window.localStorage.getItem(key); if (raw) return JSON.parse(raw) as T; } catch { /* ignore */ }
        return initial;
    };
    const [val, setVal] = React.useState<T>(read);
    React.useEffect(() => {
        const on = (e: Event) => { if ((e as CustomEvent).detail === key) setVal(read()); };
        const onStorage = (e: StorageEvent) => { if (e.key === key) setVal(read()); };
        window.addEventListener(EVT, on);
        window.addEventListener('storage', onStorage);
        return () => { window.removeEventListener(EVT, on); window.removeEventListener('storage', onStorage); };
    }, [key]);
    const set = (v: T) => {
        setVal(v);
        try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
        window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
    };
    return [val, set];
}

export const MARKET_KEY = 'dormdropp.market.v3';
export const CURRENT_KEY = 'dormdropp.current-order.v3';
export const ROOMSET_KEY = 'dormdropp.room-set.v3';
