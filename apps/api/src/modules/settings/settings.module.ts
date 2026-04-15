import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
    providers: [SettingsService, PrismaService],
    controllers: [SettingsController],
    exports: [SettingsService],
})
export class SettingsModule {}
