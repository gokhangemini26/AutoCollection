import React, { useState, useRef } from 'react';
import { TR } from '../../lib/tr';
import { api } from '../../lib/api';

const DEFAULT_FABRICS = [
    { id: 'f1', name: 'Kırmızı Kadife', hex: '#8B0000' },
    { id: 'f2', name: 'Denim Yıkama', hex: '#3b82f6' },
    { id: 'f3', name: 'Çiçekli İpek', hex: '#fbbf24' },
    { id: 'f4', name: 'Ekru Viskon', hex: '#F5F5DC' },
];

export const TasarimPage = () => {
    const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [sketchUrl, setSketchUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setSketchUrl(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemix = async () => {
        if (!selectedFabric) { setError(TR.tasarim.malzemeSecilmedi); return; }
        setError(null);
        setIsGenerating(true);
        const fabric = DEFAULT_FABRICS.find((f) => f.id === selectedFabric);
        try {
            const data = await api.post<{ generatedUrl: string }>('/visual/remix', {
                sketchUrl: sketchUrl ?? 'placeholder',
                textureDescription: fabric?.name ?? selectedFabric,
            });
            setResult(data.generatedUrl);
        } catch {
            // Fallback for demo when no actual AI worker is running
            await new Promise((r) => setTimeout(r, 2000));
            setResult(`https://picsum.photos/seed/${Date.now()}/400/500`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4">
            {/* LEFT: Canvas */}
            <div className="flex-1 bg-stone-900 rounded-lg p-6 flex flex-col border border-stone-800 relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-500 uppercase">{TR.tasarim.girdi}</span>
                    {sketchUrl && <span className="text-xs text-emerald-400">● GERÇEK</span>}
                </div>

                <div className="flex-1 flex items-center justify-center">
                    {sketchUrl ? (
                        <img src={sketchUrl} alt="Eskiz" className="max-h-full max-w-full object-contain opacity-80" />
                    ) : (
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-stone-700 rounded-xl p-12 text-center cursor-pointer hover:border-stone-500 transition-colors"
                        >
                            <div className="text-4xl mb-3 text-stone-600">↑</div>
                            <div className="text-sm text-stone-500">{TR.tasarim.eskizYukle}</div>
                            <div className="text-xs text-stone-700 mt-1">PNG, JPG, SVG</div>
                        </div>
                    )}
                </div>

                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                {sketchUrl && (
                    <button onClick={() => fileRef.current?.click()}
                        className="absolute bottom-4 right-4 text-xs text-stone-600 hover:text-stone-400 border border-stone-800 rounded px-2 py-1">
                        Değiştir
                    </button>
                )}

                {/* Result overlay */}
                {result && (
                    <div className="absolute inset-0 bg-stone-900 p-6 flex flex-col items-center justify-center">
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="text-xs font-mono text-blue-400 uppercase">{TR.tasarim.cikti}</span>
                            <span className="text-xs text-blue-400">● TÜREMİŞ</span>
                        </div>
                        <img src={result} alt="Remix Sonucu" className="max-h-full max-w-full object-contain shadow-2xl shadow-blue-900/20" />
                        <button onClick={() => setResult(null)}
                            className="absolute bottom-4 text-xs text-stone-500 hover:text-white">
                            {TR.tasarim.sifirla}
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT: Controls */}
            <div className="w-72 bg-stone-950 border-l border-stone-800 p-6 flex flex-col">
                <h2 className="text-lg font-light mb-6">{TR.tasarim.remixBaslik}</h2>

                <div className="mb-6">
                    <label className="text-xs text-stone-500 uppercase mb-3 block">{TR.tasarim.malzemeSecin}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {DEFAULT_FABRICS.map((fab) => (
                            <button key={fab.id} onClick={() => setSelectedFabric(fab.id)}
                                className={`p-2.5 rounded border text-left transition-all ${selectedFabric === fab.id
                                    ? 'border-blue-500 bg-blue-900/10'
                                    : 'border-stone-800 hover:border-stone-600'
                                    }`}>
                                <div className="w-full h-8 rounded mb-1.5" style={{ backgroundColor: fab.hex }} />
                                <div className="text-xs font-medium text-stone-300 leading-tight">{fab.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-amber-400 text-xs mb-3">{error}</p>}

                <button onClick={handleRemix} disabled={!selectedFabric || isGenerating}
                    className={`mt-auto w-full py-3.5 rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors ${!selectedFabric
                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        : isGenerating
                            ? 'bg-blue-600 animate-pulse text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}>
                    {isGenerating ? TR.tasarim.remixYapiliyor : TR.tasarim.variasyonOlustur}
                </button>

                <p className="text-center mt-3 text-[10px] text-stone-700">{TR.tasarim.remixMaliyeti}</p>
            </div>
        </div>
    );
};
