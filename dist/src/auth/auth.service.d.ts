import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/IJWTPayload';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    createToken(): Promise<{
        expiresIn: number;
        accessToken: string;
    }>;
    validateUser(payload: IJwtPayload): Promise<any>;
}
