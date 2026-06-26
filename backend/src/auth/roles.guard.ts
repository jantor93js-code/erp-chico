import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY }
  from './roles.decorator';

@Injectable()
export class RolesGuard
  implements CanActivate
{
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const roles =
      this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    const request =
      context.switchToHttp().getRequest();

    const user =
      request.user;

    console.log(
      'ROLES REQUERIDOS:',
      roles,
    );

    console.log(
      'USER:',
      user,
    );

    if (!roles) {
      return true;
    }

    const normalizedUserRole = String(user?.role ?? '')
      .trim()
      .toLowerCase();
    const normalizedRoles = roles.map((role) =>
      String(role ?? '')
        .trim()
        .toLowerCase(),
    );

    const match = normalizedRoles.includes(
      normalizedUserRole,
    );

    console.log(
      'ROLE MATCH:',
      match,
    );

    return match;
  }
}