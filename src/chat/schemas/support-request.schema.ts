import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as mSchema } from 'mongoose'
import { Users } from '../../users/schemas/users.schema'
import { Message } from './message.schema'

export type SupportRequestDocument = SupportRequest & Document

@Schema()
export class SupportRequest {
  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'Users',
    required: true
  })
  user: Users

  @Prop()
  messages: Message[]

  @Prop({ required: true })
  createdAt: Date

  @Prop()
  isActive: boolean
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest)
