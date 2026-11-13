import OpenAI from 'openai';
import { AiProvider, GenerateResult } from './ai.interface';
import { SYSTEM_PROMPT } from './ai.prompt';

export class OpenAiProvider implements AiProvider {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateStructuredMarkdown(rawNotes: string, chapterTitle: string): Promise<GenerateResult> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Chapter title: ${chapterTitle}\n\nRaw notes:\n${rawNotes}` },
      ],
      response_format: { type: 'json_object' },
    });

    const text = response.choices[0]?.message?.content ?? '';
    const parsed = JSON.parse(text.trim());

    return {
      markdownContent: parsed.markdown,
      frontmatter: parsed.frontmatter,
      tags: parsed.frontmatter?.tags ?? [],
    };
  }
}
