import { Injectable } from '@nestjs/common'
import { Connection, Model } from 'mongoose'
import { InjectModel, InjectConnection } from '@nestjs/mongoose'
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { IHotelRoomService, SearchRoomsParams } from './hotel.interface'

@Injectable()
export class HotelRoomService implements IHotelRoomService {
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

  update (room, hotel, data, images) {
    room.title = data.title
    room.description = data.description
    room.isEnabled = data.isEnabled
    room.images = [...room.images, ...images]
    room.hotel = hotel
    room.updatedAt = new Date()
    return room.save()
  }

  findById (id) {
    return this.HotelRoomModel.findById(id).exec()
  }

  search (params: SearchRoomsParams) {
    return this.HotelRoomModel.find({
      id: params.hotel,
      isEnabled: params.isEnabled
    })
      .skip(params.offset)
      .limit(params.limit)
      .exec()
  }
}
