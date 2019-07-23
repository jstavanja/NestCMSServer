import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
        return false;
    }

    request.user = this.validateToken(request.headers.authorization);

    return true;
  }

  async validateToken(auth: string) {
    const splitToken = auth.split(' ');
    if (splitToken[0] !== 'Bearer') {
        throw new ForbiddenException('Invalid authorization token format.');
    }

    const token = splitToken[1];

    if (process.env.NODE_ENV === 'test' && token === 'authenticated') {
        // ugly hack for authentication testing (unfortunately, NestJS is not the best for e2e tests)
        return {
            'id': '7sd65as2-8ds9-1j2k-rand-0m1z3d4l0t',
            'created': '2011-02-22T12:22:17.000Z',
            'username': 'test'
        };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        throw new ForbiddenException(`Token error: ${err.message || err.name}`);
    }
  }
}