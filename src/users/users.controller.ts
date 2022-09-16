import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Res,
  UseGuards,
  Req,
  SetMetadata
} from '@nestjs/common'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { createSchema } from './joi/users.schema'
import { CreateDto } from './dto/users.dto'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

@Controller('api')
export class UsersController {
  constructor (
    private usersService: UsersService
  ) {  }

  @Post('/client/register')
  async register (
    @Res() res,
    @Body(new JoiValidationPipe(createSchema)) body: CreateDto
  ) {
    try {
      const candidate = await this.usersService.findByEmail(body.email)
      if (candidate) {
        throw new HttpException('Email is busy', HttpStatus.BAD_REQUEST)
      }
      const user = await this.usersService.create(body)
      res.status(HttpStatus.CREATED)
      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/client/profile')
  @SetMetadata('roles', ['client'])
  async profile (@Req() req, @Res() res) {
    return req.user
  }
}
