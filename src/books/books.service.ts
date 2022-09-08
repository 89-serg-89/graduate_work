import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateBooksDto } from './dto/create-books.dto'
import { Books, BooksDocument } from './schemas/books.schema'

@Injectable()
export class BooksService {
  constructor (
    @InjectModel(Books.name) private BooksModel: Model<BooksDocument>,
  ) {  }

  findAll (): Promise<BooksDocument[]> {
    return this.BooksModel.find().exec()
  }

  create (data: CreateBooksDto): Promise<BooksDocument> {
    return this.BooksModel.create(data)
  }

  async update (id: string, data: CreateBooksDto): Promise<BooksDocument> {
    return this.BooksModel.findOneAndUpdate({ _id: id }, data).exec()
  }

  delete (id: string): Promise<BooksDocument> {
    return this.BooksModel.findByIdAndDelete({ _id: id }).exec()
  }
}
