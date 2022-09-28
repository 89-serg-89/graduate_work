import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema'
import { ISupportRequestClientService } from './support.interface'

export class SupportRequestClientService {
  constructor (
    @InjectModel(SupportRequest.name) private SupportModel: Model<SupportRequestDocument>,
    @InjectConnection() private connection: Connection
  ) {  }

  createSupportRequest (data) {
    const support = new this.SupportModel(data)
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
