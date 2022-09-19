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
  SetMetadata
} from '@nestjs/common'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { HotelService } from './hotel.service'
import { HotelRoomService } from './hotel-room.service'
import {
  createHotelAdminSchema,
  searchHotelAdminSchema,
  searchHotelRoomSchema
} from './joi/hotel.schema'

@Controller('api/')
export class HotelController {
  constructor (
    private hotelService: HotelService,
    private hotelRoomService: HotelRoomService
  ) {  }

  @Get('common/hotel-rooms')
  async findAll (
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
}
