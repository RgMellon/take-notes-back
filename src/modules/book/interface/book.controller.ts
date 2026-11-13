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
  async create(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    const book = await this.createBook.execute(dto);
    return BookResponseDto.fromEntity(book);
  }

  @Get()
  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.listBooks.execute();
    return books.map(BookResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookResponseDto> {
    const book = await this.getBook.execute(id);
    return BookResponseDto.fromEntity(book);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto): Promise<BookResponseDto> {
    const book = await this.updateBook.execute(id, dto);
    return BookResponseDto.fromEntity(book);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteBook.execute(id);
  }
}
