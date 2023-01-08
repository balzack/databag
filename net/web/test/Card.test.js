import React, { useState, useEffect, useContext } from 'react';
import { prettyDOM } from '@testing-library/dom'
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { CardContextProvider, CardContext } from 'context/CardContext';
import * as fetchUtil from 'api/fetchUtil';

let cardContext = null;
function CardView() {
  const [renderCount, setRenderCount] = useState(0);
  const [cards, setCards] = useState([]);
  const card = useContext(CardContext);
  cardContext = card;

  useEffect(() => {
    const rendered = []
    const entries = Array.from(card.state.cards.values());
    entries.forEach(entry => {

      rendered.push(
        <div key={entry.id} data-testid="card">
          <span data-testid="name">{ entry.data.cardProfile.name }</span>
          <span data-testid="status">{ entry.data.cardDetail.status }</span>
          <span data-testid="token">{ entry.data.cardDetail.token }</span>
        </div>);
    });
    setCards(rendered);
    setRenderCount(renderCount + 1);
  }, [card.state])

  return (
    <div data-testid="cards" count={renderCount} offsync={card.state.offsync.toString()}>
      { cards }
    </div>
  );
}

function CardTestApp() {
  return (
    <CardContextProvider>
      <CardView />
    </CardContextProvider>
  )
}

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;

let statusCards;
let statusMessage;
let statusDetail;
let statusProfile;
let fetchCards;
let fetchMessage;
let fetchDetail;
let fetchProfile;
beforeEach(() => {

  statusMessage = 200;
  fetchMessage = 
  statusCards = 200;
  fetchCards = [];
  statusDetail = 200;
  fetchDetail = {};
  statusProfile = 200;
  fetchProfile = {};
  const mockFetch = jest.fn().mockImplementation((url, options) => {

    const params = url.split('/');
    if (params[4]?.split('?')[0] === 'message') {
      return Promise.resolve({
        url: 'getMessage',
        status: statusMessage,
        json: () => Promise.resolve(fetchMessage),
      });
    }
    else if (params[4]?.split('?')[0] === 'detail') {
      return Promise.resolve({
        url: 'getDetail',
        status: statusDetail,
        json: () => Promise.resolve(fetchDetail),
      });
    }
    else if (params[4]?.split('?')[0] === 'profile') {
      return Promise.resolve({
        url: 'getProfile',
        status: statusProfile,
        json: () => Promise.resolve(fetchProfile),
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
    console.log(params, options);

      return Promise.resolve({
        url: 'endpoint',
        status: 200,
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

test('resync cards', async() => {

  render(<CardTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
  });

  await act(async () => {
    cardContext.actions.setToken('abc123');
  });

  statusCards = 500;
 
  await act(async () => {
    cardContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('cards').attributes.offsync.value).toBe('true');
  });

  statusCards = 200;
 
  await act(async () => {
    cardContext.actions.resync();
  });
 
  await waitFor(async () => {
    expect(screen.getByTestId('cards').attributes.offsync.value).toBe('false');
  });

  act(() => {
    cardContext.actions.clearToken();
  });

});

test('add, update, remove card', async () => {

  render(<CardTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
  });

  await act( async () => {
    cardContext.actions.setToken('abc123');
  });

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

  await act( async () => {
    cardContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('cards').children).toHaveLength(1);
    expect(screen.getByTestId('name').textContent).toBe('tester');
    expect(screen.getByTestId('status').textContent).toBe('connected');
    expect(screen.getByTestId('token').textContent).toBe('01ab');
  });

  fetchCards = [{
    id: '000a',
    revision: 2,
    data: {
      detailRevision: 3,
      profileRevision: 4,
      notifiedProfile: 3,
      notifiedArticle: 5,
      notifiedChannel: 6,
      notifiedView: 7,
    },
  }];

  fetchProfile = {
    guid: '01ab23',
    name: 'tested',
  };

  fetchDetail = {
    status: 'confirmed',
  };

  await act( async () => {
    cardContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe('tested');
    expect(screen.getByTestId('status').textContent).toBe('confirmed');
  });

  fetchCards = [{
    id: '000a',
    revision: 3,
  }];

  await act( async () => {
    cardContext.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('cards').children).toHaveLength(0);
  });

  act(() => {
    cardContext.actions.clearToken();
  });

});

