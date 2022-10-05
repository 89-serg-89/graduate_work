import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { Connection, Model, Types } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema'
import { Message, MessageDocument } from './schemas/message.schema'
import { GetMessagesAll, ISupportRequestService, SendMessageDto } from './support.interface'
import { HttpException, HttpStatus } from '@nestjs/common'

export class SupportRequestService implements ISupportRequestService{
  constructor (
    private eventEmmiter: EventEmitter2,
    @InjectModel(SupportRequest.name) private SupportModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  findSupportRequests (params) {
    const { limit, offset, ...filter } = params
    return this.SupportModel.find(filter)
      .select('id createdAt isActive hasNewMessages')
      .populate('user', 'id name email contactPhone')
      .skip(offset || 0)
      .limit(limit || 10)
      .exec()
  }

  findById (id: Types.ObjectId|string) {
    return this.SupportModel.findById(id)
      .populate('user')
      .exec()
  }

  async sendMessage (data: SendMessageDto) {
    const support = await this.findById(data.supportRequest)
    if (!support) {
      throw new HttpException('there is no support request with this id', HttpStatus.BAD_REQUEST)
    }
    if (
      data.author['role'] === 'client'
      && support.user['_id'].toString() !== data.author['_id'].toString()
    ) {
      throw new HttpException('access denied', HttpStatus.FORBIDDEN)
    }

    const message = new this.MessageModel({
      author: data.author,
      text: data.text,
      supportRequest: support
    })

    support.messages.push(message)
    support.save()

    this.eventEmmiter.emit('support.send-message', {
      support,
      message
    })
    return message.save()
  }

  async getMessages (data: GetMessagesAll) {
    const support = await this.findById(data.supportRequest)
    if (!support) {
      throw new HttpException('there is no support request with this id', HttpStatus.BAD_REQUEST)
    }
    if (
      data.user['role'] === 'client'
      && support.user['_id'].toString() !== data.user['_id'].toString()
    ) {
      throw new HttpException('access denied', HttpStatus.FORBIDDEN)
    }
    return this.MessageModel.find({
      supportRequest: support._id
    })
      .populate('author', 'id name')
      .exec()
  }

  @OnEvent('support.send-message')
  handleSendMessage (payload) {
    console.log(payload)
  }

  subscribe (handler) {
    handler()
  }
}
