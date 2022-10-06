import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { EventsGateway } from './events.gateway'
import { SupportModule } from '../support/support.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    SupportModule,
    AuthModule,
    JwtModule
  ],
  providers: [EventsGateway]
})
export class EventsModule {  }
