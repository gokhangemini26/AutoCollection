import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
    providers: [StrategyService, PrismaService],
    controllers: [StrategyController],
    exports: [StrategyService],
})
export class StrategyModule {}
