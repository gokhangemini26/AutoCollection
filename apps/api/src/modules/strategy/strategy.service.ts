import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class StrategyService {
    constructor(private prisma: PrismaService) { }

    async createSeason(data: {
        name: string;
        budget: number;
        skuTarget: number;
        targetMargin?: number;
        startDate?: string;
        endDate?: string;
    }) {
        if (data.budget < 10000) {
            throw new BadRequestException('Minimum bütçe ₺10.000 olmalıdır.');
        }

        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const season = await tx.season.create({
                data: {
                    name: data.name,
                    startDate: data.startDate ? new Date(data.startDate) : new Date(),
                    endDate: data.endDate
                        ? new Date(data.endDate)
                        : new Date(new Date().setMonth(new Date().getMonth() + 6)),
                    status: 'PLANNED',
                },
            });

            await tx.strategyDoc.create({
                data: {
                    seasonId: season.id,
                    budgetCap: data.budget,
                    skuTargetCount: data.skuTarget,
                    targetMargin: data.targetMargin ?? 0.60,
                    keyDates: {},
                },
            });

            return tx.season.findUnique({
                where: { id: season.id },
                include: { strategyDoc: true },
            });
        });
    }

    async getAllSeasons() {
        return this.prisma.season.findMany({
            include: { strategyDoc: true },
            orderBy: { startDate: 'desc' },
        });
    }

    async getSeasonById(id: string) {
        return this.prisma.season.findUnique({
            where: { id },
            include: { strategyDoc: true, linePlan: true },
        });
    }

    async getActiveStrategies() {
        return this.prisma.season.findMany({
            where: { status: 'ACTIVE' },
            include: { strategyDoc: true },
        });
    }
}
