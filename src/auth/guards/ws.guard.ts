import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from '../auth.service'

@Injectable()
export class WsGuard implements CanActivate {
  constructor (
    private jwtService: JwtService,
    private authService: AuthService
  ) {  }

  async canActivate (context: ExecutionContext): Promise<boolean> {
    try {
      const auth = context.getArgs()[0].handshake.headers.authorization
      if (!auth) {
        return false
      }
      const bearerToken = auth.split(' ')[1]
      const decoded = this.jwtService.verify(bearerToken, {
        secret: process.env.JWT_SECRET
      })
      const { passwordHash, ...user } = await this.authService.validateUser(decoded.email)
      context.switchToHttp().getRequest().user = user
      return user
    } catch (e) {
      console.log(e)
      return false
    }
  }
}