import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { HotelService } from './hotel.service'

@Controller('api/')
export class HotelController {
  constructor (private hotelService: HotelService) {
  }

  @Get('common/hotel-rooms')
  findAll (
    @Param('limit') limit: number,
    @Param('offset ') offset: number,
    @Param('title ') title: string
  ) {
    try {
      // return this.hotelService.search({ limit, offset, title })
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}
