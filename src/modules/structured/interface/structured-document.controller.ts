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
  generateDoc(@Param('chapterId') chapterId: string): Promise<StructuredDocumentResponseDto> {
    return this.generate.execute(chapterId);
  }

  @Get('structured')
  findOne(@Param('chapterId') chapterId: string): Promise<StructuredDocumentResponseDto> {
    return this.getDoc.execute(chapterId);
  }
}
