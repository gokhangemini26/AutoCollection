import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AiProviderFactory } from '../../common/ai/ai-provider.factory';

@Module({
    providers: [AnalysisService, PrismaService, AiProviderFactory],
    controllers: [AnalysisController],
    exports: [AnalysisService],
})
export class AnalysisModule {}
