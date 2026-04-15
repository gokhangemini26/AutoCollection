import { Module, Global } from '@nestjs/common';
import { AiProviderFactory } from './ai-provider.factory';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
    providers: [AiProviderFactory, PrismaService],
    exports: [AiProviderFactory],
})
export class AiModule {}
