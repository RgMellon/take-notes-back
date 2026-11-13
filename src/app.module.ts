import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './modules/book/book.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [PrismaModule, BookModule, ChapterModule, NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
