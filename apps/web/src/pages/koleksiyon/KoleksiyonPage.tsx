import React, { useEffect, useState } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';
import { TEDARIKCI_SEHIRLERI } from '../../lib/tedarikciler';

interface Season { id: string; name: string; status: string; }
interface LinePlanItem {
    id: string;
    category: string;
    pricePoint: 'ENTRY' | 'CORE' | 'PREMIUM';
    productDesign?: { id: string; skuPlaceholder: string; status: string } | null;
}

const PRICE_POINTS: Array<'ENTRY' | 'CORE' | 'PREMIUM'> = ['ENTRY', 'CORE', 'PREMIUM'];

export const KoleksiyonPage = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState('');
    const [linePlan, setLinePlan] = useState<LinePlanItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [activeSlot, setActiveSlot] = useState<{ linePlanId: string; cat: string; pp: string } | null>(null);
    const [skuForm, setSkuForm] = useState({ urunAdi: '', renk: '', kumas: '', tedarikciSehri: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<Season[]>('/strategy/seasons').then((data) => {
            setSeasons(data);
            const active = data.find((s) => s.status === 'ACTIVE');
            if (active) setSelectedSeasonId(active.id);
        });
    }, []);

    useEffect(() => {
        if (!selectedSeasonId) return;
        setLoading(true);
        api.get<LinePlanItem[]>(`/collection/line-plan/${selectedSeasonId}`)
            .then(setLinePlan)
            .finally(() => setLoading(false));
    }, [selectedSeasonId]);

    const categories = [...new Set(linePlan.map((i) => i.category))];
    if (categories.length === 0) {
        TR.koleksiyon.kategoriler.slice(0, 6).forEach((cat) => {
            if (!categories.includes(cat)) categories.push(cat);
        });
    }

    const getSlot = (cat: string, pp: 'ENTRY' | 'CORE' | 'PREMIUM') =>
        linePlan.find((i) => i.category === cat && i.pricePoint === pp);

    const handleSlotClick = (cat: string, pp: 'ENTRY' | 'CORE' | 'PREMIUM') => {
        if (!selectedSeasonId) { setError(TR.koleksiyon.sezonSecilmedi); return; }
        const slot = getSlot(cat, pp);
        setActiveSlot({ linePlanId: slot?.id ?? '', cat, pp });
        setShowDrawer(true);
        setError(null);
    };

    const handleSkuSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            let linePlanId = activeSlot?.linePlanId;
            if (!linePlanId) {
                const item = await api.post<LinePlanItem>('/collection/line-plan', {
                    seasonId: selectedSeasonId,
                    category: activeSlot?.cat,
                    pricePoint: activeSlot?.pp,
                });
                linePlanId = item.id;
            }
            const sku = `${activeSlot?.cat?.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
            await api.post('/collection/designs', {
                linePlanId,
                skuPlaceholder: sku,
                notes: `${skuForm.urunAdi} | ${skuForm.renk} | ${skuForm.kumas} | ${skuForm.tedarikciSehri}`,
            });
            setShowDrawer(false);
            setSkuForm({ urunAdi: '', renk: '', kumas: '', tedarikciSehri: '' });
            const updated = await api.get<LinePlanItem[]>(`/collection/line-plan/${selectedSeasonId}`);
            setLinePlan(updated);
        } catch (err: any) {
            setError(err.response?.data?.message ?? TR.genel.hata);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-light text-white">{TR.koleksiyon.baslik}</h2>
                    <p className="text-sm text-stone-500 mt-1">{TR.koleksiyon.aciklama}</p>
                </div>
                <select
                    value={selectedSeasonId}
                    onChange={(e) => setSelectedSeasonId(e.target.value)}
                    className="bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                >
                    <option value="">{TR.koleksiyon.sezonSecin}</option>
                    {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            {error && <div className="text-amber-400 text-sm mb-4">{error}</div>}

            {loading ? (
                <div className="text-stone-500 text-sm">{TR.genel.yukluyor}</div>
            ) : (
                <div className="border border-stone-800 rounded bg-stone-950 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="p-4 border-b border-stone-800 text-stone-400 font-mono text-xs uppercase">
                                    {TR.koleksiyon.kategori}
                                </th>
                                {PRICE_POINTS.map((pp) => (
                                    <th key={pp} className="p-4 border-b border-stone-800 text-stone-400 font-mono text-xs uppercase">
                                        {TR.koleksiyon.fiyatNoktaları[pp]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat} className="hover:bg-stone-900/50 transition-colors">
                                    <td className="p-4 border-b border-stone-800 font-medium text-stone-200 text-sm">{cat}</td>
                                    {PRICE_POINTS.map((pp) => {
                                        const slot = getSlot(cat, pp);
                                        const filled = !!slot?.productDesign;
                                        return (
                                            <td key={pp} className="p-4 border-b border-stone-800">
                                                <div
                                                    onClick={() => !filled && handleSlotClick(cat, pp)}
                                                    className={`h-20 border-2 border-dashed rounded flex flex-col items-center justify-center text-xs transition-all
                                                        ${filled
                                                            ? 'border-emerald-900/60 bg-emerald-900/10 text-emerald-400 cursor-default'
                                                            : 'border-stone-700 text-stone-600 hover:border-stone-500 hover:text-stone-400 cursor-pointer'
                                                        }`}
                                                >
                                                    {filled ? (
                                                        <>
                                                            <span className="text-xs font-medium">{slot!.productDesign!.skuPlaceholder}</span>
                                                            <span className="text-xs opacity-60 mt-0.5">{slot!.productDesign!.status}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-xl font-thin">+</span>
                                                            <span>{TR.koleksiyon.slotBos}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* SKU Ekle Drawer */}
            {showDrawer && (
                <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
                    <div className="bg-stone-950 border-l border-stone-800 w-80 h-full p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-medium">{TR.koleksiyon.skuEkle}</h3>
                            <button onClick={() => setShowDrawer(false)} className="text-stone-500 hover:text-white">✕</button>
                        </div>
                        <p className="text-xs text-stone-500 mb-4">
                            {activeSlot?.cat} — {activeSlot?.pp && TR.koleksiyon.fiyatNoktaları[activeSlot.pp as keyof typeof TR.koleksiyon.fiyatNoktaları]}
                        </p>
                        <form onSubmit={handleSkuSubmit} className="space-y-4 flex-1">
                            {[
                                { key: 'urunAdi', label: TR.koleksiyon.urunAdi, placeholder: 'Örn: Midi Elbise' },
                                { key: 'renk', label: TR.koleksiyon.renk, placeholder: 'Örn: Ekru, Lacivert' },
                                { key: 'kumas', label: TR.koleksiyon.kumas, placeholder: 'Örn: %100 Viskon' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key}>
                                    <label className="text-xs text-stone-500 uppercase block mb-1">{label}</label>
                                    <input
                                        value={(skuForm as any)[key]}
                                        onChange={(e) => setSkuForm((f) => ({ ...f, [key]: e.target.value }))}
                                        placeholder={placeholder}
                                        className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs text-stone-500 uppercase block mb-1">{TR.koleksiyon.tedarikciSehri}</label>
                                <select
                                    value={skuForm.tedarikciSehri}
                                    onChange={(e) => setSkuForm((f) => ({ ...f, tedarikciSehri: e.target.value }))}
                                    className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white"
                                >
                                    <option value="">— Seçin —</option>
                                    {TEDARIKCI_SEHIRLERI.map((t) => (
                                        <option key={t.sehir} value={t.sehir}>{t.sehir}</option>
                                    ))}
                                </select>
                            </div>
                            {error && <p className="text-red-400 text-xs">{error}</p>}
                            <button type="submit" disabled={saving}
                                className="w-full bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-stone-200 disabled:opacity-50 mt-auto">
                                {saving ? TR.genel.yukluyor : TR.genel.kaydet}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
