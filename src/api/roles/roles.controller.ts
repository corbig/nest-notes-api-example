import { Controller, Get, UseGuards, HttpException, HttpStatus, Body, Delete, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleCode } from './entities/role.enum';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Roles REST api
 */
@ApiBearerAuth()
@ApiUseTags('roles')
@Controller('api/roles')
export class RolesController {
    constructor(private readonly roleService: RolesService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(RoleCode.ADMIN, RoleCode.USER)
    async findAll(): Promise<Role[]> {
        const roles = await this.roleService.findAll();
        if (!roles) {
            throw new HttpException('unable to retrieve roles', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return roles;
    }
}
