import { Injectable } from '@nestjs/common'
import { Connection, Model } from 'mongoose'
import { InjectModel, InjectConnection } from '@nestjs/mongoose'
import { Hotel, HotelDocument } from './schemas/hotel.schema'
import { IHotelService } from './hotel.interface'

@Injectable()
export class HotelService{
  constructor (
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  // create (data) {
  //
  // }
  //
  // findById (id) {
  //
  // }
  //
  // search (params) {
  //
  // }
}
