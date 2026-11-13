export type ChapterStatus = 'DRAFT' | 'STRUCTURED';

export interface ChapterEntity {
  id: string;
  bookId: string;
  number: number;
  title: string;
  tags: string[];
  status: ChapterStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChapterRepository {
  findAllByBook(bookId: string): Promise<ChapterEntity[]>;
  findById(id: string): Promise<ChapterEntity | null>;
  findByBookAndId(bookId: string, id: string): Promise<ChapterEntity | null>;
  create(data: { bookId: string; number: number; title: string; tags: string[] }): Promise<ChapterEntity>;
  update(id: string, data: { number?: number; title?: string; tags?: string[] }): Promise<ChapterEntity>;
  delete(id: string): Promise<void>;
}

export const CHAPTER_REPOSITORY_TOKEN = 'CHAPTER_REPOSITORY_TOKEN';
