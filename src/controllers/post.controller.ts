import { postService } from '../services';
import { user } from '../middlewares';
import { jwt } from '../libraries';
import { logger } from '../utilities';
import { POST_RESULT, SERVER_ERROR, STATUS_CODE } from '../constants';

import type { Request, Response } from 'express';
import type {
  API,
  CommentDisplayData,
  PostUploadData,
  UserToken,
} from '@types';
import { PostsType } from '../services/post.service';

async function getPosts(req: Request, res: Response) {
  if (req.cookies.user) {
    res.locals.user = jwt.parseToken(req.cookies.user) as UserToken;
  }
  const page = req.query.page as unknown as number;
  const type = req.query.type as PostsType;
  try {
    return await postService
      .getPosts(
        { id: res.locals.user?.id },
        {
          type,
          page,
        },
      )
      .then((posts) =>
        res.json({
          success: true,
          message: POST_RESULT.GET_SUCCESS,
          data: posts,
        }),
      )
      .catch((error) => {
        logger.error(error, 'Post controller (Home)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: POST_RESULT.GET_FAILURE,
        });
      });
  } catch (error) {
    logger.error(error, 'Post controller (Home)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function getPostsByUsername(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const page = req.query.page as unknown as number;
    await postService
      .getPosts(
        { username },
        {
          type: PostsType.ByUsername,
          page,
        },
      )
      .then((posts) =>
        res.json({
          success: true,
          message: POST_RESULT.GET_SUCCESS,
          data: posts,
        }),
      )
      .catch((error) => {
        logger.error(
          JSON.stringify(error),
          'Post controller (Get by username)',
        );
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: POST_RESULT.GET_FAILURE,
        });
      });
  } catch (error) {
    logger.error(error, 'Post controller (Get by username)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function createPost(req: Request, res: Response) {
  try {
    const postData = req.body as PostUploadData;
    const uid = res.locals.user.id;
    return await postService
      .create(uid, postData)
      .then(() => {
        return res.status(STATUS_CODE.OK).json({
          success: true,
          message: POST_RESULT.CREATED,
        });
      })
      .catch((error) => {
        logger.error(error, 'Post controller (Create)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: POST_RESULT.FAILED_CREATE,
        });
      });
  } catch (error) {
    logger.error(error, 'Post controller (Create)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function updatePost(req: Request, res: Response): Promise<Response<API>> {
  try {
    const postData = req.body as PostUploadData;
    return await postService
      .update(postData)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: POST_RESULT.UPDATED,
        }),
      )
      .catch((error) => {
        logger.error(error, 'Post controller (Update)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: POST_RESULT.FAILED_UPDATE,
        });
      });
  } catch (error) {
    logger.error(error, 'Post controller');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    return await postService
      .remove(postId)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: POST_RESULT.DELETED_SUCCESSFULLY,
        }),
      )
      .catch((error) => {
        logger.error(error, 'Post controller (Delete)');
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: POST_RESULT.DELETED_FAILED,
        });
      });
  } catch (error) {
    logger.error(error, 'Post controller (Delete)');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: SERVER_ERROR.INTERNAL,
    });
  }
}

// TODO: Refactor

async function likePost(req: Request, res: Response) {
  try {
    const { postId } = req.body;
    const uid = res.locals.user.id;
    return await postService
      .like(postId, uid)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Post liked',
        } as API),
      )
      .catch((error) =>
        res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: JSON.stringify(error),
        } as API),
      );
  } catch (error) {
    logger.error(error, 'Post controller');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error, like post failed',
    });
  }
}

async function unlikePost(req: Request, res: Response) {
  try {
    const { postId } = req.body;
    const uid = res.locals.user.id;
    return await postService
      .unlike(postId, uid)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Post unliked',
        } as API),
      )
      .catch((error) =>
        res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: JSON.stringify(error),
        } as API),
      );
  } catch (error) {
    logger.error(error, 'Post controller');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error, unlike post failed',
    });
  }
}

async function commentPost(req: Request, res: Response) {
  try {
    const { postId, content } = req.body;
    const uid = res.locals.user.id;
    return await postService
      .addComment(postId, { uid, content })
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Comment added',
        } as API),
      )
      .catch((error) =>
        res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: JSON.stringify(error),
        } as API),
      );
  } catch (error) {
    logger.error(error, 'Post controller');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error, comment post failed',
    });
  }
}

async function getComments(
  req: Request,
  res: Response,
): Promise<Response<API<CommentDisplayData[] | null>>> {
  try {
    const { postId } = req.params;
    return await postService
      .getComments(postId)
      .then((comments) => {
        return res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Comments retrieved',
          data: comments,
        } as API);
      })
      .catch((error) =>
        res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: JSON.stringify(error),
        } as API),
      );
  } catch (error) {
    logger.error(error, 'Post controller');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error, get comments failed',
    });
  }
}

async function deleteComment(req: Request, res: Response) {
  try {
    const { postId, commentId } = req.params;
    return await postService
      .removeComment(postId, commentId)
      .then(() =>
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Comment removed',
        } as API),
      )
      .catch((error) =>
        res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: JSON.stringify(error),
        } as API),
      );
  } catch (error) {
    logger.error(error, 'Post controller');
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error, delete comment failed',
    });
  }
}

export default {
  get: [getPosts],
  create: [user.authenticate, createPost],
  getByUsername: [getPostsByUsername],
  update: [user.authenticate, updatePost],
  delete: [user.authenticate, deletePost],
  like: [user.authenticate, likePost],
  unlike: [user.authenticate, unlikePost],
  comment: [user.authenticate, commentPost],
  getComments: [getComments],
  deleteComment: [user.authenticate, deleteComment],
};
