import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as mSchema } from 'mongoose'
import { Users } from '../../users/schemas/users.schema'

export type MessageDocument = Message & Document

@Schema()
export class Message {
  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'Users',
    required: true
  })
  author: Users

  @Prop({ required: true })
  sentAt: Date

  @Prop()
  readAt: Date

  @Prop({ required: true })
  text: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)
