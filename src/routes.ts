import { authRoutes } from '@auth/routes/auth.routes';
import { currentUserRoutes } from '@auth/routes/current.routes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Application } from 'express';

const BASE_URL = '/api/v1';
export default (app: Application) => {
  const routes = (app: Application) => {
    app.use(BASE_URL, authRoutes.routes());
    app.use(BASE_URL, authRoutes.signOutRoute());

    app.use(BASE_URL, authMiddleware.verifyUser, currentUserRoutes.routes());
  };

  routes(app);
};
