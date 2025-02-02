import { passwordHelper } from '@helpers';
import { logger } from '@utilities';
import { UserModel, PostModel } from '../models';
import {
  DEFAULT_OPTIONS,
  QueryCondition,
  mapObjectToQuery,
} from './access.helper';
import type { User } from '@types';

export async function getUser(
  data: Partial<User>,
  options = DEFAULT_OPTIONS,
): Promise<User | null> {
  try {
    if (options?.findById) return await UserModel.findById(data.id);
    const query =
      options?.condition === QueryCondition.And
        ? {
            $and: mapObjectToQuery(data),
          }
        : {
            $or: mapObjectToQuery(data),
          };
    return await UserModel.findOne(query);
  } catch (error) {
    logger.error(error, 'User access - getUser');
    throw error;
  }
}

export async function getPostsCount(
  userId: User['id'],
): Promise<number | null> {
  try {
    return await PostModel.countDocuments({ uid: userId });
  } catch (error) {
    logger.error(error, 'User access - getPostsCount');
    throw error;
  }
}

export async function getUsers(
  data: Partial<User> | Partial<User>[],
  options = DEFAULT_OPTIONS,
): Promise<User[] | null> {
  try {
    let query;
    if (Array.isArray(data)) {
      query = {
        $or: data.map((item) => ({
          $and: mapObjectToQuery(item),
        })),
      };
    } else {
      query =
        options?.condition === QueryCondition.And
          ? {
              $and: mapObjectToQuery(data),
            }
          : {
              $or: mapObjectToQuery(data),
            };
    }
    return await UserModel.find(query);
  } catch (error) {
    logger.error(error, 'User access (Get many)');
    throw error;
  }
}

export async function searchUser(regexp: string): Promise<User[] | null> {
  try {
    return await UserModel.find({
      $or: [
        { email: { $regex: new RegExp(regexp, 'i') } },
        { username: { $regex: new RegExp(regexp, 'i') } },
      ],
    });
  } catch (error) {
    logger.error(error, 'User access (Search)');
    throw error;
  }
}

export async function createUser({
  email,
  username,
  password,
}: Pick<User, 'email' | 'username' | 'password'>): Promise<User> {
  try {
    return (await UserModel.create({
      email,
      username,
      password: await passwordHelper.hash(password),
    })) as User;
  } catch (error) {
    logger.error(error, 'User access (Create one)');
    throw error;
  }
}

export async function addFollowing(
  uid: User['id'],
  following: User['id'],
): Promise<User | null> {
  try {
    return await UserModel.findByIdAndUpdate(
      uid,
      { $addToSet: { followings: following } },
      { new: true },
    );
  } catch (error) {
    logger.error(error + error, 'User access (Add following)');
    throw error;
  }
}

export async function addFollower(
  uid: User['id'],
  follower: User['id'],
): Promise<User | null> {
  try {
    return await UserModel.findByIdAndUpdate(
      uid,
      { $addToSet: { followers: follower } },
      { new: true },
    );
  } catch (error) {
    logger.error(error + error, 'User access (Add follower)');
    throw error;
  }
}

export async function removeFollowing(
  uid: User['id'],
  following: User['id'],
): Promise<User | null> {
  try {
    return await UserModel.findByIdAndUpdate(
      uid,
      { $pull: { followings: following } },
      { new: true },
    );
  } catch (error) {
    logger.error(
      JSON.stringify(error) + error,
      'User access (Remove following)',
    );
    throw error;
  }
}

export async function removeFollower(
  uid: User['id'],
  follower: User['id'],
): Promise<User | null> {
  try {
    return await UserModel.findByIdAndUpdate(
      uid,
      { $pull: { followers: follower } },
      { new: true },
    );
  } catch (error) {
    logger.error(
      JSON.stringify(error) + error,
      'User access (Remove follower)',
    );
    throw error;
  }
}

export async function updateAvatar(
  uid: User['id'],
  avatar: User['avatar'],
): Promise<User | null> {
  try {
    return await UserModel.findByIdAndUpdate(uid, { avatar }, { new: true });
  } catch (error) {
    logger.error(error + error, 'User access (Update avatar)');
    throw error;
  }
}

export async function removeAvatar(uid: User['id']): Promise<User | null> {
  try {
    return await UserModel.findByIdAndUpdate(
      uid,
      { $unset: { avatar: 1 } },
      { new: true },
    );
  } catch (error) {
    logger.error(error + error, 'User access (Remove avatar)');
    throw error;
  }
}
