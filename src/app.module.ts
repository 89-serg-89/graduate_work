import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { HotelModule } from './hotel/hotel.module'
import { ReservationModule } from './reservation/reservation.module'
import { SupportModule } from './support/support.module'
import { EventsModule } from './events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.CONNECT_BD),
    AuthModule,
    UsersModule,
    HotelModule,
    ReservationModule,
    SupportModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
