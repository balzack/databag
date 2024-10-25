import { ContactModule } from '../src/contact';
import { NoStore } from '../src/store';
import { Crypto } from '../src/crypto';
import { ConsoleLogging } from '../src/logging';
import { defaultConfigEntity } from '../src/entities';
import { Config } from '../src/types';
import { waitFor } from '../__mocks__/waitFor';

jest.mock('../src/net/fetchUtil', () => {
  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: () => {},
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

test('contact module works', async () => {
  const log = new ConsoleLogging();
  const store = new TestStore();
  const crypto = new TestCrypto();

  const contact = new ContactModule(log, store, crypto, 'test_guid', 'test_token', 'test_url', false, [], []);
});
