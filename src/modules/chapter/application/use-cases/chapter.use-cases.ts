import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ChapterRepository } from '../../domain/chapter.repository';
import { CHAPTER_REPOSITORY_TOKEN } from '../../domain/chapter.repository';
import type { BookRepository } from '../../../book/domain/book.repository';
import { BOOK_REPOSITORY_TOKEN } from '../../../book/domain/book.repository';
import { CreateChapterDto, UpdateChapterDto } from '../../interface/dto/chapter.dto';

@Injectable()
export class CreateChapterUseCase {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository,
    @Inject(BOOK_REPOSITORY_TOKEN) private readonly bookRepo: BookRepository,
  ) {}

  async execute(bookId: string, dto: CreateChapterDto) {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw new NotFoundException(`Book ${bookId} not found`);
    return this.repo.create({ ...dto, bookId, tags: dto.tags ?? [] });
  }
}

@Injectable()
export class ListChaptersUseCase {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository,
    @Inject(BOOK_REPOSITORY_TOKEN) private readonly bookRepo: BookRepository,
  ) {}

  async execute(bookId: string) {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw new NotFoundException(`Book ${bookId} not found`);
    return this.repo.findAllByBook(bookId);
  }
}

@Injectable()
export class GetChapterUseCase {
  constructor(@Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository) {}

  async execute(bookId: string, id: string) {
    const chapter = await this.repo.findByBookAndId(bookId, id);
    if (!chapter) throw new NotFoundException(`Chapter ${id} not found`);
    return chapter;
  }
}

@Injectable()
export class UpdateChapterUseCase {
  constructor(@Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository) {}

  async execute(bookId: string, id: string, dto: UpdateChapterDto) {
    const chapter = await this.repo.findByBookAndId(bookId, id);
    if (!chapter) throw new NotFoundException(`Chapter ${id} not found`);
    return this.repo.update(id, dto);
  }
}

@Injectable()
export class DeleteChapterUseCase {
  constructor(@Inject(CHAPTER_REPOSITORY_TOKEN) private readonly repo: ChapterRepository) {}

  async execute(bookId: string, id: string) {
    const chapter = await this.repo.findByBookAndId(bookId, id);
    if (!chapter) throw new NotFoundException(`Chapter ${id} not found`);
    return this.repo.delete(id);
  }
}
