import { ValidateNested } from 'class-validator';
import { RoleDto } from '../../roles/dtos/role.dto';
import { Type } from 'class-transformer';

export class UsersRolesDto {

    @ValidateNested()
    @Type(() => RoleDto)
    roles: RoleDto[];
}
