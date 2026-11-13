import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BookRepository } from '../../domain/book.repository';
import { BOOK_REPOSITORY_TOKEN } from '../../domain/book.repository';
import { BookResponseDto, CreateBookDto } from '../../interface/dto/book.dto';

@Injectable()
export class CreateBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(dto: CreateBookDto): Promise<BookResponseDto> {
    const book = await this.repo.create(dto);
    return BookResponseDto.fromEntity(book);
  }
}

@Injectable()
export class ListBooksUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(): Promise<BookResponseDto[]> {
    const books = await this.repo.findAll();
    return books.map(BookResponseDto.fromEntity);
  }
}

@Injectable()
export class GetBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(id: string): Promise<BookResponseDto> {
    const book = await this.repo.findById(id);
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return BookResponseDto.fromEntity(book);
  }
}

@Injectable()
export class UpdateBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(id: string, dto: Partial<CreateBookDto>): Promise<BookResponseDto> {
    const book = await this.repo.findById(id);
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    const updated = await this.repo.update(id, dto);
    return BookResponseDto.fromEntity(updated);
  }
}

@Injectable()
export class DeleteBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(id: string): Promise<void> {
    const book = await this.repo.findById(id);
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return this.repo.delete(id);
  }
}
