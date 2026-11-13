import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { AiProvider } from '../../../ai/ai.interface';
import { AI_PROVIDER_TOKEN } from '../../../ai/ai.interface';
import type { ChapterRepository } from '../../../chapter/domain/chapter.repository';
import { CHAPTER_REPOSITORY_TOKEN } from '../../../chapter/domain/chapter.repository';
import type { RawNoteRepository } from '../../../note/domain/raw-note.repository';
import { RAW_NOTE_REPOSITORY_TOKEN } from '../../../note/domain/raw-note.repository';
import type { StructuredDocumentRepository } from '../../domain/structured-document.repository';
import { STRUCTURED_DOCUMENT_REPOSITORY_TOKEN } from '../../domain/structured-document.repository';
import { StructuredDocumentResponseDto } from '../../interface/dto/structured-document.dto';

@Injectable()
export class GenerateStructuredDocumentUseCase {
  constructor(
    @Inject(STRUCTURED_DOCUMENT_REPOSITORY_TOKEN) private readonly repo: StructuredDocumentRepository,
    @Inject(RAW_NOTE_REPOSITORY_TOKEN) private readonly noteRepo: RawNoteRepository,
    @Inject(CHAPTER_REPOSITORY_TOKEN) private readonly chapterRepo: ChapterRepository,
    @Inject(AI_PROVIDER_TOKEN) private readonly ai: AiProvider,
  ) {}

  async execute(chapterId: string): Promise<StructuredDocumentResponseDto> {
    const chapter = await this.chapterRepo.findById(chapterId);
    if (!chapter) throw new NotFoundException(`Chapter ${chapterId} not found`);

    const note = await this.noteRepo.findByChapter(chapterId);
    if (!note) throw new NotFoundException(`Note for chapter ${chapterId} not found`);

    const result = await this.ai.generateStructuredMarkdown(note.content, chapter.title);
    const doc = await this.repo.upsert(chapterId, result.markdownContent, result.frontmatter);
    await this.chapterRepo.update(chapterId, { tags: result.tags, status: 'STRUCTURED' });

    return StructuredDocumentResponseDto.fromEntity(doc);
  }
}

@Injectable()
export class GetStructuredDocumentUseCase {
  constructor(
    @Inject(STRUCTURED_DOCUMENT_REPOSITORY_TOKEN) private readonly repo: StructuredDocumentRepository,
  ) {}

  async execute(chapterId: string): Promise<StructuredDocumentResponseDto> {
    const doc = await this.repo.findByChapter(chapterId);
    if (!doc) throw new NotFoundException(`Structured document for chapter ${chapterId} not found`);
    return StructuredDocumentResponseDto.fromEntity(doc);
  }
}
