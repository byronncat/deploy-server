import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import { TIME } from './constants';

import type { Express } from 'express';
import type { UserToken } from './types';

declare module 'express-session' {
  export interface SessionData {
    user: { id: UserToken['id'] };
  }
}

import Redis from './data/database/Redis.database';
import RedisStore from 'connect-redis';
const redisStore = new RedisStore({
  client: Redis,
  prefix: 'bygram:',
});

export default function configureServer(server: Express) {
  server.use(cors());
  server.use(logger('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(cookieParser());

  // Parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }));
  // Parse application/json
  server.use(bodyParser.json());

  // Session
  server.use(
    session({
      name: 'session_id',
      store: redisStore,
      secret: process.env.TOKEN_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: TIME.COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
      },
    } as session.SessionOptions),
  );
}
