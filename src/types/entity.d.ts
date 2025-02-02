export type User = {
  readonly id: string;
  email: string;
  username: string;
  password: string;
  followers: User['id'][];
  followings: User['id'][];
  avatar?: MediaInfo;
  description?: string;
};

export type MediaInfo = {
  readonly id: string;
  readonly url: string;
  readonly type: 'image' | 'video';
  readonly orientation: 'landscape' | 'portrait' | 'square';
};

export type Post = {
  readonly id: string;
  readonly uid: User['id'];
  content: string;
  files: MediaInfo[];
  likes: User['id'][];
  comments: Comment[];
  createdAt: Date;
};

export type Comment = {
  readonly id: string;
  readonly uid: User['id'];
  content: string;
  createdAt: Date;
};
