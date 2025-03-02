import { FocusModule } from '../src/focus';
import { NoStore } from '../src/store';
import { ConsoleLogging } from '../src/logging';
import { Topic } from '../src/types';
import { waitFor } from '../__mocks__/waitFor';

function getTopic(id: number) {
  return {
    id: `topicId-${id}`,
    revision: id,
    data: {
      detailRevision: id,
      tagRevision: id,
      topicDetail: {
        guid: `guid-${id}`,
        dataType: 'superbasictopic',
        data: JSON.stringify({ text: `message-${id}` }),
        created: 1,
        updated: 2,
        status: 'confirmed',
        transform: 'ready',
      }
    }
  }
}

function initialTopics() {
  const topics = [];
  for(let i = 0; i < 32; i++) {
    topics.push(getTopic(i));
  }
  return topics;
}

jest.mock('../src/net/fetchUtil', () => {
  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
    if (url === 'http://test_node/content/channels/test_channel_id/topics?agent=test_token&count=32') {
      return Promise.resolve({ status: 200, json: () => (initialTopics()), headers: { get: (key: string) => key === 'topic-marker' ? 3 : 4 }});
    } else {
      console.log(url, options);
      return Promise.resolve({ status: 200, json: () => [], headers: { get: (key: string) => key === 'topic-marker' ? 3 : 4 }});
    }
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: () => {},
  }
});
  
class TestStore extends NoStore {
}

test('focus module works', async () => {
  let focusTopics = null as null | Topic[];
  const setTopics = (topics: null | Topic[]) => {
    focusTopics = topics;
  }
  const log = new ConsoleLogging();
  const store = new TestStore();
  const connection = { node: 'test_node', secure: false, token: 'test_token' };
  const markRead = async () => {};
  const flagTopic = async (id: string) => {};
  const focus = new FocusModule(log, store, null, null, null, 'test_channel_id', 'my_guid', connection, null, false, 1, markRead, flagTopic);
  focus.addTopicListener(setTopics);
  await waitFor(() => focusTopics?.length == 32);
  await focus.close();
});
