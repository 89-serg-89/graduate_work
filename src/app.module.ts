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
import { AdminModule } from './admin/admin.module'

const getUrlConnectDB = () => {
  let url = process.env.DB_CONNECT || 'mongodb://localhost:27017/'
  if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
    const split = url.split('//')
    url = `${split[0]}//${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${split[1]}`
  }
  return url
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(getUrlConnectDB()),
    AuthModule,
    UsersModule,
    HotelModule,
    ReservationModule,
    SupportModule,
    EventsModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
