import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RoleCode } from './entities/role.enum';

/**
 * Roles service
 */
@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role)
    private readonly roleRepository: Repository<Role>) { }

    async findAll(): Promise<Role[]> {
        try {
            return await this.roleRepository.find();
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    async findByRoleCode(roleCode: RoleCode): Promise<Role> {
        try {
            const role = await this.roleRepository.findOne({ where: { roleCode: roleCode.toString() } });
            return role;
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }
}
