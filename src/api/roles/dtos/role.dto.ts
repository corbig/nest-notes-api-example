import { RoleCode } from '../entities/role.enum';
import { IsNotEmpty } from 'class-validator';

export class RoleDto {
    id: number;

    @IsNotEmpty()
    code: RoleCode;
}
