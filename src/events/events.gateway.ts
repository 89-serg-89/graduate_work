import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets'
import { SetMetadata, UseFilters, UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Server, Socket } from 'socket.io'
import { WsGuard } from '../auth/guards/ws.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { WsExceptionFilter } from '../filters/ws-exception.filter'
import { SupportRequestService } from '../support/support-request.service'
import { serialize } from '../helpers/utils'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(WsExceptionFilter)
export class EventsGateway {
  @WebSocketServer()
  server: Server

  constructor (private supportRequestService: SupportRequestService) {  }

  @OnEvent('support.send-message')
  handleSendMessage (payload) {
    const { support, message } = payload
    this.server.to(support.id).emit('newMessage', {
      ...serialize(['id', 'sentAt', 'readAt', 'text'], message),
      author: serialize(['_id', 'name'], message.author)
    })
  }

  @UseGuards(WsGuard, RolesGuard)
  @SetMetadata('roles', ['client', 'manager'])
  @SubscribeMessage('subscribeToChat')
  async subscribeSupport (
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ) {
    try {
      if (client['user'].role === 'client') {
        const support = await this.supportRequestService.findById(data)
        if (support.user['id'].toString() !== client['user']['_id'].toString()) {
          throw new WsException('support was not created by this user')
        }
      }
      client.join(data)
      return false
    } catch (e) {
      throw new WsException('Something went wrong')
    }
  }
}
