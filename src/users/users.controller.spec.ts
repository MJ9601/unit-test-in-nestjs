import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  let reqMock = { query: {} } as unknown as Request;
  let resSendMock = {
    send: jest.fn((y) => y),
  };
  let resMock = {
    sendStatus: jest.fn((x) => x),
    status: jest.fn((x) => resSendMock),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: {
            createUser: jest.fn((x) => ({ ...x, status: 'success', id: 1 })),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>('USER_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('payment service should be defined!', () => {
    expect(usersService).toBeDefined();
  });

  describe('get users', () => {
    it('should return status code of 400', () => {
      controller.getUsers(reqMock, resMock);
      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it('should return status code 200', () => {
      reqMock.query = {
        count: '10',
        page: '1',
      };
      controller.getUsers(reqMock, resMock);
      expect(resMock.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('get user', () => {
    it('should return status code of 400', () => {
      reqMock.query = {};
      controller.getUser(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resSendMock.send).toHaveBeenCalledWith({ msg: 'Not Found!' });
    });

    it('should return status code of 200', () => {
      reqMock.query = { page: '10', count: '2' };
      controller.getUser(reqMock, resMock);
      expect(resMock.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('create new User', () => {
    it('should return successful response', async () => {
      const response = await controller.createUserHandler({
        email: 'john@mail.com',
        name: 'john',
        password: 'password',
      });
      expect(response).toStrictEqual({
        id: 1,
        name: 'john',
        email: 'john@mail.com',
        password: 'password',
        status: 'success',
      });
    });

    it('should return  err', async () => {
      jest.spyOn(usersService, 'createUser').mockImplementationOnce(() => {
        throw new BadRequestException();
      });
      try {
        const response = await controller.createUserHandler({
          email: 'jane@mail.com',
          name: 'jane',
          password: 'password',
        });
        expect(response).toStrictEqual({
          id: 1,
          name: 'john',
          email: 'john@mail.com',
          password: 'password',
          status: 'success',
        });
      } catch (error) {
        console.error(error);
      }
    });
  });
});
