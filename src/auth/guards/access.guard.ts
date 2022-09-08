import { ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate (context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest (err, user, info) {
    if (err) {
      throw err
    }
    if (info) {
      throw new HttpException(info.message, HttpStatus.UNAUTHORIZED)
    }
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
