import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { RoleCode } from './entities/role.enum';
import { RolesService } from './roles.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const roles: Role[] = [
  {
    id: 1,
    code: RoleCode.USER,
  },
];

describe('Roles Controller', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        RolesService,
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {

    it('should retrieve all roles', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(roles));
      const retriveRoles = await controller.findAll();
      expect(retriveRoles).toEqual(roles);
    });

    it('should reject an error on roles retrieval', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(null));
      let isErrorCatch = false;
      try {
        await controller.findAll();
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException('unable to retrieve roles', HttpStatus.INTERNAL_SERVER_ERROR));
      }
      expect(isErrorCatch).toBeTruthy();
    });

  });
});
