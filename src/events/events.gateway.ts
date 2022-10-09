import {
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets'
import { SetMetadata, UseFilters, UseGuards } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { WsGuard } from '../auth/guards/ws.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { WsExceptionFilter } from '../filters/ws-exception.filter'
import { SupportRequestService } from '../support/support-request.service'
import { SupportRequest } from '../support/schemas/support-request.schema'
import { Message } from '../support/schemas/message.schema'
import { OnEvent } from '@nestjs/event-emitter'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(WsExceptionFilter)
export class EventsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private wsClients = []

  constructor (private supportRequestService: SupportRequestService) {  }

  @OnEvent('support.send-message')
  handleSendMessage (payload) {
    // this.handleSendMessage(payload)
  }

  handleDisconnect (client: Socket): any {
    const findClientIdx = this.wsClients.findIndex(c => c === client )
    if (findClientIdx > -1) {
      this.wsClients.splice(findClientIdx, 1)
    }
  }

  handleNewMessage (supportRequest: SupportRequest, message: Message) {

  }

  @UseGuards(WsGuard, RolesGuard)
  @SetMetadata('roles', ['client', 'manager'])
  @SubscribeMessage('subscribeToChat')
  async subscribeSupport (
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ) {
    this.wsClients.push(client)
    try {
      if (client['user'].role === 'client') {
        const support = await this.supportRequestService.findById(data)
        if (support.user['id'].toString() !== client['user']['_id'].toString()) {
          throw new WsException('support was not created by this user')
        }
      }
      client.join(data)
      setTimeout(() => {
        console.log(client.rooms)
        client.to(data).emit('test', { key: 'value' })
      }, 5000)
      return false
    } catch (e) {
      throw new WsException('Something went wrong')
    }
  }

  send (client: Socket) {
    client.emit('test', { key: 'value' })
  }
}
