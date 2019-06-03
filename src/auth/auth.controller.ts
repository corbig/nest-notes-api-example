import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IJwtPayload } from './interfaces/IJWTPayload';
import { User } from '../api/users/entities/user.entity';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() jwtPayload: IJwtPayload): Promise<any> {
        return this.authService.login(jwtPayload);
    }

    @Public()
    @Post('register')
    async register(@Body() user: User): Promise<any> {
        return this.authService.register(user);
    }
}
