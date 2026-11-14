import { GoogleGenAI } from '@google/genai';
import { AiProvider, GenerateResult } from './ai.interface';
import { SYSTEM_PROMPT } from './ai.prompt';

export class GeminiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1beta' } });
  }

  async generateStructuredMarkdown(
    rawNotes: string,
    chapterTitle: string,
  ): Promise<GenerateResult> {
    const start = Date.now();
    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Chapter title: ${chapterTitle}\n\nRaw notes:\n${rawNotes}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            frontmatter: {
              type: 'object',
              properties: {
                tags: { type: 'array', items: { type: 'string' } },
                chapter: { type: 'string' },
              },
            },
            markdown: { type: 'string' },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text ?? '{}');
    console.log('[Gemini]', { tokens: response.text?.length, ms: Date.now() - start });
    console.log('[Gemini] parsed ok');

    const tags = parsed.frontmatter?.tags ?? [];

    return {
      markdownContent: parsed.markdown,
      frontmatter: { ...parsed.frontmatter, topic: tags[0] ?? chapterTitle },
      tags,
    };
  }
}
