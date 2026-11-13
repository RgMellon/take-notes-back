export interface BookEntity {
  id: string;
  title: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookRepository {
  findAll(): Promise<BookEntity[]>;
  findById(id: string): Promise<BookEntity | null>;
  create(data: { title: string; author: string }): Promise<BookEntity>;
  update(
    id: string,
    data: { title?: string; author?: string },
  ): Promise<BookEntity>;
  delete(id: string): Promise<void>;
}

export const BOOK_REPOSITORY_TOKEN = 'BOOK_REPOSITORY_TOKEN';
