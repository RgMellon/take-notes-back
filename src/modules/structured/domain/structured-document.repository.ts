export interface StructuredDocumentEntity {
  id: string;
  chapterId: string;
  markdownContent: string;
  frontmatter: Record<string, unknown>;
  generatedAt: Date;
}

export interface StructuredDocumentRepository {
  findByChapter(chapterId: string): Promise<StructuredDocumentEntity | null>;
  upsert(chapterId: string, markdownContent: string, frontmatter: Record<string, unknown>): Promise<StructuredDocumentEntity>;
}

export const STRUCTURED_DOCUMENT_REPOSITORY_TOKEN = 'STRUCTURED_DOCUMENT_REPOSITORY_TOKEN';
