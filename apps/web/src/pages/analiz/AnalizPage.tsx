import React, { useEffect, useState } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';

interface Season { id: string; name: string; status: string; }
interface Insights {
    enIyiPerformancilar: string[];
    dusukPerformancilar: string[];
    gorusler: string;
    gelecekSezonOnerileri: string[];
    kategoriInsight: string;
}

export const AnalizPage = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState('');
    const [insights, setInsights] = useState<Insights | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<Season[]>('/strategy/seasons').then((data) => {
            setSeasons(data);
            const active = data.find((s) => s.status === 'ACTIVE');
            if (active) setSelectedSeasonId(active.id);
        });
    }, []);

    const handleGenerate = async () => {
        if (!selectedSeasonId) { setError(TR.analiz.sezonSecilmedi); return; }
        setError(null);
        setLoading(true);
        try {
            const data = await api.post<Insights>(`/analysis/insights/${selectedSeasonId}`);
            setInsights(data);
        } catch (err: any) {
            setError(err.response?.data?.message ?? TR.genel.hata);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-3xl font-light text-white">{TR.analiz.baslik}</h2>
                <p className="text-sm text-stone-500 mt-1">{TR.analiz.aciklama}</p>
            </div>

            <div className="flex gap-3 mb-8">
                <select value={selectedSeasonId} onChange={(e) => setSelectedSeasonId(e.target.value)}
                    className="bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white">
                    <option value="">{TR.analiz.sezonSecin}</option>
                    {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button onClick={handleGenerate} disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded text-sm font-medium">
                    {loading ? TR.analiz.yukluyor : TR.analiz.gorusAl}
                </button>
            </div>

            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

            {loading && (
                <div className="flex items-center gap-3 p-4 border border-blue-900/40 rounded bg-blue-900/10">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <span className="text-blue-400 text-sm">{TR.analiz.yukluyor}</span>
                </div>
            )}

            {insights && !loading && (
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-emerald-500 uppercase mb-3">
                                {TR.analiz.enIyiPerformancilar}
                            </h3>
                            <ul className="space-y-1.5">
                                {insights.enIyiPerformancilar.map((p, i) => (
                                    <li key={i} className="text-sm text-stone-200 flex items-center gap-2">
                                        <span className="text-emerald-500">↑</span>{p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-red-400 uppercase mb-3">
                                {TR.analiz.dusukPerformancilar}
                            </h3>
                            <ul className="space-y-1.5">
                                {insights.dusukPerformancilar.map((p, i) => (
                                    <li key={i} className="text-sm text-stone-200 flex items-center gap-2">
                                        <span className="text-red-400">↓</span>{p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="p-5 border border-blue-900/40 rounded bg-blue-900/10">
                        <h3 className="text-xs font-mono text-blue-400 uppercase mb-2">{TR.analiz.gorusler}</h3>
                        <p className="text-sm text-stone-200 leading-relaxed">{insights.gorusler}</p>
                    </div>

                    {insights.kategoriInsight && (
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-stone-500 uppercase mb-2">{TR.analiz.kategoriInsight}</h3>
                            <p className="text-sm text-stone-300">{insights.kategoriInsight}</p>
                        </div>
                    )}

                    {insights.gelecekSezonOnerileri?.length > 0 && (
                        <div className="p-5 border border-stone-800 rounded bg-stone-950">
                            <h3 className="text-xs font-mono text-stone-500 uppercase mb-3">
                                {TR.analiz.gelecekSezonOnerileri}
                            </h3>
                            <ul className="space-y-2">
                                {insights.gelecekSezonOnerileri.map((oneri, i) => (
                                    <li key={i} className="text-sm text-stone-300 flex items-start gap-2">
                                        <span className="text-stone-600 mt-0.5">→</span>{oneri}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
