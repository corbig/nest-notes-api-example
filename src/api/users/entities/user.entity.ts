
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Exclude, Transform } from 'class-transformer';

@Entity({ name: 'users' })
export class User {

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500, unique: true })
    email: string;

    @Column()
    isActive: boolean;

    @Exclude()
    @Column()
    password: string;

    @Transform(role => role.name)
    @ManyToMany(type => Role, { nullable: false, eager: true })
    @JoinTable({ name: 'users_roles' })
    roles: Role[];
}
