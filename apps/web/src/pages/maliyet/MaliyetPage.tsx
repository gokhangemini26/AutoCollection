import React, { useEffect, useState } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Design { id: string; skuPlaceholder: string; status: string; }
interface CostResult {
    landedCost: number;
    kdvHaricFiyat: number;
    kdvDahilFiyat: number;
    kdvOrani: number;
    wholesalePrice: number;
    achievedMargin: number;
    marginAchieved: boolean;
}

const FORM_INITIAL = { fabricPrice: '', fabricYield: '1.5', makePrice: '', logistics: '', dutyPercent: '0', kdvOrani: '20' };

export const MaliyetPage = () => {
    const { user } = useAuth();
    const [designs, setDesigns] = useState<Design[]>([]);
    const [selectedDesignId, setSelectedDesignId] = useState('');
    const [form, setForm] = useState(FORM_INITIAL);
    const [result, setResult] = useState<CostResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [approving, setApproving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        api.get<any[]>('/strategy/seasons').then(async (seasons) => {
            const activeSeason = seasons.find((s: any) => s.status === 'ACTIVE') ?? seasons[0];
            if (activeSeason) {
                const d = await api.get<Design[]>(`/collection/designs/${activeSeason.id}`);
                setDesigns(d);
            }
        }).catch(() => {});
    }, []);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!selectedDesignId) { setError('Lütfen bir tasarım seçin.'); return; }
        setLoading(true);
        try {
            const data = await api.post<CostResult>(`/costing/${selectedDesignId}`, {
                fabricPrice: parseFloat(form.fabricPrice),
                fabricYield: parseFloat(form.fabricYield),
                makePrice: parseFloat(form.makePrice),
                logistics: parseFloat(form.logistics),
                dutyPercent: parseFloat(form.dutyPercent),
                kdvOrani: parseInt(form.kdvOrani, 10),
            });
            setResult(data);
            setSuccess(TR.maliyet.hesaplandi);
        } catch (err: any) {
            setError(err.response?.data?.message ?? TR.genel.hata);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!result || !selectedDesignId) return;
        setApproving(true);
        setError(null);
        try {
            const costSheet = await api.get<any>(`/costing/${selectedDesignId}`);
            await api.post('/approvals', {
                entityType: 'COST_SHEET',
                entityId: costSheet.id,
                verdict: 'APPROVED',
            });
            setSuccess(TR.maliyet.onaylandi);
        } catch (err: any) {
            setError(err.response?.data?.message ?? TR.genel.hata);
        } finally {
            setApproving(false);
        }
    };

    const canApprove = user?.role === 'GM' || user?.role === 'ADMIN';

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h2 className="text-3xl font-light text-white">{TR.maliyet.baslik}</h2>
                <p className="text-sm text-stone-500 mt-1">{TR.maliyet.aciklama}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="p-5 border border-stone-800 rounded bg-stone-950">
                    <h3 className="text-xs font-mono text-stone-500 uppercase mb-4">Maliyet Girdisi</h3>
                    <form onSubmit={handleCalculate} className="space-y-3">
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">{TR.maliyet.tasarimSec}</label>
                            <select value={selectedDesignId} onChange={(e) => setSelectedDesignId(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white">
                                <option value="">— Seçin —</option>
                                {designs.map((d) => <option key={d.id} value={d.id}>{d.skuPlaceholder}</option>)}
                            </select>
                        </div>

                        {[
                            { key: 'fabricPrice', label: TR.maliyet.kumasFiyati, placeholder: '150' },
                            { key: 'fabricYield', label: TR.maliyet.kumasYieldi, placeholder: '1.5' },
                            { key: 'makePrice', label: TR.maliyet.dikimUcreti, placeholder: '80' },
                            { key: 'logistics', label: TR.maliyet.lojistik, placeholder: '25' },
                            { key: 'dutyPercent', label: TR.maliyet.gumrukVergisi, placeholder: '0' },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className="text-xs text-stone-500 block mb-1">{label}</label>
                                <input type="number" step="any" value={(form as any)[key]} placeholder={placeholder}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                    className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white" />
                            </div>
                        ))}

                        <div>
                            <label className="text-xs text-stone-500 block mb-2">{TR.maliyet.kdvOrani}</label>
                            <div className="flex gap-3">
                                {['10', '20'].map((rate) => (
                                    <label key={rate} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="kdv" value={rate} checked={form.kdvOrani === rate}
                                            onChange={(e) => setForm((f) => ({ ...f, kdvOrani: e.target.value }))} />
                                        <span className="text-sm text-stone-300">%{rate}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-xs">{error}</p>}
                        {success && <p className="text-emerald-400 text-xs">{success}</p>}

                        <button type="submit" disabled={loading}
                            className="w-full bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-stone-200 disabled:opacity-50">
                            {loading ? TR.genel.yukluyor : TR.maliyet.hesapla}
                        </button>
                    </form>
                </div>

                <div className="p-5 border border-stone-800 rounded bg-stone-950">
                    <h3 className="text-xs font-mono text-stone-500 uppercase mb-4">Hesaplama Sonucu</h3>
                    {result ? (
                        <div className="space-y-3">
                            {[
                                { label: TR.maliyet.maliyet, value: TR.genel.para(result.landedCost) },
                                { label: TR.maliyet.hedefPerakende, value: TR.genel.para(result.kdvHaricFiyat) },
                                { label: TR.genel.kdvLabel(result.kdvOrani), value: TR.genel.para(result.kdvDahilFiyat - result.kdvHaricFiyat) },
                                { label: TR.maliyet.kdvDahilFiyat, value: TR.genel.para(result.kdvDahilFiyat), highlight: true },
                                { label: TR.maliyet.toptanFiyat, value: TR.genel.para(result.wholesalePrice) },
                                { label: TR.maliyet.brütMarj, value: TR.genel.yuzde(result.achievedMargin) },
                            ].map(({ label, value, highlight }) => (
                                <div key={label} className={`flex justify-between text-sm ${highlight ? 'pt-2 border-t border-stone-800' : ''}`}>
                                    <span className="text-stone-400">{label}</span>
                                    <span className={highlight ? 'text-white font-medium' : 'text-stone-200'}>{value}</span>
                                </div>
                            ))}

                            {!result.marginAchieved && (
                                <div className="mt-3 p-3 border border-amber-900/50 rounded bg-amber-900/10 text-amber-400 text-xs">
                                    {TR.maliyet.marjUyarisi}
                                </div>
                            )}

                            {canApprove && result.marginAchieved && (
                                <button onClick={handleApprove} disabled={approving}
                                    className="w-full mt-3 bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded text-sm font-medium disabled:opacity-50">
                                    {approving ? TR.genel.yukluyor : TR.maliyet.onaylaButon}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-stone-600 text-sm">
                            Maliyet hesaplayın
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
