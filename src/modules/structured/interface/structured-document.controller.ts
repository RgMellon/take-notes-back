import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  GenerateStructuredDocumentUseCase,
  GetStructuredDocumentUseCase,
} from '../application/use-cases/structured-document.use-cases';
import { StructuredDocumentResponseDto } from './dto/structured-document.dto';

@Controller('chapters/:chapterId')
export class StructuredDocumentController {
  constructor(
    private readonly generate: GenerateStructuredDocumentUseCase,
    private readonly getDoc: GetStructuredDocumentUseCase,
  ) {}

  @Post('generate')
  @HttpCode(200)
  async generateDoc(@Param('chapterId') chapterId: string): Promise<StructuredDocumentResponseDto> {
    const doc = await this.generate.execute(chapterId);
    return StructuredDocumentResponseDto.fromEntity(doc);
  }

  @Get('structured')
  async findOne(@Param('chapterId') chapterId: string): Promise<StructuredDocumentResponseDto> {
    const doc = await this.getDoc.execute(chapterId);
    return StructuredDocumentResponseDto.fromEntity(doc);
  }
}
