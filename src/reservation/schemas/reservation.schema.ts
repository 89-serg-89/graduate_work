import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as mSchema } from 'mongoose'
import { Users } from '../../users/schemas/users.schema'
import { Hotel } from '../../hotel/schemas/hotel.schema'
import { HotelRoom } from '../../hotel/schemas/hotel-room.schema'

export type ReservationDocument = Reservation & Document

@Schema()
export class Reservation {
  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'Users',
    required: true
  })
  userId: Users

  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  })
  hotelId: Hotel

  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'HotelRoom',
    required: true
  })
  roomId: HotelRoom

  @Prop({ required: true })
  dateStart: Date

  @Prop({ required: true })
  dateEnd: Date
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation)
