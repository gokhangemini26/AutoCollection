import React, { useEffect, useState } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';

type Provider = 'GEMINI' | 'OPENAI' | 'CLAUDE';

export const AyarlarPage = () => {
    const [provider, setProvider] = useState<Provider>('GEMINI');
    const [apiKey, setApiKey] = useState('');
    const [currentProvider, setCurrentProvider] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<{ provider: string }>('/settings/api-key')
            .then((data) => setCurrentProvider(data.provider))
            .catch(() => {});
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim()) { setError('API anahtarı boş olamaz.'); return; }
        setError(null);
        setSuccess(null);
        setSaving(true);
        try {
            await api.post('/settings/api-key', { provider, apiKey });
            setCurrentProvider(provider);
            setApiKey('');
            setSuccess(TR.ayarlar.anahtarKaydedildi);
        } catch (err: any) {
            setError(err.response?.data?.message ?? TR.genel.hata);
        } finally {
            setSaving(false);
        }
    };

    const providers: Provider[] = ['GEMINI', 'OPENAI', 'CLAUDE'];

    return (
        <div className="max-w-xl">
            <div className="mb-6">
                <h2 className="text-3xl font-light text-white">{TR.ayarlar.baslik}</h2>
            </div>

            <div className="p-6 border border-stone-800 rounded bg-stone-950">
                <h3 className="text-xs font-mono text-stone-500 uppercase mb-5">{TR.ayarlar.yapayZeka}</h3>

                {currentProvider && (
                    <div className="mb-5 p-3 bg-stone-900 rounded text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-stone-400">{TR.ayarlar.mevcutSaglayici}:</span>
                        <span className="text-white font-medium">
                            {TR.ayarlar.saglaycılar[currentProvider as Provider] ?? currentProvider}
                        </span>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="text-xs text-stone-500 uppercase block mb-3">Sağlayıcı Seç</label>
                        <div className="space-y-2">
                            {providers.map((p) => (
                                <label key={p} className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${provider === p
                                    ? 'border-white bg-stone-900'
                                    : 'border-stone-800 hover:border-stone-700'
                                    }`}>
                                    <input type="radio" name="provider" value={p} checked={provider === p}
                                        onChange={() => setProvider(p)} className="text-white" />
                                    <div>
                                        <div className="text-sm font-medium text-white">
                                            {TR.ayarlar.saglaycılar[p]}
                                        </div>
                                        <div className="text-xs text-stone-500">
                                            {p === 'GEMINI' ? 'gemini-1.5-flash' : p === 'OPENAI' ? 'gpt-4o-mini' : 'claude-haiku'}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-stone-500 uppercase block mb-1">{TR.ayarlar.apiAnahtari}</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={TR.ayarlar.anahtarPlaceholder}
                            className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-sm text-white placeholder-stone-600"
                        />
                        <p className="text-xs text-stone-600 mt-1.5">{TR.ayarlar.anahtarIpucu}</p>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {success && <p className="text-emerald-400 text-sm">{success}</p>}

                    <button type="submit" disabled={saving}
                        className="w-full bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-stone-200 disabled:opacity-50">
                        {saving ? TR.genel.yukluyor : TR.ayarlar.kaydet}
                    </button>
                </form>
            </div>
        </div>
    );
};
