import { Document } from 'mongoose'

export interface BooksInterface extends Document {
  readonly title: string,
  readonly description: string,
  readonly favorite: boolean,
  readonly authors?: string,
  readonly fileCover?: string,
  readonly fileName?: string,
  readonly fileBook?: string
}
