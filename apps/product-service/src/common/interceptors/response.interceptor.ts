import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MESSAGE_KEY } from '../decorators/response-message.decorator';
import { PaginatedResponse } from '../models/response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message = this.reflector.get<string>(
      MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((response) => {
        if (response instanceof PaginatedResponse) {
          return {
            data: response.data,
            meta: response.meta,
            message,
          };
        }

        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: response,
          message,
        };
      }),
    );
  }
}
