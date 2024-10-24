import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { UserService } from '../../user/user.service';
@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector,
    private readonly userService: UserService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userRole = this.userService.getUserRole(user.id);
    return requiredRoles.some(async (role) => role === await userRole);
  }
}
