export enum LOGIN_RESULT {
  NOT_EXIST = 'User does not exist',
  INCORRECT_PASSWORD = 'Incorrect password',
  SUCCESS = 'Logged in successfully',
}

export enum REGISTER_RESULT {
  USERNAME_EXISTS = 'Username already exists',
  EMAIL_EXISTS = 'Email already exists',
  SUCCESS = 'Registered successfully',
}

export enum LOGOUT_RESULT {
  SUCCESS = 'Logged out successfully',
  NO_SESSION = 'No session found or already logged out',
}

export enum AUTHENTICATE_STATE {
  AUTHORIZED = 'Authorized',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
}

export enum POST_RESULT {
  GET_SUCCESS = 'Posts retrieved',
  GET_FAILURE = 'Failed to get posts',

  CREATED = 'Post created',
  UPDATED = 'Post updated',
  DELETED_SUCCESSFULLY = 'Post deleted',
  DELETED_FAILED = 'Failed to delete post',
  LIKE = 'Post liked',
  UNLIKE = 'Post unliked',
  COMMENT = 'Comment posted',
  FAILED_CREATE = 'Failed to create post',
  FAILED_UPDATE = 'Failed to update post',
  FAILED_LIKE = 'Failed to like post',
  FAILED_UNLIKE = 'Failed to unlike post',
  FAILED_COMMENT = 'Failed to post comment',
}

export enum USER_RESULT {
  GET_PROFILE = 'Profile retrieved',
  SEARCH_SUCCESSFULLY = 'Search results',
  FAILED_GET_PROFILE = 'Failed to get profile',
  MISSING_SEARCH_TERM = 'Missing search term',
  FAILED_SEARCH = 'Failed to search',
  FOLLOWED = 'Followed',
  UNFOLLOWED = 'Unfollowed',
  FAILED_FOLLOW = 'Failed to follow',
  FAILED_UNFOLLOW = 'Failed to unfollow',
  AVATAR_CHANGED = 'Avatar changed',
  FAILED_AVATAR_CHANGE = 'Failed to change avatar',
  AVATAR_REMOVED = 'Avatar removed',
  FAILED_REMOVE_AVATAR = 'Failed to remove avatar',
}

export enum SERVER_ERROR {
  INTERNAL = 'Internal server error',
}
