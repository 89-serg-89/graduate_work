import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BooksComments, BooksCommentsDocument } from './schemas/books-comments.schema'
import { Model } from 'mongoose'
import { CreateDto } from './dto/create.dto'

@Injectable()
export class BooksCommentsService {
  constructor (
    @InjectModel(BooksComments.name) private BooksModel: Model<BooksCommentsDocument>,
  ) {  }

  findAll (bookId: string): Promise<BooksCommentsDocument[]> {
    return this.BooksModel.find({ bookId }).exec()
  }

  create (data: CreateDto): Promise<BooksCommentsDocument> {
    return this.BooksModel.create(data)
  }
}
