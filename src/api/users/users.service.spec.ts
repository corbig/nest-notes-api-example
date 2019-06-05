import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/entities/role.entity';
import { RoleCode } from '../roles/entities/role.enum';
import { Logger } from '@nestjs/common';

// Logger mock, other objects in module keep their real implementations
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: class {
    log = jest.fn();
    static error = jest.fn();
    static overrideLogger = jest.fn();
  },
}));

const user: User = {
  id: 1,
  email: 'user@user.com',
  isActive: false,
  password: 'user',
  roles: [],
};
const role = { id: 1, code: RoleCode.USER };

const encryptedPassword = 'fa2a968f6fb053f4edf9a0fc19b95e543eff5324395fd26e983cad9be7f114e5';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let roleService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        UsersService,
        RolesService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    roleService = module.get<RolesService>(RolesService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findByEmail', () => {

    it('should retrieve a user by email', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.resolve(user));
      const requestedUser = await service.findByEmail(user.email);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(requestedUser).toEqual(user);
    });

    it('should throw an error when retrieve a user by email', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.reject('findOne_findByEmail_error'));
      const userCreated = await service.findByEmail(user.email);
      expect(Logger.error).toHaveBeenCalledWith('findOne_findByEmail_error');
      expect(userCreated).toBeNull();
    });
  });

  describe('findById', () => {

    it('should retrieve a user by id', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.resolve(user));
      const requestedUser = await service.findById(user.id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(requestedUser).toEqual(user);
    });

    it('should throw an error when retrieve a user by email', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.reject('findOne_findById_error'));
      const userCreated = await service.findById(user.id);
      expect(Logger.error).toHaveBeenCalledWith('findOne_findById_error');
      expect(userCreated).toBeNull();
    });
  });

  describe('create', () => {

    it('should create a user', async () => {
      jest.spyOn(roleService, 'findByRoleCode').mockImplementation(() => Promise.resolve(role));
      jest.spyOn(repository, 'save').mockImplementation(() => Promise.resolve(user));
      const userSettedForCreation = { ...user, id: null, roles: [role], password: encryptedPassword };
      const userCreated = await service.create(user);
      expect(roleService.findByRoleCode).toHaveBeenCalledWith(RoleCode.USER);
      expect(repository.save).toHaveBeenCalledWith(userSettedForCreation);
      expect(userCreated).toEqual(userSettedForCreation);
    });

    it('should throw an error from repository when create a user', async () => {
      jest.spyOn(roleService, 'findByRoleCode').mockImplementation(() => Promise.resolve(role));
      jest.spyOn(repository, 'save').mockImplementation(() => Promise.reject('save_create_error'));
      const userCreated = await service.create(user);
      expect(Logger.error).toHaveBeenCalledWith('save_create_error');
      expect(userCreated).toBeNull();
    });

    it('should throw an error from roleService when create a user', async () => {
      jest.spyOn(roleService, 'findByRoleCode').mockImplementation(() => Promise.reject('findByRoleCode_create_error'));
      const userCreated = await service.create(user);
      expect(Logger.error).toHaveBeenCalledWith('findByRoleCode_create_error');
      expect(userCreated).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      jest.spyOn(repository, 'save').mockImplementation(() => Promise.resolve(user));
      const userCreated = await service.save(user);
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(userCreated).toEqual(user);
    });
    it('should throw an error from repository when save a user', async () => {
      jest.spyOn(repository, 'save').mockImplementation(() => Promise.reject('save_save_error'));
      const userCreated = await service.create(user);
      expect(Logger.error).toHaveBeenCalledWith('save_save_error');
      expect(userCreated).toBeNull();
    });
  });
});
