import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema'
import { Message, MessageDocument } from './schemas/message.schema'
import { ISupportRequestEmployeeService, MarkMessagesAsReadDto } from './support.interface'

export class SupportRequestEmployeeService implements ISupportRequestEmployeeService{
  constructor (
    @InjectModel(SupportRequest.name) private SupportModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  async markMessagesAsRead (params: MarkMessagesAsReadDto) {
    const messages = await this.MessageModel.find({
      supportRequest: params.supportRequest,
      readAt: undefined
    }).populate('author', 'id role')
    messages
      .filter(m => m.author.role === 'client')
      .forEach(m => {
        m.readAt = params.createdBefore
        m.save()
      })
  }

  async getUnreadCount (supportRequest: string) {
    const messages = await this.MessageModel.find({ supportRequest })
    return messages.filter(m => !m.readAt).length
  }

  async closeRequest (supportRequest) {
    const res = await this.SupportModel.findByIdAndUpdate(
      supportRequest,
      { isActive: false }
    )
    if (!res) return Promise.reject('support request id is not defined')
    return Promise.resolve()
  }
}
