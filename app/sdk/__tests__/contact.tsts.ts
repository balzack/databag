import { ContactModule } from '../src/contact';
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

const getCard = (id: string) => {
  return {
    id: 'C000' + id,
    revision: 1,
    data: {
      detailRevision: 1,
      profileRevision: 1,
      notifiedProfile: 1,
      notifiedrticle: 1,
      notifiedChannel: 1,
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

jest.mock('../src/net/fetchUtil', () => {
  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
      if (url === 'http://test_url/contact/cards?agent=test_token') {
        return Promise.resolve({ status: 200, json: () => [getCard('A')] });
      }
      else if (url === 'http://test_url/contact/cards?agent=test_token&revision=1') {
        return Promise.resolve({ status: 200, json: () => [getCard('A'), getCard('B')] });
      }
      else {
        console.log(url, options);
        return Promise.resolve({ status: 200, json: () => [] });
      }
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: (status: number) => { if (status === 500) { throw new Error('nope') } },
  }
});

class TestCrypto implements Crypto {

  public async pbkdfSalt() {
    return { saltHex: 'SALT_HEX' }
  }

  public async pbkdfKey(saltHex: string, password: string) {
    return { aesKeyHex: 'AES_KEY_HEX' }
  }

  public async aesKey() {
    return { aesKeyHex: 'AES_KEY_HEX' };
  }

  public async aesIv() {
    return { ivHex: 'IV_HEX' };
  }

  public async aesEncrypt(data: string, ivHex: string, aesKeyHex: string) {
    return { encryptedDataB64: 'ENCRYPTED_DATA_B64' };
  }

  public async aesDecrypt(encryptedDataB64: string, ivHex: string, aesKeyHex: string) {
    return { data: 'DATA' }
  }

  public async rsaKey() {
    return { publicKeyB64: 'PUBLIC_KEY_B64', privateKeyB64: 'PRIVATE_KEY_B64' };
  }

  public async rsaEncrypt(data: string, publicKeyB64: string) {
    return { encryptedDataB64: 'ENCRYPTED_DATA_B64' }
  }

  public async rsaDecrypt(encryptedDataB64: string, privateKeyB64: string) {
    return { data: 'DATA' }
  }
}

class TestStore extends NoStore {
}

const log = new ConsoleLogging();
const store = new TestStore();
const crypto = new TestCrypto();

test('received contact updates', async () => {

  let testCards: Card[] = [];

  const update = (cards: Card[]) => {
    testCards = cards;
    console.log(cards);
  }

  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
  contact.addCardListener(update);

  contact.setRevision(1)
  await waitFor(() => testCards.length === 1);

  contact.setRevision(2)
  await waitFor(() => testCards.length === 2);
});

test('accepts unknown contact', async () => {
  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
});

test('ignores unknown contact', async () => {
  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
});

test('denies unknown contact', async () => {
  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
});

test('connects with known contact', async () => {
  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
});

test('disconnects with connected contact', async () => {
  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
});

test('removes connected contact', async () => {
  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
});

