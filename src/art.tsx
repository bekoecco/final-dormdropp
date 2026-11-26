import * as Sc from './scenes';
import { PageHead } from './components';

export function ArtGallery() {
    const items = Object.entries(Sc) as [string, () => JSX.Element][];
    return <div>
        <PageHead eyebrow="Illustrations" title="Crayon set" back="/" />
        <div className="art-grid">{items.map(([n, Comp]) => <figure key={n}><Comp /><figcaption>{n.replace('Scene', '')}</figcaption></figure>)}</div>
    </div>;
}
