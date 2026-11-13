import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  CreateChapterUseCase,
  DeleteChapterUseCase,
  GetChapterUseCase,
  ListChaptersUseCase,
  UpdateChapterUseCase,
} from '../application/use-cases/chapter.use-cases';
import { ChapterResponseDto, CreateChapterDto, UpdateChapterDto } from './dto/chapter.dto';

@Controller('books/:bookId/chapters')
export class ChapterController {
  constructor(
    private readonly createChapter: CreateChapterUseCase,
    private readonly listChapters: ListChaptersUseCase,
    private readonly getChapter: GetChapterUseCase,
    private readonly updateChapter: UpdateChapterUseCase,
    private readonly deleteChapter: DeleteChapterUseCase,
  ) {}

  @Post()
  create(@Param('bookId') bookId: string, @Body() dto: CreateChapterDto): Promise<ChapterResponseDto> {
    return this.createChapter.execute(bookId, dto);
  }

  @Get()
  findAll(@Param('bookId') bookId: string): Promise<ChapterResponseDto[]> {
    return this.listChapters.execute(bookId);
  }

  @Get(':id')
  findOne(@Param('bookId') bookId: string, @Param('id') id: string): Promise<ChapterResponseDto> {
    return this.getChapter.execute(bookId, id);
  }

  @Patch(':id')
  update(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChapterDto,
  ): Promise<ChapterResponseDto> {
    return this.updateChapter.execute(bookId, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('bookId') bookId: string, @Param('id') id: string): Promise<void> {
    return this.deleteChapter.execute(bookId, id);
  }
}
