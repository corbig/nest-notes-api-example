import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NoteDto } from './dtos/Note.dto';

@Injectable()
export class NotesService {
    constructor(@InjectRepository(Note)
    private readonly noteRepository: Repository<Note>) { }

    async findAllByUser(user: User): Promise<Note[]> {
        try {
            return await this.noteRepository.find({ where: { author: user } });
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    async save(note: Note): Promise<Note> {
        try {
            return await this.noteRepository.save(note);
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    async findOneByIdAndUser(user: User, noteId: number): Promise<Note> {
        try {
            return await this.noteRepository.findOneOrFail({ where: { id: noteId, author: user } });
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    async delete(note: Note): Promise<Note> {
        try {
            return await this.noteRepository.remove(note);
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }
}
