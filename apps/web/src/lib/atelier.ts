export interface Look {
    id: string;
    name: string;
    category: string;
    fabric: string;
    colorHex: string;
    accentHex: string;
}

export interface Capsule {
    id: string;
    title: string;
    season: string;
    house: string;
    story: string;
    mood: string[];
    palette: string[];
    looks: Look[];
}

export const CAPSULES: Capsule[] = [
    {
        id: 'meridyen',
        title: 'Meridyen',
        season: 'İLKBAHAR–YAZ 2027',
        house: 'TERZİLİK EVİ',
        story: 'Akdeniz ışığında yeniden çizilen klasik terzilik. Yapısız omuzlar, akışkan yünler, kum ve mürekkep arasında bir gardırop.',
        mood: ['akdeniz', 'yapısız', 'hafif yün', 'monokrom sıcak'],
        palette: ['#D8CBB3', '#B8A98C', '#6E6250', '#1E2430', '#0C0B09'],
        looks: [
            { id: 'm1', name: 'Kum Saati', category: 'Yapısız Blazer', fabric: 'Yün-ipek hopsack', colorHex: '#D8CBB3', accentHex: '#1E2430' },
            { id: 'm2', name: 'Meltem', category: 'Gömlek Ceket', fabric: 'Yıkanmış keten', colorHex: '#B8A98C', accentHex: '#0C0B09' },
            { id: 'm3', name: 'Rıhtım', category: 'Pilili Pantolon', fabric: 'Tropikal yün', colorHex: '#6E6250', accentHex: '#D8CBB3' },
            { id: 'm4', name: 'Gece Yarısı', category: 'Kruvaze Takım', fabric: 'Süper 130s yün', colorHex: '#1E2430', accentHex: '#C3A46E' },
            { id: 'm5', name: 'Liman', category: 'Bomber Triko', fabric: 'Pamuk krep örgü', colorHex: '#8A7D66', accentHex: '#1E2430' },
            { id: 'm6', name: 'Fener', category: 'Sahil Gömleği', fabric: 'İpek-pamuk vual', colorHex: '#E4DAC4', accentHex: '#6E6250' },
        ],
    },
    {
        id: 'arsiv',
        title: 'Kış Arşivi',
        season: 'SONBAHAR–KIŞ 2026',
        house: 'LÜKS MODA EVİ',
        story: 'Arşivden çıkan bir palto hikâyesi. Kamel, bordo ve loden yeşili; el dikişi detaylar, çift yüzlü kaşmir ve sessiz bir zenginlik.',
        mood: ['arşiv', 'çift yüzlü kaşmir', 'el dikişi', 'sessiz lüks'],
        palette: ['#B08D57', '#6E2B35', '#3E4A3D', '#2B2B33', '#0C0B09'],
        looks: [
            { id: 'a1', name: 'Arşiv No.7', category: 'Çift Yüzlü Palto', fabric: 'Kaşmir double-face', colorHex: '#B08D57', accentHex: '#6E2B35' },
            { id: 'a2', name: 'Bordo Oda', category: 'Smokin Ceket', fabric: 'İpek kadife', colorHex: '#6E2B35', accentHex: '#C3A46E' },
            { id: 'a3', name: 'Loden', category: 'Av Ceketi', fabric: 'Loden yünü', colorHex: '#3E4A3D', accentHex: '#B08D57' },
            { id: 'a4', name: 'Gri Kurşun', category: 'Flanel Takım', fabric: 'Fırçalanmış flanel', colorHex: '#2B2B33', accentHex: '#EDE7DA' },
            { id: 'a5', name: 'Kâğıt', category: 'Yaka Detaylı Gömlek', fabric: 'Poplin', colorHex: '#E8E2D2', accentHex: '#2B2B33' },
            { id: 'a6', name: 'İz', category: 'Atkı & Eldiven', fabric: 'Saf kaşmir', colorHex: '#8C6D46', accentHex: '#3E4A3D' },
        ],
    },
    {
        id: 'ege',
        title: 'Ege Rotası',
        season: 'RESORT 2027',
        house: 'MODERN SMART-CASUAL',
        story: 'Bir yaz rotası: beyaz taş, zeytin yaprağı, gün batımı bakırı. Keten ve terry; valize sığan on parça.',
        mood: ['resort', 'keten', 'kapsül valiz', 'güneş'],
        palette: ['#EDE7DA', '#A9B49B', '#C87F5D', '#4E657A', '#0C0B09'],
        looks: [
            { id: 'e1', name: 'Taş Avlu', category: 'Keten Takım', fabric: 'İri dokulu keten', colorHex: '#EDE7DA', accentHex: '#4E657A' },
            { id: 'e2', name: 'Zeytin', category: 'Kamp Yaka Gömlek', fabric: 'Viskon-keten', colorHex: '#A9B49B', accentHex: '#C87F5D' },
            { id: 'e3', name: 'Bakır Saat', category: 'Terry Polo', fabric: 'Havlu örme', colorHex: '#C87F5D', accentHex: '#EDE7DA' },
            { id: 'e4', name: 'Koy', category: 'Yüzücü Şort', fabric: 'Geri dönüşümlü naylon', colorHex: '#4E657A', accentHex: '#A9B49B' },
            { id: 'e5', name: 'Güverte', category: 'Espadril', fabric: 'Kanvas-jüt', colorHex: '#D6C9AE', accentHex: '#4E657A' },
            { id: 'e6', name: 'Meltem II', category: 'Hafif Trençkot', fabric: 'Mumlu pamuk', colorHex: '#B8A98C', accentHex: '#0C0B09' },
        ],
    },
];

const ACTIVE_KEY = 'maison.activeCapsule';

export function getActiveCapsule(): Capsule {
    try {
        const raw = localStorage.getItem(ACTIVE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Capsule;
            if (parsed && parsed.looks?.length) return parsed;
        }
    } catch { /* fall through */ }
    return CAPSULES[0];
}

export function setActiveCapsule(capsule: Capsule) {
    try {
        localStorage.setItem(ACTIVE_KEY, JSON.stringify(capsule));
    } catch { /* ignore */ }
}
