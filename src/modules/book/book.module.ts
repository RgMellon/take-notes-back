import { Module } from '@nestjs/common';
import {
  CreateBookUseCase,
  DeleteBookUseCase,
  GetBookUseCase,
  ListBooksUseCase,
  UpdateBookUseCase,
} from './application/use-cases/book.use-cases';
import { BOOK_REPOSITORY_TOKEN } from './domain/book.repository';
import { BookPrismaRepository } from './infra/persistence/book.prisma.repository';
import { BookController } from './interface/book.controller';

@Module({
  controllers: [BookController],
  providers: [
    { provide: BOOK_REPOSITORY_TOKEN, useClass: BookPrismaRepository },
    CreateBookUseCase,
    ListBooksUseCase,
    GetBookUseCase,
    UpdateBookUseCase,
    DeleteBookUseCase,
  ],
  exports: [BOOK_REPOSITORY_TOKEN],
})
export class BookModule {}
