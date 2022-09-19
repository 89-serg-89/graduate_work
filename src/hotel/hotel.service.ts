import { Injectable } from '@nestjs/common'
import { Connection, Model } from 'mongoose'
import { InjectModel, InjectConnection } from '@nestjs/mongoose'
import { Hotel, HotelDocument } from './schemas/hotel.schema'
import { IHotelService } from './hotel.interface'

@Injectable()
export class HotelService implements IHotelService {
  constructor (
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  create (data) {
    const hotel = new this.HotelModel(data)
    return hotel.save()
  }

  update (hotel, data) {
    hotel.title = data.title
    hotel.description = data.description
    hotel.updatedAt = new Date()
    return hotel.save()
  }

  findById (id) {
    return this.HotelModel.findById(id).exec()
  }

  search (params) {
    return this.HotelModel.find({
      title: { '$regex': params?.title || '', '$options': 'i' },
    })
      .select('id title description')
      .skip(params.offset)
      .limit(params.limit)
      .exec()
  }
}
