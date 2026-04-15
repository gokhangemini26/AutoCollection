import { AiProviderInterface } from './ai-provider.interface';

export class ClaudeProvider implements AiProviderInterface {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateText(prompt: string, systemPrompt?: string): Promise<string> {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        const client = new Anthropic({ apiKey: this.apiKey });

        const resp = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 2048,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
        });
        return (resp.content[0] as any).text ?? '';
    }

    async generateJson<T>(prompt: string, jsonSchema: string): Promise<T> {
        const text = await this.generateText(
            prompt,
            `Sen bir JSON üretici asistansın. Yanıtını YALNIZCA geçerli JSON olarak döndür. Şema: ${jsonSchema}`,
        );
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleaned) as T;
    }
}
