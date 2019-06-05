import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../api/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../api/roles/entities/role.entity';
import { UsersService } from '../api/users/users.service';
import { RolesService } from '../api/roles/roles.service';
import { ConfigurationService } from '../configuration/configuration.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: jest.fn(),
        },
        {
          provide: ConfigurationService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
