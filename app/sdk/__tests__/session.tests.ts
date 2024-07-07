import { DatabagSDK } from '../src/index';
import { type SessionParams } from '../src/types';

import { Connection } from '../src/connection';

let mockClose = jest.fn();
jest.mock('../src/connection', () => {
  return {
    Connection: jest.fn().mockImplementation(() => {
      return { close: mockClose };
    })
  }
})

test('allocates session correctly', async () => {
  const sdk = new DatabagSDK(null);
  const params: SessionParams = { topicBatch: 0, tagBatch: 0, channelTypes: [], pushType: '', deviceToken: '', notifications: [], deviceId: '', version: '', appName: '' };
  const session = await sdk.login('handle', 'password', 'url', null, params);
  const account = session.getAccount();
  account.enableNotifications();
  //expect(r).toBe(5);
});
