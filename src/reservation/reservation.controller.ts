import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  SetMetadata,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  Param
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { HotelRoomService } from '../hotel/hotel-room.service'
import { ReservationService } from './reservation.service'
import { createClientSchema } from './joi/reservation.schema'
import { serialize } from '../helpers/utils'

@Controller()
export class ReservationController {
  constructor (
    private reservationService: ReservationService,
    private hotelRoomService: HotelRoomService
  ) {  }

  @Post('/client/reservations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client'])
  async createClient (
    @Req() req,
    @Body(new JoiValidationPipe(createClientSchema)) body
  ) {
    try {
      const { hotelRoom, startDate, endDate } = body
      const room = await this.hotelRoomService.findOne({ id: hotelRoom })
      if (!room) {
        throw new HttpException('there is no hotel room with this id', HttpStatus.BAD_REQUEST)
      }
      const reserv = await this.reservationService.addReservation({
        userId: req.user,
        roomId: room,
        hotelId: room.hotel,
        dateStart: new Date(startDate),
        dateEnd: new Date(endDate).setUTCHours(23,59,59,999)
      })

      return {
        startDate: reserv.dateStart,
        endDate: reserv.dateEnd,
        hotelRoom: serialize(['title', 'description', 'images'], reserv.roomId),
        hotel: serialize(['title', 'description'], reserv.hotelId)
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/client/reservations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client'])
  async allClient (
    @Req() req,
  ) {
    try {
      const reservations = await this.reservationService.getReservations({
        userId: req.user
      })
      return reservations.map(i => {
        return {
          startDate: i.dateStart,
          endDate: i.dateEnd,
          hotelRoom: serialize(['title', 'description', 'images'], i.roomId),
          hotel: serialize(['title', 'description'], i.hotelId)
        }
      })
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete('/client/reservations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client'])
  async deleteClient (
    @Req() req,
    @Param('id') id: string
  ) {
    try {
      if (!id) {
        throw new HttpException('id is required', HttpStatus.BAD_REQUEST)
      }
      const reservation = await this.reservationService.findById(id)
      if (!reservation) {
        throw new HttpException('reservation not found', HttpStatus.BAD_REQUEST)
      }
      if (reservation.userId.toString() !== req.user._id.toString()) {
        throw new HttpException('access denied', HttpStatus.FORBIDDEN)
      }
      await this.reservationService.removeReservation(id)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/manager/reservations/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['manager'])
  async listManager (
    @Param('userId') userId: string
  ) {
    try {
      if (!userId) {
        throw new HttpException('userId is required', HttpStatus.BAD_REQUEST)
      }
      const reservations = await this.reservationService.getReservations({
        userId
      })
      return reservations.map(i => {
        return {
          startDate: i.dateStart,
          endDate: i.dateEnd,
          hotelRoom: serialize(['title', 'description', 'images'], i.roomId),
          hotel: serialize(['title', 'description'], i.hotelId)
        }
      })
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete('/manager/reservations/:userId/:reservationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['manager'])
  async deleteManager (
    @Param('userId') userId: string,
    @Param('reservationId') reservationId: string
  ) {
    try {
      if (!userId || !reservationId) {
        throw new HttpException('userId, reservationId is required', HttpStatus.BAD_REQUEST)
      }
      const reservation = await this.reservationService.findById(reservationId)
      if (!reservation) {
        throw new HttpException('reservation not found', HttpStatus.BAD_REQUEST)
      }
      if (reservation.userId.toString() !== userId.toString()) {
        throw new HttpException('reservation user does not match', HttpStatus.FORBIDDEN)
      }
      await this.reservationService.removeReservation(reservationId)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}
