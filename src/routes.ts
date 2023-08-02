import { authRoutes } from '@auth/routes/auth.routes';
import { Application } from 'express';

const BASE_URL = '/api/v1';
export default (app: Application) => {
  const routes = (app: Application) => {
    app.use(BASE_URL, authRoutes.routes());
  };

  routes(app);
};
