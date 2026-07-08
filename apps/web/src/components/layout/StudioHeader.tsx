import { Link, useLocation } from 'react-router-dom';

const STUDIO_LINKS = [
    { to: '/ilham', label: 'İlham' },
    { to: '/atelier', label: 'Atölye' },
    { to: '/defile', label: 'Defile' },
];

export function StudioHeader({ subtitle }: { subtitle: string }) {
    const { pathname } = useLocation();
    return (
        <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-10 py-4 bg-gradient-to-b from-ink/95 to-transparent pointer-events-none">
            <div className="flex items-baseline gap-4 pointer-events-auto">
                <Link to="/landing" className="font-display text-xl tracking-[0.25em] text-ivory hover:text-champagne transition-colors">
                    MAISON
                </Link>
                <span className="hidden sm:block text-[10px] tracking-luxe uppercase text-taupe">{subtitle}</span>
            </div>
            <nav className="flex items-center gap-5 md:gap-7 text-[11px] tracking-luxe uppercase pointer-events-auto">
                {STUDIO_LINKS.map((l) => (
                    <Link
                        key={l.to}
                        to={l.to}
                        className={`transition-colors ${pathname === l.to ? 'text-champagne' : 'text-taupe hover:text-ivory'}`}
                    >
                        {l.label}
                    </Link>
                ))}
                <Link to="/" className="hidden md:block text-ivory border border-seam hover:border-champagne px-4 py-1.5 transition-colors">
                    Panele Dön
                </Link>
            </nav>
        </header>
    );
}

export default StudioHeader;
