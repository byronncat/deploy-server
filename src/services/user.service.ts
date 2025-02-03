import { passwordHelper } from '../helpers';
import { isEmptyObject } from '../utilities';
import { LOGIN_RESULT, REGISTER_RESULT } from '../constants';
import { UserDB, QueryCondition } from '../data';
import type {
  User,
  SearchProfileData,
  UserToken,
} from '../types';
import fileService from './file.service';

async function login(
  identity: User['email'],
  password: User['password'],
): Promise<{
  user?: UserToken;
  message: LOGIN_RESULT;
}> {
  const user = await UserDB.getUser(
    { email: identity, username: identity },
    {
      condition: QueryCondition.Or,
    },
  );
  if (!user) return { message: LOGIN_RESULT.NOT_EXIST };
  if (!(await passwordHelper.compare(password, user.password)))
    return { message: LOGIN_RESULT.INCORRECT_PASSWORD };
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    message: LOGIN_RESULT.SUCCESS,
  };
}

async function register({
  email,
  username,
  password,
}: Pick<User, 'email' | 'username' | 'password'>): Promise<{
  user?: UserToken;
  message: REGISTER_RESULT;
}> {
  const users = await UserDB.getUsers(
    {
      email,
      username,
    },
    { condition: QueryCondition.Or },
  );

  if (users) {
    const isEmailExists = users.some((user) => user.email === email);
    const isUsernameExists = users.some((user) => user.username === username);
    if (isEmailExists) return { message: REGISTER_RESULT.EMAIL_EXISTS };
    if (isUsernameExists) return { message: REGISTER_RESULT.USERNAME_EXISTS };
  }

  const result = await UserDB.createUser({
    email,
    username,
    password,
  });
  return {
    user: {
      id: result.id,
      email: result.email,
      username: result.username,
    },
    message: REGISTER_RESULT.SUCCESS,
  };
}

async function searchProfile(
  searchTerm: string,
): Promise<SearchProfileData[] | null> {
  const users = await UserDB.searchUser(searchTerm);
  if (!users || users.length === 0) return null;

  const searchResult = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    };
  });
  return searchResult;
}

async function getUserProfile(
  data: Partial<User>,
): Promise<any | null> {
  const profile: any = await UserDB.getUser(data);
  if (!profile) return null;
  const totalPosts = await UserDB.getPostsCount(profile.id) || 0;
  return {
    ...(profile._doc),
    totalPosts,
  };
}

async function changeAvatar(uid: User['id'], file: User['avatar']) {
  if (!file) return Promise.reject('No file found');
  const user = await UserDB.getUser({ id: uid }, { findById: true });
  if (!user) return Promise.reject('User not found');
  if (!isEmptyObject(user.avatar))
    await fileService.deleteImage(user.avatar!.url);
  await UserDB.updateAvatar(uid, file);
}

async function removeAvatar(uid: User['id']) {
  const user = await UserDB.getUser({ id: uid }, { findById: true });
  if (!user) return Promise.reject('User not found');
  if (isEmptyObject(user.avatar)) return Promise.reject('No avatar found');
  const success = await fileService.deleteImage(user.avatar!.url);
  if (success) {
    await UserDB.removeAvatar(uid);
    return;
  }
  return Promise.reject('Image deletion failed');
}

async function followProfile(uid: User['id'], profileUserId: User['id']) {
  await UserDB.addFollowing(uid, profileUserId);
  await UserDB.addFollower(profileUserId, uid);
}

async function unfollowProfile(uid: User['id'], profileUserId: User['id']) {
  await UserDB.removeFollowing(uid, profileUserId);
  await UserDB.removeFollower(profileUserId, uid);
}

export default {
  login,
  register,
  searchProfile,
  getUserProfile,
  followProfile,
  unfollowProfile,
  changeAvatar,
  removeAvatar,
};
