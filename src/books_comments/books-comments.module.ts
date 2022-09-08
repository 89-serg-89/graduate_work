import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BooksComments, BooksCommentsSchema } from './schemas/books-comments.schema'
import { BooksCommentsService } from './books-comments.service'

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: BooksComments.name,
      schema: BooksCommentsSchema
    }])
  ],
  providers: [BooksCommentsService],
  exports: [BooksCommentsService]
})
export class BooksCommentsModule {  }
