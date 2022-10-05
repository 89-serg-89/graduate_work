import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema'
import { Message, MessageDocument } from './schemas/message.schema'
import { CreateSupportRequestDto, ISupportRequestClientService, MarkMessagesAsReadDto } from './support.interface'

export class SupportRequestClientService implements ISupportRequestClientService{
  constructor (
    @InjectModel(SupportRequest.name) private SupportModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  createSupportRequest (data: CreateSupportRequestDto) {
    const support = new this.SupportModel({
      isActive: true,
      hasNewMessages: true,
      messages: [],
      user: data.user
    })
    const message = new this.MessageModel({
      author: data.user,
      text: data.text,
      supportRequest: support
    })
    message.save()

    support.messages.push(message)
    return support.save()
  }

  async markMessagesAsRead (params: MarkMessagesAsReadDto) {
    const messages = await this.MessageModel.find({
      supportRequest: params.supportRequest,
      readAt: undefined
    }).populate('author', 'id role')
    messages
      .filter(m => m.author.role === 'manager')
      .forEach(m => {
        m.readAt = params.createdBefore
        m.save()
      })
  }

  async getUnreadCount (supportRequest: string) {
    const messages = await this.MessageModel.find({ supportRequest })
    return messages.filter(m => !m.readAt).length
  }
}
