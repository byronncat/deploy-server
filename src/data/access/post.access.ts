import { logger } from '@utilities';
import { PostModel, UserModel } from '../models';
import {
  DEFAULT_OPTIONS,
  QueryCondition,
  mapObjectToQuery,
} from './access.helper';
import type { Comment, Post, PostUploadData } from '@types';

export async function getPost(
  data: Partial<Post>,
  options = DEFAULT_OPTIONS,
): Promise<Post | null> {
  try {
    if (options.findById) return await PostModel.findById(data.id);
    const query =
      options?.condition === QueryCondition.And
        ? {
            $and: mapObjectToQuery(data),
          }
        : {
            $or: mapObjectToQuery(data),
          };
    return await PostModel.findOne(query);
  } catch (error) {
    logger.error(error, 'Post Access (Get one)');
    throw error;
  }
}

export async function getPosts(
  data: Partial<Post> | Partial<Post>[],
  options = DEFAULT_OPTIONS,
): Promise<Post[] | []> {
  try {
    let query;
    if (Array.isArray(data)) {
      if (data.length === 0) return [];
      if (options.excludeCondition)
        query = {
          $nor: data.map((item) => ({
            $and: mapObjectToQuery(item),
          })),
        };
      else
        query = {
          $or: data.map((item) => ({
            $and: mapObjectToQuery(item),
          })),
        };
    } else {
      if (options.excludeCondition)
        query = {
          $nor: mapObjectToQuery(data),
        };
      else
        query =
          options?.condition === QueryCondition.And
            ? {
                $and: mapObjectToQuery(data),
              }
            : {
                $or: mapObjectToQuery(data),
              };
    }

    if (options.random)
      return PostModel.aggregate()
        .match(query)
        .sample(options.limit || 1);
    let queryBuilder = PostModel.find(query);
    if (options.skip) queryBuilder = queryBuilder.skip(options.skip);
    if (options.limit) queryBuilder = queryBuilder.limit(options.limit);
    queryBuilder = queryBuilder.sort({ createdAt: -1 });
    return await queryBuilder;
  } catch (error) {
    logger.error(error, 'Post Access (Get many)');
    throw error;
  }
}

const PAGE_LIMIT = 9;
export async function explorePostsByUID(
  uid: Post['uid'],
  page: number,
): Promise<Post[] | null> {
  try {
    const user = await UserModel.findById(uid);
    if (!user) return null;
    return await PostModel.find({ uid: { $nin: user.followings, $ne: uid } })
      .skip(page * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
  } catch (error) {
    logger.error(error, 'Post Access (Explore Posts By ID)');
    throw error;
  }
}

export async function createPost(
  uid: Post['uid'],
  data: PostUploadData,
): Promise<Post> {
  try {
    const post = new PostModel({ uid, ...data });
    await post.save();
    return post;
  } catch (error) {
    logger.error(error, 'Post Access (Create Post)');
    throw error;
  }
}

export async function getPostByID(postID: Post['id']): Promise<Post | null> {
  try {
    return await PostModel.findById(postID);
  } catch (error) {
    logger.error(error, 'Post Access (Get Post By ID)');
    throw error;
  }
}

export async function updatePostByID(postID: Post['id'], data: PostUploadData) {
  try {
    await PostModel.updateOne({ _id: postID }, data);
  } catch (error) {
    logger.error(error, 'Post Access (Update Post By ID)');
    throw error;
  }
}

export async function deletePostByID(postID: Post['id']): Promise<void> {
  try {
    await PostModel.deleteOne({ _id: postID });
  } catch (error) {
    logger.error(error, 'Post Access (Delete Post)');
    throw error;
  }
}

export async function getPostByUIDs(
  uids: Post['uid'][],
): Promise<Post[] | null> {
  try {
    return await PostModel.find({ uid: { $in: uids } });
  } catch (error) {
    logger.error(error, 'Post Access (Get Post By UIDs)');
    throw error;
  }
}

export async function getPostByUID(uid: Post['uid']): Promise<Post[] | null> {
  try {
    return await PostModel.find({ uid });
  } catch (error) {
    logger.error(error, 'Post Access (Get Post By UID)');
    throw error;
  }
}

export async function likePostByID(
  postID: Post['id'],
  uid: Post['uid'],
): Promise<void> {
  try {
    await PostModel.updateOne({ _id: postID }, { $addToSet: { likes: uid } });
  } catch (error) {
    logger.error(error, 'Post Access (Like Post By ID)');
    throw error;
  }
}

export async function unlikePostByID(
  postID: Post['id'],
  uid: Post['uid'],
): Promise<void> {
  try {
    await PostModel.updateOne({ _id: postID }, { $pull: { likes: uid } });
  } catch (error) {
    logger.error(error, 'Post Access (Unlike Post By ID)');
    throw error;
  }
}

export async function addCommentToPostByID(
  postID: Post['id'],
  commentData: Partial<Comment>,
): Promise<void> {
  try {
    await PostModel.updateOne(
      { _id: postID },
      { $push: { comments: commentData } },
    );
  } catch (error) {
    logger.error(
      JSON.stringify(error),
      'Post Access (Add Comment To Post By ID)',
    );
    throw error;
  }
}

export async function getCommentsByID(
  postID: Post['id'],
): Promise<Comment[] | null> {
  try {
    const post = await PostModel.findById(postID).select('comments');
    if (!post) return null;
    return post.comments;
  } catch (error) {
    logger.error(error, 'Post Access (Get Comments By ID)');
    throw error;
  }
}

export async function deleteCommentByID(
  postID: Post['id'],
  commentID: Comment['id'],
): Promise<void> {
  try {
    await PostModel.updateOne(
      { _id: postID },
      { $pull: { comments: { _id: commentID } } },
    );
  } catch (error) {
    logger.error(error, 'Post Access (Delete Comment By ID)');
    throw error;
  }
}