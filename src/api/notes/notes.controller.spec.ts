import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { NotesService } from './notes.service';
import { HttpStatus, HttpException } from '@nestjs/common';
import { NoteDto } from './dtos/Note.dto';

declare var global;

const constantDate = new Date('2019-06-01T05:41:20');

// tslint:disable-next-line:variable-name
const _Date = Date;
global.Date = jest.fn(() => constantDate);
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;

const notes: Note[] = [
  {
    id: 1,
    title: 'title',
    content: 'content',
    lastModificationDate: new Date(),
    author: null,
  },
];

describe('Notes Controller', () => {
  let controller: NotesController;
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
        },
        NotesService,
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllByUser', () => {
    it('should retrieve all notes for a user given user', async () => {
      jest.spyOn(service, 'findAllByUser').mockImplementation(() => Promise.resolve(notes));
      const request = { user: { id: 1 } };
      const retrievedNotes = await controller.findAllByUser(request);
      expect(retrievedNotes).toEqual(notes);
    });

    it('should throw an error when retrieve all notes for a user given user', async () => {
      jest.spyOn(service, 'findAllByUser').mockImplementation(() => Promise.resolve(null));
      const request = { user: { id: 1 } };
      let isErrorCatch = false;
      try {
        await controller.findAllByUser(request);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException('unable to retrieve notes', HttpStatus.NOT_FOUND));
      }
      expect(isErrorCatch).toBeTruthy();
    });

  });

  describe('create', () => {
    it('should create new note for a given user', async () => {
      const request = { user: { id: 1 } };
      const noteDto = { ...notes[0], id: null };
      const noteSetupForSave = { ...noteDto, author: request.user as any, lastModificationDate: constantDate };
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(noteSetupForSave));
      const savedNote = await controller.create(request, noteDto);
      expect(service.save).toHaveBeenCalledWith(noteSetupForSave);
      expect(savedNote).toEqual(noteSetupForSave);
    });
    it('should update note for a given user', async () => {
      const request = { user: { id: 1 } };
      const noteDto = { ...notes[0] };
      const noteSetupForSave = { ...noteDto, author: request.user as any, lastModificationDate: constantDate };
      jest.spyOn(service, 'findOneByIdAndUser').mockImplementation(() => Promise.resolve({ ...notes[0], author: request.user } as any));
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(noteSetupForSave));
      const savedNote = await controller.create(request, noteDto);
      expect(service.save).toHaveBeenCalledWith(noteSetupForSave);
      expect(savedNote).toEqual(noteSetupForSave);
    });
    it('should throw an error when retrieve an existing note for a given user', async () => {
      jest.spyOn(service, 'findOneByIdAndUser').mockImplementation(() => Promise.resolve(null));
      const request = { user: { id: 1, email: 'user@user.com' } };
      const noteDto: NoteDto = { ...notes[0] };
      let isErrorCatch = false;
      try {
        await controller.create(request, noteDto);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException('note[noteId=1] for user[email=user@user.com] not found', HttpStatus.NOT_FOUND));
      }
      expect(isErrorCatch).toBeTruthy();
    });
    it('should throw an error when create new note for a given user', async () => {
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(null));
      const request = { user: { id: 1 } };
      const noteDto: NoteDto = { ...notes[0], id: null };
      let isErrorCatch = false;
      try {
        await controller.create(request, noteDto);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException('unable to create new note', HttpStatus.INTERNAL_SERVER_ERROR));
      }
      expect(isErrorCatch).toBeTruthy();
    });
    it('should throw an error when save existing note for a given user', async () => {
      jest.spyOn(service, 'findOneByIdAndUser').mockImplementation(() => Promise.resolve({ ...notes[0], author: request.user } as any));
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(null));
      const request = { user: { id: 1 } };
      const noteDto: NoteDto = { ...notes[0] };
      let isErrorCatch = false;
      try {
        await controller.create(request, noteDto);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException('unable to save note[noteId=1]', HttpStatus.INTERNAL_SERVER_ERROR));
      }
      expect(isErrorCatch).toBeTruthy();
    });
  });
  describe('delete', () => {
    it('should delete a note for a given user', async () => {
      jest.spyOn(service, 'findOneByIdAndUser').mockImplementation(() => Promise.resolve(notes[0]));
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve(notes[0]));
      const request = { user: { id: 1 } };
      const deletedNote = await controller.delete(request, 1);
      expect(deletedNote).toEqual(notes[0]);
    });
    it('should throw an error from NotesService.findOneByIdAndUser when delete a note for a given user', async () => {
      jest.spyOn(service, 'findOneByIdAndUser').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve(notes[0]));
      const request = { user: { id: 1, email: 'user@user.com' } };
      let isErrorCatch = false;
      try {
        await controller.delete(request, 1);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException('note[noteId=1] for user[email=user@user.com] not found', HttpStatus.NOT_FOUND));
      }
      expect(isErrorCatch).toBeTruthy();
    });
    it('should throw an error from NotesService.delete when delete a note for a given user', async () => {
      jest.spyOn(service, 'findOneByIdAndUser').mockImplementation(() => Promise.resolve(notes[0]));
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve(null));
      const request = { user: { id: 1 } };
      let isErrorCatch = false;
      try {
        await controller.delete(request, 1);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException('unable to delete note[noteId=1]', HttpStatus.INTERNAL_SERVER_ERROR));
      }
      expect(isErrorCatch).toBeTruthy();
    });
  });
});
