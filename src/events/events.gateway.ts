import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException, WsResponse
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { BooksCommentsService } from '../books_comments/books-comments.service'
import { BooksCommentsDocument } from '../books_comments/schemas/books-comments.schema'
import { CreateDto } from '../books_comments/dto/create.dto'
import { findAllSchema } from '../books_comments/joi/find-all.schema'
import { createSchema } from '../books_comments/joi/create.schema'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  constructor (private booksCommentsService: BooksCommentsService) {  }

  @SubscribeMessage('getAllComment')
  async getAllComments (
    @MessageBody(new JoiValidationPipe(findAllSchema)) data: any,
  ): Promise<WsResponse<BooksCommentsDocument[]>> {
    try {
      const res = await this.booksCommentsService.findAll(data.bookId)
      return { event: 'comments', data: res }
    } catch (e) {
      throw new WsException(e)
    }
  }

  @SubscribeMessage('addComment')
  async addComment (
    @MessageBody(new JoiValidationPipe(createSchema)) data: CreateDto
  ): Promise<WsResponse<BooksCommentsDocument>> {
    try {
      const res = await this.booksCommentsService.create(data)
      return { event: 'comment', data: res }
    } catch (e) {
      throw new WsException(e)
    }
  }
}
