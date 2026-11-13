import { Module } from '@nestjs/common';
import { BookModule } from '../book/book.module';
import {
  CreateChapterUseCase,
  DeleteChapterUseCase,
  GetChapterUseCase,
  ListChaptersUseCase,
  UpdateChapterUseCase,
} from './application/use-cases/chapter.use-cases';
import { CHAPTER_REPOSITORY_TOKEN } from './domain/chapter.repository';
import { ChapterPrismaRepository } from './infra/persistence/chapter.prisma.repository';
import { ChapterController } from './interface/chapter.controller';

@Module({
  imports: [BookModule],
  controllers: [ChapterController],
  providers: [
    { provide: CHAPTER_REPOSITORY_TOKEN, useClass: ChapterPrismaRepository },
    CreateChapterUseCase,
    ListChaptersUseCase,
    GetChapterUseCase,
    UpdateChapterUseCase,
    DeleteChapterUseCase,
  ],
  exports: [CHAPTER_REPOSITORY_TOKEN],
})
export class ChapterModule {}
