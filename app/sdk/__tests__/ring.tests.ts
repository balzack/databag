import { RingModule } from '../src/ring';
import { MockLink } from '../__mocks__/link';
import { waitFor } from '../__mocks__/waitFor';
import { ConsoleLogging } from '../src/logging';

jest.mock('../src/net/fetchUtil', () => {
  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
    console.log(url, options);
    return Promise.resolve({ state: 200, json: () => {} });
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: () => {},
  }
});

const mockLink = new MockLink();
jest.mock('../src/link', () => {
  return {
    Connection: jest.fn().mockImplementation(() => {
      return mockLink;
    })
  }
})

test('rings correctly', async () => {
  const endContactCall = async (cardId: string, callId: string) => {
    console.log("ending");
  }

  const log = new ConsoleLogging();
  const ring = new RingModule(log, endContactCall);
});
