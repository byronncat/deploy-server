jest.useFakeTimers();
import { userService } from '@services';
import { LOGIN_RESULT, REGISTER_RESULT } from '@constants';

import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../database/access';
import { password } from '@/helpers';
import { User } from '@/types';

jest.mock('redis', () => ({
  createClient: () => ({
    on: jest.fn(),
    quit: jest.fn(),
    connect: jest.fn(),
  }),
}));
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  Schema: jest.fn().mockImplementation(() => ({})),
  model: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('pg-promise', () => {
  return () =>
    jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn().mockResolvedValue({
          client: {
            serverVersion: '13.3',
          },
          done: jest.fn(),
        }),
      };
    });
});

jest.mock('../database/access');
jest.mock('@helpers');

describe('service', () => {
  describe('account', () => {
    describe('login', () => {
      beforeEach(() => {});
      it('should successfully', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue({
          id: 1,
          email: 'test@gmail.com',
          password: '123456',
        });
        (password.compare as jest.Mock).mockResolvedValue(true);
        const result = await userService.login('test@gmail.com', '123456');
        expect(result).toEqual({
          userId: 1,
          message: LOGIN_RESULT.SUCCESS,
        });
      });

      it('should return failure if password is incorrect', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue({
          id: 1,
          email: 'test@gmail.com',
          password: '123456',
        });
        (password.compare as jest.Mock).mockResolvedValue(false);
        const result = await userService.login(
          'test@gmail.com',
          'wrongpassword',
        );
        expect(result).toEqual({
          userId: null,
          message: LOGIN_RESULT.INCORRECT_PASSWORD,
        });
      });
      it('should return failure if email does not exist', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        const result = await userService.login('wrongemail', '123456');
        expect(result).toEqual({
          userId: null,
          message: LOGIN_RESULT.NOT_EXIST,
        });
      });
      it('should throw an error if database query fails', async () => {
        (getUserByEmail as jest.Mock).mockRejectedValue('Database error');
        await expect(userService.login('test', '123456')).rejects.toEqual(
          'Database error',
        );
      });
    });

    describe('register', () => {
      it('should return success', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        (getUserByUsername as jest.Mock).mockResolvedValue(null);
        (createUser as jest.Mock).mockResolvedValue({
          id: 1,
        });
        const result = await userService.register({
          email: '',
          password: '',
          username: '',
        } as User);

        expect(result).toEqual({
          userId: 1,
          message: REGISTER_RESULT.SUCCESS,
        });
      });

      it('should return failure if email exists', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue({
          email: '',
          password: '',
          username: '',
        });
        const result = await userService.register({
          email: '',
          password: '',
          username: '',
        } as User);
        expect(result).toEqual({
          userId: null,
          message: REGISTER_RESULT.EMAIL_EXISTS,
        });
      });

      it('should return failure if username exists', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        (getUserByUsername as jest.Mock).mockResolvedValue({
          email: '',
          password: '',
          username: '',
        });
        const result = await userService.register({
          email: '',
          password: '',
          username: '',
        } as User);
        expect(result).toEqual({
          userId: null,
          message: REGISTER_RESULT.USERNAME_EXISTS,
        });
      });

      it('should throw an error if database query fails', async () => {
        (getUserByEmail as jest.Mock).mockRejectedValue('Database error');
        await expect(
          userService.register({
            email: '',
            password: '',
            username: '',
          } as User),
        ).rejects.toEqual('Database error');
      });
    });
  });
});
