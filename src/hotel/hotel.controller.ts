import {
  Controller,
  Req,
  Get,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { HotelService } from './hotel.service'
import { HotelRoomService } from './hotel-room.service'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { searchHotelRoomSchema } from './joi/hotel.schema'

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
}
