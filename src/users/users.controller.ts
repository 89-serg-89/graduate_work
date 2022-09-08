import { Body, Controller, HttpException, HttpStatus, Post, Get, Res, UseGuards, Req } from '@nestjs/common'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { createSchema, signInSchema } from './joi/users.schema'
import { CreateDto, SignInDto } from './dto/users.dto'
import { UsersService } from './users.service'
import { AuthService } from '../auth/auth.service'
import { JwtAuthGuard } from '../auth/guards/access.guard'

@Controller('api/users')
export class UsersController {
  constructor (
    private usersService: UsersService,
    private authService: AuthService
  ) {  }

  @Post('/signup')
  async signUp (
    @Res() res,
    @Body(new JoiValidationPipe(createSchema)) body: CreateDto
  ) {
    try {
      await this.usersService.create(body)
      res.status(HttpStatus.CREATED)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('/signin')
  async signIn (
    @Res() res,
    @Body(new JoiValidationPipe(signInSchema)) body: SignInDto
  ) {
    const auth = await this.authService.login(body)
    res.status(HttpStatus.OK)
    return auth
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile (@Req() req, @Res() res) {
    return req.user
  }
}
