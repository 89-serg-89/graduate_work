import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SupportRequestService } from '../support/support-request.service'
import { Req, SetMetadata, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { WsGuard } from '../auth/guards/ws.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  constructor (private supportRequestService: SupportRequestService) {  }

  @UseGuards(WsGuard, RolesGuard)
  @SetMetadata('roles', ['client', 'manager'])
  @SubscribeMessage('subscribeToChat')
  subscribeSupport (
    @Req() req,
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ) {
    try {
      console.log(data)
      console.log(req.user)
      setTimeout(() => {
        this.send(client)
      }, 5000)
      return false
    } catch (e) {
      throw new WsException(e)
    }
  }

  send (client: Socket) {
    client.emit('test', { key: 'value' })
  }

  // @SubscribeMessage('getAllComment')
  // async getAllComments (
  //   @MessageBody(new JoiValidationPipe(findAllSchema)) data: any,
  // ): Promise<WsResponse<BooksCommentsDocument[]>> {
  //   try {
  //     const res = await this.booksCommentsService.findAll(data.bookId)
  //     return { event: 'comments', data: res }
  //   } catch (e) {
  //     throw new WsException(e)
  //   }
  // }
  //
  // @SubscribeMessage('addComment')
  // async addComment (
  //   @MessageBody(new JoiValidationPipe(createSchema)) data: CreateDto
  // ): Promise<WsResponse<BooksCommentsDocument>> {
  //   try {
  //     const res = await this.booksCommentsService.create(data)
  //     return { event: 'comment', data: res }
  //   } catch (e) {
  //     throw new WsException(e)
  //   }
  // }
}
