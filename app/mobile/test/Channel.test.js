import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react-native'
import { ChannelContextProvider, ChannelContext } from 'context/ChannelContext';
import * as fetchUtil from 'api/fetchUtil';

function ChannelView() {
  const [renderCount, setRenderCount] = useState(0);
  const channel = useContext(ChannelContext);

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [channel.state]);

  return (
    <View testID="channel" channel={channel} renderCount={renderCount}>
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

beforeEach(() => {
  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    return useTestStoreContext();
  });
  React.useContext = mockUseContext;

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    console.log(url);
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

test('testing', async () => {
  render(<ChannelTestApp />)

  await act(async () => {
    const channel = screen.getByTestId('channel').props.channel;
    await channel.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
    await channel.actions.setRevision(1);
  });

});



