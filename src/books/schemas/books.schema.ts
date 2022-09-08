import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type BooksDocument = Books & Document

@Schema()
export class Books {
  @Prop({ required: true })
  title: string

  @Prop()
  description: string

  @Prop({ default: false })
  favorite: boolean

  @Prop()
  authors: string

  @Prop()
  fileCover: string

  @Prop()
  fileName: string

  @Prop()
  fileBook: string
}

export const BooksSchema = SchemaFactory.createForClass(Books)
