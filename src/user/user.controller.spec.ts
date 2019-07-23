import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDTO } from 'dist/user/dto/user.dto';

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: UserDTO = {
    'username': 'test_user',
    'password': 'test_password',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            showAll: jest.fn(() => true),
            register: jest.fn(() => true),
            login: jest.fn(() => true),
          }),
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get users', async () => {
    await controller.showAllUsers();
    expect(service.showAll).toHaveBeenCalled();
  });

  it('should log a user in', async () => {
    await controller.login(mockUser);
    expect(service.login).toHaveBeenCalledWith(mockUser);
  });

  it('register a user', async () => {
    await controller.register(mockUser);
    expect(service.register).toHaveBeenCalledWith(mockUser);
  });
});
