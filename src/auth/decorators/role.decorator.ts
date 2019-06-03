
import { SetMetadata } from '@nestjs/common';
import { RoleCode } from '../../api/roles/entities/role.enum';

export const Roles = (...roleCodes: RoleCode[]) => SetMetadata('roleCodes', roleCodes);
