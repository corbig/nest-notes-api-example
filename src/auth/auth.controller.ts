import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IJwtPayload } from './interfaces/IJWTPayload';
import { User } from '../api/users/entities/user.entity';
import { Public } from './decorators/public.decorator';
import { UserRegistrationDto } from 'src/api/users/dtos/userRegistration.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() jwtPayload: IJwtPayload): Promise<User> {
        return this.authService.login(jwtPayload);
    }

    @Public()
    @Post('register')
    async register(@Body() userRegistrationDto: UserRegistrationDto): Promise<User> {
        return this.authService.register(userRegistrationDto);
    }
}
