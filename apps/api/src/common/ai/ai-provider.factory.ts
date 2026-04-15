import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiProviderInterface } from './ai-provider.interface';
import { GeminiProvider } from './gemini.provider';
import { OpenAiProvider } from './openai.provider';
import { ClaudeProvider } from './claude.provider';
import { decrypt } from './crypto.util';

@Injectable()
export class AiProviderFactory {
    constructor(private prisma: PrismaService) {}

    async getForUser(userId: string): Promise<AiProviderInterface> {
        const keyRecord = await this.prisma.userApiKey.findFirst({
            where: { userId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });

        if (!keyRecord) {
            // Fall back to server-side Gemini key
            const fallbackKey = process.env.GEMINI_API_KEY;
            if (!fallbackKey) {
                throw new Error('Yapay Zeka API anahtarı bulunamadı. Ayarlar sayfasından API anahtarınızı ekleyin.');
            }
            return new GeminiProvider(fallbackKey);
        }

        const decryptedKey = decrypt(keyRecord.keyEncrypted);
        switch (keyRecord.provider) {
            case 'OPENAI':
                return new OpenAiProvider(decryptedKey);
            case 'CLAUDE':
                return new ClaudeProvider(decryptedKey);
            case 'GEMINI':
            default:
                return new GeminiProvider(decryptedKey);
        }
    }
}
