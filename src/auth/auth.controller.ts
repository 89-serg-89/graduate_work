import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
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

  // @Post('/reg')
  // async login (
  //   @Res() res,
  //   @Body(new JoiValidationPipe(createSchema)) body: CreateDto
  // ) {
  //   try {
  //     await this.usersService.create(body)
  //     res.status(HttpStatus.CREATED)
  //   } catch (e) {
  //     throw new HttpException(e, HttpStatus.BAD_REQUEST)
  //   }
  // }

  @Post('/login')
  async signIn (
    @Res() res,
    @Body(new JoiValidationPipe(signInSchema)) body
  ) {
    return await this.authService.login(body)
  }
}
