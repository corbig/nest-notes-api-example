import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/IJWTPayload';
import { UsersService } from '../api/users/users.service';
import { User } from '../api/users/entities/user.entity';
import { Role } from '../api/roles/entities/role.entity';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly confService: ConfigurationService) { }

    public async validate(payload: IJwtPayload): Promise<User> {
        const user: User = await this.userService.findByEmail(payload.email);
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    public async login(payload: IJwtPayload): Promise<any | { status: number }> {
        const userData = await this.validate(payload);
        const roles = userData.roles.map((userRole: Role) => userRole.code);
        const userPayload = { email: userData.email, isActive: userData.isActive, roles };
        const accessToken = this.jwtService.sign(userPayload);

        return {
            expires_in: this.confService.get('JWT_EXPIRATION_DELAY'),
            access_token: accessToken,
            user: userPayload,
            status: HttpStatus.OK,
        };

    }

    public async register(user: User): Promise<any> {
        return this.userService.create(user);
    }
}
