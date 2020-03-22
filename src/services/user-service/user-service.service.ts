// Initializes the `UserService` service on path `/user-service`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { UserService } from './user-service.class';
import createModel from '../../models/user-service.model';
import hooks from './user-service.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'user-service': UserService & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-service', new UserService(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-service');

  service.hooks(hooks);
}
