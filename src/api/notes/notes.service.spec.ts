import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Logger } from '@nestjs/common';
import { NoteDto } from './dtos/Note.dto';

// Logger mock, other objects in module keep their real implementations
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: class {
    log = jest.fn();
    static error = jest.fn();
    static overrideLogger = jest.fn();
  },
}));

const notes: Note[] = [
  {
    id: 1,
    title: 'title',
    content: 'content',
    lastModificationDate: new Date(),
    author: null,
  },
];

describe('NotesService', () => {
  let service: NotesService;
  let repository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
        },
        NotesService,
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAllByUser', () => {
    it('should retrieve all notes for a given user', async () => {
      jest.spyOn(repository, 'find').mockImplementation(() => Promise.resolve(notes));
      const user: User = { id: 1, email: null, password: null, isActive: null, roles: null };
      const retrievedNotes = await service.findAllByUser(user);
      expect(retrievedNotes).toEqual(notes);
      expect(repository.find).toHaveBeenCalledWith({ where: { author: user } });
    });

    it('should throw an error when retrieve all notes for a given user', async () => {
      jest.spyOn(repository, 'find').mockImplementation(() => Promise.reject('find_findAllByUser_error'));
      const user: User = { id: 1, email: null, password: null, isActive: null, roles: null };
      const retrievedNotes = await service.findAllByUser(user);
      expect(Logger.error).toHaveBeenCalledWith('find_findAllByUser_error');
      expect(retrievedNotes).toBeNull();
    });
  });
  describe('save', () => {
    it('should save a note for a given user', async () => {
      const note: Note = { ...notes[0] };
      jest.spyOn(repository, 'save').mockImplementation(() => Promise.resolve(note));
      const savedNote = await service.save(note);
      expect(repository.save).toHaveBeenCalledWith(note);
      expect(savedNote).toEqual(note);
    });
    it('should throw an error when save a note for a given user', async () => {
      jest.spyOn(repository, 'save').mockImplementation(() => Promise.reject('save_save_error'));
      const note: Note = { ...notes[0] };
      const savedNote = await service.save(note);
      expect(Logger.error).toHaveBeenCalledWith('save_save_error');
      expect(savedNote).toEqual(null);
    });
  });
  describe('findOneByIdAndUser', () => {
    it('should retrieve a note for a given user', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockImplementation(() => Promise.resolve(notes[0]));
      const user: User = { id: 1, email: null, password: null, isActive: null, roles: null };
      const retrieveNote = await service.findOneByIdAndUser(user, 1);
      expect(retrieveNote).toEqual(notes[0]);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1, author: user } });
    });
    it('should retrieve a note for a given user', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockImplementation(() => Promise.reject('findOneOrFail_findOneByIdAndUser_error'));
      const user: User = { id: 1, email: null, password: null, isActive: null, roles: null };
      const retrieveNote = await service.findOneByIdAndUser(user, 1);
      expect(Logger.error).toHaveBeenCalledWith('findOneOrFail_findOneByIdAndUser_error');
      expect(retrieveNote).toEqual(null);
    });
  });
  describe('delete', () => {
    it('should delete a note', async () => {
      jest.spyOn(repository, 'remove').mockImplementation(() => Promise.resolve(notes[0]));
      const deletedNote = await service.delete(notes[0]);
      expect(deletedNote).toEqual(notes[0]);
      expect(repository.remove).toHaveBeenCalledWith(notes[0]);
    });
    it('should throw an error when delete a note', async () => {
      jest.spyOn(repository, 'remove').mockImplementation(() => Promise.reject('remove_delete_error'));
      const deletedNote = await service.delete(notes[0]);
      expect(Logger.error).toHaveBeenCalledWith('remove_delete_error');
      expect(deletedNote).toEqual(null);
    });
  });
});
