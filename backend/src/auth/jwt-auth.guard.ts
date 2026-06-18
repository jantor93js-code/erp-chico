import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard
  implements CanActivate
{
  constructor(
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request =
      context.switchToHttp().getRequest();

    console.log(
      'HEADERS:',
      request.headers,
    );

    const authHeader =
      request.headers.authorization;

    console.log(
      'AUTH HEADER:',
      authHeader,
    );

    if (!authHeader) {
      return false;
    }

    const token =
      authHeader.replace(
        'Bearer ',
        '',
      );

    try {

      const payload =
        this.jwtService.verify(token);

      console.log(
        'PAYLOAD:',
        payload,
      );

      request.user = payload;

      return true;

    } catch (error) {

      console.log(
        'JWT ERROR:',
        error,
      );

      return false;

    }
  }
}