import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { IJwtPayload } from '../interfaces/IJWTPayload';
import { ConfigurationService } from '../../configuration/configuration.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigurationService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: IJwtPayload) {
        const user = await this.authService.validate(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
