import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import { prettyDOM } from '@testing-library/dom';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react-native';
import { StoreContext } from 'context/StoreContext';
import { ConversationContextProvider, ConversationContext } from 'context/ConversationContext';
import { CardContextProvider, CardContext } from 'context/CardContext';
import { ChannelContextProvider, ChannelContext } from 'context/ChannelContext';
import * as fetchUtil from 'api/fetchUtil';

function ConversationView() {
  const [renderCount, setRenderCount] = useState(0);
  const conversation = useContext(ConversationContext);
  const channel = useContext(ChannelContext);
  const card = useContext(CardContext);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setRenderCount(renderCount + 1);
    const rendered = [];
  }, [conversation.state]);

  return (
    <View key="conversation" testID="conversation" renderCount={renderCount}
        card={card} channel={channel} conversation={conversation}>
    </View>
  );
}

function ConversationTestApp() {
  return (
    <ChannelContextProvider>
      <CardContextProvider>
        <ConversationContextProvider>
          <ConversationView />
        </ConversationContextProvider>
      </CardContextProvider>
    </ChannelContextProvider>
  )
}

const realUseContext = React.useContext;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    if (ctx === StoreContext) {
      return useTestStoreContext();
    }
    return realUseContext(ctx);
  });
  React.useContext = mockUseContext;

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    return Promise.resolve({
      json: () => Promise.resolve([])
    });
  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  React.useContext = realUseContext;
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('test conversation', async () => {
  
  render(<ConversationTestApp />)

  await act(async () => {
    const channel = screen.getByTestId('conversation').props.channel;
    await channel.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
    await channel.actions.setRevision(1);

    const card = screen.getByTestId('conversation').props.card;
    await card.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
    await card.actions.setRevision(1);
    //const conversation = screen.getByTestId('conversation').props.conversation;
  });
});

