import { Module } from '@nestjs/common';
import { RemixEngineService } from './remix.engine';
import { VisualController } from './visual.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
    providers: [RemixEngineService, PrismaService],
    controllers: [VisualController],
    exports: [RemixEngineService],
})
export class VisualModule {}
