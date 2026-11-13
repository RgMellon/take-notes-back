export interface StructuredDocumentResponseDto {
  id: string;
  chapterId: string;
  markdownContent: string;
  frontmatter: Record<string, unknown>;
  generatedAt: Date;
}

export namespace StructuredDocumentResponseDto {
  export function fromEntity(entity: {
    id: string;
    chapterId: string;
    markdownContent: string;
    frontmatter: Record<string, unknown>;
    generatedAt: Date;
  }): StructuredDocumentResponseDto {
    return {
      id: entity.id,
      chapterId: entity.chapterId,
      markdownContent: entity.markdownContent,
      frontmatter: entity.frontmatter,
      generatedAt: entity.generatedAt,
    };
  }
}
