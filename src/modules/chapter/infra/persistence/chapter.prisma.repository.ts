import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  ChapterEntity,
  ChapterRepository,
  ChapterStatus,
} from '../../domain/chapter.repository';

@Injectable()
export class ChapterPrismaRepository implements ChapterRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByBook(bookId: string): Promise<ChapterEntity[]> {
    return this.prisma.chapter.findMany({
      where: { bookId },
      orderBy: { number: 'asc' },
    });
  }

  findById(id: string): Promise<ChapterEntity | null> {
    return this.prisma.chapter.findUnique({ where: { id } });
  }

  findByBookAndId(bookId: string, id: string): Promise<ChapterEntity | null> {
    return this.prisma.chapter.findFirst({ where: { id, bookId } });
  }

  create(data: {
    bookId: string;
    number: number;
    title: string;
    tags: string[];
  }): Promise<ChapterEntity> {
    return this.prisma.chapter.create({ data });
  }

  update(
    id: string,
    data: {
      number?: number;
      title?: string;
      tags?: string[];
      status?: ChapterStatus;
    },
  ): Promise<ChapterEntity> {
    return this.prisma.chapter.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chapter.delete({ where: { id } });
  }
}
