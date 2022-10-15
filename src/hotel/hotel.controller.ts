import {
  Controller,
  Req,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { HotelService } from './hotel.service'
import { HotelRoomService } from './hotel-room.service'
import {
  searchHotelRoomSchema
} from './joi/hotel.schema'

@Controller('/common')
export class HotelController {
  constructor (
    private hotelService: HotelService,
    private hotelRoomService: HotelRoomService
  ) {  }

  @Get('/hotel-rooms')
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

  @Get('/hotel-rooms/:id')
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
