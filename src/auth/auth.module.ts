import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../api/users/users.module';
import { AppAuthGuard } from './guards/appAuth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ConfigurationService } from '../configuration/configuration.service';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigurationService) => ({
                secret: configService.get('JWT_SECRET_KEY'),
                expiresIn: configService.get('JWT_EXPIRATION_DELAY'),
            }) as any,
            inject: [ConfigurationService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AppAuthGuard,
        },
        AuthService,
        JwtStrategy,
        AppAuthGuard,
        RolesGuard,
    ],
})
export class AuthModule { }
