import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as mSchema } from 'mongoose'
import { Hotel } from './hotel.schema'

export type HotelRoomDocument = HotelRoom & Document

@Schema()
export class HotelRoom {
  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  })
  hotel: Hotel

  @Prop()
  description: string

  @Prop({ default: [] })
  images: string[]

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  updatedAt: Date

  @Prop({ required: true, default: true })
  isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)
