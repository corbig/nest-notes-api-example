
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoleCode } from './role.enum';

/**
 * Role entity
 */
@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    code: RoleCode;
}
