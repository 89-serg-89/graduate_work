import {
  Controller,
  Req,
  Post,
  Get,
  Put,
  Query,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { HotelService } from './hotel.service'
import { HotelRoomService } from './hotel-room.service'
import {
  createHotelAdminSchema,
  createHotelRoomsAdminSchema,
  searchHotelAdminSchema,
  searchHotelRoomSchema, updateHotelRoomsAdminSchema
} from './joi/hotel.schema'
import { diskStorage } from 'multer'

@Controller('api/')
export class HotelController {
  constructor (
    private hotelService: HotelService,
    private hotelRoomService: HotelRoomService
  ) {  }

  @Get('/admin/hotels')
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

  @Post('/admin/hotels')
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

  @Put('/admin/hotels/:id')
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

  @Post('admin/hotel-rooms')
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

  @Put('admin/hotel-rooms/:id')
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

  @Get('common/hotel-rooms')
  async findHotelRoomsAll (
    @Req() req,
    @Query(new JoiValidationPipe(searchHotelRoomSchema)) query
  ) {
    try {
      const params = { ...query }
      const user = req.user

      if (!user || user?.role === 'client') params.isEnabled = true

      return await this.hotelRoomService.search(params)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('common/hotel-rooms/:id')
  async findHotelRoom (
    @Req() req,
    @Param('id') id: string
  ) {
    try {
      const params = { id, isEnabled: undefined }
      const user = req.user

      if (!user || user?.role === 'client') params.isEnabled = true

      return await this.hotelRoomService.findOne(params)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}
