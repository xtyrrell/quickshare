import { Application } from '../declarations';
import userService from './user-service/user-service.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(userService);
}
