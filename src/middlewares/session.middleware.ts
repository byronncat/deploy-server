import { signedCookie } from 'cookie-parser';
import { jwt } from '../libraries';
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
  req.session.user = { id: user!.id };
  res.cookie('user', jwt.generateToken(user!), {
    maxAge: TIME.COOKIE_MAX_AGE,
  });
}

export async function destroy(req: Request, res: Response) {
  try {
    const sessionCookie = req.cookies.session_id;
    const sessionId = signedCookie(
      sessionCookie,
      process.env.TOKEN_SECRET || 'secret',
    );

    if (!sessionId) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: LOGOUT_RESULT.NO_SESSION,
      });
    }

    const removedSessions = await SessionStorage.remove(sessionId);
    if (removedSessions > 0) {
      res.clearCookie('session_id');
      res.clearCookie('user');

      return res.status(STATUS_CODE.OK).json({
        success: true,
        message: LOGOUT_RESULT.SUCCESS,
      });
    } else {
      logger.error('Session not found', 'Session middleware - destroy');
      return res.status(STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: LOGOUT_RESULT.NO_SESSION,
      });
    }
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
