import React, { useState, useEffect, useContext } from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContext, ProfileContextProvider } from 'context/ProfileContext';
import { StoreContextProvider } from 'context/StoreContext';
import { SettingsContextProvider } from 'context/SettingsContext';
import { ConversationContext, ConversationContextProvider } from 'context/ConversationContext';
import { CardContext, CardContextProvider } from 'context/CardContext';
import { UploadContextProvider } from 'context/UploadContext';
import { useDetails } from 'session/details/useDetails.hook';

import * as fetchUtil from 'api/fetchUtil';

let details = null;
let card = null;
let conversation = null;
function InfoView() {
  const { state, actions } = useDetails();
  const [renderCount, setRenderCount] = useState(0);

  details = actions;
  card = useContext(CardContext);
  conversation = useContext(ConversationContext);

  return (
    //@ts-ignore
    <div
      data-testid="info"
      data-count={renderCount}
    >
      {state.title}
    </div>
  );
}

function InfoTestApp() {
  return (
    <StoreContextProvider>
      <UploadContextProvider>
        <CardContextProvider>
          <ProfileContextProvider>
            <AccountContextProvider>
              <SettingsContextProvider>
                <ConversationContextProvider>
                  <AppContextProvider>
                    <InfoView />
                  </AppContextProvider>
                </ConversationContextProvider>
              </SettingsContextProvider>
            </AccountContextProvider>
          </ProfileContextProvider>
        </CardContextProvider>
      </UploadContextProvider>
    </StoreContextProvider>
  );
}

let fetchCards;
let fetchChannels;
let fetchTopics;
let fetchDetail;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  fetchCards = [];
  fetchChannels = [];
  fetchTopics = [];
  fetchDetail = {};

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (url.startsWith('/contact/cards?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCards),
      });
    }
    if (url.startsWith('https://test.org/content/channels?contact')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchChannels),
      });
    }
    if (url.startsWith('https://test.org/content/channels/channel01/topics?contact')) {
      const headers = new Map();
      headers.set('topic-marker', 48);
      headers.set('topic-revision', 55);
      return Promise.resolve({
        url: 'getTopics',
        status: 200,
        headers: headers,
        json: () => Promise.resolve(fetchTopics),
      });
    }
    if (url.startsWith('https://test.org/content/channels/channel01/detail')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchDetail),
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

test('conversation selection', async () => {
  render(<InfoTestApp />);

  await waitFor(async () => {
    expect(card).not.toBe(null);
    expect(details).not.toBe(null);
    expect(conversation).not.toBe(null);
  });

  await act(async () => {
    conversation.actions.setChannel('card01', 'channel01');
  });

  fetchCards = [
    {
      id: 'card01',
      revision: 1,
      data: {
        detailRevision: 2,
        profileRevision: 3,
        notifiedProfile: 3,
        notifiedArticle: 5,
        notifiedChannel: 6,
        notifiedView: 7,
        cardDetail: { status: 'connected', statusUpdate: 136, token: '01ab' },
        cardProfile: {
          guid: 'guid01',
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

  fetchChannels = [
    {
      id: 'channel01',
      revision: 2,
      data: {
        detailRevision: 3,
        topicRevision: 5,
        channelSummary: { guid: 'guid01', dataType: 'superbasictopic', data: JSON.stringify({ text: 'testing' }) },
        channelDetail: { dataType: 'superbasic', data: '{}' },
      },
    },
  ];

  fetchTopics = [
    {
      id: 'topic01',
      revision: 1,
      data: {
        detailRevision: 1,
        tagRevision: 1,
        topicDetail: {
          guid: 'guid01',
          dataType: 'superbasictopic',
          data: JSON.stringify({ text: 'message' }),
          created: 1,
          updated: 1,
          status: 'confirmed',
          transform: 'complete',
        },
      },
    },
  ];

  await act(async () => {
    card.actions.setToken('abc123');
    card.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('info').textContent).toBe('');
  });

  fetchCards = [
    {
      id: 'card01',
      revision: 2,
      data: {
        detailRevision: 2,
        profileRevision: 3,
        notifiedProfile: 3,
        notifiedArticle: 5,
        notifiedChannel: 7,
        notifiedView: 7,
        cardDetail: { status: 'connected', statusUpdate: 136, token: '01ab' },
        cardProfile: {
          guid: 'guid01',
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

  fetchChannels = [
    {
      id: 'channel01',
      revision: 3,
      data: {
        detailRevision: 4,
        topicRevision: 5,
      },
    },
  ];

  (fetchDetail = { dataType: 'superbasic', data: JSON.stringify({ subject: 'testing' }) }),
    await act(async () => {
      card.actions.setRevision(2);
    });

  await waitFor(async () => {
    expect(screen.getByTestId('info').textContent).toBe('testing');
  });
});
