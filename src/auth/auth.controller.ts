import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { signInSchema } from './joi/auth.schema'
import { AuthService } from './auth.service'

@Controller('api/auth')
export class AuthController {
  constructor (
    private authService: AuthService
  ) {  }

  @Post('/login')
  async signIn (
    @Res() res,
    @Body(new JoiValidationPipe(signInSchema)) body
  ) {
    return await this.authService.login(body)
  }
}
