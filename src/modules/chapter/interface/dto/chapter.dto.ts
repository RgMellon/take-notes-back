import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export type ChapterStatus = 'DRAFT' | 'STRUCTURED';

export class CreateChapterDto {
  @IsInt()
  @Min(1)
  number: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateChapterDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  number?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export interface ChapterResponseDto {
  id: string;
  bookId: string;
  number: number;
  title: string;
  tags: string[];
  status: ChapterStatus;
  createdAt: Date;
  updatedAt: Date;
}

export namespace ChapterResponseDto {
  export function fromEntity(entity: {
    id: string;
    bookId: string;
    number: number;
    title: string;
    tags: string[];
    status: ChapterStatus;
    createdAt: Date;
    updatedAt: Date;
  }): ChapterResponseDto {
    return {
      id: entity.id,
      bookId: entity.bookId,
      number: entity.number,
      title: entity.title,
      tags: entity.tags,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
