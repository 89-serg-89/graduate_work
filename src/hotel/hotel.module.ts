import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Hotel, HotelSchema } from './schemas/hotel.schema'
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema'
import { HotelController } from './hotel.controller'
import { HotelService } from './hotel.service'
import { HotelRoomService } from './hotel-room.service'

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Hotel.name,
      schema: HotelSchema
    }]),
    MongooseModule.forFeature([{
      name: HotelRoom.name,
      schema: HotelRoomSchema
    }]),
  ],
  controllers: [HotelController],
  providers: [HotelService, HotelRoomService],
  exports: [HotelService, HotelRoomService]
})
export class HotelModule {  }
