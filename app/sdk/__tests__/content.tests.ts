import { ContactModule } from '../src/contact';
import { StreamModule } from '../src/stream';
import { ContentModule } from '../src/content';
import { NoStore } from '../src/store';
import { Crypto } from '../src/crypto';
import { ConsoleLogging } from '../src/logging';
import { defaultConfigEntity } from '../src/entities';
import { Channel } from '../src/types';
import { waitFor } from '../__mocks__/waitFor';

const getCard = (id: string, revision: number) => {
  return {
    id: 'C000' + id,
    revision: revision,
    data: {
      detailRevision: revision,
      profileRevision: revision,
      notifiedProfile: revision,
      notifiedrticle: revision,
      notifiedChannel: revision,
      cardDetail: {
        status: 'connected',
        statusUpdated: 1,
        token: 'T000' + id,
        notes: '',
        groups: [],
      },
      cardProfile: {
        guid: 'G000' + id,
        handle: 'H000' + id,
        name: 'N000' + id,
        description: 'D000' + id,
        location: 'L000' + id,
        imageSet: true,
        version: 'V000' + id,
        node: 'URL_' + id,
        seal: '',
        revision: 1,
      }
    }
  }
}

const getChannel = (subject: string, message: string, revision: number) => {
  return {
    id: 'CHAN1',
    revision: revision,
    data: revision === 3 ? undefined : {
      detailRevision: revision,
      topicRevision: revision,
      channelSummary: revision !== 1 ? undefined : { 
        lastTopic: {
          guid: 'guid1',
          dataType: 'test',
          data: JSON.stringify({ text: message }),
          created: 2,
          updated: 2,
          status: 'ready',
          transform: 'ready',
        },
      },
      channelDetail: revision !== 1 ? undefined : {
        dataType: 'test',
        data: JSON.stringify({ subject: subject }),
        created: 1,
        updated: 1,
        enableImage: false,
        enbaleAudio: false,
        enableVideo: false,
        enableBinary: false,
        contacts: {
          groups: [],
          cards: [],
        },
        members: [{
          member: 'person',
          pushEnabled: false,
        }],
      }
    }
  }
}

const getChannelDetail = (subject: string) => {
  return {
    dataType: 'test',
    data: JSON.stringify({ subject: subject }),
    created: 1,
    updated: 1,
    enableImage: false,
    enbaleAudio: false,
    enableVideo: false,
    enableBinary: false,
    contacts: {
      groups: [],
      cards: [],
    },
    members: [{
      member: 'person',
      pushEnabled: false,
    }],
  }
}

const getChannelSummary = (message: string) => {
  return {
    lastTopic: {
      guid: 'guid1',
      dataType: 'test',
      data: JSON.stringify({ text: message }),
      created: 2,
      updated: 2,
      status: 'ready',
      transform: 'ready',
    },
  }
}

jest.mock('../src/net/fetchUtil', () => {

  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
    if (url == 'http://test_url/contact/cards?agent=test_token') { 
      return Promise.resolve({ status: 200, json: () => [getCard('A', 1)] });
    } else if (url == 'http://test_url/contact/cards?agent=test_token&revision=1') {
      return Promise.resolve({ status: 200, json: () => [getCard('A', 2)] });
    } else if (url == 'http://test_url/contact/cards?agent=test_token&revision=2') {
      return Promise.resolve({ status: 200, json: () => [getCard('A', 3)] });
    } else if (url == 'https://URL_A/content/channels?contact=G000A.T000A&viewRevision=1&types=%5B%5D' ||
        url == 'http://test_url/content/channels?agent=test_token&types=%5B%5D') {
      return Promise.resolve({ status: 200, json: () => [getChannel('test_subject_0', 'test_message_0', 1)] });
    } else if (url == 'https://URL_A/content/channels?contact=G000A.T000A&viewRevision=1&channelRevision=1&types=%5B%5D' ||
        url == 'http://test_url/content/channels?agent=test_token&channelRevision=1&types=%5B%5D') {
      return Promise.resolve({ status: 200, json: () => [getChannel('test_subject_1', 'test_message_1', 2)] });
    } else if (url == 'https://URL_A/content/channels?contact=G000A.T000A&viewRevision=1&channelRevision=2&types=%5B%5D' ||
        url == 'http://test_url/content/channels?agent=test_token&channelRevision=2&types=%5B%5D') {
      return Promise.resolve({ status: 200, json: () => [getChannel('test_subject_2', 'test_message_2', 3)] });
    } else if (url == 'https://URL_A/content/channels/CHAN1/detail?contact=G000A.T000A' ||
        url == 'http://test_url/content/channels/CHAN1/detail?agent=test_token') {
      return Promise.resolve({ status: 200, json: () => getChannelDetail('test_subject_1') });
    } else if (url == 'https://URL_A/content/channels/CHAN1/summary?contact=G000A.T000A' ||
        url == 'http://test_url/content/channels/CHAN1/summary?agent=test_token') {
      return Promise.resolve({ status: 200, json: () => getChannelSummary('test_message_1') });
    } else {
      console.log(url, options.method);
    }
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: (status: number) => { if (status === 500) { throw new Error('nope') } },
  }
});

class TestStore extends NoStore {
}

const log = new ConsoleLogging();
const store = new TestStore();

test('received contact updates', async () => {
  const cardChannels = new Map<string | null, Channel[]>();
  const stream = new StreamModule(log, store, null, null, 'test_guid', 'test_token', 'test_url', false, []);
  const contact = new ContactModule(log, store, null, null, 'test_guid', 'test_token', 'test_url', false, [], []);
  const content = new ContentModule(log, null, contact, stream);

  const channelUpdate = ({ channels, cardId }: { channels: Channel[]; cardId: string | null }) => {
    cardChannels.set(cardId, channels);
  };
  content.addChannelListener(channelUpdate);

  await contact.setRevision(1);
  await waitFor(() => cardChannels.get('C000A')?.length === 1);

  await waitFor(() => cardChannels.get('C000A')?.[0].data.subject === 'test_subject_0');
  await waitFor(() => cardChannels.get('C000A')?.[0].lastTopic.data.text === 'test_message_0');

  await contact.setRevision(2);
  await waitFor(() => cardChannels.get('C000A')?.[0].data.subject === 'test_subject_1');
  await waitFor(() => cardChannels.get('C000A')?.[0].lastTopic.data.text === 'test_message_1');

  await contact.setRevision(3);
  await waitFor(() => cardChannels.get('C000A')?.length === 0);

  await stream.close();
  await contact.close();
});

test('received stream updates', async () => {
  const streamChannels = new Map<string | null, Channel[]>();
  const stream = new StreamModule(log, store, null, null, 'test_guid', 'test_token', 'test_url', false, []);
  const contact = new ContactModule(log, store, null, null, 'test_guid', 'test_token', 'test_url', false, [], []);
  const content = new ContentModule(log, null, contact, stream);

  const channelUpdate = ({ channels, cardId }: { channels: Channel[]; cardId: string | null }) => {
    streamChannels.set(cardId, channels);
  };
  content.addChannelListener(channelUpdate);

  await stream.setRevision(1);
  await waitFor(() => streamChannels.get(null)?.length === 1);
  await waitFor(() => streamChannels.get(null)?.[0].data.subject === 'test_subject_0');
  await waitFor(() => streamChannels.get(null)?.[0].lastTopic.data.text === 'test_message_0');

  await stream.setRevision(2);
  await waitFor(() => streamChannels.get(null)?.[0].data.subject === 'test_subject_1');
  await waitFor(() => streamChannels.get(null)?.[0].lastTopic.data.text === 'test_message_1');

  await stream.setRevision(3);
  await waitFor(() => streamChannels.get(null)?.length === 0);

  await stream.close();
  await contact.close();
});

