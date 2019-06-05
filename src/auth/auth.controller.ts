import { Controller, Post, Body, HttpException, HttpStatus, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../api/users/entities/user.entity';
import { Public } from './decorators/public.decorator';
import { UserRegistrationDto } from '../api/users/dtos/userRegistration.dto';
import { UserLoginDto } from '../api/users/dtos/userLogin.dto';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    @UseInterceptors(ClassSerializerInterceptor)
    async login(@Body() userLoginDto: UserLoginDto): Promise<User> {
        const validatedUser = await this.authService.validate(userLoginDto);
        if (!validatedUser) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        return this.authService.login(validatedUser);
    }

    @Public()
    @Post('register')
    @UseInterceptors(ClassSerializerInterceptor)
    async register(@Body() userRegistrationDto: UserRegistrationDto): Promise<User> {
        if (userRegistrationDto.password !== userRegistrationDto.confirmPassword) {
            throw new HttpException('passwords do not match', HttpStatus.BAD_REQUEST);
        }
        const userRegistered = await this.authService.register(userRegistrationDto);
        if (!userRegistered) {
            throw new HttpException(`error while registering user[Email=${userRegistrationDto.email}]`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return this.authService.register(userRegistrationDto);
    }
}
