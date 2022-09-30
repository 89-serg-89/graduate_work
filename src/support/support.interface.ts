import { Types } from 'mongoose'
import { SupportRequest } from './schemas/support-request.schema'
import { Message } from './schemas/message.schema'

export interface CreateSupportRequestDto {
  user: Types.ObjectId|string
  text: string
}

export interface SendMessageDto {
  author: Types.ObjectId|string
  supportRequest: Types.ObjectId|string
  text: string
}
export interface MarkMessagesAsReadDto {
  user: Types.ObjectId|string
  supportRequest: Types.ObjectId|string
  createdBefore: Date
}

export interface GetChatListParams {
  user: Types.ObjectId|string|null
  isActive: boolean
}

export interface GetMessagesAll {
  supportRequest: Types.ObjectId|string,
  user: Types.ObjectId|string
}

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>
  sendMessage(data: SendMessageDto): Promise<Message>
  getMessages(data: GetMessagesAll): Promise<Message[]>
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void
  ): () => void
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>
  markMessagesAsRead(params: MarkMessagesAsReadDto)
  getUnreadCount(supportRequest: Types.ObjectId|string): Promise<Message[]>
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto)
  getUnreadCount(supportRequest: Types.ObjectId|string): Promise<Message[]>
  closeRequest(supportRequest: Types.ObjectId|string): Promise<void>
}
