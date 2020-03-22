import app from '../../src/app';
import { UserData } from '../../src/services/user-service/user-service.class';

const users = app.service('user-service');

describe('\'UserService\' service', () => {
  it('registered the service', () => {
    expect(users).toBeTruthy();
  });

  it('creates a user who starts off unconfirmed and saves their public key', async () => {
    const user: UserData = {email: 'bob@example.com', publicKey: 'abcd'}
    const createdUser = await users.create(user, {})
    
    expect(createdUser.confirmed).toEqual(false)
    expect(createdUser.confirmed).toEqual(false)
  })
});
