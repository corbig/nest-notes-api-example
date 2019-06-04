import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { RolesService } from '../roles/roles.service';
import { RoleCode } from '../roles/entities/role.enum';

@Injectable()
export class UsersService {
    constructor(private readonly roleService: RolesService, @InjectRepository(User)
    private readonly userRepository: Repository<User>) { }

    async findByEmail(email: string): Promise<User> {
        try {
            return await this.userRepository.findOne({
                where: {
                    email,
                },
            });
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    async findById(id: number): Promise<User> {
        try {
            return await this.userRepository.findOne({
                where: {
                    id,
                },
            });
        } catch (error) {
            Logger.error(error);
            return null;
        }

    }

    async create(user: User): Promise<User> {
        user.id = null;
        user.password = this.encryptPassword(user.password);
        user.isActive = false;
        try {
            const userRole = await this.roleService.findByRoleCode(RoleCode.USER);
            user.roles = [userRole];
            return await this.userRepository.save(user);
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    async save(user: User): Promise<User> {
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    encryptPassword(password: string): string {
        return crypto.createHmac('sha256', password).digest('hex');
    }

}
