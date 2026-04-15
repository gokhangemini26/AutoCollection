import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

const GECERLI_KATEGORILER = [
    'Elbise', 'Bluz', 'Pantolon', 'Dış Giyim', 'Triko',
    'Denim', 'Aksesuar', 'Etek', 'Şort', 'Tulum',
];

@Injectable()
export class CollectionService {
    constructor(private prisma: PrismaService) {}

    async getLinePlan(seasonId: string) {
        return this.prisma.linePlanItem.findMany({
            where: { seasonId },
            include: { productDesign: true },
            orderBy: [{ category: 'asc' }, { pricePoint: 'asc' }],
        });
    }

    async createLinePlanItem(data: {
        seasonId: string;
        category: string;
        pricePoint: 'ENTRY' | 'CORE' | 'PREMIUM';
    }) {
        if (!GECERLI_KATEGORILER.includes(data.category)) {
            throw new BadRequestException(`Geçersiz kategori: ${data.category}`);
        }

        const existing = await this.prisma.linePlanItem.findFirst({
            where: {
                seasonId: data.seasonId,
                category: data.category,
                pricePoint: data.pricePoint,
            },
        });

        if (existing) {
            throw new BadRequestException('Bu kategori/fiyat kombinasyonu zaten mevcut.');
        }

        return this.prisma.linePlanItem.create({ data });
    }

    async createDesign(data: {
        linePlanId: string;
        skuPlaceholder: string;
        designerId: string;
        notes?: string;
    }) {
        return this.prisma.productDesign.create({
            data: {
                linePlanId: data.linePlanId,
                skuPlaceholder: data.skuPlaceholder,
                designerId: data.designerId,
                status: 'DRAFT',
                techPack: data.notes ? { notlar: data.notes } : {},
            },
        });
    }

    async getDesigns(seasonId: string) {
        return this.prisma.productDesign.findMany({
            where: {
                linePlan: { seasonId },
            },
            include: {
                linePlan: true,
                costSheet: true,
                samples: true,
                fabricOptions: true,
            },
        });
    }
}
