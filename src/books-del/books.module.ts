import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BooksController } from './books.controller'
import { BooksService } from './books.service'
import { Books, BooksSchema } from './schemas/books.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Books.name,
      schema: BooksSchema
    }])
  ],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {  }
