import { Injectable } from '@nestjs/common'
import { Connection, Model, Schema } from 'mongoose'
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

  findOne (params) {
    return this.HotelRoomModel.findOne(params)
      .select('id title description images hotel')
      .populate('hotel', 'id title description')
  }

  search (params: SearchRoomsParams) {
    return this.HotelRoomModel.find({
      isEnabled: params.isEnabled,
      hotel: params.hotel
    })
      .select('id title images hotel')
      .populate('hotel', 'id title')
      .skip(params.offset || 0)
      .limit(params.limit || 10)
      .exec()
  }
}
