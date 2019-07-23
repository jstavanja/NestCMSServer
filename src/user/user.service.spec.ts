import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  let mockUser: any;

  beforeEach(async () => {
    mockUser = {
      'username': 'test_user',
      'password': 'test_password'
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
      {
        provide: getRepositoryToken(User),
        useFactory: () => ({
          find: jest.fn(() => [mockUser]),
          findOne: jest.fn(() => true),
          save: jest.fn(() => true),
        }),
      }],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users without sensitive info', async () => {
    mockUser.toResponseObject = jest.fn(() => ({ 'username': 'test_user', 'token': 'sometoken' }));
    const users = await service.showAll();
    expect(repository.find).toHaveBeenCalledWith();
    expect(mockUser.toResponseObject).toHaveBeenCalled();
    expect(users[0]).not.toHaveProperty('password');
  });

  it('should login a user with correct password', async () => {
    // fake a successful authentication when comparePassword is called
    mockUser.comparePassword = jest.fn(() => true)
    // mock an actual found user
    repository.findOne = jest.fn().mockResolvedValue(mockUser);

    const mockUsername = mockUser.username;
    const loggedInMockUserRO = { 'username': mockUsername, 'token': 'sometoken' };
    mockUser.toResponseObject = jest.fn(() => loggedInMockUserRO);
    
    const loggedInUser = await service.login(mockUser);
    expect(repository.findOne).toBeCalledWith({ where: { username: mockUsername } });
    expect(loggedInUser).toEqual(loggedInMockUserRO);
    expect(loggedInUser).not.toHaveProperty('password');
  });

  it('should not login a user with an incorrect password', async () => {
    // fake a successful authentication when comparePassword is called
    mockUser.comparePassword = jest.fn(() => false)
    // mock an actual found user
    repository.findOne = jest.fn().mockResolvedValue(mockUser);

    
    await expect(service.login(mockUser))
      .rejects  
      .toThrow(UnauthorizedException);
      
    const mockUsername = mockUser.username;
    expect(repository.findOne).toBeCalledWith({ where: { username: mockUsername } });
  });
  
  it('should not login a non-existent user', async () => {
    repository.findOne = jest.fn().mockResolvedValue(undefined);

    await expect(service.login(mockUser))
      .rejects  
      .toThrow(UnauthorizedException);

    const mockUsername = mockUser.username;
    expect(repository.findOne).toBeCalledWith({ where: { username: mockUsername } });
  });

  it('should register a not yet existing user', async () => {
    const date = new Date();
    const mockUserAfterCreate: any = {
      'id': 'someid',
      'username': 'test_user',
      'password': 'somehash',
      'created': date,
      toResponseObject: null,
      hashPassword: null,
      comparePassword: null,
      token: 'sometoken'
    }

    repository.create = jest.fn(() => mockUserAfterCreate);
    repository.findOne = jest.fn().mockResolvedValue(undefined);

    const mockUsername = mockUser.username;
    const loggedInMockUserRO = { 'username': mockUsername, 'token': 'sometokenaftercreate' };
    mockUserAfterCreate.toResponseObject = jest.fn(() => loggedInMockUserRO);

    const registeredUser = await service.register(mockUser);

    expect(repository.findOne).toBeCalledWith({ where: { username: mockUsername } });
    expect(repository.create).toBeCalledWith(mockUser);
    expect(repository.save).toBeCalledWith(mockUserAfterCreate);
    expect(registeredUser).not.toHaveProperty('password');
    expect(registeredUser).toHaveProperty('token');
    expect(registeredUser.token).toEqual('sometokenaftercreate');
  });

  it('should not register an existing user', async () => {
    repository.findOne = jest.fn().mockResolvedValue(mockUser);

    await expect(service.register(mockUser))
      .rejects  
      .toThrow(BadRequestException);

    const mockUsername = mockUser.username;
    expect(repository.findOne).toHaveBeenCalledWith({ where: { username: mockUsername } });
  })
});
