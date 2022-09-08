import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RequestInterceptor } from './interceptors/request.interceptor'
import { HttpExceptionFilter } from './filters/http-exception.filter'

const PORT = process.env.PORT || 3005

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new RequestInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(PORT)
  console.log(`Server listen in port:${PORT}`)
}
bootstrap()
