import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AiProviderFactory } from '../../common/ai/ai-provider.factory';

const TREND_SYSTEM_PROMPT = `Sen Türk moda endüstrisi için çalışan uzman bir trend analisti asistansın.
Yanıtlarını SADECE Türkçe olarak ver.
Türk pazarı dinamiklerini, Türk tüketici alışkanlıklarını ve Türkiye'deki moda takvimini göz önünde bulundur.
Bursa, İstanbul, Çerkezköy tekstil merkezlerini ve yerel tedarikçileri referans al.
Fiyatları TL cinsinden düşün.`;

const TREND_JSON_SCHEMA = `{
  "baslik": "string",
  "ozet": "string (2-3 cümle)",
  "anahtarKelimeler": ["string (5-7 adet)"],
  "renkPaleti": [{ "isim": "string", "hex": "#RRGGBB", "aciklama": "string" }],
  "kumasSonerileri": [{ "malzeme": "string", "tedarikMerkezi": "string", "neden": "string" }],
  "kategoriOnerileri": [{ "kategori": "string", "oncelik": "YUKSEK|ORTA|DUSUK", "aciklama": "string" }],
  "duyguSkoru": 0.85
}`;

@Injectable()
export class TrendAgentService {
    constructor(
        private prisma: PrismaService,
        private aiFactory: AiProviderFactory,
    ) {}

    async generateTrendReport(query: string, userId: string) {
        const provider = await this.aiFactory.getForUser(userId);

        const prompt = `"${query}" sezonu için kapsamlı bir Türk moda trendi raporu hazırla.
Şu başlıkları içermeli:
1. Sezon özeti
2. Anahtar trend kelimeleri (5-7 adet)
3. Renk paleti (5 renk: isim, HEX kodu ve kısa açıklama)
4. Kumaş önerileri (Türk tedarik merkezleri dahil: Bursa/Çerkezköy/İstanbul/Denizli)
5. Kategori yatırım önerileri (hangi kategoriye bütçe artırılmalı)
6. Genel duygu skoru (0.0-1.0)

Yanıtı belirtilen JSON şemasına uygun ver.`;

        type TrendDto = {
            baslik: string;
            ozet: string;
            anahtarKelimeler: string[];
            renkPaleti: { isim: string; hex: string; aciklama: string }[];
            kumasSonerileri: { malzeme: string; tedarikMerkezi: string; neden: string }[];
            kategoriOnerileri: { kategori: string; oncelik: string; aciklama: string }[];
            duyguSkoru: number;
        };

        const result = await provider.generateJson<TrendDto>(prompt, TREND_JSON_SCHEMA);

        // Persist to DB (non-blocking)
        try {
            const report = await this.prisma.trendReport.create({
                data: {
                    title: result.baslik || `${query} Trend Raporu`,
                    summary: result.ozet || '',
                    sentimentScore: typeof result.duyguSkoru === 'number' ? result.duyguSkoru : 0.75,
                    keywords: result.anahtarKelimeler || [],
                    sourceUrls: [],
                    images: [],
                },
            });
            return { ...result, id: report.id };
        } catch {
            return result;
        }
    }
}
