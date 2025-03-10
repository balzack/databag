import { Call } from '../src/types';
import { RingModule } from '../src/ring';
import { MockLinkModule } from '../__mocks__/link';
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

const mockLink = new MockLinkModule();
jest.mock('../src/link', () => {
  return {
    Connection: jest.fn().mockImplementation(() => {
      return mockLink;
    })
  }
})

test('rings correctly', async () => {
  let calling = [] as { cardId: string, callId: string }[];
  const endContactCall = async (cardId: string, callId: string) => {
    console.log("ending");
  };
  const ringing = (calls: { cardId: string, callId: string }[]) => {
    calling = calls;
  };

  const log = new ConsoleLogging();
  const ringModule = new RingModule(log, endContactCall);

  ringModule.addRingingListener(ringing);
  ringModule.ring({ cardId: 'card1', callId: 'call1', calleeToken: 'token1', ice: [] });
  await waitFor(() => calling.length === 1);
  await waitFor(() => calling.length === 0, 10);
  ringModule.close();
}, 15000);
