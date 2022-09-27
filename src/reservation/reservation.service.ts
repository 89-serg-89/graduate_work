import { Connection, Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Reservation, ReservationDocument } from './schemas/reservation.schema'
import { IReservation, ReservationSearchOptions } from './reservation.interface'

@Injectable()
export class ReservationService {
  constructor (
    @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  addReservation (data: object) {
    const reservation = new this.ReservationModel(data)
    return reservation.save()
  }

  removeReservation (id: string) {
    return this.ReservationModel.deleteOne({ id }).exec()
  }

  getReservations (filter: ReservationSearchOptions, select: string[] = []) {
    const res = this.ReservationModel
      .find(filter)
      .populate('hotelId', 'id title description')
      .populate('roomId', 'id title description images')
    if (select.length) res.select(select.join(' '))
    return res.exec()
  }

  findById (id: string) {
    return this.ReservationModel.findById(id).exec()
  }
}
