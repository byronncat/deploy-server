import { Express, Router } from 'express';

import authenticationRouter from './authentication.api';
import postRouter from './post.api';
import userRouter from './user.api';

type APIRoute = {
  path?: string;
  router: Router;
};

const apis: APIRoute[] = [
  {
    router: authenticationRouter,
  },
  {
    path: '/profile',
    router: userRouter,
  },
  {
    path: '/post',
    router: postRouter,
  },
];

export default function configureApi(app: Express) {
  apis.forEach((api: APIRoute) => {
    const apiPath = api.path || '';
    app.use(`/v1${apiPath}`, api.router);
  });
}
