import { DomainError } from './domain.error';

export class BookNotFoundException extends DomainError {}
export class ChapterNotFoundException extends DomainError {}
export class NoteNotFoundException extends DomainError {}
export class StructuredDocumentNotFoundException extends DomainError {}
