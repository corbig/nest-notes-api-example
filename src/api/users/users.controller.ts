import { Controller, Body, Post, Param, HttpException, HttpStatus, UseGuards, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleCode } from '../roles/entities/role.enum';
import { UsersRolesDto } from './dtos/usersRoles.dto';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('api/users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post(':userId/roles')
    @UseGuards(RolesGuard)
    @Roles(RoleCode.ADMIN)
    async setUsersRole(@Param('userId') userId: number, @Body() usersRolesDto: UsersRolesDto): Promise<User> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new HttpException(`User [ID=${userId}] not found`, HttpStatus.NOT_FOUND);
        }

        user.roles = usersRolesDto.roles;

        const updatedUser = await this.usersService.save(user);
        if (!updatedUser) {
            throw new HttpException(`Error while updating User [ID=${userId}]`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return updatedUser;
    }

    @Get(':userId/activation')
    @UseGuards(RolesGuard)
    @Roles(RoleCode.ADMIN)
    async setActivation(@Param('userId') userId: number, @Query('active') active: string): Promise<User> {

        if (!active || (active !== 'true' && active !== 'false')) {
            throw new HttpException(`The active query param must be set to \'true\' or \'false\'`, HttpStatus.BAD_REQUEST);
        }
        const isActive = active === 'true';

        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new HttpException(`User [ID=${userId}] not found`, HttpStatus.NOT_FOUND);
        }

        user.isActive = isActive;

        const updatedUser = await this.usersService.save(user);
        if (!updatedUser) {
            throw new HttpException(`Error while updating User [ID=${userId}]`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return updatedUser;
    }
}
