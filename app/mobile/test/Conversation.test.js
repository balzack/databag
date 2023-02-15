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
    conversation.state.topics.forEach((value) => {
      rendered.push(<Text key={value.topicId} testID={value.topicId}>{ value.detail.data }</Text>);
    });
    setTopics(rendered);
  }, [conversation.state]);

  return (
    <View key="conversation" testID="conversation" renderCount={renderCount}
        card={card} channel={channel} conversation={conversation}>
      { topics }
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

let fetchCards;
let fetchChannels;
let fetchCardChannels;
let fetchTopics;

const realUseContext = React.useContext;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {

  fetchCards = [];
  fetchChannels = [];
  fetchCardChannels = [];

  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    if (ctx === StoreContext) {
      return useTestStoreContext();
    }
    return realUseContext(ctx);
  });
  React.useContext = mockUseContext;

  const mockFetch = jest.fn().mockImplementation((url, options) => {

    if (url.startsWith('https://test.org/content/channels?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchChannels)
      });
    }
    else if (url.startsWith('https://test.org/contact/cards?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCards)
      });
    }
    else if (url.startsWith('https://test.org/content/channels?contact')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCardChannels)
      });
    }
    else if (url.startsWith('https://test.org/content/channels/aabb/topics?contact') ||
        url.startsWith('https://test.org/content/channels/123/topics?agent')) {
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
    else {
      return Promise.resolve({
        json: () => Promise.resolve([])
      });
    }
  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  React.useContext = realUseContext;
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('add, update, remove card channel topic', async () => {
  
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

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(0);
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

  fetchTopics = [
    { id: '888', revision: 5, data: {
      detailRevision: 3,
      tagRevision: 0,
      topicDetail: {
        guid: '0123',
        dataType: 'topictype',
        data: 'contacttopicdata',
        created: 1,
        updated: 1,
        status: 'confirmed',
        transform: 'complete',
      },
    }
   }
  ];

  await act(async () => {
    const conversation = screen.getByTestId('conversation').props.conversation;
    conversation.actions.setConversation('000a', 'aabb');

    const channel = screen.getByTestId('conversation').props.channel;
    await channel.actions.setRevision(2);
    const card = screen.getByTestId('conversation').props.card;
    await card.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(1);
    expect(screen.getByTestId('888').props.children).toBe('contacttopicdata');
  });

  fetchCards = [{
    id: '000a',
    revision: 2,
    data: {
      detailRevision: 2,
      profileRevision: 3,
      notifiedProfile: 3,
      notifiedArticle: 5,
      notifiedChannel: 7,
      notifiedView: 7,
    },
  }];

  fetchCardChannels = [
    { id: 'aabb', revision: 3, data: {
        detailRevision: 3,
        topicRevision: 6,
      }
    },
  ];

  fetchTopics = [
    { id: '888', revision: 6, data: {
      detailRevision: 4,
      tagRevision: 0,
      topicDetail: {
        guid: '0123',
        dataType: 'topictype',
        data: 'contacttopicdata2',
        created: 1,
        updated: 1,
        status: 'confirmed',
        transform: 'complete',
      },
    }
   }
  ];

  await act(async () => {
    const card = screen.getByTestId('conversation').props.card;
    await card.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(1);
    expect(screen.getByTestId('888').props.children).toBe('contacttopicdata2');
  });

  fetchCards = [{
    id: '000a',
    revision: 3,
    data: {
      detailRevision: 2,
      profileRevision: 3,
      notifiedProfile: 3,
      notifiedArticle: 5,
      notifiedChannel: 8,
      notifiedView: 7,
    },
  }];

  fetchCardChannels = [
    { id: 'aabb', revision: 4, data: {
        detailRevision: 3,
        topicRevision: 6,
      }
    },
  ];

  fetchTopics = [
    { id: '888', revision: 6 }
  ];

  await act(async () => {
    const card = screen.getByTestId('conversation').props.card;
    await card.actions.setRevision(4);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(1);
  });


  fetchCards = [{
    id: '000a',
    revision: 4,
    data: {
      detailRevision: 2,
      profileRevision: 3,
      notifiedProfile: 3,
      notifiedArticle: 5,
      notifiedChannel: 9,
      notifiedView: 7,
    },
  }];

  fetchCardChannels = [
    { id: 'aabb', revision: 5, data: {
        detailRevision: 3,
        topicRevision: 7,
      }
    },
  ];

  await act(async () => {
    const card = screen.getByTestId('conversation').props.card;
    await card.actions.setRevision(5);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(0);
  });



});






test('add, update, remove channel topic', async () => {
  
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

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(0);
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

  fetchTopics = [
    { id: '888', revision: 5, data: {
      detailRevision: 3,
      tagRevision: 0,
      topicDetail: {
        guid: '0123',
        dataType: 'topictype',
        data: 'contacttopicdata',
        created: 1,
        updated: 1,
        status: 'confirmed',
        transform: 'complete',
      },
    }
   }
  ];

  await act(async () => {
    const conversation = screen.getByTestId('conversation').props.conversation;
    conversation.actions.setConversation(null, '123');

    const channel = screen.getByTestId('conversation').props.channel;
    await channel.actions.setRevision(2);
    const card = screen.getByTestId('conversation').props.card;
    await card.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(1);
    expect(screen.getByTestId('888').props.children).toBe('contacttopicdata');
  });

  fetchChannels = [
    { id: '123', revision: 3, data: {
        detailRevision: 3,
        topicRevision: 6,
      }
    },
  ];

  fetchTopics = [
    { id: '888', revision: 7, data: {
      detailRevision: 5,
      tagRevision: 0,
      topicDetail: {
        guid: '0123',
        dataType: 'topictype',
        data: 'contacttopicdata2',
        created: 1,
        updated: 1,
        status: 'confirmed',
        transform: 'complete',
      },
    }
   }
  ];

  await act(async () => {
    const channel = screen.getByTestId('conversation').props.channel;
    await channel.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(1);
    expect(screen.getByTestId('888').props.children).toBe('contacttopicdata2');
  });

  fetchChannels = [
    { id: '123', revision: 4, data: {
        detailRevision: 3,
        topicRevision: 6,
      }
    },
  ];

  fetchTopics = [
    { id: '888', revision: 8 }
  ];

  await act(async () => {
    const channel = screen.getByTestId('conversation').props.channel;
    await channel.actions.setRevision(4);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(1);
  });

  fetchChannels = [
    { id: '123', revision: 5, data: {
        detailRevision: 3,
        topicRevision: 7,
      }
    },
  ];

  await act(async () => {
    const channel = screen.getByTestId('conversation').props.channel;
    await channel.actions.setRevision(5);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('conversation').props.children).toHaveLength(0);
  });



});

