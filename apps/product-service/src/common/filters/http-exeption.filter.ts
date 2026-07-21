import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

type ExceptionResponse = {
  message?: string | string[];
  errors?: unknown;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errors: unknown;

    if (typeof exceptionResponse === 'string') {
      errors = exceptionResponse;
    } else {
      const res = exceptionResponse as ExceptionResponse;
      errors = res.errors ?? res.message;
    }

    response.status(status).json({ errors });
  }
}
