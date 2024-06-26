import { DatabagSDK } from '../src/index';

test('allocates session correctly', async () => {
  const sdk = new DatabagSDK();
  const session = await sdk.login('handle', 'password', 'url');
  const account = session.getAccount();
  account.setNotifications(true);
  //expect(r).toBe(5);
});
