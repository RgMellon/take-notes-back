import { NotFoundException } from '@nestjs/common';
import { RawNoteEntity } from '../../domain/raw-note.repository';
import { GetNoteUseCase, UpsertNoteUseCase } from './note.use-cases';

const mockNote: RawNoteEntity = {
  id: 'note-1',
  chapterId: 'ch-1',
  content: 'Nomes devem revelar intenção.',
  updatedAt: new Date(),
};

const mockRepo = {
  findByChapter: jest.fn(),
  upsert: jest.fn(),
};

const mockChapterRepo = {
  findById: jest.fn(),
};

describe('Note Use Cases', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GetNoteUseCase', () => {
    it('should return a note', async () => {
      mockRepo.findByChapter.mockResolvedValue(mockNote);
      const useCase = new GetNoteUseCase(mockRepo as any);
      const result = await useCase.execute('ch-1');
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException when note not found', async () => {
      mockRepo.findByChapter.mockResolvedValue(null);
      const useCase = new GetNoteUseCase(mockRepo as any);
      await expect(useCase.execute('ch-x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpsertNoteUseCase', () => {
    it('should upsert a note', async () => {
      mockChapterRepo.findById.mockResolvedValue({ id: 'ch-1' });
      mockRepo.upsert.mockResolvedValue(mockNote);
      const useCase = new UpsertNoteUseCase(mockRepo as any, mockChapterRepo as any);
      const result = await useCase.execute('ch-1', { content: 'Nomes devem revelar intenção.' });
      expect(result).toEqual(mockNote);
      expect(mockRepo.upsert).toHaveBeenCalledWith('ch-1', 'Nomes devem revelar intenção.');
    });

    it('should throw NotFoundException when chapter not found', async () => {
      mockChapterRepo.findById.mockResolvedValue(null);
      const useCase = new UpsertNoteUseCase(mockRepo as any, mockChapterRepo as any);
      await expect(useCase.execute('ch-x', { content: 'test' })).rejects.toThrow(NotFoundException);
    });
  });
});
