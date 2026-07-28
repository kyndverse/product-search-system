import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from '../models/response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response instanceof PaginatedResponse) {
          return {
            data: response.data,
            meta: response.meta,
          };
        }

        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: response,
        };
      }),
    );
  }
}
