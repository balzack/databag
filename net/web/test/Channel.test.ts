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
let addedChannel;
let removedChannel;
let updatedChannel;
let addedCard;
let removedCard;
beforeEach(() => {

  statusDetail = 200;
  statusSummary = 200;
  statusChannels = 200;
  fetchDetail = {};
  fetchSummary = {};
  fetchChannels =[];
  addedChannel = [];
  updatedChannel = [];
  removedChannel = [];
  addedCard = [];
  removedCard = [];
  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (options.method === 'POST') {
      addedChannel.push(options.body);
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ id: 'id1' }),
      });
    }
    else if (options.method === 'PUT') {
      const params = url.split('/');
      if (params[4] === 'cards') {
        addedCard.push(params[5].split('?')[0]);
      }
      else {
        updatedChannel.push({ id: params[3], body: options.body });
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
      });
    }
    else if (options.method === 'DELETE') {
      const params = url.split('/');
      if (params[4] === 'cards') {
        removedCard.push(params[5].split('?')[0]);
      }
      else {
        removedChannel.push(params[3].split('?')[0]);
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(),
      });
    }
    else if (url.includes('detail')) {
      return Promise.resolve({
        url: 'getDetail',
        status: statusDetail,
        json: () => Promise.resolve(fetchDetail),
      });
    }
    else if (url.includes('summary')) {
      return Promise.resolve({
        url: 'getSummary',
        status: statusSummary,
        json: () => Promise.resolve(fetchSummary),
      });
    }
    else {
      return Promise.resolve({
        url: 'getChannels',
        status: statusChannels,
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

test('api invocation', async () => {

  render(<ChannelTestApp />);

  await waitFor(async () => {
    expect(channelContext).not.toBe(null);
  });

  await act( async () => {
    channelContext.actions.setToken('abc123');
  });

  await act(async () => {
    await channelContext.actions.addChannel('testtype', 'testsubject', ['testcard']);
    await channelContext.actions.setChannelSubject('123', 'testtype', 'testsubject');
    await channelContext.actions.setChannelCard('123', 'newcard');
    await channelContext.actions.clearChannelCard('123', 'newcard');
    await channelContext.actions.removeChannel('123');
  });

  await waitFor(async () => {
    expect(addedChannel.length).toBe(1);
    const added = JSON.parse(addedChannel[0]);
    expect(added.dataType).toBe('testtype');
    expect(updatedChannel.length).toBe(1);
    expect(updatedChannel[0].id).toBe('123');
    expect(removedChannel.length).toBe(1);
    expect(removedChannel[0]).toBe('123');
    expect(addedCard.length).toBe(1);
    expect(addedCard[0]).toBe('newcard');
    expect(addedCard[0]).toBe('newcard');
  });

  await act( async () => {
    channelContext.actions.clearToken();
  });

});

test('add, update and remove channel', async () => {

  render(<ChannelTestApp />);

  fetchDetail = { dataType: 'superbasic', data: 'testdata' };
  fetchSummary = { guid: '11', dataType: 'superbasictopic', data: 'testdata' };
  fetchChannels = [
    { id: '123', revision: 2, data: {
        detailRevision: 3,
        topicRevision: 5,
        channelSummary: { guid: '11', dataType: 'superbasictopic', data: 'testdata' },
        channelDetail: { dataType: 'superbasic', data: 'testdata' },
      }
    },
  ];

  await waitFor(async () => {
    expect(channelContext).not.toBe(null);
  });

  await act( async () => {
    channelContext.actions.setToken('abc123');
  });

  await act( async () => {
    await channelContext.actions.setRevision(1);
  });

  //screen.getByTestId('count').attributes.count.value
  //console.log(prettyDOM(screen.getByTestId('channels')));

  await waitFor(async () => {
    expect(screen.getByTestId('channels').children).toHaveLength(1);
    expect(screen.getByTestId('detail').textContent).toBe('testdata');
    expect(screen.getByTestId('summary').textContent).toBe('testdata');
  });

  const count = parseInt(screen.getByTestId('channels').attributes.count.value) + 1;

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
    expect(screen.getByTestId('channels').attributes.count.value).toBe(count.toString());
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

  await act( async () => {
    channelContext.actions.clearToken();
  });

});

test('resync', async () => {

  render(<ChannelTestApp />);

  await waitFor(async () => {
    expect(channelContext).not.toBe(null);
  });

  await act( async () => {
    channelContext.actions.setToken('abc123');
  });

  await act( async () => {
    statusChannels = 500;
    await channelContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channels').attributes.offsync.value).toBe("true");
  });

  await act( async () => {
    statusChannels = 200;
    await channelContext.actions.resync();
  });

  await waitFor(async () => {
    expect(screen.getByTestId('channels').attributes.offsync.value).toBe("false");
  });
});

