import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@remotion/player';
import { CAPSULES, Capsule, getActiveCapsule, setActiveCapsule } from '../../lib/atelier';
import { CollectionFilm, FILM_FPS, filmDuration } from '../../remotion/CollectionFilm';
import { StudioHeader } from '../../components/layout/StudioHeader';

export default function DefilePage() {
    const navigate = useNavigate();
    const [capsule, setCapsule] = useState<Capsule>(() => getActiveCapsule());

    const durationInFrames = useMemo(() => filmDuration(capsule), [capsule]);
    const seconds = Math.round(durationInFrames / FILM_FPS);

    const switchCapsule = (c: Capsule) => {
        setCapsule(c);
        setActiveCapsule(c);
    };

    return (
        <div className="min-h-screen bg-ink text-ivory">
            <StudioHeader subtitle="Defile — Koleksiyon Filmi" />

            <main className="pt-24 pb-16 px-5 md:px-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
                {/* PLAYER */}
                <section className="lg:col-span-8">
                    <div className="border border-seam bg-carbon">
                        <Player
                            key={capsule.id}
                            component={CollectionFilm}
                            inputProps={{ capsule }}
                            durationInFrames={durationInFrames}
                            fps={FILM_FPS}
                            compositionWidth={1280}
                            compositionHeight={720}
                            controls
                            loop
                            autoPlay
                            acknowledgeRemotionLicense
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-4 font-mono text-[10px] tracking-luxe text-taupe uppercase">
                        <span>1280 × 720 — {FILM_FPS} FPS — {seconds} SN</span>
                        <span>REMOTION İLE KARE KARE ÜRETİLDİ</span>
                    </div>
                </section>

                {/* SIDE PANEL */}
                <aside className="lg:col-span-4 space-y-8">
                    <div>
                        <p className="text-[11px] tracking-luxe uppercase text-champagne mb-4">Kapsül Seçin</p>
                        <div className="space-y-px bg-seam border border-seam">
                            {CAPSULES.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => switchCapsule(c)}
                                    className={`w-full text-left p-5 transition-colors ${
                                        capsule.id === c.id ? 'bg-carbon' : 'bg-ink hover:bg-carbon/60'
                                    }`}
                                >
                                    <div className="flex items-baseline justify-between">
                                        <span className={`font-display text-2xl font-light ${capsule.id === c.id ? 'text-champagne' : 'text-ivory'}`}>
                                            {c.title}
                                        </span>
                                        <span className="font-mono text-[10px] text-taupe">{c.looks.length} LOOK</span>
                                    </div>
                                    <p className="font-mono text-[10px] tracking-luxe text-taupe mt-1">{c.season}</p>
                                    <div className="flex gap-1.5 mt-3">
                                        {c.palette.map((hex) => (
                                            <span key={hex} className="w-4 h-4 border border-seam" style={{ background: hex }} />
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border border-seam p-5">
                        <p className="text-[11px] tracking-luxe uppercase text-champagne mb-3">Bu Film Nasıl Üretildi</p>
                        <p className="text-xs text-taupe leading-relaxed">
                            Koleksiyon verisi — look isimleri, kumaşlar, sezon paleti — MAISON tarafından
                            otomatik olarak sinematik bir kurguya dönüştürülür. Kapsülü değiştirin;
                            film saniyeler içinde yeniden kurgulanır. Aynı kompozisyon, sunucu tarafında
                            4K MP4 olarak da render alınabilir.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => { setActiveCapsule(capsule); navigate('/atelier'); }}
                            className="w-full py-3.5 border border-seam text-ivory text-[10px] tracking-luxe uppercase hover:border-champagne hover:text-champagne transition-colors"
                        >
                            Bu Kapsülü 3D Atölyede Aç
                        </button>
                        <button
                            onClick={() => navigate('/ilham')}
                            className="w-full py-3.5 border border-seam text-ivory text-[10px] tracking-luxe uppercase hover:border-champagne hover:text-champagne transition-colors"
                        >
                            Yeni Kapsül Fikri Üret
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}
