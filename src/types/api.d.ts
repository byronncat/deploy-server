import type { User, Comment, Post, Profile } from '@types';

export type API<DataType = undefined> = {
  readonly success: boolean;
  readonly message: string;
} & (DataType extends undefined ? {} : { readonly data?: DataType });

export type PostUploadData = {
  id?: Post['id'];
  content: Post['content'];
  files: Post['files'];
};

export type SearchProfileData = Pick<User, 'id' | 'username' | 'avatar'>;
export type GetProfileData = User & {
  totalPosts: number;
};

// TODO: Refactor

export type PostDisplayData = Omit<Post, 'comments'> &
  Pick<User, 'username'> &
  Pick<Profile, 'avatar'> & {
    comments: number;
  };

export type CommentDisplayData = Comment &
  Pick<User, 'username'> &
  Pick<Profile, 'avatar'>;
