import { AiProviderInterface } from './ai-provider.interface';

export class GeminiProvider implements AiProviderInterface {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateText(prompt: string, systemPrompt?: string): Promise<string> {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
    }

    async generateJson<T>(prompt: string, jsonSchema: string): Promise<T> {
        const jsonPrompt = `${prompt}\n\nYANIT SADECE GEÇERLİ JSON OLMALIDIR. Şema:\n${jsonSchema}`;
        const text = await this.generateText(jsonPrompt);

        // Extract JSON from response (handle markdown code blocks)
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleaned) as T;
    }
}
