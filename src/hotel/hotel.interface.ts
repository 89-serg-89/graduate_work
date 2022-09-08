import { Types } from 'mongoose'
import { Hotel } from './schemas/hotel.schema'
import { HotelRoom } from './schemas/hotel-room.schema'

export interface IHotelService {
  create(data: any): Promise<Hotel>
  findById(id: Types.ObjectId|string): Promise<Hotel>
  search(params: Pick<Hotel, "title">): Promise<Hotel[]>
}

export interface SearchRoomsParams {
  limit: number
  offset: number
  title: string
  isEnabled?: true
}

export interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>
  findById(id: Types.ObjectId|string, isEnabled?: true): Promise<HotelRoom>
  search(params: SearchRoomsParams): Promise<HotelRoom[]>
  update(id: Types.ObjectId|string, data: Partial<HotelRoom>): Promise<HotelRoom>
}
