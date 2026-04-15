import React, { useEffect, useState } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Season {
    id: string;
    name: string;
    status: string;
    strategyDoc?: {
        budgetCap: string;
        skuTargetCount: number;
        targetMargin: string;
    };
}

const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="p-6 bg-stone-950 border border-stone-800 rounded">
        <div className="text-xs text-stone-500 uppercase tracking-wider mb-2">{label}</div>
        <div className="text-2xl font-light">{value}</div>
        {sub && <div className="text-xs text-emerald-500 mt-1">{sub}</div>}
    </div>
);

export const DashboardPage = () => {
    const { user } = useAuth();
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Season[]>('/strategy/seasons')
            .then(setSeasons)
            .catch(() => setSeasons([]))
            .finally(() => setLoading(false));
    }, []);

    const activeSeason = seasons.find((s) => s.status === 'ACTIVE') ?? seasons[0];

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-3xl font-light">
                    {activeSeason
                        ? <>Sezon: <span className="font-normal text-white">{activeSeason.name}</span></>
                        : 'Genel Bakış'}
                </h2>
                {user && (
                    <p className="text-sm text-stone-500 mt-1">
                        Hoş geldiniz, {user.name} — {user.role}
                    </p>
                )}
            </div>

            {loading ? (
                <div className="text-stone-500 text-sm">{TR.genel.yukluyor}</div>
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <StatCard
                            label={TR.strateji.butceKullanimi}
                            value={activeSeason?.strategyDoc
                                ? TR.genel.para(Number(activeSeason.strategyDoc.budgetCap))
                                : '—'}
                        />
                        <StatCard
                            label={TR.strateji.skuSayisi}
                            value={activeSeason?.strategyDoc
                                ? `— / ${activeSeason.strategyDoc.skuTargetCount}`
                                : '—'}
                        />
                        <StatCard
                            label={TR.strateji.ortMarj}
                            value={activeSeason?.strategyDoc
                                ? TR.genel.yuzde(Number(activeSeason.strategyDoc.targetMargin))
                                : '—'}
                            sub="↑ Hedef üzerinde"
                        />
                    </div>

                    <div className="p-6 border border-stone-800 rounded bg-stone-950/50 mb-6">
                        <h3 className="text-sm font-mono text-stone-500 mb-4">AKTİF SEZONLAR</h3>
                        {seasons.length === 0 ? (
                            <p className="text-stone-600 text-sm">{TR.strateji.sezonYok}</p>
                        ) : (
                            <div className="space-y-2">
                                {seasons.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between text-sm">
                                        <span className="text-stone-200">{s.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${s.status === 'ACTIVE' ? 'bg-emerald-900/40 text-emerald-400' :
                                            s.status === 'PLANNED' ? 'bg-blue-900/40 text-blue-400' :
                                                'bg-stone-800 text-stone-500'
                                            }`}>
                                            {TR.strateji.durum[s.status as keyof typeof TR.strateji.durum] ?? s.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 border border-amber-900/40 rounded bg-amber-900/10">
                        <h3 className="text-sm font-mono text-amber-500 mb-3">AKTİF UYARILAR</h3>
                        <div className="flex items-center gap-3 text-amber-400 text-sm">
                            <span>⚠</span>
                            <span>Koleksiyon planında Aksesuar kategorisinde 3 Giriş fiyat slotu boş.</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
