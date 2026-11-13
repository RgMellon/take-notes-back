import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;
}

export interface BookResponseDto {
  id: string;
  title: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export namespace BookResponseDto {
  export function fromEntity(entity: { id: string; title: string; author: string; createdAt: Date; updatedAt: Date }): BookResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      author: entity.author,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
