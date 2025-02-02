import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import type { Document, ObjectId } from 'mongoose';
import type { User, Post } from '@types';

mongoose.Schema.Types.String.checkRequired((v) => typeof v === 'string'); // for checking empty strings
mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

interface UserDocument extends Omit<User, 'id'>, Document {
  _id: User['id'];
  _doc?: Post;
}

export const UserModel = mongoose.model(
  'user',
  new mongoose.Schema<UserDocument>({
    _id: { type: String, required: true, default: uuidv4 },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    followers: {
      type: [String],
      ref: 'User',
      default: [],
      required: true,
    },
    followings: {
      type: [String],
      ref: 'User',
      default: [],
      required: true,
    },
    avatar: {
      url: { type: String },
      orientation: { type: String },
    },
    description: { type: String },
  }),
);

interface PostDocument extends Omit<Post, 'id'>, Document {
  id: ObjectId;
  _doc?: Post;
}

export const PostModel = mongoose.model(
  'post',
  new mongoose.Schema<PostDocument>({
    uid: { type: String, required: true },
    content: { type: String, required: true, default: '' },
    files: [
      {
        url: { type: String, required: true },
        type: { type: String, required: true },
        orientation: { type: String, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    likes: {
      type: [String],
      required: true,
      default: [],
    },
    comments: {
      type: [
        {
          uid: { type: String, required: true },
          content: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      required: true,
      default: [],
    },
  }),
);

export type { PostDocument };
