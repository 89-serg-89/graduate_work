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
    return this.HotelModel.find(data).exec()[0]
  }

  findById (id) {
    return this.HotelModel.findById(id).exec()
  }

  search (params) {
    return this.HotelModel.find().exec()
    // return this.HotelModel.find({
    //   title: { '$regex': params.title, '$options': 'i' },
    // })
    //   .skip(params.offset)
    //   .limit(params.limit)
    //   .exec()
  }
}
