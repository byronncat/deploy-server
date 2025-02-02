import { userService } from '@services';
import { SERVER_ERROR, STATUS_CODE, USER_RESULT } from '@constants';
import { logger } from '@utilities';

import type { Request, Response } from 'express';
import { user } from '@/middlewares';
import { User } from '@/types';

async function getProfile(req: Request, res: Response) {
  const username = req.params.username;
  try {
    await userService
      .getUserProfile({ username })
      .then((profile) =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: USER_RESULT.GET_PROFILE,
          data: profile,
        }),
      )
      .catch((error) => {
        logger.error(error, 'User controller (Get)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: USER_RESULT.FAILED_GET_PROFILE,
        });
      });
  } catch (error) {
    logger.error(error, 'User controller (Get)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error,
    });
  }
}

async function searchProfile(req: Request, res: Response) {
  const searchTerm = req.params.text;
  if (typeof searchTerm === 'undefined') {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      success: false,
      message: USER_RESULT.MISSING_SEARCH_TERM,
    });
  }
  try {
    return await userService
      .searchProfile(searchTerm)
      .then((users) =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: USER_RESULT.SEARCH_SUCCESSFULLY,
          data: users,
        }),
      )
      .catch((error) => {
        logger.error(error, 'User controller (Search)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: USER_RESULT.FAILED_SEARCH,
        });
      });
  } catch (error) {
    logger.error(error, 'User controller (Search)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function followProfile(req: Request, res: Response) {
  const profileUid = req.body.uid;
  const uid = res.locals.user.id;
  try {
    return await userService
      .followProfile(uid, profileUid)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: USER_RESULT.FOLLOWED,
        }),
      )
      .catch((error) => {
        logger.error(error, 'User controller (Follow)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: USER_RESULT.FAILED_FOLLOW,
        });
      });
  } catch (error) {
    logger.error(error, 'User controller (Follow)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function unfollowProfile(req: Request, res: Response) {
  const profileUid = req.body.uid;
  const uid = res.locals.user.id;
  try {
    return await userService
      .unfollowProfile(uid, profileUid)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: USER_RESULT.UNFOLLOWED,
        }),
      )
      .catch((error) => {
        logger.error(error, 'User controller (Unfollow)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: USER_RESULT.FAILED_UNFOLLOW,
        });
      });
  } catch (error) {
    logger.error(error, 'User controller (Unfollow)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function changeAvatar(req: Request, res: Response) {
  const uid = res.locals.user.id;
  const file = JSON.parse(req.body.file) as User['avatar'];
  try {
    return await userService
      .changeAvatar(uid, file)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: USER_RESULT.AVATAR_CHANGED,
        }),
      )
      .catch((error) => {
        logger.error(error, 'User controller (Avatar)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: USER_RESULT.FAILED_AVATAR_CHANGE,
        });
      });
  } catch (error) {
    logger.error(error, 'User controller (Avatar)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function removeAvatar(req: Request, res: Response) {
  const uid = res.locals.user.id;
  try {
    return await userService
      .removeAvatar(uid)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: USER_RESULT.AVATAR_REMOVED,
        }),
      )
      .catch((error) => {
        logger.error(error, 'User controller (Remove avatar)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: USER_RESULT.FAILED_REMOVE_AVATAR,
        });
      });
  } catch (error) {
    logger.error(error, 'User controller (Remove avatar)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

export default {
  search: [searchProfile],
  get: [getProfile],
  follow: [user.authenticate, followProfile],
  unfollow: [user.authenticate, unfollowProfile],
  changeAvatar: [user.authenticate, changeAvatar],
  removeAvatar: [user.authenticate, removeAvatar],
};
