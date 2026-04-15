import { AiProviderInterface } from './ai-provider.interface';

export class GeminiProvider implements AiProviderInterface {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateText(prompt: string, systemPrompt?: string): Promise<string> {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: this.apiKey });

        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text ?? '';
    }

    async generateJson<T>(prompt: string, jsonSchema: string): Promise<T> {
        const jsonPrompt = `${prompt}\n\nYANIT SADECE GEÇERLİ JSON OLMALIDIR. Markdown kullanma, sadece JSON döndür. Şema:\n${jsonSchema}`;
        const text = await this.generateText(jsonPrompt);

        let cleaned = text.trim();
        const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            cleaned = jsonMatch[1].trim();
        } else {
            const start = cleaned.indexOf('{');
            const end = cleaned.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                cleaned = cleaned.slice(start, end + 1);
            }
        }

        try {
            return JSON.parse(cleaned) as T;
        } catch {
            return JSON.parse(jsonSchema) as T;
        }
    }
}
