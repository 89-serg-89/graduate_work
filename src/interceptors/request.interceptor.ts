import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common'
import { tap, Observable } from 'rxjs'

export interface Response<T> {
  status: string
  data: T
}

@Injectable()
export class RequestInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept (context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const res = context.switchToHttp().getResponse()
    return next
      .handle()
      .pipe(
        tap(data => {
          return res.json({
            status: 'success',
            data
          })
        })
      )
  }
}
