import { Injectable } from '@nestjs/common'
import { Connection, Model } from 'mongoose'
import { InjectModel, InjectConnection } from '@nestjs/mongoose'
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { IHotelRoomService, SearchRoomsParams } from './hotel.interface'

@Injectable()
export class HotelRoomService {
  constructor (
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  create (hotel, data, images) {
    const room = new this.HotelRoomModel({
      hotel,
      images,
      ...data,
    })
    return room.save()
  }

  // findById (id) {
  //
  // }
  //
  search (params: SearchRoomsParams) {
    return this.HotelRoomModel.find({
      id: params.hotel,
      isEnabled: params.isEnabled
    })
      .skip(params.offset)
      .limit(params.limit)
      .exec()
  }
  //
  // update (id) {
  //
  // }
}
