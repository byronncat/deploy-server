import { signedCookie } from 'cookie-parser';
import { logger } from '../utilities';
import { SessionStorage } from '../data';
import {
  TIME,
  AUTHENTICATE_STATE,
  STATUS_CODE,
  SERVER_ERROR,
  LOGOUT_RESULT,
} from '../constants';

import type { Request, Response } from 'express';
import type { UserToken } from '../types';

export function save(req: Request, res: Response) {
  const user = res.locals.user as UserToken;
  req.session.user = { id: user.id };
  res.cookie('user', user, {
    maxAge: TIME.COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
  });
}

export async function destroy(req: Request, res: Response) {
  try {
    const session = req.session.user;

    if (!session) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: LOGOUT_RESULT.NO_SESSION,
      });
    }

    req.session.destroy((error) => {
      if (error) {
        logger.error(error, 'Session middleware - destroy');
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: SERVER_ERROR.INTERNAL,
        });
      }
    });
    res.clearCookie('user');
    res.clearCookie('session_id');

    return res.status(STATUS_CODE.OK).json({
      success: true,
      message: LOGOUT_RESULT.SUCCESS,
    });
  } catch (error) {
    logger.error(error, 'Session middleware - destroy');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

export async function authenticate(req: Request, res: Response) {
  let result = {
    statusCode: STATUS_CODE.UNAUTHORIZED,
    response: {
      success: false,
      message: AUTHENTICATE_STATE.UNAUTHORIZED,
      data: undefined,
    },
  };

  try {
    const sessionCookie = req.cookies.session_id;
    const sessionId = signedCookie(
      sessionCookie,
      process.env.TOKEN_SECRET || 'secret',
    );

    if (sessionId && req.cookies.user && (await SessionStorage.get(sessionId)))
      result = {
        statusCode: STATUS_CODE.OK,
        response: {
          success: true,
          message: AUTHENTICATE_STATE.AUTHORIZED,
          data: req.cookies.user,
        },
      };
  } catch (error) {
    logger.error(error, 'Session middleware - authenticate');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }

  return res.status(result.statusCode).json(result.response);
}
