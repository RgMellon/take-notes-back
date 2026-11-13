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

export class BookResponseDto {
  id: string;
  title: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: { id: string; title: string; author: string; createdAt: Date; updatedAt: Date }): BookResponseDto {
    return Object.assign(new BookResponseDto(), entity);
  }
}
