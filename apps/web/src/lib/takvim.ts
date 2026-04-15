export const SEZON_SABLONLARI = [
    { ad: 'İlkbahar/Yaz 2026', baslangic: '2026-02-01', bitis: '2026-07-31', kod: 'IY26' },
    { ad: 'Sonbahar/Kış 2026', baslangic: '2026-08-01', bitis: '2027-01-31', kod: 'SK26' },
    { ad: 'Ara Sezon İlkbahar 2026', baslangic: '2026-04-01', bitis: '2026-05-31', kod: 'AS26I' },
    { ad: 'Ara Sezon Sonbahar 2026', baslangic: '2026-09-01', bitis: '2026-10-31', kod: 'AS26S' },
    { ad: 'İlkbahar/Yaz 2025', baslangic: '2025-02-01', bitis: '2025-07-31', kod: 'IY25' },
    { ad: 'Sonbahar/Kış 2025', baslangic: '2025-08-01', bitis: '2026-01-31', kod: 'SK25' },
] as const;

export type SezonSablonu = (typeof SEZON_SABLONLARI)[number];

export const ANAHTAR_TARIHLER: Record<string, {
    koleksiyonKapanis: string;
    tasarimTeslim: string;
    orneklemeBitisi: string;
    magazaGiris: string;
}> = {
    IY26: {
        koleksiyonKapanis: '2025-10-15',
        tasarimTeslim: '2025-11-01',
        orneklemeBitisi: '2026-01-15',
        magazaGiris: '2026-02-15',
    },
    SK26: {
        koleksiyonKapanis: '2026-03-15',
        tasarimTeslim: '2026-04-01',
        orneklemeBitisi: '2026-06-15',
        magazaGiris: '2026-08-15',
    },
    SK25: {
        koleksiyonKapanis: '2025-03-15',
        tasarimTeslim: '2025-04-01',
        orneklemeBitisi: '2025-06-15',
        magazaGiris: '2025-08-15',
    },
};
