import { Types } from 'mongoose'
import { Hotel } from './schemas/hotel.schema'
import { HotelRoom } from './schemas/hotel-room.schema'

export interface CreateHotelParams {
  title: string,
  description: string
}

export interface IHotelService {
  create(data: CreateHotelParams): Promise<Hotel>
  update(hotel: Hotel, data: CreateHotelParams): Promise<Hotel>
  findById(id: Types.ObjectId|string): Promise<Hotel>
  search(params: Pick<Hotel, "title">): Promise<Hotel[]>
}

export interface SearchRoomsParams {
  limit: number
  offset: number
  hotel: Types.ObjectId|string
  isEnabled?: true
}

export interface IHotelRoomService {
  create(
    hotel: Partial<Hotel>,
    data: Partial<HotelRoom>,
    images: Array<Express.Multer.File>
  ): Promise<HotelRoom>
  update(
    room: Partial<HotelRoom>,
    hotel: Partial<Hotel>,
    data: Partial<HotelRoom>,
    images: Array<Express.Multer.File>
  ): Promise<HotelRoom>
  findById(id: Types.ObjectId|string, isEnabled?: true): Promise<HotelRoom>
  search(params: SearchRoomsParams): Promise<HotelRoom[]>
}
