import { Inject, Injectable } from '@nestjs/common';
import { ChapterNotFoundException, NoteNotFoundException } from '../../../../common/errors/not-found.error';
import type { RawNoteRepository } from '../../domain/raw-note.repository';
import { RAW_NOTE_REPOSITORY_TOKEN } from '../../domain/raw-note.repository';
import type { ChapterRepository } from '../../../chapter/domain/chapter.repository';
import { CHAPTER_REPOSITORY_TOKEN } from '../../../chapter/domain/chapter.repository';
import { NoteResponseDto, UpsertNoteDto } from '../../interface/dto/note.dto';

@Injectable()
export class GetNoteUseCase {
  constructor(@Inject(RAW_NOTE_REPOSITORY_TOKEN) private readonly repo: RawNoteRepository) {}

  async execute(chapterId: string): Promise<NoteResponseDto> {
    const note = await this.repo.findByChapter(chapterId);
    if (!note) throw new NoteNotFoundException(`Note for chapter ${chapterId} not found`);
    return NoteResponseDto.fromEntity(note);
  }
}

@Injectable()
export class UpsertNoteUseCase {
  constructor(
    @Inject(RAW_NOTE_REPOSITORY_TOKEN) private readonly repo: RawNoteRepository,
    @Inject(CHAPTER_REPOSITORY_TOKEN) private readonly chapterRepo: ChapterRepository,
  ) {}

  async execute(chapterId: string, dto: UpsertNoteDto): Promise<NoteResponseDto> {
    const chapter = await this.chapterRepo.findById(chapterId);
    if (!chapter) throw new ChapterNotFoundException(`Chapter ${chapterId} not found`);
    const note = await this.repo.upsert(chapterId, dto.content);
    return NoteResponseDto.fromEntity(note);
  }
}
