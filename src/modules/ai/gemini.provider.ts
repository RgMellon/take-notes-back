import { GoogleGenAI } from '@google/genai';
import { AiProvider, GenerateResult } from './ai.interface';
import { SYSTEM_PROMPT } from './ai.prompt';

export class GeminiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateStructuredMarkdown(rawNotes: string, chapterTitle: string): Promise<GenerateResult> {
    const response = await this.client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Chapter title: ${chapterTitle}\n\nRaw notes:\n${rawNotes}`,
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    const text = response.text ?? '';
    const parsed = JSON.parse(text.trim());

    return {
      markdownContent: parsed.markdown,
      frontmatter: parsed.frontmatter,
      tags: parsed.frontmatter?.tags ?? [],
    };
  }
}
