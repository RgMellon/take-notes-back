import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GetNoteUseCase, UpsertNoteUseCase } from '../application/use-cases/note.use-cases';
import { NoteResponseDto, UpsertNoteDto } from './dto/note.dto';

@Controller('chapters/:chapterId/note')
export class NoteController {
  constructor(
    private readonly getNote: GetNoteUseCase,
    private readonly upsertNote: UpsertNoteUseCase,
  ) {}

  @Get()
  async findOne(@Param('chapterId') chapterId: string): Promise<NoteResponseDto> {
    const note = await this.getNote.execute(chapterId);
    return NoteResponseDto.fromEntity(note);
  }

  @Put()
  async upsert(@Param('chapterId') chapterId: string, @Body() dto: UpsertNoteDto): Promise<NoteResponseDto> {
    const note = await this.upsertNote.execute(chapterId, dto);
    return NoteResponseDto.fromEntity(note);
  }
}
