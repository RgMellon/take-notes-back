import { ChapterNotFoundException, NoteNotFoundException, StructuredDocumentNotFoundException } from '../../../../common/errors/not-found.error';
import { StructuredDocumentEntity } from '../../domain/structured-document.repository';
import { GenerateStructuredDocumentUseCase, GetStructuredDocumentUseCase } from './structured-document.use-cases';

const mockDoc: StructuredDocumentEntity = {
  id: 'doc-1',
  chapterId: 'ch-1',
  markdownContent: '# Clean Code\n\nContent...',
  frontmatter: { topic: 'clean-code', tags: ['refactoring', 'naming'] },
  generatedAt: new Date(),
};

const mockRepo = {
  findByChapter: jest.fn(),
  upsert: jest.fn(),
};

const mockNoteRepo = {
  findByChapter: jest.fn(),
};

const mockChapterRepo = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockAi = {
  generateStructuredMarkdown: jest.fn(),
};

describe('Structured Document Use Cases', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GenerateStructuredDocumentUseCase', () => {
    it('should generate and save a structured document', async () => {
      mockChapterRepo.findById.mockResolvedValue({ id: 'ch-1', title: 'Clean Code' });
      mockNoteRepo.findByChapter.mockResolvedValue({ id: 'note-1', content: 'raw notes...' });
      mockAi.generateStructuredMarkdown.mockResolvedValue({
        markdownContent: '# Clean Code\n\nContent...',
        frontmatter: { topic: 'clean-code', tags: ['refactoring', 'naming'] },
        tags: ['refactoring', 'naming'],
      });
      mockRepo.upsert.mockResolvedValue(mockDoc);
      mockChapterRepo.update.mockResolvedValue({});

      const useCase = new GenerateStructuredDocumentUseCase(
        mockRepo as any,
        mockNoteRepo as any,
        mockChapterRepo as any,
        mockAi as any,
      );

      const result = await useCase.execute('ch-1');
      expect(result).toEqual(mockDoc);
      expect(mockAi.generateStructuredMarkdown).toHaveBeenCalledWith('raw notes...', 'Clean Code');
      expect(mockChapterRepo.update).toHaveBeenCalledWith('ch-1', {
        tags: ['refactoring', 'naming'],
        status: 'STRUCTURED',
      });
    });

    it('should throw NotFoundException when chapter not found', async () => {
      mockChapterRepo.findById.mockResolvedValue(null);
      const useCase = new GenerateStructuredDocumentUseCase(
        mockRepo as any,
        mockNoteRepo as any,
        mockChapterRepo as any,
        mockAi as any,
      );
      await expect(useCase.execute('ch-x')).rejects.toThrow(ChapterNotFoundException);
    });

    it('should throw NotFoundException when note not found', async () => {
      mockChapterRepo.findById.mockResolvedValue({ id: 'ch-1', title: 'Clean Code' });
      mockNoteRepo.findByChapter.mockResolvedValue(null);
      const useCase = new GenerateStructuredDocumentUseCase(
        mockRepo as any,
        mockNoteRepo as any,
        mockChapterRepo as any,
        mockAi as any,
      );
      await expect(useCase.execute('ch-1')).rejects.toThrow(NoteNotFoundException);
    });
  });

  describe('GetStructuredDocumentUseCase', () => {
    it('should return a structured document', async () => {
      mockRepo.findByChapter.mockResolvedValue(mockDoc);
      const useCase = new GetStructuredDocumentUseCase(mockRepo as any);
      const result = await useCase.execute('ch-1');
      expect(result).toEqual(mockDoc);
    });

    it('should throw NotFoundException when document not found', async () => {
      mockRepo.findByChapter.mockResolvedValue(null);
      const useCase = new GetStructuredDocumentUseCase(mockRepo as any);
      await expect(useCase.execute('ch-x')).rejects.toThrow(StructuredDocumentNotFoundException);
    });
  });
});
