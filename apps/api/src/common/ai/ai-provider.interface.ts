export interface AiProviderInterface {
    generateText(prompt: string, systemPrompt?: string): Promise<string>;
    generateJson<T>(prompt: string, jsonSchema: string): Promise<T>;
}
