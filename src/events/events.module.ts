import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { SupportModule } from '../support/support.module'

@Module({
  imports: [
    SupportModule
  ],
  providers: [EventsGateway]
})
export class EventsModule {  }
