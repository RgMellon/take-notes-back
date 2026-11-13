import { BookNotFoundException, ChapterNotFoundException } from '../../../../common/errors/not-found.error';
import { ChapterEntity } from '../../domain/chapter.repository';
import {
  CreateChapterUseCase,
  DeleteChapterUseCase,
  GetChapterUseCase,
  ListChaptersUseCase,
  UpdateChapterUseCase,
} from './chapter.use-cases';

const mockChapter: ChapterEntity = {
  id: 'ch-1',
  bookId: 'book-1',
  number: 1,
  title: 'Nomes Significativos',
  tags: [],
  status: 'DRAFT',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo = {
  findAllByBook: jest.fn(),
  findById: jest.fn(),
  findByBookAndId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockBookRepo = {
  findById: jest.fn(),
};

describe('Chapter Use Cases', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('CreateChapterUseCase', () => {
    it('should create a chapter', async () => {
      mockBookRepo.findById.mockResolvedValue({ id: 'book-1' });
      mockRepo.create.mockResolvedValue(mockChapter);
      const useCase = new CreateChapterUseCase(mockRepo as any, mockBookRepo as any);
      const result = await useCase.execute('book-1', { number: 1, title: 'Nomes Significativos' });
      expect(result).toEqual(mockChapter);
    });

    it('should throw NotFoundException when book not found', async () => {
      mockBookRepo.findById.mockResolvedValue(null);
      const useCase = new CreateChapterUseCase(mockRepo as any, mockBookRepo as any);
      await expect(useCase.execute('book-x', { number: 1, title: 'Test' })).rejects.toThrow(BookNotFoundException);
    });
  });

  describe('ListChaptersUseCase', () => {
    it('should return chapters for a book', async () => {
      mockBookRepo.findById.mockResolvedValue({ id: 'book-1' });
      mockRepo.findAllByBook.mockResolvedValue([mockChapter]);
      const useCase = new ListChaptersUseCase(mockRepo as any, mockBookRepo as any);
      const result = await useCase.execute('book-1');
      expect(result).toEqual([mockChapter]);
    });

    it('should throw NotFoundException when book not found', async () => {
      mockBookRepo.findById.mockResolvedValue(null);
      const useCase = new ListChaptersUseCase(mockRepo as any, mockBookRepo as any);
      await expect(useCase.execute('book-x')).rejects.toThrow(BookNotFoundException);
    });
  });

  describe('GetChapterUseCase', () => {
    it('should return a chapter', async () => {
      mockRepo.findByBookAndId.mockResolvedValue(mockChapter);
      const useCase = new GetChapterUseCase(mockRepo as any);
      const result = await useCase.execute('book-1', 'ch-1');
      expect(result).toEqual(mockChapter);
    });

    it('should throw NotFoundException when chapter not found', async () => {
      mockRepo.findByBookAndId.mockResolvedValue(null);
      const useCase = new GetChapterUseCase(mockRepo as any);
      await expect(useCase.execute('book-1', 'ch-x')).rejects.toThrow(ChapterNotFoundException);
    });
  });

  describe('UpdateChapterUseCase', () => {
    it('should update a chapter', async () => {
      const updated = { ...mockChapter, title: 'Funções' };
      mockRepo.findByBookAndId.mockResolvedValue(mockChapter);
      mockRepo.update.mockResolvedValue(updated);
      const useCase = new UpdateChapterUseCase(mockRepo as any);
      const result = await useCase.execute('book-1', 'ch-1', { title: 'Funções' });
      expect(result.title).toBe('Funções');
    });

    it('should throw NotFoundException when chapter not found', async () => {
      mockRepo.findByBookAndId.mockResolvedValue(null);
      const useCase = new UpdateChapterUseCase(mockRepo as any);
      await expect(useCase.execute('book-1', 'ch-x', {})).rejects.toThrow(ChapterNotFoundException);
    });
  });

  describe('DeleteChapterUseCase', () => {
    it('should delete a chapter', async () => {
      mockRepo.findByBookAndId.mockResolvedValue(mockChapter);
      mockRepo.delete.mockResolvedValue(undefined);
      const useCase = new DeleteChapterUseCase(mockRepo as any);
      await expect(useCase.execute('book-1', 'ch-1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when chapter not found', async () => {
      mockRepo.findByBookAndId.mockResolvedValue(null);
      const useCase = new DeleteChapterUseCase(mockRepo as any);
      await expect(useCase.execute('book-1', 'ch-x')).rejects.toThrow(ChapterNotFoundException);
    });
  });
});
