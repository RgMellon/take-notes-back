import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../errors/domain.error';
import {
  BookNotFoundException,
  ChapterNotFoundException,
  NoteNotFoundException,
  StructuredDocumentNotFoundException,
} from '../errors/not-found.error';
import { ChapterNumberConflictException } from '../errors/conflict.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.resolveStatus(exception);

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }

  private resolveStatus(exception: DomainError): HttpStatus {
    if (
      exception instanceof BookNotFoundException ||
      exception instanceof ChapterNotFoundException ||
      exception instanceof NoteNotFoundException ||
      exception instanceof StructuredDocumentNotFoundException
    ) {
      return HttpStatus.NOT_FOUND;
    }

    if (exception instanceof ChapterNumberConflictException) {
      return HttpStatus.CONFLICT;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
