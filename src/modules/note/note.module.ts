import { Module } from '@nestjs/common';
import { ChapterModule } from '../chapter/chapter.module';
import { GetNoteUseCase, UpsertNoteUseCase } from './application/use-cases/note.use-cases';
import { RAW_NOTE_REPOSITORY_TOKEN } from './domain/raw-note.repository';
import { RawNotePrismaRepository } from './infra/persistence/raw-note.prisma.repository';
import { NoteController } from './interface/note.controller';

@Module({
  imports: [ChapterModule],
  controllers: [NoteController],
  providers: [
    { provide: RAW_NOTE_REPOSITORY_TOKEN, useClass: RawNotePrismaRepository },
    GetNoteUseCase,
    UpsertNoteUseCase,
  ],
  exports: [RAW_NOTE_REPOSITORY_TOKEN],
})
export class NoteModule {}
