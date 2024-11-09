import { ContactModule } from '../src/contact';
import { StreamModule } from '../src/stream';
import { ContentModule } from '../src/content';
import { NoStore } from '../src/store';
import { Crypto } from '../src/crypto';
import { ConsoleLogging } from '../src/logging';
import { defaultConfigEntity } from '../src/entities';
import { Card } from '../src/types';
import { waitFor } from '../__mocks__/waitFor';

export type CardDetailEntity = {
  status: string;
  statusUpdated: number;
  token: string;
  notes: string;
  groups: [string];
};
  
export type CardProfileEntity = {
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  imageSet: boolean;
  version: string;
  node: string;
  seal: string;
  revision: number;
};
  
export type CardEntity = {
  id: string;
  revision: number;
  data?: {
    detailRevision: number;
    profileRevision: number;
    notifiedProfile: number;
    notifiedArticle: number;
    notifiedChannel: number;
    cardDetail?: CardDetailEntity;
    cardProfile?: CardProfileEntity;
  };
};


jest.mock('../src/net/fetchUtil', () => {

  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
      console.log(url, options.method);
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

test('received content updates', async () => {
  const stream = new StreamModule(log, store, null, 'test_guid', 'test_token', 'test_url', false, []);
  const contact = new ContactModule(log, store, null, 'test_guid', 'test_token', 'test_url', false, [], []);
  const content = new ContentModule(log, null, contact, stream);
});

