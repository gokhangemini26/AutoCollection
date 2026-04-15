import { AiProviderInterface } from './ai-provider.interface';

export class GeminiProvider implements AiProviderInterface {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateText(prompt: string, systemPrompt?: string): Promise<string> {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
    }

    async generateJson<T>(prompt: string, jsonSchema: string): Promise<T> {
        const jsonPrompt = `${prompt}\n\nYANIT SADECE GEÇERLİ JSON OLMALIDIR. Markdown kullanma, sadece JSON döndür. Şema:\n${jsonSchema}`;
        const text = await this.generateText(jsonPrompt);

        // Extract JSON - handle markdown blocks and extra text
        let cleaned = text.trim();
        const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            cleaned = jsonMatch[1].trim();
        } else {
            // Find first { to last }
            const start = cleaned.indexOf('{');
            const end = cleaned.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                cleaned = cleaned.slice(start, end + 1);
            }
        }

        try {
            return JSON.parse(cleaned) as T;
        } catch {
            // Return empty fallback rather than crashing
            return JSON.parse(jsonSchema) as T;
        }
    }
}
