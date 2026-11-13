import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './modules/book/book.module';
import { ChapterModule } from './modules/chapter/chapter.module';

@Module({
  imports: [PrismaModule, BookModule, ChapterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
