import { Capsule } from './atelier';

export type Segment = 'Terzilik Evi' | 'Lüks Moda Evi' | 'Modern Smart-Casual' | 'Kadın Lüks';
export type Season = 'İlkbahar–Yaz' | 'Sonbahar–Kış' | 'Resort';

export interface IdeaInput {
    season: Season;
    year: number;
    segment: Segment;
    mood: string;
}

export interface KeyPiece {
    name: string;
    category: string;
    fabric: string;
}

export interface CapsuleConcept {
    id: string;
    title: string;
    season: string;
    segment: Segment;
    story: string;
    mood: string[];
    palette: string[];
    keyPieces: KeyPiece[];
}

const TITLES = [
    'Meridyen', 'Pergel', 'Kordon', 'Atlas', 'Sedef', 'Rıhtım', 'Divan', 'Fener',
    'Mahzen', 'Pusula', 'Gravür', 'Patika', 'Liman', 'Şimşir', 'Kehribar', 'Fırtına',
    'Saray Arşivi', 'Kuzey Işığı', 'Bakır Çağı', 'Sessiz Oda',
];

const PIECE_NAMES = [
    'Kum Saati', 'Gece Yarısı', 'Meltem', 'Taş Avlu', 'Bakır Saat', 'İpek Yolu',
    'Gravür', 'Kuzey', 'Anafor', 'Saklı Bahçe', 'Dolunay', 'Alaturka', 'Sisli Sabah',
    'Küf Yeşili', 'Antik', 'Zeytin', 'Amber', 'Vitrin', 'Perde', 'Kalem',
];

const CATEGORIES: Record<Segment, { category: string; fabrics: string[] }[]> = {
    'Terzilik Evi': [
        { category: 'Kruvaze Takım', fabrics: ['Süper 130s yün', 'Yün-kaşmir karışım', 'Fırçalanmış flanel'] },
        { category: 'Yapısız Blazer', fabrics: ['Yün-ipek hopsack', 'Yıkanmış keten', 'Jarse örme'] },
        { category: 'Pilili Pantolon', fabrics: ['Tropikal yün', 'Kavalri tüvit', 'Yüksek büküm gabardin'] },
        { category: 'Palto', fabrics: ['Kaşmir double-face', 'Loden yünü', 'Kamgarn kaşe'] },
        { category: 'Yaka Detaylı Gömlek', fabrics: ['İki kat poplin', 'Oxford pike', 'İpek-pamuk vual'] },
        { category: 'Triko Polo', fabrics: ['Merino 16GG', 'Pamuk krep örgü', 'İpek karışım file'] },
        { category: 'Smokin Ceket', fabrics: ['İpek kadife', 'Barathea yün', 'Jakarlı mikro desen'] },
    ],
    'Lüks Moda Evi': [
        { category: 'Drape Elbise', fabrics: ['İpek saten', 'Krep düşes', 'Bias kesim şifon'] },
        { category: 'Kaşmir Kaban', fabrics: ['Çift yüzlü kaşmir', 'Alpaka karışım', 'Deve tüyü'] },
        { category: 'İpek Bluz', fabrics: ['Krep de şin', 'Jorjet', 'Saten arka krep'] },
        { category: 'Deri Çanta', fabrics: ['Bitkisel tabaklama dana', 'Süet nubuk', 'Saffiano'] },
        { category: 'Abiye Takım', fabrics: ['İpek kadife', 'Lame jakar', 'Kristal işleme tül'] },
        { category: 'Eşarp & Şal', fabrics: ['Saf ipek twill', 'Kaşmir-ipek', 'Modal jakar'] },
    ],
    'Modern Smart-Casual': [
        { category: 'Overshirt', fabrics: ['Mumlu pamuk', 'Yün-naylon teknik', 'Fırçalı twill'] },
        { category: 'Bomber Triko', fabrics: ['Merino çift plaka', 'Pamuk krep örgü', 'Geri dönüşümlü poliamid'] },
        { category: 'Chino Pantolon', fabrics: ['Streç gabardin', 'Garment-dye kanvas', 'Teknik seersucker'] },
        { category: 'Kapüşonlu Mont', fabrics: ['Hafif ripstop', 'Üç katmanlı membran', 'Mat naylon'] },
        { category: 'Kamp Yaka Gömlek', fabrics: ['Viskon-keten', 'Tensel twill', 'Jakarlı örme'] },
        { category: 'Sneaker', fabrics: ['Nappa deri', 'Süet-file mix', 'Bio-bazlı taban'] },
    ],
    'Kadın Lüks': [
        { category: 'Kruvaze Blazer', fabrics: ['Yün krep', 'İpek karışım tüvit', 'Streç kamgarn'] },
        { category: 'Midi Etek', fabrics: ['Pilili jorjet', 'Deri-süet panel', 'Jakarlı brokar'] },
        { category: 'Trençkot', fabrics: ['Bonded pamuk', 'İpek gabardin', 'Vinil kaplama keten'] },
        { category: 'Örme Elbise', fabrics: ['Merino fitilli', 'Kaşmir karışım jarse', 'Metalik lurex örme'] },
        { category: 'İpek Fular', fabrics: ['Twill ipek', 'Şifon degrade', 'Jakarlı saten'] },
        { category: 'Topuklu Bot', fabrics: ['Rugan', 'Streç süet', 'Kroko baskı deri'] },
    ],
};

const PALETTES: Record<Season, { name: string; colors: string[] }[]> = {
    'İlkbahar–Yaz': [
        { name: 'Kum & Mürekkep', colors: ['#D8CBB3', '#B8A98C', '#6E6250', '#1E2430', '#0C0B09'] },
        { name: 'Ege Sabahı', colors: ['#EDE7DA', '#A9B49B', '#7FA0A6', '#4E657A', '#22262B'] },
        { name: 'Narenciye Bahçesi', colors: ['#F0E6D0', '#D9A85F', '#C87F5D', '#7A5238', '#2B2018'] },
        { name: 'Beyaz Keten', colors: ['#F2EEE3', '#D6CDB8', '#A89F8A', '#5C5A50', '#101010'] },
    ],
    'Sonbahar–Kış': [
        { name: 'Arşiv', colors: ['#B08D57', '#6E2B35', '#3E4A3D', '#2B2B33', '#0C0B09'] },
        { name: 'Gece Treni', colors: ['#1E2430', '#31405C', '#6B7A8F', '#A39B8B', '#0B0C10'] },
        { name: 'Kestane & Kurşun', colors: ['#5C3A28', '#8C6D46', '#484744', '#23252A', '#0E0D0B'] },
        { name: 'Buz & Antrasit', colors: ['#D9DCDD', '#9FA6AB', '#5A6167', '#2E3338', '#121417'] },
    ],
    'Resort': [
        { name: 'Taş Avlu', colors: ['#EDE7DA', '#A9B49B', '#C87F5D', '#4E657A', '#0C0B09'] },
        { name: 'Tuz Gölü', colors: ['#F4EFE4', '#E3C9B0', '#C89A7A', '#7C8B94', '#1C2226'] },
        { name: 'Zümrüt Koy', colors: ['#E9E4D4', '#7FA08C', '#3E6B5D', '#274046', '#101413'] },
    ],
};

const STORY_OPENERS: Record<Segment, string[]> = {
    'Terzilik Evi': [
        'Klasik terziliğin cetvelle çizilmiş dünyası, {mood} bir yorumla yumuşuyor',
        'Atölyenin kalıp masasından çıkan bir gardırop; {mood} ama disiplinli',
        'El dikişi yaka, doğal omuz: terzilik mirası {mood} bir sezona taşınıyor',
    ],
    'Lüks Moda Evi': [
        'Sessiz lüksün grameri: {mood} dokular, isimsiz zenginlik',
        'Bir kadın, bir vitrin, bir şehir; {mood} bir zarafet anlatısı',
        'Arşivden çıkan bir ilham, {mood} bir kadına yeniden dikiliyor',
    ],
    'Modern Smart-Casual': [
        'Ofisten sahile tek valiz: {mood} ve fonksiyonel bir kapsül',
        'Şehirli bir ritim; {mood} katmanlar, teknik kumaşlar',
        'Hafta içi ve hafta sonu arasındaki çizgi siliniyor: {mood} bir seri',
    ],
    'Kadın Lüks': [
        'Kadın siluetinde mimari bir bakış; {mood} ve kararlı',
        'Kumaşın kadın bedeninde {mood} bir akışı; gündüzden geceye',
        'İpek ve yünün {mood} diyaloğu; zamansız bir dolap',
    ],
};

const STORY_CLOSERS = [
    'Palet, sezonun ışığından damıtıldı; her parça birbirinin cümlesini tamamlıyor.',
    'On iki parçalık çekirdek plan, kapsül olarak büyümeye hazır.',
    'Kumaş seçkisi Bursa ve Como tezgâhlarından; üretim planına hazır.',
    'Vitrin hikâyesi, kampanya filmi ve lookbook aynı DNA\'dan türetilebilir.',
];

function shuffled<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateConcepts(input: IdeaInput): CapsuleConcept[] {
    const seasonLabel = `${input.season.toUpperCase()} ${input.year}`;
    const titles = shuffled(TITLES);
    const palettes = shuffled(PALETTES[input.season]);
    const moodWords = input.mood
        .split(/[,;]+/)
        .map((m) => m.trim().toLowerCase())
        .filter(Boolean);
    const moodPhrase = moodWords.length ? moodWords.join(', ') : 'sakin, dokunsal';

    return [0, 1, 2].map((i) => {
        const palette = palettes[i % palettes.length];
        const pieces = shuffled(CATEGORIES[input.segment]).slice(0, 6);
        const names = shuffled(PIECE_NAMES);
        const opener = pick(STORY_OPENERS[input.segment]).replace('{mood}', moodPhrase);

        return {
            id: `fikir-${Date.now()}-${i}`,
            title: titles[i],
            season: seasonLabel,
            segment: input.segment,
            story: `${opener}. ${pick(STORY_CLOSERS)}`,
            mood: moodWords.length ? moodWords : ['sakin', 'dokunsal', palette.name.toLowerCase()],
            palette: palette.colors,
            keyPieces: pieces.map((p, j) => ({
                name: names[j],
                category: p.category,
                fabric: pick(p.fabrics),
            })),
        };
    });
}

export function conceptToCapsule(concept: CapsuleConcept): Capsule {
    return {
        id: concept.id,
        title: concept.title,
        season: concept.season,
        house: concept.segment.toUpperCase(),
        story: concept.story,
        mood: concept.mood,
        palette: concept.palette,
        looks: concept.keyPieces.map((piece, i) => ({
            id: `${concept.id}-${i}`,
            name: piece.name,
            category: piece.category,
            fabric: piece.fabric,
            colorHex: concept.palette[i % (concept.palette.length - 1)],
            accentHex: concept.palette[(i + 2) % concept.palette.length],
        })),
    };
}
