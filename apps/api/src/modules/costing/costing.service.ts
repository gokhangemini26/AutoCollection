import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CostingService {
    constructor(private prisma: PrismaService) { }

    async getCostSheet(designId: string) {
        return this.prisma.costSheet.findUnique({ where: { designId } });
    }

    async calculateAndValidateCost(designId: string, costs: {
        fabricPrice: number;
        fabricYield: number;
        makePrice: number;
        logistics: number;
        dutyPercent: number;
        kdvOrani?: number;
    }) {
        // 1. Calculate Landed Cost
        const fabricCost = costs.fabricPrice * costs.fabricYield;
        const dutyCost = (fabricCost + costs.makePrice) * (costs.dutyPercent / 100);
        const landedCost = fabricCost + costs.makePrice + costs.logistics + dutyCost;

        // 2. Fetch Strategy Target (via Design -> LinePlan -> Season -> Strategy)
        const design = await this.prisma.productDesign.findUnique({
            where: { id: designId },
            include: {
                linePlan: {
                    include: {
                        season: { include: { strategyDoc: true } }
                    }
                }
            }
        });

        if (!design || !design.linePlan || !design.linePlan.season.strategyDoc) {
            throw new Error("Missing Strategy Context for this Design");
        }

        const { targetMargin } = design.linePlan.season.strategyDoc;
        const impliedRetail = landedCost / (1 - Number(targetMargin));
        const kdvOrani = costs.kdvOrani ?? 20;
        const kdvTutari = impliedRetail * (kdvOrani / 100);
        const kdvDahilFiyat = impliedRetail + kdvTutari;
        const achievedMargin = (impliedRetail - landedCost) / impliedRetail;

        await this.prisma.costSheet.upsert({
            where: { designId },
            create: {
                designId,
                rawMaterial: fabricCost,
                labor: costs.makePrice,
                logistics: costs.logistics,
                duty: dutyCost,
                targetRetail: impliedRetail,
                wholesalePrice: impliedRetail * 0.4,
                kdvOrani,
                isApproved: false,
            },
            update: {
                rawMaterial: fabricCost,
                labor: costs.makePrice,
                logistics: costs.logistics,
                duty: dutyCost,
                targetRetail: impliedRetail,
                wholesalePrice: impliedRetail * 0.4,
                kdvOrani,
            },
        });

        return {
            landedCost,
            kdvHaricFiyat: impliedRetail,
            kdvDahilFiyat,
            kdvOrani,
            wholesalePrice: impliedRetail * 0.4,
            achievedMargin,
            marginAchieved: achievedMargin >= 0.55,
            meta: { fabricCost, dutyCost },
        };
    }
}
