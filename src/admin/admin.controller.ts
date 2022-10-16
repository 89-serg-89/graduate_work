import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus, Param,
  Post, Put,
  Query,
  Res,
  SetMetadata, UploadedFiles,
  UseGuards, UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { listSchema } from '../users/joi/users.schema'
import { CreateDto } from '../users/dto/users.dto'
import { UsersService } from '../users/users.service'
import { HotelService } from '../hotel/hotel.service'
import { HotelRoomService } from '../hotel/hotel-room.service'
import { serialize } from '../helpers/utils'
import {
  createHotelAdminSchema,
  createHotelRoomsAdminSchema,
  searchHotelAdminSchema,
  updateHotelRoomsAdminSchema
} from './joi/admin.schema'
import { createAdminSchema } from './joi/admin.schema'

@Controller('/admin')
export class AdminController {
  constructor (
    private usersService: UsersService,
    private hotelService: HotelService,
    private hotelRoomService: HotelRoomService
  ) {  }

  @Post('/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async createAdmin (
    @Res() res,
    @Body(new JoiValidationPipe(createAdminSchema)) body: CreateDto
  ) {
    try {
      const candidate = await this.usersService.findByEmail(body.email)
      if (candidate) {
        throw new HttpException('Email is busy', HttpStatus.BAD_REQUEST)
      }
      const user = await this.usersService.create(body)
      res.status(HttpStatus.CREATED)
      return serialize(['id', 'email', 'name', 'contactPhone', 'role'], user)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async listAdmin (
    @Query(new JoiValidationPipe(listSchema)) query
  ) {
    try {
      return await this.usersService.search(query)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async profile (
    @Param('id') id: string
  ) {
    try {
      return await this.usersService.findById(id)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/hotels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async findAllAdmin (
    @Query(new JoiValidationPipe(searchHotelAdminSchema)) query
  ) {
    try {
      return await this.hotelService.search(query)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('/hotels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async createHotel (
    @Body(new JoiValidationPipe(createHotelAdminSchema)) body
  ) {
    try {
      const hotel = await this.hotelService.create(body)
      return {
        id: hotel.id.toString(),
        title: hotel.title,
        description: hotel.description
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Put('/hotels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async updateHotel (
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createHotelAdminSchema)) body
  ) {
    try {
      const candidate = await this.hotelService.findById(id)
      if (!candidate) {
        throw new HttpException('there is no hotel with this id', HttpStatus.BAD_REQUEST)
      }
      const hotel = await this.hotelService.update(candidate, body)

      return {
        id: hotel.id.toString(),
        title: hotel.title,
        description: hotel.description
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('/hotel-rooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @UseInterceptors(FilesInterceptor(
    'images',
    10,
    {
      storage: diskStorage({
        destination: './assets/uploads',
        filename: (req, file: Express.Multer.File, cb) => {
          const filenameSplit = file.originalname.split('.')
          const fileExt = filenameSplit[filenameSplit.length - 1]
          cb(null, `${Date.now()}.${fileExt}`)
        }
      })
    }
  ))
  async createHotelRooms (
    @Body(new JoiValidationPipe(createHotelRoomsAdminSchema)) body,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    try {
      const hotel = await this.hotelService.findById(body.hotelId)
      if (!hotel) {
        throw new HttpException('there is no hotel with this id', HttpStatus.BAD_REQUEST)
      }
      const room = await this.hotelRoomService.create(hotel, body, files.map(i => i.filename))

      return {
        id: room.id,
        title: room.title,
        description: room.description,
        images: room.images,
        isEnabled: room.isEnabled,
        hotel: {
          id: hotel.id,
          title: hotel.title,
          description: hotel.description,
        }
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Put('/hotel-rooms/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @UseInterceptors(FilesInterceptor(
    'images',
    10,
    {
      storage: diskStorage({
        destination: './assets/uploads',
        filename: (req, file: Express.Multer.File, cb) => {
          const filenameSplit = file.originalname.split('.')
          const fileExt = filenameSplit[filenameSplit.length - 1]
          cb(null, `${Date.now()}.${fileExt}`)
        }
      })
    }
  ))
  async updateHotelRooms (
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateHotelRoomsAdminSchema)) body,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    try {
      const findRoom = await this.hotelRoomService.findById(id)
      if (!findRoom) {
        throw new HttpException('there is no hotel room with this id', HttpStatus.BAD_REQUEST)
      }
      const hotel = await this.hotelService.findById(body.hotelId)
      if (!hotel) {
        throw new HttpException('there is no hotel with this id', HttpStatus.BAD_REQUEST)
      }
      const room = await this.hotelRoomService.update(
        findRoom,
        hotel,
        body,
        files.map(i => i.filename)
      )

      return {
        id: room.id,
        title: room.title,
        description: room.description,
        images: room.images,
        isEnabled: room.isEnabled,
        hotel: {
          id: hotel.id,
          title: hotel.title,
          description: hotel.description,
        }
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}