import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ChapterModule } from '../chapter/chapter.module';
import { NoteModule } from '../note/note.module';
import { GenerateStructuredDocumentUseCase, GetStructuredDocumentUseCase } from './application/use-cases/structured-document.use-cases';
import { STRUCTURED_DOCUMENT_REPOSITORY_TOKEN } from './domain/structured-document.repository';
import { StructuredDocumentPrismaRepository } from './infra/persistence/structured-document.prisma.repository';
import { StructuredDocumentController } from './interface/structured-document.controller';

@Module({
  imports: [ChapterModule, NoteModule, AiModule],
  controllers: [StructuredDocumentController],
  providers: [
    { provide: STRUCTURED_DOCUMENT_REPOSITORY_TOKEN, useClass: StructuredDocumentPrismaRepository },
    GenerateStructuredDocumentUseCase,
    GetStructuredDocumentUseCase,
  ],
})
export class StructuredModule {}
