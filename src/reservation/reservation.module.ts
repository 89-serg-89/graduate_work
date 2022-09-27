import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HotelModule } from '../hotel/hotel.module'
import { Reservation, ReservationSchema } from './schemas/reservation.schema'
import { ReservationController } from './reservation.controller'
import { ReservationService } from './reservation.service'

@Module({
  imports: [
    HotelModule,
    MongooseModule.forFeature([{
      name: Reservation.name,
      schema: ReservationSchema
    }])
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService]
})
export class ReservationModule {  }
