import { jwt } from '../libraries';
import { STATUS_CODE } from '../constants';

import type { Request, Response } from 'express';
import type { UserToken } from '../types';

export function authenticate(req: Request, res: Response, next: Function) {
  if (req.cookies.user) {
    res.locals.user = jwt.parseToken(req.cookies.user) as UserToken;
  } else {
    return res.status(STATUS_CODE.FORBIDDEN).json({
      success: false,
      message: 'User not authenticated',
    });
  }
  next();
}
