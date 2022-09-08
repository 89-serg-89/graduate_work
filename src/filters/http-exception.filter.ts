import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

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
