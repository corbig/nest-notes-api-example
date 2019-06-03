import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JWT auth guard to control app's endpoint access
 * This guard is configured globally for the app (see auth.module.ts).
 */
@Injectable()
export class AppAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // if public metadata is daclared, the endpoint doesn't need auth
        const isPublic = this.reflector.get<boolean>('public', context.getHandler());
        if (isPublic) {
            return true;
        }
        // add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
