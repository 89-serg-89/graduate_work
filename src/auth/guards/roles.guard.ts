import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

const ROLES = ['admin', 'manager', 'client']

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const accessRoles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!accessRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user

    return accessRoles.includes(user.role)
  }
}
