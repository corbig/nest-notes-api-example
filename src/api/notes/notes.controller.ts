import {
    Controller, Get, UseGuards, Post, Req, HttpException,
    HttpStatus, Body, UseInterceptors, ClassSerializerInterceptor, Delete, Param,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/role.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RoleCode } from '../roles/entities/role.enum';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { NoteDto } from './dtos/Note.dto';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('notes')
@Controller('api/notes')
export class NotesController {

    constructor(private readonly noteService: NotesService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(RoleCode.USER, RoleCode.ADMIN)
    async findAllByUser(@Req() request): Promise<Note[]> {
        const userNotes = await this.noteService.findAllByUser(request.user);
        if (!userNotes) {
            throw new HttpException('unable to retrieve notes', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return userNotes;
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(RoleCode.USER, RoleCode.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(@Req() request, @Body() noteDto: NoteDto): Promise<Note> {
        const user: User = request.user;
        let userNote: Note = { ...noteDto, lastModificationDate: null, author: null };
        if (noteDto.id) {
            userNote = await this.noteService.findOneByIdAndUser(user, userNote.id);
            if (!userNote) {
                throw new HttpException(`note[noteId=${noteDto.id}] for user[email=${user.email}] not found`, HttpStatus.NOT_FOUND);
            }
        } else {
            userNote.author = user;
        }
        userNote.lastModificationDate = new Date();
        userNote = await this.noteService.save(userNote);
        if (!userNote) {
            const message = noteDto.id ? `unable to save note[noteId=${noteDto.id}]` : 'unable to create new note';
            throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // To use serializer tranformation, the entity needs to be regenerated
        return new Note({ ...userNote });
    }

    @Delete(':noteId')
    @UseGuards(RolesGuard)
    @Roles(RoleCode.USER, RoleCode.ADMIN)
    async delete(@Req() request, @Param('noteId') noteId: number): Promise<Note> {

        const user: User = request.user;

        const userNote = await this.noteService.findOneByIdAndUser(user, noteId);
        if (!userNote) {
            throw new HttpException(`note[noteId=${noteId}] for user[email=${user.email}] not found`, HttpStatus.NOT_FOUND);
        }
        const deletedNote = await this.noteService.delete(userNote);
        if (!deletedNote) {
            throw new HttpException(`unable to delete note[noteId=${noteId}]`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return deletedNote;
    }
}
