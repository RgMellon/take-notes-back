import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BookRepository } from '../../domain/book.repository';
import { BOOK_REPOSITORY_TOKEN } from '../../domain/book.repository';
import { CreateBookDto } from '../../interface/dto/book.dto';

@Injectable()
export class CreateBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  execute(dto: CreateBookDto) {
    return this.repo.create(dto);
  }
}

@Injectable()
export class ListBooksUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  execute() {
    return this.repo.findAll();
  }
}

@Injectable()
export class GetBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(id: string) {
    const book = await this.repo.findById(id);
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }
}

@Injectable()
export class UpdateBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(id: string, dto: Partial<CreateBookDto>) {
    const book = await this.repo.findById(id);
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return this.repo.update(id, dto);
  }
}

@Injectable()
export class DeleteBookUseCase {
  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private readonly repo: BookRepository) {}

  async execute(id: string) {
    const book = await this.repo.findById(id);
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return this.repo.delete(id);
  }
}
