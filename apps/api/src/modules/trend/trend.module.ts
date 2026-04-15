import { Module } from '@nestjs/common';
import { TrendAgentService } from './trend.agent';
import { TrendController } from './trend.controller';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AiProviderFactory } from '../../common/ai/ai-provider.factory';

@Module({
    providers: [TrendAgentService, PrismaService, AiProviderFactory],
    controllers: [TrendController],
    exports: [TrendAgentService],
})
export class TrendModule {}
