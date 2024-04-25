import React, { useState, useEffect, useContext } from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContext, CardContextProvider } from 'context/CardContext';
import { ChannelContextProvider } from 'context/ChannelContext';
import { StoreContext, StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { SettingsContextProvider } from 'context/SettingsContext';
import { RingContextProvider } from 'context/RingContext';
import { useSession } from 'session/useSession.hook';
import * as fetchUtil from 'api/fetchUtil';

let navPath;
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => {
    return (path) => {
      navPath = path;
    };
  },
  useLocation: () => {
    return 'path';
  },
}));

let cardContext;
let storeContext;
function SessionView() {
  const { state, actions } = useSession();
  const card = useContext(CardContext);
  const store = useContext(StoreContext);
  cardContext = card;
  storeContext = store;
  return <div data-testid="updated">{state.cardUpdated.toString()}</div>;
}

function SessionTestApp() {
  return (
    <UploadContextProvider>
      <ChannelContextProvider>
        <CardContextProvider>
          <ProfileContextProvider>
            <StoreContextProvider>
              <AccountContextProvider>
                <RingContextProvider>
                  <SettingsContextProvider>
                    <AppContextProvider>
                      <SessionView />
                    </AppContextProvider>
                  </SettingsContextProvider>
                </RingContextProvider>
              </AccountContextProvider>
            </StoreContextProvider>
          </ProfileContextProvider>
        </CardContextProvider>
      </ChannelContextProvider>
    </UploadContextProvider>
  );
}

let fetchCards;

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  fetchCards = [];

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (url === '/contact/cards?agent=123') {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCards),
      });
    } else {
      return Promise.resolve({
        json: () => Promise.resolve([]),
      });
    }
  });
  //@ts-ignore
  fetchUtil.fetchWithTimeout = mockFetch;
  //@ts-ignore
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  //@ts-ignore
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  //@ts-ignore
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('card update indicator', async () => {
  render(<SessionTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
    expect(storeContext).not.toBe(null);
  });

  fetchCards = [
    {
      id: '000a',
      revision: 1,
      data: {
        detailRevision: 2,
        profileRevision: 3,
        notifiedProfile: 3,
        notifiedArticle: 5,
        notifiedChannel: 6,
        notifiedView: 7,
        cardDetail: { status: 'connected', statusUpdated: 136, token: '01ab' },
        cardProfile: {
          guid: '01ab23',
          handle: 'test1',
          name: 'tester',
          imageSet: false,
          seal: 'abc',
          version: '1.1.1',
          node: 'test.org',
        },
      },
    },
  ];

  await act(async () => {
    cardContext.actions.setToken('123');
    storeContext.actions.setValue('cards:updated', 133);
    cardContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('updated').textContent).toBe('true');
  });

  await act(async () => {
    storeContext.actions.setValue('cards:updated', 136);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('updated').textContent).toBe('false');
  });
});
