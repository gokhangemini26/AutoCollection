import { Module } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController } from './approvals.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
    providers: [ApprovalsService, PrismaService],
    controllers: [ApprovalsController],
    exports: [ApprovalsService],
})
export class ApprovalsModule {}
