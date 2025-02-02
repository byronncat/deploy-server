import { sessionManager } from '@middlewares';
import { userService } from '@services';
import { logger } from '@utilities';
import {
  LOGIN_RESULT,
  REGISTER_RESULT,
  SERVER_ERROR,
  STATUS_CODE,
} from '@constants';

import type { NextFunction, Request, Response } from 'express';
import type { User, UserToken } from '@types';

async function logIn(req: Request, res: Response, next: NextFunction) {
  const { identity, password } = req.body as Pick<User, 'password'> & {
    identity: User['email'] | User['username'];
  };
  try {
    const result = (await userService.login(identity, password)) as {
      message: LOGIN_RESULT;
      user?: UserToken;
    };

    switch (result.message) {
      case LOGIN_RESULT.NOT_EXIST:
        return res.status(STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: LOGIN_RESULT.NOT_EXIST,
        });
      case LOGIN_RESULT.INCORRECT_PASSWORD:
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
          success: false,
          message: LOGIN_RESULT.INCORRECT_PASSWORD,
        });
      case LOGIN_RESULT.SUCCESS:
        res.locals.user = result.user;
        next();
        return res.status(STATUS_CODE.OK).json({
          success: true,
          message: LOGIN_RESULT.SUCCESS,
        });
      default:
        throw new Error('Invalid login result');
    }
  } catch (error) {
    logger.error(error, 'Authentication controller - login');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function register(req: Request, res: Response, next: NextFunction) {
  const registerData = req.body as Pick<
    User,
    'email' | 'username' | 'password'
  >;

  try {
    const result = (await userService.register(registerData)) as {
      message: REGISTER_RESULT;
      user?: UserToken;
    };

    switch (result.message) {
      case REGISTER_RESULT.EMAIL_EXISTS:
        return res.status(STATUS_CODE.CONFLICT).json({
          success: false,
          message: REGISTER_RESULT.EMAIL_EXISTS,
        });
      case REGISTER_RESULT.USERNAME_EXISTS:
        return res.status(STATUS_CODE.CONFLICT).json({
          success: false,
          message: REGISTER_RESULT.USERNAME_EXISTS,
        });
      case REGISTER_RESULT.SUCCESS:
        res.locals.user = result.user;
        next();
        return res.status(STATUS_CODE.OK).json({
          success: true,
          message: REGISTER_RESULT.SUCCESS,
        });
      default:
        throw new Error('Invalid register result');
    }
  } catch (error) {
    logger.error(error, 'Authentication controller - register');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

export default {
  login: [logIn, sessionManager.save],
  register: [register, sessionManager.save],
  logout: [sessionManager.destroy],
  authenticate: [sessionManager.authenticate],
};
