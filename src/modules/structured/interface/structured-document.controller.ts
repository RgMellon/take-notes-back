import { Body, Controller, Get, Header, HttpCode, Param, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  GenerateStructuredDocumentUseCase,
  GetStructuredDocumentUseCase,
  UpdateStructuredDocumentUseCase,
} from '../application/use-cases/structured-document.use-cases';
import { StructuredDocumentResponseDto, UpdateStructuredDocumentDto } from './dto/structured-document.dto';

@Controller('chapters/:chapterId')
export class StructuredDocumentController {
  constructor(
    private readonly generate: GenerateStructuredDocumentUseCase,
    private readonly getDoc: GetStructuredDocumentUseCase,
    private readonly updateDoc: UpdateStructuredDocumentUseCase,
  ) {}

  @Post('generate')
  @HttpCode(200)
  generateDoc(
    @Param('chapterId') chapterId: string,
  ): Promise<StructuredDocumentResponseDto> {
    return this.generate.execute(chapterId);
  }

  @Put('structured')
  update(
    @Param('chapterId') chapterId: string,
    @Body() body: UpdateStructuredDocumentDto,
  ): Promise<StructuredDocumentResponseDto> {
    return this.updateDoc.execute(chapterId, body.markdownContent, body.frontmatter ?? {});
  }

  @Get('structured/preview')
  async preview(
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ): Promise<void> {
    const doc = await this.getDoc.execute(chapterId);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(doc.markdownContent);
  }

  @Get('structured')
  findOne(
    @Param('chapterId') chapterId: string,
  ): Promise<StructuredDocumentResponseDto> {
    return this.getDoc.execute(chapterId);
  }
}
