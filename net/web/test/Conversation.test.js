import React, { useState, useEffect, useContext } from 'react';
import { prettyDOM } from '@testing-library/dom'
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { CardContextProvider, CardContext } from 'context/CardContext';
import { ChannelContextProvider, ChannelContext } from 'context/ChannelContext';
import { ConversationContextProvider, ConversationContext } from 'context/ConversationContext';
import * as fetchUtil from 'api/fetchUtil';

let cardContext = null;
let channelContext = null;
let conversationContext = null;
function ConversationView() {
  const [renderCount, setRenderCount] = useState(0);
  const [topics, setTopics] = useState([]);

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const conversation = useContext(ConversationContext);

  cardContext = card;
  channelContext = channel;
  conversationContext = conversation;

  useEffect(() => {
    const rendered = []
    const entries = Array.from(conversation.state.topics.values());
    entries.forEach(entry => {
      rendered.push(
        <div key={entry.id} data-testid="topic">
          <span data-testid="name">{ entry.data.cardProfile.name }</span>
          <span data-testid="status">{ entry.data.cardDetail.status }</span>
          <span data-testid="token">{ entry.data.cardDetail.token }</span>
        </div>);
    });
    setTopics(rendered);
    setRenderCount(renderCount + 1);
  }, [card.state])

  return (
    <div data-testid="topics" count={renderCount} offsync={card.state.offsync.toString()}>
      { topics }
    </div>
  );
}

function ConversationTestApp() {
  return (
    <CardContextProvider>
      <ChannelContextProvider>
        <ConversationContextProvider>
          <ConversationView />
        </ConversationContextProvider>
      </ChannelContextProvider>
    </CardContextProvider>
  )
}

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;

let statusCards;
let fetchCards;
let statusChannels;
let fetchChannels;
let statusCardChannels;
let fetchCardChannels;
beforeEach(() => {

  statusCards = 200;
  fetchCards = [];
  statusChannels = 200;
  fetchChannels = [];
  statusCardChannels = 200;
  fetchCardChannels = [];

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    const params = url.split('/');
      console.log(params, options);
    if (params[2].startsWith('channels?agent')) {
      return Promise.resolve({
        url: 'getChannels',
        status: statusChannels,
        json: () => Promise.resolve(fetchChannels),
      });
    }
    if (params[2].startsWith('channels?contact')) {
      return Promise.resolve({
        url: 'getCardChannels',
        status: statusCardChannels,
        json: () => Promise.resolve(fetchCardChannels),
      });
    }
    else if (params[2]?.split('?')[0] === 'cards') {
      return Promise.resolve({
        url: 'getCards',
        status: statusCards,
        json: () => Promise.resolve(fetchCards),
      });
    }
    else {
      return Promise.resolve({
        url: 'endpoint',
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve([]),
      });
    }

  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('conversation', async() => {

  render(<ConversationTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
    expect(channelContext).not.toBe(null);
    expect(conversationContext).not.toBe(null);
  });

  await act(async () => {
    cardContext.actions.setToken('abc123');
    channelContext.actions.setToken('abc123');
  });

  fetchChannels = [
    { id: '123', revision: 2, data: {
        detailRevision: 3,
        topicRevision: 5,
        channelSummary: { guid: '11', dataType: 'superbasictopic', data: 'testdata' },
        channelDetail: { dataType: 'superbasic', data: 'testdata' },
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
    { id: 'aabb', revision: 2, data: {
        detailRevision: 3,
        topicRevision: 5,
        channelSummary: { guid: '11', dataType: 'superbasictopic', data: 'testcardtopic' },
        channelDetail: { dataType: 'superbasic', data: 'testcardchannel' },
      }
    },
  ];

  await act(async () => {
    cardContext.actions.setRevision(1);
    channelContext.actions.setRevision(1);
  });

  await act(async () => {
    conversationContext.actions.setChannel('000a', 'aabb');
  });

  act(() => {
    cardContext.actions.clearToken();
    channelContext.actions.clearToken();
  });

});

