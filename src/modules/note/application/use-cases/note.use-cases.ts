import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { RawNoteRepository } from '../../domain/raw-note.repository';
import { RAW_NOTE_REPOSITORY_TOKEN } from '../../domain/raw-note.repository';
import type { ChapterRepository } from '../../../chapter/domain/chapter.repository';
import { CHAPTER_REPOSITORY_TOKEN } from '../../../chapter/domain/chapter.repository';
import { UpsertNoteDto } from '../../interface/dto/note.dto';

@Injectable()
export class GetNoteUseCase {
  constructor(@Inject(RAW_NOTE_REPOSITORY_TOKEN) private readonly repo: RawNoteRepository) {}

  async execute(chapterId: string) {
    const note = await this.repo.findByChapter(chapterId);
    if (!note) throw new NotFoundException(`Note for chapter ${chapterId} not found`);
    return note;
  }
}

@Injectable()
export class UpsertNoteUseCase {
  constructor(
    @Inject(RAW_NOTE_REPOSITORY_TOKEN) private readonly repo: RawNoteRepository,
    @Inject(CHAPTER_REPOSITORY_TOKEN) private readonly chapterRepo: ChapterRepository,
  ) {}

  async execute(chapterId: string, dto: UpsertNoteDto) {
    const chapter = await this.chapterRepo.findById(chapterId);
    if (!chapter) throw new NotFoundException(`Chapter ${chapterId} not found`);
    return this.repo.upsert(chapterId, dto.content);
  }
}
