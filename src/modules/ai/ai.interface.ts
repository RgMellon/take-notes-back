export interface GenerateResult {
  markdownContent: string;
  frontmatter: Record<string, unknown>;
  tags: string[];
}

export interface AiProvider {
  generateStructuredMarkdown(
    rawNotes: string,
    chapterTitle: string,
  ): Promise<GenerateResult>;
}

export const AI_PROVIDER_TOKEN = 'AI_PROVIDER_TOKEN';
