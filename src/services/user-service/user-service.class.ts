import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';

export interface UserData {
  _id?: string;
  email: string;
  publicKey: string;
  salt?: string;
  confirmed?: boolean;
}

export class UserService extends Service<UserData> {
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: UserData, params: Params) {
    const userData = {
      email: data.email,
      publicKey: data.publicKey,
      // TODO: Do side effect of sending a confirmation email to the email in `data`
      confirmed: false
    }
    return super.create(userData, params)
  }
  // https://docs.feathersjs.com/guides/basics/services.html#service-methods
};
