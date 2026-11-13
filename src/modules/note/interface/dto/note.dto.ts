import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export interface NoteResponseDto {
  id: string;
  chapterId: string;
  content: string;
  updatedAt: Date;
}

export namespace NoteResponseDto {
  export function fromEntity(entity: {
    id: string;
    chapterId: string;
    content: string;
    updatedAt: Date;
  }): NoteResponseDto {
    return {
      id: entity.id,
      chapterId: entity.chapterId,
      content: entity.content,
      updatedAt: entity.updatedAt,
    };
  }
}
