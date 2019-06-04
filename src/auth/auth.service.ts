import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../api/users/users.service';
import { User } from '../api/users/entities/user.entity';
import { Role } from '../api/roles/entities/role.entity';
import { ConfigurationService } from '../configuration/configuration.service';
import { UserRegistrationDto } from 'src/api/users/dtos/userRegistration.dto';
import { UserLoginDto } from 'src/api/users/dtos/userLogin.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly confService: ConfigurationService) { }

    public async validate(userLoginDto: UserLoginDto): Promise<User> {
        try {
            return await this.userService.findByEmail(userLoginDto.email);
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    public async login(user: User): Promise<any | { status: number }> {
        const roles = user.roles.map((userRole: Role) => userRole.code);
        const userPayload = { email: user.email, isActive: user.isActive, roles };
        const accessToken = this.jwtService.sign(userPayload);

        return {
            expires_in: this.confService.get('JWT_EXPIRATION_DELAY'),
            access_token: accessToken,
            user: userPayload,
            status: HttpStatus.OK,
        };

    }

    public async register(userRegistrationDto: UserRegistrationDto): Promise<User> {
        const user: User = { email: userRegistrationDto.email, password: userRegistrationDto.password, id: null, isActive: null, roles: null };
        return this.userService.create(user);
    }
}
