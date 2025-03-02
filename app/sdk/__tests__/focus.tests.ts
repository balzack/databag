import { FocusModule } from '../src/focus';
import { NoStore } from '../src/store';
import { ConsoleLogging } from '../src/logging';
import { waitFor } from '../__mocks__/waitFor';

jest.mock('../src/net/fetchUtil', () => {
  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: () => {},
  }
});
  
class TestStore extends NoStore {
}

test('focus module works', async () => {
  const log = new ConsoleLogging();
  const store = new TestStore();
  const connection = { node: 'test_node', secure: false, token: 'test_token' };
  const markRead = async () => {};
  const flagTopic = async (id: string) => {};
  const focus = new FocusModule(log, store, null, null, null, 'test_channel_id', 'my_guid', connection, null, false, 1, markRead, flagTopic);
  await focus.close();
});
