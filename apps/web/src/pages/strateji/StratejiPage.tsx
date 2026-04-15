import React, { useEffect, useState } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';
import { SEZON_SABLONLARI } from '../../lib/takvim';
import { useAgUiStore } from '../../agents/AgUiCore';

interface Season {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
    strategyDoc?: { budgetCap: string; skuTargetCount: number; targetMargin: string };
}

const INITIAL_FORM = { name: '', budget: '', skuTarget: '', targetMargin: '60', startDate: '', endDate: '' };

export const StratejiPage = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { actions, context } = useAgUiStore();

    const load = () => {
        setLoading(true);
        api.get<Season[]>('/strategy/seasons')
            .then(setSeasons)
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleSeasonTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const template = SEZON_SABLONLARI.find((s) => s.ad === e.target.value);
        if (template) {
            setForm((f) => ({ ...f, name: template.ad, startDate: template.baslangic, endDate: template.bitis }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            const newSeason = await api.post<Season>('/strategy/seasons', {
                name: form.name,
                budget: parseFloat(form.budget),
                skuTarget: parseInt(form.skuTarget, 10),
                targetMargin: parseFloat(form.targetMargin) / 100,
                startDate: form.startDate || undefined,
                endDate: form.endDate || undefined,
            });
            actions.setContext({ activeSeasonId: newSeason.id, currentModule: 1 });
            actions.setStatus('IDLE', null);
            setShowModal(false);
            setForm(INITIAL_FORM);
            load();
        } catch (err: any) {
            setError(err.response?.data?.message ?? TR.genel.hata);
        } finally {
            setSaving(false);
        }
    };

    const selectSeason = (s: Season) => {
        actions.setContext({ activeSeasonId: s.id, currentModule: 1 });
        actions.setStatus('IDLE', null);
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-light text-white">{TR.strateji.baslik}</h2>
                    <p className="text-sm text-stone-500 mt-1">{TR.strateji.aciklama}</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-white text-black px-4 py-2 rounded text-sm hover:bg-stone-200 transition-colors"
                >
                    + {TR.strateji.yeniSezon}
                </button>
            </div>

            {context.activeSeasonId && (
                <div className="mb-4 px-4 py-2 bg-emerald-900/30 border border-emerald-800 rounded text-emerald-400 text-sm">
                    Aktif Sezon: {seasons.find(s => s.id === context.activeSeasonId)?.name ?? context.activeSeasonId}
                </div>
            )}

            {loading ? (
                <div className="text-stone-500 text-sm">{TR.genel.yukluyor}</div>
            ) : seasons.length === 0 ? (
                <div className="p-8 border border-dashed border-stone-700 rounded text-center text-stone-600">
                    {TR.strateji.sezonYok}
                </div>
            ) : (
                <div className="space-y-4">
                    {seasons.map((s) => (
                        <div
                            key={s.id}
                            className={`p-5 border rounded bg-stone-950 transition-colors ${context.activeSeasonId === s.id ? 'border-emerald-700' : 'border-stone-800 hover:border-stone-700'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-white">{s.name}</h3>
                                    <p className="text-xs text-stone-500 mt-1">
                                        {new Date(s.startDate).toLocaleDateString('tr-TR')} —{' '}
                                        {new Date(s.endDate).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${s.status === 'ACTIVE' ? 'bg-emerald-900/40 text-emerald-400' :
                                        s.status === 'PLANNED' ? 'bg-blue-900/40 text-blue-400' :
                                            'bg-stone-800 text-stone-500'
                                        }`}>
                                        {TR.strateji.durum[s.status as keyof typeof TR.strateji.durum] ?? s.status}
                                    </span>
                                    {context.activeSeasonId !== s.id && (
                                        <button
                                            onClick={() => selectSeason(s)}
                                            className="text-xs px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
                                        >
                                            Seç
                                        </button>
                                    )}
                                </div>
                            </div>
                            {s.strategyDoc && (
                                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-stone-800">
                                    <div>
                                        <div className="text-xs text-stone-500">{TR.strateji.butce}</div>
                                        <div className="text-sm text-white font-medium">
                                            {TR.genel.para(Number(s.strategyDoc.budgetCap))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-stone-500">{TR.strateji.skuHedefi}</div>
                                        <div className="text-sm text-white font-medium">{s.strategyDoc.skuTargetCount}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-stone-500">{TR.strateji.hedefMarj}</div>
                                        <div className="text-sm text-white font-medium">
                                            {TR.genel.yuzde(Number(s.strategyDoc.targetMargin))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-stone-950 border border-stone-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium mb-5">{TR.strateji.yeniSezon}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-stone-500 uppercase block mb-1">
                                    Sezon Şablonu
                                </label>
                                <select
                                    onChange={handleSeasonTemplate}
                                    className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                                >
                                    <option value="">— Şablon seçin (isteğe bağlı) —</option>
                                    {SEZON_SABLONLARI.map((s) => (
                                        <option key={s.kod} value={s.ad}>{s.ad}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-stone-500 uppercase block mb-1">
                                    {TR.strateji.sezonAdi}
                                </label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                                    placeholder="İlkbahar/Yaz 2026"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-stone-500 uppercase block mb-1">
                                        {TR.strateji.butce} (₺)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="10000"
                                        value={form.budget}
                                        onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                                        className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                                        placeholder="2500000"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-500 uppercase block mb-1">
                                        {TR.strateji.skuHedefi}
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={form.skuTarget}
                                        onChange={(e) => setForm((f) => ({ ...f, skuTarget: e.target.value }))}
                                        className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                                        placeholder="85"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-stone-500 uppercase block mb-1">
                                    {TR.strateji.hedefMarj} (%)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={form.targetMargin}
                                    onChange={(e) => setForm((f) => ({ ...f, targetMargin: e.target.value }))}
                                    className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-white text-black py-2 rounded text-sm font-medium hover:bg-stone-200 disabled:opacity-50">
                                    {saving ? TR.genel.yukluyor : TR.genel.kaydet}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 border border-stone-700 py-2 rounded text-sm text-stone-400 hover:text-white">
                                    {TR.genel.iptal}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
