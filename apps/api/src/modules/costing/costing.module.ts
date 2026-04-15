import { Module } from '@nestjs/common';
import { CostingService } from './costing.service';
import { CostingController } from './costing.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
    providers: [CostingService, PrismaService],
    controllers: [CostingController],
    exports: [CostingService],
})
export class CostingModule {}
