import React, { useState } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';

interface TrendResult {
    id?: string;
    baslik: string;
    ozet: string;
    anahtarKelimeler: string[];
    renkPaleti: { isim: string; hex: string; aciklama: string }[];
    kumasSonerileri: { malzeme: string; tedarikMerkezi: string; neden: string }[];
    kategoriOnerileri: { kategori: string; oncelik: string; aciklama: string }[];
    duyguSkoru: number;
}

const oncelikRenk: Record<string, string> = {
    YUKSEK: 'text-emerald-400',
    ORTA: 'text-amber-400',
    DUSUK: 'text-stone-400',
};

export const TrendPage = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TrendResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!query.trim()) {
            setError(TR.trend.sorguBos);
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const data = await api.post<TrendResult>('/trend/generate', { query });
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.message ?? TR.genel.hata);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-3xl font-light text-white">{TR.trend.baslik}</h2>
                <p className="text-sm text-stone-500 mt-1">{TR.trend.aciklama}</p>
            </div>

            <div className="flex gap-3 mb-8">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder={TR.trend.sorguPlaceholder}
                    className="flex-1 bg-stone-900 border border-stone-700 rounded px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded text-sm font-medium transition-colors"
                >
                    {loading ? TR.trend.olusturuluyor : TR.trend.raporOlustur}
                </button>
            </div>

            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

            {loading && (
                <div className="flex items-center gap-3 p-6 border border-blue-900/40 rounded bg-blue-900/10">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <span className="text-blue-400 text-sm">{TR.trend.olusturuluyor}</span>
                </div>
            )}

            {result && !loading && (
                <div className="space-y-6">
                    <div className="p-5 border border-stone-800 rounded bg-stone-950">
                        <h3 className="text-xs font-mono text-stone-500 uppercase mb-2">{TR.trend.ozet}</h3>
                        <h2 className="text-xl font-light text-white mb-3">{result.baslik}</h2>
                        <p className="text-stone-300 text-sm leading-relaxed">{result.ozet}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                            <span>Duygu Skoru:</span>
                            <span className={result.duyguSkoru >= 0.7 ? 'text-emerald-400' : 'text-amber-400'}>
                                {(result.duyguSkoru * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>

                    {result.anahtarKelimeler?.length > 0 && (
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-stone-500 uppercase mb-3">{TR.trend.anahtarKelimeler}</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.anahtarKelimeler.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-stone-800 rounded-full text-sm text-stone-200">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.renkPaleti?.length > 0 && (
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-stone-500 uppercase mb-3">{TR.trend.renkPaleti}</h3>
                            <div className="flex gap-3 flex-wrap">
                                {result.renkPaleti.map((renk, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-20">
                                        <div className="w-16 h-16 rounded-lg border border-stone-700"
                                            style={{ backgroundColor: renk.hex }} />
                                        <div className="text-center">
                                            <div className="text-xs text-white font-medium">{renk.isim}</div>
                                            <div className="text-xs text-stone-600">{renk.hex}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.kumasSonerileri?.length > 0 && (
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-stone-500 uppercase mb-3">{TR.trend.kumasOnerileri}</h3>
                            <div className="space-y-3">
                                {result.kumasSonerileri.map((k, i) => (
                                    <div key={i} className="flex justify-between items-start gap-4 text-sm">
                                        <div>
                                            <div className="font-medium text-white">{k.malzeme}</div>
                                            <div className="text-stone-500 text-xs mt-0.5">{k.neden}</div>
                                        </div>
                                        <div className="text-xs text-blue-400 whitespace-nowrap">
                                            📍 {k.tedarikMerkezi}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.kategoriOnerileri?.length > 0 && (
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-stone-500 uppercase mb-3">{TR.trend.kategoriOnerileri}</h3>
                            <div className="space-y-2">
                                {result.kategoriOnerileri.map((k, i) => (
                                    <div key={i} className="flex justify-between items-start text-sm">
                                        <div>
                                            <span className="font-medium text-white">{k.kategori}</span>
                                            <span className="text-stone-500 text-xs ml-2">{k.aciklama}</span>
                                        </div>
                                        <span className={`text-xs font-medium ${oncelikRenk[k.oncelik] ?? 'text-stone-400'}`}>
                                            {TR.trend.oncelik[k.oncelik as keyof typeof TR.trend.oncelik] ?? k.oncelik}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
