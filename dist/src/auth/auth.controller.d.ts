import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createToken(): Promise<any>;
    findAll(): void;
}
