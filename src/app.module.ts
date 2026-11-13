import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './modules/book/book.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { NoteModule } from './modules/note/note.module';
import { AiModule } from './modules/ai/ai.module';
import { StructuredModule } from './modules/structured/structured.module';

@Module({
  imports: [PrismaModule, BookModule, ChapterModule, NoteModule, AiModule, StructuredModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
