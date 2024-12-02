import { ContactModule } from '../src/contact';
import { NoStore } from '../src/store';
import { Crypto } from '../src/crypto';
import { ConsoleLogging } from '../src/logging';
import { defaultConfigEntity } from '../src/entities';
import { Card } from '../src/types';
import { waitFor } from '../__mocks__/waitFor';

let disconnected = false;
let disconnecting = false;
let connected = false;
let connecting = false;
let deleted = false;

const getCard = (id: string) => {
  return {
    id: 'C000' + id,
    revision: 1 + (connected ? 1 : 0),
    data: {
      detailRevision: 1 + (connected ? 1 : 0),
      profileRevision: 1,
      notifiedProfile: 1,
      notifiedrticle: 1,
      notifiedChannel: 1,
      cardDetail: {
        status: connected ? 'connected' : 'confirmed',
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
      if (url === 'http://test_url/contact/cards?agent=test_token' && options.method === 'GET') {
        return Promise.resolve({ status: 200, json: () => [getCard('A')] });
      }
      else if (url === 'http://test_url/contact/cards/C000A?agent=test_token' && options.method === 'DELETE') {
        deleted = true;
        return Promise.resolve({ status: 200, json: () => {} });
      }
      else if (url === 'https://URL_A/contact/closeMessage') {
        disconnecting = true;
        return Promise.resolve({ status: 200, json: () => {} });
      }
      else if (url === 'https://URL_A/contact/openMessage') {
        connecting = true;
        return Promise.resolve({ status: 200, json: () => ({ token: 't', status: 'connected', viewRevision: 1, channelRevision: 1, profileRevision: 1, articleRevision: 1 }) });
      }
      else if (url === 'http://test_url/contact/cards?agent=test_token&revision=8' && options.method === 'GET') {
        return Promise.resolve({ status: 200, json: () => [{ id: 'C000A', revision: 2 }] });
      }
      else if (url === 'http://test_url/contact/cards/C000A/status?agent=test_token' && options.body === '"confirmed"') {
        disconnected = true;
        return Promise.resolve({ status: 200, json: () => {} });
      }
      else if (url === 'http://test_url/contact/cards/C000A/status?agent=test_token&token=t&viewRevision=1&articleRevision=1&channelRevision=1&profileRevision=1') {
        if (options.body === '"connected"') {
          connected = true;
        }
        return Promise.resolve({ status: 200, json: () => {} });
      }
      else if (url === 'http://test_url/contact/cards?agent=test_token&revision=11' && options.method === 'GET') {
        return Promise.resolve({ status: 200, json: () => [getCard('A')] });
      }
      else if (url === 'http://test_url/contact/cards?agent=test_token&revision=1' && options.method === 'GET') {
        return Promise.resolve({ status: 200, json: () => [getCard('A'), getCard('B')] });
      }
      else if (url === 'http://test_url/account/listing') {
        return Promise.resolve({ status: 200, json: () => JSON.parse('[{"guid": "dbc14d0237657b5e5a08b76355e883c762f1d8e7b1b9ff51d0b6ed9469e814e2", "handle": "test1234", "imageSet": false, "node": "balzack.coredb.org", "version": "0.1.0"}, {"guid": "5e0cec83c81786ba6b374cac38bb248349965ba2e5ba53b0d7bbe6b61a749832", "handle": "1234ttttrr", "imageSet": false, "node": "balzack.coredb.org", "version": "0.1.0"}, {"guid": "0035d6ffd34218a12b6f3c67ed2c20f4eee06dc36eed03715bbf46f04366511c", "handle": "123ttttrr", "imageSet": false, "node": "balzack.coredb.org", "version": "0.1.0"}]')});
      }
      else if (url === 'http://test_url/contact/cards/C000A/closeMessage?agent=test_token' || url === 'http://test_url/contact/cards/C000A/openMessage?agent=test_token' || url === 'http://test_url/account/listing/G0000003/message') {
        return Promise.resolve({ status: 200, json: () => JSON.parse('{"keyType": "RSA2048", "message": "eyJndWlkIjoiMDAzNWQ2ZmZkMzQyMThhMTJiNmYzYzY3ZWQyYzIwZjRlZWUwNmRjMzZlZWQwMzcxNWJiZjQ2ZjA0MzY2NTExYyIsInRpbWVzdGFtcCI6MTcyOTkwMjg4NCwibWVzc2FnZVR5cGUiOiJpZGVudGl0eSIsInZhbHVlIjoie1wicmV2aXNpb25cIjoxLFwiaGFuZGxlXCI6XCIxMjN0dHR0cnJcIixcInZlcnNpb25cIjpcIjAuMS4wXCIsXCJub2RlXCI6XCJiYWx6YWNrLmNvcmVkYi5vcmdcIixcInNlYWxcIjpcIlwifSJ9", "publicKey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBcmI1Zjd4a0NmODhlazhhQ05paVgKWlpJOCt3dlArSzZBUG85OWZCM3hBWWRGVi84djZzSTdCY3lnWXYxVC9QbzI2UmpPdEZjcVRRV1ZZZlBiTlZxVgpQQ1VSblJwWkVnQWVjSGdqUmNzSjF3cWJZQWZRSDhhRGR4aGE4enRRcS9ZVlVzRCtkRU5IamNYV0NCSW04eDVzCjZ2NXo1aS9BeFRyR2I4YlgybDAydUxaNmVIYjNuOHhUQkRMa2VPUzJBaFZWWW0zSVc3bjhrQUJnT2dQY1Y1QS8Ka1B2LzFWbnJ4OTd6Q2VNaHdYd3Y0SEpxTldGR3dvaUlTNzJXU2hCcWk5N2ZSRHlOSVJ4SVJrMDFRdlJYL3hMcQpuM3R0WWN1cWdYN0NoUGhyRHpwRVlKOUZKT0ZaQSt1TVF2K1NmZVg4YlQzcGEzV2hXNFFHZ3BMNXhuM0NuMTlkCkYwVG1laWVLSTUyR0lPejRLV1R2alJDZHc2YW5vTGJNWW0xUzM4emhpbHZ4YWlZWTZ4WXVpNXJneWU2bzJlakgKZGphV0kzeTRaZVJ1UnUxTEgzd1U2UGhzbGhDZnJrU05FVFIzRkd2RWRKNzRzdVFEVmtnakF2R3BqaC9FUlkyUApZYmE1L254WlJVRGF4bjFjcURzOU0wUk5pMHp0R2d3dVJPSE1WeHFNMEFONko2TnJlL3F0dTFGbm5SMVllMmQ5CnRHVDVLSXRaZUN2dzY0Y3U2SFhMZWFzcXg3b2kwbU5BT0RoQWUrMzlXbFN1VEE1YWNyR3YydFpUSldPY0I5TmcKNlpGb2hzY3ErbHdVZHM3ek1lVkdXU1VQWmtnZUxrTk9rT0ZlWVNuVk4wc2RaVHFQMllTU0hDU0hxS0dtaHlhMQpXRlNPMTBxaTZjQWhheldraWMyR0Zwa0NBd0VBQVE9PQotLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0tCg==", "signature": "gj5NKLzgF5HHWthu47ofuEhkhpOiP4CJ5QNG65VmuqL05Mu7dUef5Nxp6BacCIJoDb3GdYbHI/UBj0Ns4gBsMihOkwIMCav/P0FdvLYZQrpaNf6t6PUI2c4xW/w3gZ/5IrJiUmWE+PKYTjMjUlroc1gHAXIyGG2vs152HT2uMjB/kGKMU1nxvjABAN+khhw7h0iW3EBKffKRTeAsRjUw6YIXwmeYEM7MP8zrISkKquIScf4yxDM2iZWC0DJOvGa4XANqkLKLPNL11u7hBXt2Ovj++U5eQsYSXcn1IDyhwlgRyRzuNEayZJnpbCCyXybEIaty+bf0wdq5nVWi1E4ju4wY+Z1pV5lsXtuKyxA/GY4Zk3QMTwx4dz2tWPDQYa35VUeyxhm5U5iMWdFG+nJuhPT0IhajLWrrTzQA5xXCzb5Da/ae0FrS3w3opATKNKxDpl0P5gjCQ1Xbku7VoUYaQQ6JaTdxNV/eKNCmcDcCDnZoEsE0Mp1hcqf8nT6YVvIVJG5luhv5TWEmTLBgZsWfUreaUkz/DJV+0fLwfL6oZuRkEx3aZnU1BfWtsS1ecgVJ93Q73sGohnUN9EaeR4ruviMrb4x1lS1IHGFuKooGqChukuTbKxlBkeqABiMsVkvme846cpFWijv/CnK6yoDhJA9lHaugjI+KgapYZUOwJOg=", "signatureType": "PKCS1v15"}') });
      }
      else if (url === 'http://test_url/contact/cards?agent=test_token' && options.method === 'POST') {
        return Promise.resolve({ status: 200, json: () => JSON.parse(options.body).message.substring(0,9) });
      }
      else {
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
  const update = (cards: Card[]) => { testCards = cards }
  const contact = new ContactModule(log, store, crypto, null, 'test_guid', 'test_token', 'test_url', false, [], []);
  contact.addCardListener(update);
  contact.setRevision(1)
  await waitFor(() => testCards.length === 1);
  contact.setRevision(2)
  await waitFor(() => testCards.length === 2);
});

test('adds new contact', async () => {
  let testCards: Card[] = [];
  const update = (cards: Card[]) => { testCards = cards }
  const contact = new ContactModule(log, store, crypto, null, 'test_guid', 'test_token', 'test_url', false, [], []);
  contact.addCardListener(update);
  contact.setRevision(3)
  await waitFor(() => testCards.length === 1);
  const listing = await contact.getRegistry(null, null);
  expect(listing.length).toBe(3);
  const added = await contact.addCard(null, 'G0000003');
  expect(added).toBe('eyJndWlkI');
});

test('removes contact', async () => {
  let testCards: Card[] = [];
  const update = (cards: Card[]) => { testCards = cards }
  const contact = new ContactModule(log, store, crypto, null, 'test_guid', 'test_token', 'test_url', false, [], []);
  contact.addCardListener(update);
  contact.setRevision(8)
  await waitFor(() => testCards.length === 1);
  await contact.removeCard('C000A'); 
  contact.setRevision(9)
  await waitFor(() => testCards.length === 0);
  expect(deleted).toBe(true);
});

test('connects and disconnects with known contact', async () => {
  let testCards: Card[] = [];
  const update = (cards: Card[]) => { testCards = cards }
  const contact = new ContactModule(log, store, crypto, null, 'test_guid', 'test_token', 'test_url', false, [], []);
  contact.addCardListener(update);
  contact.setRevision(11)
  await waitFor(() => testCards.length === 1);
  await contact.connectCard('C000A');
  await waitFor(() => connecting);
  await waitFor(() => connected);
  contact.setRevision(12)
  await waitFor(() => (testCards[0]?.status === 'connected'));
  await contact.disconnectCard('C000A'); 
  await waitFor(() => disconnecting);
  await waitFor(() => disconnected);
});


