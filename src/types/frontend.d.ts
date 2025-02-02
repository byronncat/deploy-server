import { API, User, Credentials, Post, Profile } from '@types';

export interface PostData
  extends Pick<Profile, 'username' | 'avatar'>,
    Omit<Post, 'comments'> {}

export interface ProfileData extends Profile {
  posts?: PostData[];
}

export interface SearchProfileAPI extends API {
  data: Profile[];
}

export interface PostAPI extends API {
  data: PostData[];
}

export interface CommentAPI extends API {
  data: CommentData[];
}

export interface AvatarAPI extends API {
  data: Profile['avatar'];
}

export interface ProfileAPI extends API {
  data: ProfileData;
}
