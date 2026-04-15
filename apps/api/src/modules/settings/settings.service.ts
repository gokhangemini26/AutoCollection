import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { encrypt, decrypt } from '../../common/ai/crypto.util';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) {}

    async saveApiKey(userId: string, provider: 'GEMINI' | 'OPENAI' | 'CLAUDE', rawKey: string) {
        const keyEncrypted = encrypt(rawKey);
        return this.prisma.userApiKey.upsert({
            where: { userId_provider: { userId, provider } },
            create: { userId, provider, keyEncrypted, isActive: true },
            update: { keyEncrypted, isActive: true },
        });
    }

    async getActiveProvider(userId: string) {
        const key = await this.prisma.userApiKey.findFirst({
            where: { userId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return key ? { provider: key.provider } : { provider: 'GEMINI' };
    }

    async deactivateKey(userId: string, provider: 'GEMINI' | 'OPENAI' | 'CLAUDE') {
        return this.prisma.userApiKey.updateMany({
            where: { userId, provider },
            data: { isActive: false },
        });
    }
}
