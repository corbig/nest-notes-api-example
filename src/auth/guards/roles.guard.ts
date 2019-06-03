import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '../../api/users/entities/user.entity';
import { Role } from '../../api/roles/entities/role.entity';
import { RoleCode } from 'src/api/roles/entities/role.enum';

/**
 * Role auth guard to control app's endpoint access with specific roles.
 * This guard needs to be filled on each endpoint which need specifics roles to be used.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user.isActive) {
            return false;
        }

        const roles = this.reflector.get<RoleCode[]>('roleCodes', context.getHandler());
        if (!roles) {
            return true;
        }

        return this.hasRole(roles, user.roles);
    }

    private hasRole(roleCodes: RoleCode[], userRoles: Role[]) {
        return userRoles.some(userRole => roleCodes.find(roleCode => roleCode === userRole.code) != null);
    }
}
