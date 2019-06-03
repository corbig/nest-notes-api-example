import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private readonly photoRepository;
    constructor(photoRepository: Repository<User>);
}
