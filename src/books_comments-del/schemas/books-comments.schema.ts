import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type BooksCommentsDocument = BooksComments & Document

@Schema()
export class BooksComments {
  @Prop({ required: true })
  bookId: string

  @Prop({ required: true })
  comment: string
}

export const BooksCommentsSchema = SchemaFactory.createForClass(BooksComments)
