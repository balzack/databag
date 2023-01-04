import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { ChannelContextProvider, ChannelContext } from 'context/ChannelContext';
import * as fetchUtil from 'api/fetchUtil';

let channelContext = null;
function ChannelView() {
  const [renderCount, setRenderCount] = useState(0);
  const channel = useContext(ChannelContext);
  channelContext = channel;

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [channel.state]);

  return (
    <div>
      <span data-testid="count">{ renderCount }</span>
    </div>
  );
}

function ChannelTestApp() {
  return (
    <ChannelContextProvider>
      <ChannelView />
    </ChannelContextProvider>
  )
}

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;

let fetching = (url, options) => Promise.resolve({ json: () => Promise.resolve([])});

beforeEach(() => {
  const mockFetch = jest.fn().mockImplementation((url, options) => fetching(url, options));
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('testing channel sync', async () => {
  render(<ChannelTestApp />);

  await waitFor(async () => {
    expect(channelContext).not.toBe(null);
  });

  await act( async () => {
    channelContext.actions.setToken('abc123');
    await channelContext.actions.setRevision(1);
  });
});



