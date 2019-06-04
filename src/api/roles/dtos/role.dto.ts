import { RoleCode } from '../entities/role.enum';
import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RoleDto {

    @ApiModelProperty({ required: false, example: 1 })
    id: number;

    @ApiModelProperty({ required: true, enum: ['Admin', 'User'] })
    @IsNotEmpty()
    code: RoleCode;
}
