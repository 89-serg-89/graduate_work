import { Injectable } from '@nestjs/common'
import { Connection, Model } from 'mongoose'
import { InjectModel, InjectConnection } from '@nestjs/mongoose'
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { IHotelRoomService } from './hotel.interface'

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor (
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  create (data) {

  }

  findById (id) {

  }

  search (params) {

  }

  update (id) {

  }
}
