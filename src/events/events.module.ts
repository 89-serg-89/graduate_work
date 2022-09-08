import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { BooksCommentsModule } from '../books_comments/books-comments.module'

@Module({
  imports: [
    BooksCommentsModule
  ],
  providers: [EventsGateway]
})
export class EventsModule {  }
