import CurrentUser from '@auth/controllers/current-user';
import { Router } from 'express';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/currentuser', CurrentUser.prototype.read);
    return this.router;
  }
}

export const currentUserRoutes = new CurrentUserRoutes();
