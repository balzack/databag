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
let fetchCards;
beforeEach(() => {

  statusCards = 200;
  fetchCards =[];
  const mockFetch = jest.fn().mockImplementation((url, options) => {
    return Promise.resolve({
      url: 'getChannels',
      status: statusChannels,
      json: () => Promise.resolve(fetchChannels),
    });
  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('boilerplate', async () => {

  render(<CardTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
  });

  await act( async () => {
    cardContext.actions.setToken('abc123');
  });

  await act( async () => {
    cardContext.actions.clearToken();
  });

});

