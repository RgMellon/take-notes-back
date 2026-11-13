import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
  GetNoteUseCase,
  UpsertNoteUseCase,
} from '../application/use-cases/note.use-cases';
import { NoteResponseDto, UpsertNoteDto } from './dto/note.dto';

@Controller('chapters/:chapterId/note')
export class NoteController {
  constructor(
    private readonly getNote: GetNoteUseCase,
    private readonly upsertNote: UpsertNoteUseCase,
  ) {}

  @Get()
  findOne(@Param('chapterId') chapterId: string): Promise<NoteResponseDto> {
    return this.getNote.execute(chapterId);
  }

  @Put()
  upsert(
    @Param('chapterId') chapterId: string,
    @Body() dto: UpsertNoteDto,
  ): Promise<NoteResponseDto> {
    return this.upsertNote.execute(chapterId, dto);
  }
}
