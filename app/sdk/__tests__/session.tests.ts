import { DatabagSDK } from '../src/index';
import { type SessionParams } from '../src/types';

import { MockConnection } from '../__mocks__/connection';

const mock = new MockConnection();
jest.mock('../src/connection', () => {
  return {
    Connection: jest.fn().mockImplementation(() => {
      return mock;
    })
  }
})

test('allocates session correctly', async () => {

  let status: string = '';
  const sdk = new DatabagSDK(null);
  const params: SessionParams = { topicBatch: 0, tagBatch: 0, channelTypes: [], pushType: '', deviceToken: '', notifications: [], deviceId: '', version: '', appName: '' };
  const session = await sdk.login('handle', 'password', 'url', null, params);
  session.addStatusListener((ev: string) => { status = ev; });
  const account = session.getAccount();
  account.enableNotifications();
  mock.emitStatus('connected');
  expect(status).toBe('connected');
});
