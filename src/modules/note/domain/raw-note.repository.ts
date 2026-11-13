export interface RawNoteEntity {
  id: string;
  chapterId: string;
  content: string;
  updatedAt: Date;
}

export interface RawNoteRepository {
  findByChapter(chapterId: string): Promise<RawNoteEntity | null>;
  upsert(chapterId: string, content: string): Promise<RawNoteEntity>;
}

export const RAW_NOTE_REPOSITORY_TOKEN = 'RAW_NOTE_REPOSITORY_TOKEN';
