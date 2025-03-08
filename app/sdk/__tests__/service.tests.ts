import { DatabagSDK } from '../src/index';
import { Member } from '../src/types';


export type AccountEntity = {
  accountId: number;
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  imageSet: boolean;
  revision: number;
  seal?: string;
  version: string;
  node: string;
  storageUsed: number; 
  disabled: boolean;
};

function getAccount(id: number) {
  return {
    accountId: id,
    guid: `account.guid.${id}`,
    handle: `account.handle.${id}`,
    name: 'test.name',
    description: 'test.description',
    location: 'test.location',
    imageSet: false,
    revision: 1,
    version: 'test.version',
    node: 'test.node',
    storageUsed: 1,
    disabled: false,
  }
}

jest.mock('../src/net/fetchUtil', () => {
  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
    if (url === 'http://test.node/admin/access?token=test.token') {
      return Promise.resolve({ state: 200, json: () => ('admin.token') });
    } else if (url === 'http://test.node/admin/accounts?token=admin.token') {
      const accounts = [ getAccount(1), getAccount(2), getAccount(3) ];
      return Promise.resolve({ state: 200, json: () => (accounts) });
    }
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: () => {},
  }
});

test('allocates service correctly', async () => {
  let status: string = '';
  const sdk = new DatabagSDK({ channelTypes: []});
  const service = await sdk.configure('test.node', false, 'test.token', null);
  const members = await service.getMembers();
  expect(members.length === 3).toBe(true);
});
