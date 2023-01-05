import React, { useState, useEffect, useContext } from 'react';
import { prettyDOM } from '@testing-library/dom'
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { ChannelContextProvider, ChannelContext } from 'context/ChannelContext';
import * as fetchUtil from 'api/fetchUtil';

let channelContext = null;
function ChannelView() {
  const [renderCount, setRenderCount] = useState(0);
  const [channels, setChannels] = useState([]);
  const channel = useContext(ChannelContext);
  channelContext = channel;

  useEffect(() => {
    const rendered = []
    const entries = Array.from(channel.state.channels.values());
    entries.forEach(entry => {
      rendered.push(
        <div key={entry.id} data-testid="channel">
          <span data-testid="detail">{ entry.data.channelDetail.data }</span>
          <span data-testid="summary">{ entry.data.channelSummary.data }</span>
        </div>);
    });
    setChannels(rendered);
    setRenderCount(renderCount + 1);
  }, [channel.state])

  return (
    <div data-testid="channels" count={renderCount} offsync={channel.state.offsync.toString()}>
      { channels }
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

let statusDetail;
let statusSummary;
let statusChannels;
let fetchDetail;
let fetchSummary;
let fetchChannels;
beforeEach(() => {

  statusDetail = 200;
  statusSummary = 200;
  statusChannels = 200;
  fetchDetail = {};
  fetchSummary = {};
  fetchChannels = {};

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (url.includes('detail')) {
      return Promise.resolve({
        status: statusDetail,
        json: () => Promise.resolve(fetchDetail),
      });
    }
    else if (url.includes('summary')) {
      return Promise.resolve({
        status: statusSummary,
        json: () => Promise.resolve(fetchSummary),
      });
    }
    else {
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(fetchChannels),
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

test('add, update and remove channel', async () => {
  fetchDetail = { dataType: 'superbasic', data: 'testdata' };
  fetchSummary = { guid: '11', dataType: 'superbasictopic', data: 'testdata' };

  render(<ChannelTestApp />);

  await waitFor(async () => {
    expect(channelContext).not.toBe(null);
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

  await act( async () => {
    channelContext.actions.setToken('abc123');
    await channelContext.actions.setRevision(1);
  });

  //screen.getByTestId('count').attributes.count.value
  //console.log(prettyDOM(screen.getByTestId('channels')));

  await waitFor(async () => {
    expect(screen.getByTestId('channels').children).toHaveLength(1);
    expect(screen.getByTestId('detail').textContent).toBe('testdata');
    expect(screen.getByTestId('summary').textContent).toBe('testdata');
  });

  fetchChannels = [
    { id: '123', revision: 3, data: {
        detailRevision: 4,
        topicRevision: 5,
        channelDetail: { dataType: 'superbasic', data: 'testdata2' },
      }
    },
  ];

  await act( async () => {
    await channelContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channels').children).toHaveLength(1);
    expect(screen.getByTestId('detail').textContent).toBe('testdata2');
  });

  fetchChannels = [ { id: '123', revision: 3 } ];

  await act( async () => {
    await channelContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channels').children).toHaveLength(1);
  });

  await act( async () => {
    await channelContext.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channels').children).toHaveLength(0);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channels').attributes.offsync.value).toBe("false");
  });
});


// set and clear of channel card
// add, update and remove topic
// unseal topic and channels
// offsync resync
