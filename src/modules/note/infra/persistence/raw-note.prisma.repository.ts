import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RawNoteEntity, RawNoteRepository } from '../../domain/raw-note.repository';

@Injectable()
export class RawNotePrismaRepository implements RawNoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByChapter(chapterId: string): Promise<RawNoteEntity | null> {
    return this.prisma.rawNote.findUnique({ where: { chapterId } });
  }

  upsert(chapterId: string, content: string): Promise<RawNoteEntity> {
    return this.prisma.rawNote.upsert({
      where: { chapterId },
      create: { chapterId, content },
      update: { content },
    });
  }
}
