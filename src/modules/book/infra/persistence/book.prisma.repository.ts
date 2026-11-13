import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BookEntity, BookRepository } from '../../domain/book.repository';

@Injectable()
export class BookPrismaRepository implements BookRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<BookEntity[]> {
    return this.prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string): Promise<BookEntity | null> {
    return this.prisma.book.findUnique({ where: { id } });
  }

  create(data: { title: string; author: string }): Promise<BookEntity> {
    return this.prisma.book.create({ data });
  }

  update(
    id: string,
    data: { title?: string; author?: string },
  ): Promise<BookEntity> {
    return this.prisma.book.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.book.delete({ where: { id } });
  }
}
