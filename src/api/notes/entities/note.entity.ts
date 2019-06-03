import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transform } from 'class-transformer';

@Entity({ name: 'notes' })
export class Note {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @CreateDateColumn({ type: 'date' })
    lastModificationDate: Date;

    @ManyToOne(type => User, { nullable: false })
    @Transform(author => author.email)
    author: User;

    constructor(partial: Partial<Note>) {
        Object.assign(this, partial);
    }
}
