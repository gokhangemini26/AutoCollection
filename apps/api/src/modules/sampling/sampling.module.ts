import { Module } from '@nestjs/common';
import { SamplingService } from './sampling.service';
import { SamplingController } from './sampling.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
    providers: [SamplingService, PrismaService],
    controllers: [SamplingController],
    exports: [SamplingService],
})
export class SamplingModule {}
