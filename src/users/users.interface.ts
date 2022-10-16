import { Types } from 'mongoose'
import { Users } from './schemas/users.schema'

export interface SearchUserParams {
  limit: number
  offset: number
  email: string
  name: string
  contactPhone: string
}

export interface IUserService {
  create(data: Partial<Users>): Promise<Users>
  findById(id: Types.ObjectId|string): Promise<Users>
  findByEmail(email: string): Promise<Users>
  search(params: SearchUserParams): Promise<Users[]>
}
