import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Message, MessageSchema } from './schemas/message.schema'
import { SupportRequest, SupportRequestSchema } from './schemas/support-request.schema'
import { SupportController } from './support.controller'
import { SupportRequestClientService } from './support-request-client.service'
import { SupportRequestService } from './support-request.service'
import { SupportRequestEmployeeService } from './support-request-employee.service'

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Message.name,
      schema: MessageSchema
    }]),
    MongooseModule.forFeature([{
      name: SupportRequest.name,
      schema: SupportRequestSchema
    }])
  ],
  controllers: [SupportController],
  providers: [
    SupportRequestClientService,
    SupportRequestService,
    SupportRequestEmployeeService
  ],
  exports: [
    SupportRequestClientService,
    SupportRequestService,
    SupportRequestEmployeeService
  ]
})
export class SupportModule {  }
