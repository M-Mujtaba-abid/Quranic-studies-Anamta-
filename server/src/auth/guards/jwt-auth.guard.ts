import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    let token: string | undefined;

    // 1. Extract from Cookie
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, val] = cookie.trim().split('=');
        if (key) acc[key] = val;
        return acc;
      }, {} as Record<string, string>);
      token = cookies['token'];
    }

    // 2. Fallback to Authorization header
    if (!token && req.headers.authorization) {
      const [type, authHeaderToken] = req.headers.authorization.split(' ');
      if (type === 'Bearer' && authHeaderToken) {
        token = authHeaderToken;
      }
    }

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
