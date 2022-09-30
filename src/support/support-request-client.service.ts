import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema'
import { Message, MessageDocument } from './schemas/message.schema'
import { CreateSupportRequestDto, ISupportRequestClientService } from './support.interface'

export class SupportRequestClientService {
  constructor (
    @InjectModel(SupportRequest.name) private SupportModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  createSupportRequest (data: CreateSupportRequestDto) {
    const message = new this.MessageModel({
      author: data.user,
      text: data.text
    })
    message.save()
    const support = new this.SupportModel({
      isActive: true,
      hasNewMessages: true,
      messages: [message],
      user: data.user
    })
    return support.save()
  }

  // markMessagesAsRead (params) {
  //
  // }
  //
  // getUnreadCount (supportRequest) {
  //
  // }
}
