import { ValidateNested } from 'class-validator';
import { RoleDto } from '../../roles/dtos/role.dto';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class UsersRolesDto {

    @ApiModelProperty({ required: true, type: [RoleDto] })
    @ValidateNested()
    @Type(() => RoleDto)
    roles: RoleDto[];
}
