import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Res,
  UseGuards,
  SetMetadata,
  Query
} from '@nestjs/common'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { serialize } from '../helpers/utils'
import {
  registrationSchema,
  listSchema
} from './joi/users.schema'
import { CreateDto } from './dto/users.dto'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor (
    private usersService: UsersService
  ) {  }

  @Post('/client/register')
  async register (
    @Res() res,
    @Body(new JoiValidationPipe(registrationSchema)) body: CreateDto
  ) {
    try {
      const candidate = await this.usersService.findByEmail(body.email)
      if (candidate) {
        throw new HttpException('Email is busy', HttpStatus.BAD_REQUEST)
      }
      const user = await this.usersService.create(body)
      res.status(HttpStatus.CREATED)
      return serialize(['id', 'email', 'name', ], user)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/manager/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['manager'])
  async listManager (
    @Query(new JoiValidationPipe(listSchema)) query
  ) {
    try {
      return await this.usersService.search(query)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}
