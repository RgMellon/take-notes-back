import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  CreateBookUseCase,
  DeleteBookUseCase,
  GetBookUseCase,
  ListBooksUseCase,
  UpdateBookUseCase,
} from '../application/use-cases/book.use-cases';
import { BookResponseDto, CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Controller('books')
export class BookController {
  constructor(
    private readonly createBook: CreateBookUseCase,
    private readonly listBooks: ListBooksUseCase,
    private readonly getBook: GetBookUseCase,
    private readonly updateBook: UpdateBookUseCase,
    private readonly deleteBook: DeleteBookUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return this.createBook.execute(dto);
  }

  @Get()
  findAll(): Promise<BookResponseDto[]> {
    return this.listBooks.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return this.getBook.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto): Promise<BookResponseDto> {
    return this.updateBook.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.deleteBook.execute(id);
  }
}
