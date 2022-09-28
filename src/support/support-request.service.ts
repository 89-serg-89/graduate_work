import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema'
import { Message, MessageDocument } from './schemas/message.schema'
import { ISupportRequestService } from './support.interface'

export class SupportRequestService {
  constructor (
    @InjectModel(SupportRequest.name) private SupportModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  // findSupportRequests (params) {
  //
  // }

  sendMessage (data) {
    const message = new this.MessageModel(data)
    return message.save()
  }

  // getMessages (supportRequest) {
  //
  // }
  //
  // subscribe (handler) {
  //
  // }
}
