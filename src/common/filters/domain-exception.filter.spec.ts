import { HttpStatus } from '@nestjs/common';
import { DomainExceptionFilter } from './domain-exception.filter';
import {
  BookNotFoundException,
  ChapterNotFoundException,
  NoteNotFoundException,
  StructuredDocumentNotFoundException,
} from '../errors/not-found.error';
import { DomainError } from '../errors/domain.error';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
const mockSwitchToHttp = jest.fn().mockReturnValue({ getResponse: mockGetResponse });
const mockHost = { switchToHttp: mockSwitchToHttp } as any;

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
    jest.clearAllMocks();
  });

  it.each([
    ['BookNotFoundException', new BookNotFoundException('Book x not found')],
    ['ChapterNotFoundException', new ChapterNotFoundException('Chapter x not found')],
    ['NoteNotFoundException', new NoteNotFoundException('Note x not found')],
    ['StructuredDocumentNotFoundException', new StructuredDocumentNotFoundException('Doc x not found')],
  ])('should return 404 for %s', (_name, exception) => {
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      error: exception.name,
      message: exception.message,
    });
  });

  it('should return 500 for unknown DomainError', () => {
    class UnknownDomainError extends DomainError {}
    const exception = new UnknownDomainError('something went wrong');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'UnknownDomainError',
      message: 'something went wrong',
    });
  });
});
