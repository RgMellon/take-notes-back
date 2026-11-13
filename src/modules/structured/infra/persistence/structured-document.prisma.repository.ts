import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  StructuredDocumentEntity,
  StructuredDocumentRepository,
} from '../../domain/structured-document.repository';

@Injectable()
export class StructuredDocumentPrismaRepository implements StructuredDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByChapter(chapterId: string): Promise<StructuredDocumentEntity | null> {
    return this.prisma.structuredDocument.findUnique({
      where: { chapterId },
    }) as Promise<StructuredDocumentEntity | null>;
  }

  upsert(
    chapterId: string,
    markdownContent: string,
    frontmatter: Record<string, unknown>,
  ): Promise<StructuredDocumentEntity> {
    const fm = frontmatter as Prisma.InputJsonValue;
    return this.prisma.structuredDocument.upsert({
      where: { chapterId },
      create: { chapterId, markdownContent, frontmatter: fm },
      update: { markdownContent, frontmatter: fm, generatedAt: new Date() },
    }) as Promise<StructuredDocumentEntity>;
  }
}
