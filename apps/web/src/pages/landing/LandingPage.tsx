import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SilkCanvas } from '../../components/three/SilkCanvas';

const ACTS = [
    {
        no: '01',
        title: 'İlham',
        desc: 'Ürün müdürleri için fikir stüdyosu. Sezon, pazar ve marka DNA\'sından kapsül koleksiyon konseptleri: hikâye, palet, kilit parçalar.',
        to: '/ilham',
        cta: 'Fikir Stüdyosu',
    },
    {
        no: '02',
        title: 'Kesim',
        desc: 'Koleksiyon planı, SKU hedefleri, kumaş ve maliyet. Strateji ile tasarım aynı masada; her parça bütçesiyle birlikte doğar.',
        to: '/login',
        cta: 'Koleksiyon Masası',
    },
    {
        no: '03',
        title: 'Prova',
        desc: 'Üç boyutlu atölye. Koleksiyonunuzu kumaş kartelaları ve siluetlerle sanal bir showroomda inceleyin — dikişten önce görün.',
        to: '/atelier',
        cta: '3D Atölye',
    },
    {
        no: '04',
        title: 'Defile',
        desc: 'Her kapsül için saniyeler içinde üretilen koleksiyon filmi. Satış ekibine, showroom ekranına, sosyal medyaya hazır.',
        to: '/defile',
        cta: 'Koleksiyon Filmi',
    },
];

const HOUSES = [
    { name: 'Terzilik Evleri', note: 'Sarar geleneğinde klasik erkek terziliği' },
    { name: 'Lüks Moda Evleri', note: 'Vakko ölçeğinde çok kategorili koleksiyonlar' },
    { name: 'Modern Markalar', note: 'Ramsey çizgisinde smart-casual seriler' },
];

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                    io.disconnect();
                }
            },
            { threshold: 0.2 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div ref={ref} className={`maison-reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
            {children}
        </div>
    );
}

function HeroWords({ text, startDelay = 300 }: { text: string; startDelay?: number }) {
    return (
        <>
            {text.split(' ').map((word, i) => (
                <span key={i} className="maison-word" style={{ animationDelay: `${startDelay + i * 140}ms` }}>
                    {word}{' '}
                </span>
            ))}
        </>
    );
}

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-ink text-ivory min-h-screen">
            {/* NAV */}
            <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-12 py-5 bg-gradient-to-b from-ink/90 to-transparent">
                <Link to="/landing" className="font-display text-2xl tracking-[0.25em] text-ivory">
                    MAISON
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-xs tracking-luxe uppercase text-taupe">
                    <Link to="/ilham" className="hover:text-champagne transition-colors">İlham</Link>
                    <Link to="/atelier" className="hover:text-champagne transition-colors">Atölye</Link>
                    <Link to="/defile" className="hover:text-champagne transition-colors">Defile</Link>
                    <Link to="/login" className="text-ivory border border-seam hover:border-champagne px-5 py-2 transition-colors">
                        Giriş
                    </Link>
                </nav>
                <Link to="/login" className="md:hidden text-xs tracking-luxe uppercase text-ivory border border-seam px-4 py-2">
                    Giriş
                </Link>
            </header>

            {/* HERO */}
            <section className="relative h-screen overflow-hidden">
                <SilkCanvas className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40 pointer-events-none" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <p className="maison-word text-[11px] tracking-luxe uppercase text-champagne mb-8" style={{ animationDelay: '100ms' }}>
                        Fashion Intelligence Atelier
                    </p>
                    <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-4xl">
                        <HeroWords text="İlhamdan" startDelay={350} />
                        <em className="text-champagne"><HeroWords text="defileye," startDelay={550} /></em>
                        <br />
                        <HeroWords text="tek atölye." startDelay={800} />
                    </h1>
                    <p className="maison-word mt-8 max-w-xl text-sm md:text-base text-taupe leading-relaxed" style={{ animationDelay: '1400ms' }}>
                        MAISON, moda evlerinin koleksiyon geliştirme sürecini yapay zekâ ile hızlandırır:
                        tasarımcıya üç boyutlu bir prova odası, ürün müdürüne tükenmeyen bir fikir defteri.
                    </p>
                    <div className="maison-word mt-12 flex flex-col sm:flex-row gap-4" style={{ animationDelay: '1700ms' }}>
                        <button
                            onClick={() => navigate('/atelier')}
                            className="px-10 py-3.5 bg-ivory text-ink text-xs tracking-luxe uppercase hover:bg-champagne transition-colors"
                        >
                            Atölyeyi Deneyin
                        </button>
                        <button
                            onClick={() => navigate('/defile')}
                            className="px-10 py-3.5 border border-seam text-ivory text-xs tracking-luxe uppercase hover:border-champagne hover:text-champagne transition-colors"
                        >
                            Defileyi İzleyin
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
                    <span className="text-[10px] tracking-luxe uppercase text-taupe">Koleksiyonun hikâyesi</span>
                    <div className="w-px h-10 bg-champagne/60 maison-thread" style={{ animationDelay: '2200ms' }} />
                </div>
            </section>

            {/* MANIFESTO */}
            <section className="relative px-6 md:px-12 py-32 md:py-44 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-12 gap-10 items-start">
                    <Reveal className="md:col-span-8">
                        <p className="font-display font-light text-3xl md:text-5xl leading-snug">
                            Bir koleksiyon dört provadan geçer.
                            <span className="text-taupe"> MAISON, dördünü de aynı masaya getirir — </span>
                            fikir, plan, prova ve sahne.
                        </p>
                    </Reveal>
                    <Reveal className="md:col-span-4 md:pt-4" delay={200}>
                        <div className="font-mono text-[11px] leading-loose text-taupe border-l border-seam pl-6">
                            <p>MODÜL — 11</p>
                            <p>DİL — TR / EN</p>
                            <p>SEZON TAKVİMİ — İSTANBUL · MİLANO · PARİS</p>
                            <p>YZ SAĞLAYICI — GEMINI · GPT · CLAUDE</p>
                            <p>MALİYET — TRY · EUR · USD, KDV DAHİL</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* FOUR ACTS */}
            <section className="px-6 md:px-12 pb-32 max-w-6xl mx-auto">
                <Reveal>
                    <p className="text-[11px] tracking-luxe uppercase text-champagne mb-14">Atölyenin Dört Provası</p>
                </Reveal>
                <div className="space-y-0">
                    {ACTS.map((act, i) => (
                        <Reveal key={act.no} delay={i * 100}>
                            <Link
                                to={act.to}
                                className="group grid md:grid-cols-12 gap-4 md:gap-8 items-baseline border-t border-seam py-10 md:py-12 hover:bg-carbon/50 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
                            >
                                <span className="md:col-span-1 font-mono text-xs text-taupe">{act.no}</span>
                                <h3 className="md:col-span-3 font-display font-light text-4xl md:text-5xl group-hover:text-champagne transition-colors">
                                    {act.title}
                                </h3>
                                <p className="md:col-span-6 text-sm text-taupe leading-relaxed max-w-lg">{act.desc}</p>
                                <span className="md:col-span-2 text-right text-[11px] tracking-luxe uppercase text-ivory/70 group-hover:text-champagne transition-colors">
                                    {act.cta} →
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                    <div className="border-t border-seam" />
                </div>
            </section>

            {/* HOUSES */}
            <section className="relative px-6 md:px-12 py-32 bg-carbon border-y border-seam">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <p className="text-[11px] tracking-luxe uppercase text-champagne mb-10">Kimin İçin</p>
                        <p className="font-display font-light text-3xl md:text-4xl leading-snug max-w-3xl mb-16">
                            Türk terzilik geleneğinden global vitrine —
                            <span className="text-taupe"> her ölçekte moda evi için tasarlandı.</span>
                        </p>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-px bg-seam">
                        {HOUSES.map((h, i) => (
                            <Reveal key={h.name} delay={i * 120}>
                                <div className="bg-carbon p-8 h-full">
                                    <h4 className="font-display text-2xl mb-3">{h.name}</h4>
                                    <p className="text-xs text-taupe leading-relaxed">{h.note}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 md:px-12 py-32 md:py-40 text-center">
                <Reveal>
                    <p className="font-display font-light text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
                        Bir sonraki sezonunuz,
                        <em className="text-champagne"> bu atölyede</em> başlasın.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/register')}
                            className="px-12 py-4 bg-champagne text-ink text-xs tracking-luxe uppercase hover:bg-ivory transition-colors"
                        >
                            Atölyeye Katılın
                        </button>
                        <button
                            onClick={() => navigate('/ilham')}
                            className="px-12 py-4 border border-seam text-ivory text-xs tracking-luxe uppercase hover:border-champagne hover:text-champagne transition-colors"
                        >
                            Önce Bir Fikir Alın
                        </button>
                    </div>
                </Reveal>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-seam px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-luxe uppercase text-taupe">
                <span className="font-display text-base tracking-[0.25em] text-ivory normal-case">MAISON</span>
                <span>Fashion Intelligence Atelier — YZ Koleksiyon</span>
                <span>© {new Date().getFullYear()}</span>
            </footer>
        </div>
    );
}
