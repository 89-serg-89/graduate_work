import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const exceptionResponse = exception.getResponse()
    let status = exception.getStatus()

    if (typeof exceptionResponse === 'object' && exceptionResponse['status']) {
      status = exceptionResponse['status']
    }

    response
      .status(status)
      .json({
        status: 'fail',
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        data: (typeof exceptionResponse === 'object'
          ? exceptionResponse['message']
          : exceptionResponse) || 'error'
      })
  }
}
