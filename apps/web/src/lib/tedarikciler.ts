export const TEDARIKCI_SEHIRLERI = [
    { sehir: 'Bursa', uzmanlik: 'Dokuma, İpekli, Kadife, Jakarlı' },
    { sehir: 'Çerkezköy (Tekirdağ)', uzmanlik: 'Örme, Triko, Denim, İnterlok' },
    { sehir: 'İstanbul (Bağcılar)', uzmanlik: 'Hazır giyim, Aksesuar, Küçük seri' },
    { sehir: 'İstanbul (Merter)', uzmanlik: 'Toptan kumaş, Çeşitli malzeme' },
    { sehir: 'Denizli', uzmanlik: 'Pamuklu, Keten, Müslin, Büyük seri' },
    { sehir: 'İzmir (Atatürk OSB)', uzmanlik: 'Denim, Pamuklu, İhracat odaklı' },
    { sehir: 'Konya', uzmanlik: 'Halı, Döşemelik, Ev tekstili' },
    { sehir: 'Diğer', uzmanlik: '' },
] as const;

export type TedarikciSehri = (typeof TEDARIKCI_SEHIRLERI)[number];
