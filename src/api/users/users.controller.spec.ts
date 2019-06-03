import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { UsersRolesDto } from './dtos/UsersRoles.dto';
import { RoleCode } from '../roles/entities/role.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

const userId = 1;

const user: User = {
  id: 1,
  email: 'user@user.com',
  isActive: true,
  password: 'user',
  roles: [],
};
const usersRolesDto: UsersRolesDto = {
  roles: [
    {
      id: 1,
      code: RoleCode.USER,
    },
  ],
};

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setUsersRole', () => {
    it('should update roles of a user', async () => {
      jest.spyOn(service, 'findById').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(user));
      const updatedUser = await controller.setUsersRole(userId, usersRolesDto);

      expect(service.findById).toHaveBeenCalledWith(userId);
      expect(service.save).toHaveBeenCalledWith(user);
      expect(updatedUser).toEqual({ ...user, roles: usersRolesDto.roles });
    });
    it('should throw an error from UsersService.findById when update roles of a user', async () => {
      let isErrorCatch = false;
      jest.spyOn(service, 'findById').mockImplementation(() => Promise.resolve(null));
      try {
        await controller.setUsersRole(userId, usersRolesDto);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException(`User [ID=1] not found`, HttpStatus.NOT_FOUND));
      }
      expect(isErrorCatch).toBeTruthy();
    });
    it('should throw an error from UsersService.save when update roles of a user', async () => {
      let isErrorCatch = false;
      jest.spyOn(service, 'findById').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(null));
      try {
        await controller.setUsersRole(userId, usersRolesDto);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException(`Error while updating User [ID=1]`, HttpStatus.INTERNAL_SERVER_ERROR));
      }
      expect(isErrorCatch).toBeTruthy();
    });
  });

  describe('setActivation', () => {
    it('should change user activation', async () => {
      jest.spyOn(service, 'findById').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(user));
      const updatedUser = await controller.setActivation(userId, 'false');
      expect(service.findById).toHaveBeenCalledWith(userId);
      expect(service.save).toHaveBeenCalledWith(user);
      expect(updatedUser).toEqual({ ...user, isActive: false });
    });

    it('should throw an error from UsersService.findById when update activation of a user', async () => {
      let isErrorCatch = false;
      jest.spyOn(service, 'findById').mockImplementation(() => Promise.resolve(null));
      try {
        await controller.setActivation(userId, 'false');
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException(`User [ID=1] not found`, HttpStatus.NOT_FOUND));
      }
      expect(isErrorCatch).toBeTruthy();
    });

    it('should throw an error from UsersService.save when update activation of a user', async () => {
      let isErrorCatch = false;
      jest.spyOn(service, 'findById').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(service, 'save').mockImplementation(() => Promise.resolve(null));
      try {
        await controller.setActivation(userId, 'false');
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException(`Error while updating User [ID=1]`, HttpStatus.INTERNAL_SERVER_ERROR));
      }
      expect(isErrorCatch).toBeTruthy();
    });

    it('should throw an error when activation param. is null', async () => {
      let isErrorCatch = false;
      try {
        await controller.setActivation(userId, null);
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException(`The active query param must be set to \'true\' or \'false\'`, HttpStatus.BAD_REQUEST));
      }
      expect(isErrorCatch).toBeTruthy();
    });

    it('should throw an error when activation param. is not a boolean', async () => {
      let isErrorCatch = false;
      try {
        await controller.setActivation(userId, '');
      } catch (error) {
        isErrorCatch = true;
        expect(error).toEqual(new HttpException(`The active query param must be set to \'true\' or \'false\'`, HttpStatus.BAD_REQUEST));
      }
      expect(isErrorCatch).toBeTruthy();
    });
  });
});
