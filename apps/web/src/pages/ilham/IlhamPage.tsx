import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { setActiveCapsule } from '../../lib/atelier';
import {
    CapsuleConcept, IdeaInput, Season, Segment,
    conceptToCapsule, generateConcepts,
} from '../../lib/ideaEngine';
import { StudioHeader } from '../../components/layout/StudioHeader';

const SEASONS: Season[] = ['İlkbahar–Yaz', 'Sonbahar–Kış', 'Resort'];
const SEGMENTS: Segment[] = ['Terzilik Evi', 'Lüks Moda Evi', 'Modern Smart-Casual', 'Kadın Lüks'];

interface TrendNotes {
    baslik?: string;
    ozet?: string;
    anahtarKelimeler?: string[];
    kumasSonerileri?: { malzeme: string; tedarikMerkezi: string; neden: string }[];
}

export default function IlhamPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState<IdeaInput>({
        season: 'Sonbahar–Kış',
        year: 2026,
        segment: 'Terzilik Evi',
        mood: '',
    });
    const [concepts, setConcepts] = useState<CapsuleConcept[]>([]);
    const [generating, setGenerating] = useState(false);
    const [aiNotes, setAiNotes] = useState<TrendNotes | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const hasToken = Boolean(localStorage.getItem('token'));

    const generate = () => {
        setGenerating(true);
        setAiNotes(null);
        setAiError(null);
        // small delay so the reveal reads as a considered act, not a flicker
        setTimeout(() => {
            setConcepts(generateConcepts(input));
            setGenerating(false);
        }, 450);
    };

    const deepen = async () => {
        setAiLoading(true);
        setAiError(null);
        try {
            const query = `${input.season} ${input.year} — ${input.segment}${input.mood ? ` — ${input.mood}` : ''}`;
            const res = await api.post<TrendNotes>('/trend/generate', { query });
            setAiNotes(res);
        } catch {
            setAiError('YZ raporu alınamadı. API bağlantısını ve ayarlardaki sağlayıcı anahtarınızı kontrol edin.');
        } finally {
            setAiLoading(false);
        }
    };

    const openIn = (concept: CapsuleConcept, path: '/atelier' | '/defile') => {
        setActiveCapsule(conceptToCapsule(concept));
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-ink text-ivory">
            <StudioHeader subtitle="İlham — Fikir Stüdyosu" />

            <main className="pt-28 pb-20 px-5 md:px-10 max-w-6xl mx-auto">
                <div className="max-w-2xl mb-14">
                    <p className="text-[11px] tracking-luxe uppercase text-champagne mb-4">Ürün Müdürünün Defteri</p>
                    <h1 className="font-display font-light text-4xl md:text-5xl leading-tight">
                        Bir sonraki kapsülün <em className="text-champagne">ilk cümlesi.</em>
                    </h1>
                    <p className="text-sm text-taupe leading-relaxed mt-5">
                        Sezonu, pazarı ve aradığınız duyguyu söyleyin; MAISON size hikâyesi, paleti ve
                        kilit parçalarıyla üç kapsül konsepti çıkarsın. Beğendiğinizi tek tıkla 3D atölyede
                        inceleyin ya da defile filmini izleyin.
                    </p>
                </div>

                {/* CONTROLS */}
                <div className="grid md:grid-cols-12 gap-px bg-seam border border-seam mb-6">
                    <div className="md:col-span-3 bg-ink p-5">
                        <label className="block text-[10px] tracking-luxe uppercase text-taupe mb-3">Sezon</label>
                        <div className="space-y-1">
                            {SEASONS.map((s) => (
                                <button key={s} onClick={() => setInput({ ...input, season: s })}
                                    className={`block w-full text-left px-3 py-2 text-xs transition-colors ${input.season === s ? 'bg-carbon text-champagne' : 'text-ivory/70 hover:text-ivory'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-ink p-5">
                        <label className="block text-[10px] tracking-luxe uppercase text-taupe mb-3">Yıl</label>
                        <div className="space-y-1">
                            {[2026, 2027, 2028].map((y) => (
                                <button key={y} onClick={() => setInput({ ...input, year: y })}
                                    className={`block w-full text-left px-3 py-2 text-xs font-mono transition-colors ${input.year === y ? 'bg-carbon text-champagne' : 'text-ivory/70 hover:text-ivory'}`}>
                                    {y}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-3 bg-ink p-5">
                        <label className="block text-[10px] tracking-luxe uppercase text-taupe mb-3">Marka DNA'sı</label>
                        <div className="space-y-1">
                            {SEGMENTS.map((s) => (
                                <button key={s} onClick={() => setInput({ ...input, segment: s })}
                                    className={`block w-full text-left px-3 py-2 text-xs transition-colors ${input.segment === s ? 'bg-carbon text-champagne' : 'text-ivory/70 hover:text-ivory'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-4 bg-ink p-5 flex flex-col">
                        <label className="block text-[10px] tracking-luxe uppercase text-taupe mb-3">Duygu / Mood (virgülle)</label>
                        <textarea
                            value={input.mood}
                            onChange={(e) => setInput({ ...input, mood: e.target.value })}
                            placeholder="örn. arşiv, sessiz lüks, akdeniz ışığı"
                            className="flex-1 min-h-[88px] bg-carbon border border-seam p-3 text-xs text-ivory placeholder:text-taupe/50 focus:border-champagne focus:outline-none resize-none"
                        />
                        <button
                            onClick={generate}
                            disabled={generating}
                            className="mt-4 py-3.5 bg-champagne text-ink text-[10px] tracking-luxe uppercase hover:bg-ivory transition-colors disabled:opacity-60"
                        >
                            {generating ? 'Kapsüller çiziliyor…' : 'Üç Kapsül Konsepti Üret'}
                        </button>
                    </div>
                </div>

                {/* AI DEEPEN */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-16">
                    <button
                        onClick={deepen}
                        disabled={!hasToken || aiLoading}
                        title={hasToken ? undefined : 'YZ trend raporu için giriş yapın'}
                        className="px-6 py-3 border border-seam text-[10px] tracking-luxe uppercase transition-colors disabled:opacity-40 enabled:hover:border-champagne enabled:hover:text-champagne"
                    >
                        {aiLoading ? 'Trend masası çalışıyor…' : 'YZ ile Derinleştir — Trend Raporu'}
                    </button>
                    <span className="text-[10px] text-taupe tracking-wide">
                        {hasToken
                            ? 'Bağlı YZ sağlayıcınız (Gemini / GPT / Claude) ile Türk pazarına özel rapor üretir.'
                            : 'Trend raporu için atölyeye giriş yapmanız gerekir; konsept üretimi girişsiz çalışır.'}
                    </span>
                </div>

                {aiError && <p className="text-xs text-red-400/80 mb-10 font-mono">{aiError}</p>}

                {aiNotes && (
                    <div className="border border-champagne/40 bg-carbon p-6 mb-16">
                        <p className="text-[10px] tracking-luxe uppercase text-champagne mb-3">YZ Trend Masası — {aiNotes.baslik}</p>
                        <p className="text-sm text-ivory/85 leading-relaxed mb-4">{aiNotes.ozet}</p>
                        {aiNotes.anahtarKelimeler && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {aiNotes.anahtarKelimeler.map((k) => (
                                    <span key={k} className="font-mono text-[10px] border border-seam px-2.5 py-1 text-taupe">{k}</span>
                                ))}
                            </div>
                        )}
                        {aiNotes.kumasSonerileri && (
                            <div className="grid md:grid-cols-3 gap-4">
                                {aiNotes.kumasSonerileri.slice(0, 3).map((f) => (
                                    <div key={f.malzeme} className="text-xs text-taupe">
                                        <span className="text-ivory">{f.malzeme}</span> — {f.tedarikMerkezi}
                                        <p className="mt-1 leading-relaxed">{f.neden}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* CONCEPTS */}
                {concepts.length > 0 && (
                    <div className="grid lg:grid-cols-3 gap-px bg-seam border border-seam">
                        {concepts.map((c, i) => (
                            <article key={c.id} className="bg-ink p-7 flex flex-col maison-reveal is-visible" style={{ animationDelay: `${i * 150}ms` }}>
                                <p className="font-mono text-[10px] tracking-luxe text-champagne mb-2">
                                    KONSEPT {String(i + 1).padStart(2, '0')} — {c.season}
                                </p>
                                <h2 className="font-display font-light text-4xl mb-4">{c.title}</h2>
                                <p className="text-xs text-taupe leading-relaxed mb-5">{c.story}</p>

                                <div className="flex h-8 mb-5">
                                    {c.palette.map((hex) => (
                                        <span key={hex} className="flex-1" style={{ background: hex }} title={hex} />
                                    ))}
                                </div>

                                <ul className="space-y-2.5 mb-6 flex-1">
                                    {c.keyPieces.map((piece) => (
                                        <li key={piece.name + piece.category} className="flex items-baseline justify-between gap-3 border-b border-seam/60 pb-2">
                                            <span className="text-xs text-ivory">{piece.category}</span>
                                            <span className="font-mono text-[10px] text-taupe text-right">{piece.fabric}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => openIn(c, '/atelier')}
                                        className="py-3 border border-seam text-[10px] tracking-luxe uppercase hover:border-champagne hover:text-champagne transition-colors"
                                    >
                                        3D Atölyede Aç
                                    </button>
                                    <button
                                        onClick={() => openIn(c, '/defile')}
                                        className="py-3 bg-ivory text-ink text-[10px] tracking-luxe uppercase hover:bg-champagne transition-colors"
                                    >
                                        Defilesini İzle
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {concepts.length === 0 && !generating && (
                    <div className="border border-dashed border-seam py-24 text-center">
                        <p className="font-display font-light text-2xl text-taupe italic">Defter boş — ilk kapsülü siz açın.</p>
                        <p className="font-mono text-[10px] tracking-luxe uppercase text-taupe/60 mt-3">Sezon + DNA + Mood → Üret</p>
                    </div>
                )}
            </main>
        </div>
    );
}
