import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContext, CardContextProvider } from 'context/CardContext';
import { ChannelContext, ChannelContextProvider } from 'context/ChannelContext';
import { StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { SettingsContextProvider } from 'context/SettingsContext';
import { useChannels } from 'session/channels/useChannels.hook';
import * as fetchUtil from 'api/fetchUtil';

let cardContext;
let channelContext;
function TopicsView() {
  const { state, actions } = useChannels();

  const [renderCount, setRenderCount] = useState(0);
  const [channels, setChannels] = useState([]);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  cardContext = card;
  channelContext = channel;

  useEffect(() => {
    const rendered = [];
    state.channels.forEach(chan => {
      rendered.push(
        <div key={chan.channelId} data-testid="channel">
          <span key={chan.channelId} data-testid={'channelId-' + chan.channelId}>{ chan.subject }</span>
        </div>
      );
    });
    setChannels(rendered);
    setRenderCount(renderCount + 1);
  }, [state]);

  return (
    //@ts-ignore
    <div data-testid="channels" count={renderCount}>
      { channels }
    </div>
  );
}

function TopicsTestApp() {
  return (
    <UploadContextProvider>
      <ChannelContextProvider>
        <CardContextProvider>
          <ProfileContextProvider>
            <StoreContextProvider>
              <AccountContextProvider>
                <SettingsContextProvider>
                  <TopicsView />
                </SettingsContextProvider>
              </AccountContextProvider>
            </StoreContextProvider>
          </ProfileContextProvider>
        </CardContextProvider>
      </ChannelContextProvider>
    </UploadContextProvider>
  );
}

let fetchCards;
let fetchChannels;
let fetchCardChannels;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {

  fetchCards = []
  fetchChannels = [];
  fetchCardChannels = [];

  const mockFetch = jest.fn().mockImplementation((url, options) => {

    if (url.startsWith('/contact/cards?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCards)
      });
    }
    else if (url.startsWith('/content/channels?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchChannels)
      });
    }
    else if (url.startsWith('https://test.org/content/channels?contact')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCardChannels)
      });
    }
    else {
      return Promise.resolve({
        json: () => Promise.resolve([])
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

test('view merged channels', async () => {
  render(<TopicsTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
    expect(channelContext).not.toBe(null);
  });

  fetchChannels = [
    { id: '123', revision: 3, data: {
        detailRevision: 4,
        topicRevision: 5,
        channelDetail: { dataType: 'superbasic', data: JSON.stringify({ subject: 'channelsubject' }), members: [] },
      }
    },
  ];

  fetchCards = [{
    id: '000a',
    revision: 1,
    data: {
      detailRevision: 2,
      profileRevision: 3,
      notifiedProfile: 3,
      notifiedArticle: 5,
      notifiedChannel: 6,
      notifiedView: 7,
      cardDetail: { status: 'connected', statusUpdate: 136, token: '01ab', },
      cardProfile: { guid: '01ab23', handle: 'test1', name: 'tester', imageSet: false,
        seal: 'abc', version: '1.1.1', node: 'test.org' },
    },
  }];

  fetchCardChannels = [
    { id: '2123', revision: 3, data: {
        detailRevision: 4,
        topicRevision: 5,
        channelDetail: { dataType: 'superbasic', data: JSON.stringify({ subject: 'cardchannelsubject' }), members: [] },
      }
    },
  ];

  await act(async () => {
    cardContext.actions.setToken('abc123');
    channelContext.actions.setToken('abc123');
    cardContext.actions.setRevision(1);
    channelContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channels').children).toHaveLength(2);
    expect(screen.getByTestId('channelId-2123').textContent).toBe('cardchannelsubject');
    expect(screen.getByTestId('channelId-123').textContent).toBe('channelsubject');
  });

});



