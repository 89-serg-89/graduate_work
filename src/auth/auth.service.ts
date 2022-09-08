import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor (
    private usersService: UsersService,
    private jwtService: JwtService
  ) {  }

  async validateUser (email: string): Promise<any> {
    const user = await this.usersService.findOne(email)
    if (user) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async login(user: any) {
    const candidate = await this.usersService.findOne(user.email)
    if (!candidate) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
    }
    const isValid = this.usersService.compare(user.password, candidate.password)
    if (!isValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
    }
    const payload = { id: candidate._id.toString(), email: candidate.email, firstName: candidate.firstName }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
