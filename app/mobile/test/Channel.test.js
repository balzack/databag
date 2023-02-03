import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import { prettyDOM } from '@testing-library/dom';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react-native';
import { ChannelContextProvider, ChannelContext } from 'context/ChannelContext';
import * as fetchUtil from 'api/fetchUtil';

function ChannelView() {
  const [renderCount, setRenderCount] = useState(0);
  const channel = useContext(ChannelContext);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    setRenderCount(renderCount + 1);
    const rendered = [];
    channel.state.channels.forEach((value) => {
      rendered.push(<Text key={value.channelId} testID={value.channelId}>{ value.detail.data }</Text>);
    });
    setChannels(rendered);
  }, [channel.state]);

  return (
    <View key="channels" testID="channel" channel={channel} renderCount={renderCount}>
      { channels }
    </View>
  );
}

function ChannelTestApp() {
  return (
    <ChannelContextProvider>
      <ChannelView />
    </ChannelContextProvider>
  )
}

const realUseContext = React.useContext;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;

let fetchChannels;
let fetchDetail;
beforeEach(() => {
  fetchChannels = [];

  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    return useTestStoreContext();
  });
  React.useContext = mockUseContext;

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (url.startsWith('https://test.org/content/channels?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchChannels)
      });
    }
    if (url.startsWith('https://test.org/content/channels/01/detail?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchDetail)
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

test('add, update, and remove', async () => {
  
  render(<ChannelTestApp />)

  fetchChannels = [{
    id: '01',
    revision: 1,
    data: {
      detailRevision: 1,
      topicRevision: 1,
      channelDetail: {
        dataType: 'superbasic',
        data: 'testchannel',
      },
      channelSummary: {
        dataType: 'superbasictopic',
        data: 'testtopic',
      },
    },
  }];

  await act(async () => {
    const channel = screen.getByTestId('channel').props.channel;
    await channel.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
    await channel.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('01').props.children).toBe('testchannel');
  });

  fetchChannels = [];

  await act(async () => {
    const channel = screen.getByTestId('channel').props.channel;
    await channel.actions.clearSession();
    await channel.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
  });

  await waitFor(async () => {
    expect(screen.getByTestId('01').props.children).toBe('testchannel');
  });

  fetchChannels = [{
    id: '01',
    revision: 2,
    data: {
      detailRevision: 3,
      topicRevision: 1,
    },
  }];

  fetchDetail = {
    dataType: 'superbasic',
    data: 'updatedchannel',
  };

  await act(async () => {
    const channel = screen.getByTestId('channel').props.channel;
    await channel.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('01').props.children).toBe('updatedchannel');
  });

  fetchChannels = [{
    id: '01',
    revision: 3,
  }];

  await act(async () => {
    const channel = screen.getByTestId('channel').props.channel;
    await channel.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channel').props.children).toHaveLength(0);
  });

  await act(async () => {
    const channel = screen.getByTestId('channel').props.channel;
    await channel.actions.clearSession();
    await channel.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channel').props.children).toHaveLength(0);
  });


});



