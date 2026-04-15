import { AiProviderInterface } from './ai-provider.interface';

export class OpenAiProvider implements AiProviderInterface {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateText(prompt: string, systemPrompt?: string): Promise<string> {
        const OpenAI = (await import('openai')).default;
        const client = new OpenAI({ apiKey: this.apiKey });

        const messages: any[] = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const resp = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
        });
        return resp.choices[0].message.content ?? '';
    }

    async generateJson<T>(prompt: string, jsonSchema: string): Promise<T> {
        const OpenAI = (await import('openai')).default;
        const client = new OpenAI({ apiKey: this.apiKey });

        const resp = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: `Yanıtını her zaman geçerli JSON olarak ver. Şema: ${jsonSchema}` },
                { role: 'user', content: prompt },
            ],
        });
        return JSON.parse(resp.choices[0].message.content ?? '{}') as T;
    }
}
