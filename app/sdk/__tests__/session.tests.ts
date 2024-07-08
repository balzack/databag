import { DatabagSDK } from '../src/index';
import { type SessionParams } from '../src/types';

import { MockConnection } from '../__mocks__/connection';
import { MockAccountModule } from '../__mocks__/account';
import { MockIdentityModule } from '../__mocks__/identity';
import { MockAliasModule } from '../__mocks__/alias';
import { MockContentModule } from '../__mocks__/content';
import { MockContactModule } from '../__mocks__/contact';
import { MockAttributeModule } from '../__mocks__/attribute';
import { waitFor } from '../__mocks__/waitFor';

const mockConnection = new MockConnection();
jest.mock('../src/connection', () => {
  return {
    Connection: jest.fn().mockImplementation(() => {
      return mockConnection;
    })
  }
})

const mockAccount = new MockAccountModule();
jest.mock('../src/account', () => {
  return {
    AccountModule: jest.fn().mockImplementation(() => {
      return mockAccount;
    })
  }
})

const mockIdentity = new MockIdentityModule();
jest.mock('../src/identity', () => {
  return {
    IdentityModule: jest.fn().mockImplementation(() => {
      return mockIdentity;
    })
  }
})

const mockContent = new MockContentModule();
jest.mock('../src/content', () => {
  return {
    ContentModule: jest.fn().mockImplementation(() => {
      return mockContent;
    })
  }
})

const mockContact = new MockContactModule();
jest.mock('../src/contact', () => {
  return {
    ContactModule: jest.fn().mockImplementation(() => {
      return mockContact;
    })
  }
})

const mockAttribute = new MockAttributeModule();
jest.mock('../src/attribute', () => {
  return {
    AttributeModule: jest.fn().mockImplementation(() => {
      return mockAttribute;
    })
  }
})

const mockAlias = new MockAliasModule();
jest.mock('../src/alias', () => {
  return {
    AliasModule: jest.fn().mockImplementation(() => {
      return mockAlias;
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
  mockConnection.emitStatus('connected');
  mockConnection.emitRevision({ account: 3, profile: 3, article: 3, group: 3, channel: 3, card: 3});
  await waitFor(() => (status === 'connected'));
  await waitFor(() => (mockAccount.revision == 3));
  await waitFor(() => (mockIdentity.revision == 3));
  await waitFor(() => (mockContent.revision == 3));
  await waitFor(() => (mockContact.revision == 3));
  await waitFor(() => (mockAttribute.revision == 3));
  await waitFor(() => (mockAlias.revision == 3));
});
