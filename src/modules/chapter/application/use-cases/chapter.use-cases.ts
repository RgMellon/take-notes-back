import { Inject, Injectable } from '@nestjs/common';
import { BookNotFoundException, ChapterNotFoundException } from '../../../../common/errors/not-found.error';
import type { ChapterRepository } from '../../domain/chapter.repository';
import { CHAPTER_REPOSITORY_TOKEN } from '../../domain/chapter.repository';
import type { BookRepository } from '../../../book/domain/book.repository';
import { BOOK_REPOSITORY_TOKEN } from '../../../book/domain/book.repository';
import { ChapterResponseDto, CreateChapterDto, UpdateChapterDto } from '../../interface/dto/chapter.dto';

@Injectable()
export class CreateChapterUseCase {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository,
    @Inject(BOOK_REPOSITORY_TOKEN) private readonly bookRepo: BookRepository,
  ) {}

  async execute(bookId: string, dto: CreateChapterDto): Promise<ChapterResponseDto> {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw new BookNotFoundException(`Book ${bookId} not found`);
    const chapter = await this.repo.create({ ...dto, bookId, tags: dto.tags ?? [] });
    return ChapterResponseDto.fromEntity(chapter);
  }
}

@Injectable()
export class ListChaptersUseCase {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository,
    @Inject(BOOK_REPOSITORY_TOKEN) private readonly bookRepo: BookRepository,
  ) {}

  async execute(bookId: string): Promise<ChapterResponseDto[]> {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw new BookNotFoundException(`Book ${bookId} not found`);
    const chapters = await this.repo.findAllByBook(bookId);
    return chapters.map(ChapterResponseDto.fromEntity);
  }
}

@Injectable()
export class GetChapterUseCase {
  constructor(@Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository) {}

  async execute(bookId: string, id: string): Promise<ChapterResponseDto> {
    const chapter = await this.repo.findByBookAndId(bookId, id);
    if (!chapter) throw new ChapterNotFoundException(`Chapter ${id} not found`);
    return ChapterResponseDto.fromEntity(chapter);
  }
}

@Injectable()
export class UpdateChapterUseCase {
  constructor(@Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository) {}

  async execute(bookId: string, id: string, dto: UpdateChapterDto): Promise<ChapterResponseDto> {
    const chapter = await this.repo.findByBookAndId(bookId, id);
    if (!chapter) throw new ChapterNotFoundException(`Chapter ${id} not found`);
    const updated = await this.repo.update(id, dto);
    return ChapterResponseDto.fromEntity(updated);
  }
}

@Injectable()
export class DeleteChapterUseCase {
  constructor(@Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository) {}

  async execute(bookId: string, id: string): Promise<void> {
    const chapter = await this.repo.findByBookAndId(bookId, id);
    if (!chapter) throw new ChapterNotFoundException(`Chapter ${id} not found`);
    return this.repo.delete(id);
  }
}
