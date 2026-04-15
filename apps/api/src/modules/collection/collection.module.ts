import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
    providers: [CollectionService, PrismaService],
    controllers: [CollectionController],
    exports: [CollectionService],
})
export class CollectionModule {}
