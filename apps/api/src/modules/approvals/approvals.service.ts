import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

const APPROVED_ROLES = ['GM', 'ADMIN'];

@Injectable()
export class ApprovalsService {
    constructor(private prisma: PrismaService) {}

    async approve(data: {
        approverId: string;
        approverRole: string;
        entityType: string;
        entityId: string;
        verdict: 'APPROVED' | 'REJECTED';
        notes?: string;
    }) {
        if (!APPROVED_ROLES.includes(data.approverRole)) {
            throw new ForbiddenException('Yalnızca GM veya ADMIN onay verebilir.');
        }

        // Business rule: Cost sheet must have margin >= 55%
        if (data.entityType === 'COST_SHEET') {
            const sheet = await this.prisma.costSheet.findUnique({
                where: { id: data.entityId },
                include: { design: { include: { linePlan: { include: { season: { include: { strategyDoc: true } } } } } } },
            });
            if (!sheet) throw new BadRequestException('Maliyet tablosu bulunamadı.');

            const landed = Number(sheet.rawMaterial) + Number(sheet.labor) + Number(sheet.logistics) + Number(sheet.duty);
            const retail = Number(sheet.targetRetail);
            const margin = retail > 0 ? (retail - landed) / retail : 0;

            if (data.verdict === 'APPROVED' && margin < 0.55) {
                throw new BadRequestException(
                    `Marj İhlali: Mevcut marj %${(margin * 100).toFixed(1)}, minimum %55 gerekli.`
                );
            }

            // Update cost sheet
            await this.prisma.costSheet.update({
                where: { id: data.entityId },
                data: { isApproved: data.verdict === 'APPROVED' },
            });
        }

        if (data.entityType === 'DESIGN') {
            const costSheet = await this.prisma.costSheet.findFirst({
                where: { designId: data.entityId },
            });
            if (!costSheet && data.verdict === 'APPROVED') {
                throw new BadRequestException(
                    'Tasarım onaylanmadan önce maliyet tablosu oluşturulmalıdır.'
                );
            }

            await this.prisma.productDesign.update({
                where: { id: data.entityId },
                data: { status: data.verdict === 'APPROVED' ? 'APPROVED' : 'DROPPED' },
            });
        }

        // Record approval
        return this.prisma.approval.create({
            data: {
                entityType: data.entityType,
                entityId: data.entityId,
                approverId: data.approverId,
                verdict: data.verdict,
                notes: data.notes,
            },
        });
    }

    async getApprovals(entityId: string) {
        return this.prisma.approval.findMany({
            where: { entityId },
            include: { approver: { select: { name: true, email: true } } },
            orderBy: { timestamp: 'desc' },
        });
    }
}
