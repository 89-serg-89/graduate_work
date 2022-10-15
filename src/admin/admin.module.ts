import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AdminController } from './admin.controller'
import { HotelModule } from '../hotel/hotel.module'

@Module({
  imports: [
    UsersModule,
    HotelModule
  ],
  controllers: [AdminController]
})
export class AdminModule {

}