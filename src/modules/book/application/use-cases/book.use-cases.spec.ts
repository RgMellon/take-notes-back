import { NotFoundException } from '@nestjs/common';
import { BookEntity } from '../../domain/book.repository';
import {
  CreateBookUseCase,
  DeleteBookUseCase,
  GetBookUseCase,
  ListBooksUseCase,
  UpdateBookUseCase,
} from './book.use-cases';

const mockBook: BookEntity = {
  id: 'uuid-1',
  title: 'Clean Code',
  author: 'Robert Martin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Book Use Cases', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('CreateBookUseCase', () => {
    it('should create a book', async () => {
      mockRepo.create.mockResolvedValue(mockBook);
      const useCase = new CreateBookUseCase(mockRepo as any);
      const result = await useCase.execute({ title: 'Clean Code', author: 'Robert Martin' });
      expect(result).toEqual(mockBook);
      expect(mockRepo.create).toHaveBeenCalledWith({ title: 'Clean Code', author: 'Robert Martin' });
    });
  });

  describe('ListBooksUseCase', () => {
    it('should return all books', async () => {
      mockRepo.findAll.mockResolvedValue([mockBook]);
      const useCase = new ListBooksUseCase(mockRepo as any);
      const result = await useCase.execute();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('GetBookUseCase', () => {
    it('should return a book by id', async () => {
      mockRepo.findById.mockResolvedValue(mockBook);
      const useCase = new GetBookUseCase(mockRepo as any);
      const result = await useCase.execute('uuid-1');
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const useCase = new GetBookUseCase(mockRepo as any);
      await expect(useCase.execute('uuid-x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateBookUseCase', () => {
    it('should update a book', async () => {
      const updated = { ...mockBook, title: 'Clean Architecture' };
      mockRepo.findById.mockResolvedValue(mockBook);
      mockRepo.update.mockResolvedValue(updated);
      const useCase = new UpdateBookUseCase(mockRepo as any);
      const result = await useCase.execute('uuid-1', { title: 'Clean Architecture' });
      expect(result.title).toBe('Clean Architecture');
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const useCase = new UpdateBookUseCase(mockRepo as any);
      await expect(useCase.execute('uuid-x', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteBookUseCase', () => {
    it('should delete a book', async () => {
      mockRepo.findById.mockResolvedValue(mockBook);
      mockRepo.delete.mockResolvedValue(undefined);
      const useCase = new DeleteBookUseCase(mockRepo as any);
      await expect(useCase.execute('uuid-1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const useCase = new DeleteBookUseCase(mockRepo as any);
      await expect(useCase.execute('uuid-x')).rejects.toThrow(NotFoundException);
    });
  });
});
