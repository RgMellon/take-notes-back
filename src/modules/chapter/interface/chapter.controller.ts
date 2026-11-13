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
  async create(@Param('bookId') bookId: string, @Body() dto: CreateChapterDto): Promise<ChapterResponseDto> {
    const chapter = await this.createChapter.execute(bookId, dto);
    return ChapterResponseDto.fromEntity(chapter);
  }

  @Get()
  async findAll(@Param('bookId') bookId: string): Promise<ChapterResponseDto[]> {
    const chapters = await this.listChapters.execute(bookId);
    return chapters.map(ChapterResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('bookId') bookId: string, @Param('id') id: string): Promise<ChapterResponseDto> {
    const chapter = await this.getChapter.execute(bookId, id);
    return ChapterResponseDto.fromEntity(chapter);
  }

  @Patch(':id')
  async update(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChapterDto,
  ): Promise<ChapterResponseDto> {
    const chapter = await this.updateChapter.execute(bookId, id, dto);
    return ChapterResponseDto.fromEntity(chapter);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('bookId') bookId: string, @Param('id') id: string): Promise<void> {
    await this.deleteChapter.execute(bookId, id);
  }
}
