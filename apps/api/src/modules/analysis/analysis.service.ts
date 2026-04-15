import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AiProviderFactory } from '../../common/ai/ai-provider.factory';

@Injectable()
export class AnalysisService {
    constructor(
        private prisma: PrismaService,
        private aiFactory: AiProviderFactory,
    ) {}

    async ingestSalesData(sku: string, unitsSold: number, returns: number) {
        const returnRate = unitsSold > 0 ? returns / unitsSold : 0;
        const sellThroughRate = unitsSold > 0 ? Math.min((unitsSold - returns) / unitsSold, 1) : 0;

        return this.prisma.performanceMetric.upsert({
            where: { sku },
            create: {
                sku,
                sellThroughRate,
                returnRate,
                customerSentiment: 0.7,
            },
            update: {
                sellThroughRate,
                returnRate,
            },
        });
    }

    async generateNextSeasonInsights(seasonId: string, userId: string) {
        const metrics = await this.prisma.performanceMetric.findMany({ take: 50 });
        const designs = await this.prisma.productDesign.findMany({
            where: { linePlan: { seasonId } },
            include: { linePlan: true, costSheet: true },
            take: 30,
        });

        const provider = await this.aiFactory.getForUser(userId);

        const dataContext = designs.length > 0
            ? `Sezon tasarım sayısı: ${designs.length}. Kategoriler: ${[...new Set(designs.map((d: any) => d.linePlan?.category))].join(', ')}`
            : 'Sezon verisi henüz yok, genel Türk moda pazarı trendleri için öneriler sun.';

        const prompt = `Türk hazır giyim markası için sezon sonu analizi yap.
${dataContext}
Performans metrikleri: ${metrics.length} SKU kaydı var.

Şu yapıda JSON döndür:
{
  "enIyiPerformancilar": ["string"],
  "dusukPerformancilar": ["string"],
  "gorusler": "string (2-3 cümle Türkçe analiz)",
  "gelecekSezonOnerileri": ["string (3-5 öneri)"],
  "kategoriInsight": "string"
}

Türk moda pazarına ve sezona özgü, pratik öneriler sun.`;

        type InsightDto = {
            enIyiPerformancilar: string[];
            dusukPerformancilar: string[];
            gorusler: string;
            gelecekSezonOnerileri: string[];
            kategoriInsight: string;
        };

        return provider.generateJson<InsightDto>(prompt, '{}');
    }
}
