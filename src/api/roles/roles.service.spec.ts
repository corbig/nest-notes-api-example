import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { RoleCode } from './entities/role.enum';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
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

const roles: Role[] = [
  {
    id: 1,
    code: RoleCode.USER,
  },
];

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        RolesService,
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should retrieve all roles', async () => {
      jest.spyOn(repository, 'find').mockImplementation(() => Promise.resolve(roles));
      const expectedRoles = await service.findAll();
      expect(expectedRoles).toEqual(roles);
    });
    it('should throw an error when retrieve all roles', async () => {
      jest.spyOn(repository, 'find').mockImplementation(() => Promise.reject('find_findAll_error'));
      const expectedRoles = await service.findAll();
      expect(Logger.error).toHaveBeenCalledWith('find_findAll_error');
      expect(expectedRoles).toBeNull();
    });
  });

  describe('findByRoleCode', () => {

    it('should retrieve a role by role code', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.resolve(roles[0]));
      const requestedRole = await service.findByRoleCode(RoleCode.USER);
      expect(repository.findOne).toHaveBeenCalled();
      expect(requestedRole).toEqual(roles[0]);
    });

    it('should not retrieve a role', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.reject('findOne_findByRoleCode_error'));
      const requestedRole = await service.findByRoleCode(RoleCode.USER);
      expect(Logger.error).toHaveBeenCalledWith('findOne_findByRoleCode_error');
      expect(requestedRole).toBeNull();
    });
  });
});
