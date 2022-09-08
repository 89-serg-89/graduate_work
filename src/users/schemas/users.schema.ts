import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UsersDocument = Users & Document

@Schema()
export class Users {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  passwordHash: string

  @Prop({ required: true })
  name: string

  @Prop()
  contactPhone: string

  @Prop({ required: true, default: 'client' })
  role: string
}

export const UsersSchema = SchemaFactory.createForClass(Users)
