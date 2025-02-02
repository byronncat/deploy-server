import { fileService } from '@services';
import { PostDB, UserDB, QueryCondition } from '@data';
import type {
  User,
  PostUploadData,
  Post,
  PostDisplayData,
  Comment,
  CommentDisplayData,
} from '@types';

enum PageLimit {
  Vertical = 7,
  Grid = 9,
}

export enum PostsType {
  Home = 'home',
  Explore = 'explore',
  ByUsername = 'byUsername',
}

async function getPosts(
  data: Partial<User>,
  options: { type: PostsType; page: number } = {
    type: PostsType.ByUsername,
    page: 0,
  },
): Promise<PostDisplayData[] | null> {
  let posts: (Post & {_id?: string})[] | null = null;

  switch (options.type) {
    case PostsType.Home: {
      if (!data.id) throw new Error('User ID is required');
      const user = await UserDB.getUser(data, {
        findById: data.id ? true : false,
        condition: QueryCondition.Or,
      });
      if (!user) throw new Error('User not found');
      const query = user.followings.map((id) => ({ uid: id }));
      query.push({ uid: user.id });
      posts = await PostDB.getPosts(query, {
        skip: options.page * PageLimit.Vertical,
        limit: PageLimit.Vertical,
      });
      break;
    }
    case PostsType.Explore: {
      const user = await UserDB.getUser(data, {
        findById: true,
      });
      const followings = user?.followings || [];
      posts = await PostDB.getPosts(
        [
          {
            uid: data.id,
          },
          ...followings.map((id) => ({ uid: id })),
        ],
        {
          skip: options.page * PageLimit.Grid,
          limit: PageLimit.Grid,
          random: true,
          excludeCondition: true,
        },
      );
      break;
    }
    case PostsType.ByUsername: {
      const user = await UserDB.getUser({
        username: data.username
      })
      if (!user) throw new Error('User not found');
      posts = await PostDB.getPosts(
        { uid: user.id },
        { skip: options.page * PageLimit.Grid, limit: PageLimit.Grid },
      );
      break;
    }
    default:
      throw new Error('Invalid type');
  }

  if (!posts || posts.length === 0) return null;
  const postDetails = await Promise.all(
    posts.map(async (post) => {
      const user = await UserDB.getUser({ id: post.uid }, { findById: true });
      return {
        id: post._id,
        uid: post.uid,
        username: user!.username,
        avatar: user!.avatar,
        content: post.content,
        files: post.files,
        likes: post.likes,
        comments: post.comments.length,
        createdAt: post.createdAt,
      } as PostDisplayData;
    }),
  );
  return postDetails;
}

async function create(
  uid: User['id'],
  postData: PostUploadData,
): Promise<Post> {
  return await PostDB.createPost(uid, postData);
}

async function update(postData: PostUploadData) {
  if (!postData.id) return Promise.reject('Post ID is required');
  const post = await PostDB.getPost({ id: postData.id }, { findById: true });
  if (!post) return Promise.reject('Post not found');

  await Promise.all(
    post.files.map(async (file) => {
      await fileService
        .deleteImage(file.url)
        .catch((error) => Promise.reject(error));
    }),
  ).catch((error) => Promise.reject(error));
  await PostDB.updatePostByID(postData.id, postData);
}

async function remove(postId: Post['id']) {
  const post = await PostDB.getPostByID(postId);
  if (!post) return Promise.reject('Post not found');

  await Promise.all(
    post.files.map(async (file) => {
      await fileService
        .deleteImage(file.url)
        .catch((error) => Promise.reject(error));
    }),
  ).catch((error) => Promise.reject(error));
  await PostDB.deletePostByID(postId);
}

async function like(postId: Post['id'], uid: User['id']) {
  await PostDB.likePostByID(postId, uid);
}

async function unlike(postId: Post['id'], uid: User['id']) {
  await PostDB.unlikePostByID(postId, uid);
}

async function addComment(
  postId: Post['id'],
  { uid, content }: Partial<Comment>,
) {
  await PostDB.addCommentToPostByID(postId, { uid, content });
}

async function getComments(
  postId: Post['id'],
): Promise<CommentDisplayData[] | null> {
  const comments = await PostDB.getCommentsByID(postId);
  if (!comments) return null;
  return await Promise.all(
    comments.map(async (comment) => {
      const user = await UserDB.getUser({ id: comment.uid }, { findById: true });
      return {
        id: comment.id.toString(),
        uid: comment.uid,
        username: user!.username,
        avatar: user!.avatar,
        content: comment.content,
        createdAt: comment.createdAt,
      } as CommentDisplayData;
    }),
  );
}



async function removeComment(
  postId: Post['id'],
  commentId: CommentDisplayData['id'],
): Promise<void> {
  await PostDB.deleteCommentByID(postId, commentId);
}

export default {
  getPosts,
  create,
  update,
  remove,
  like,
  unlike,
  addComment,
  getComments,
  removeComment,
};
