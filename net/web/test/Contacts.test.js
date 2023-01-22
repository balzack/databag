import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContext, CardContextProvider } from 'context/CardContext';
import { ChannelContextProvider } from 'context/ChannelContext';
import { StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { ViewportContextProvider } from 'context/ViewportContext';
import { useCards } from 'session/cards/useCards.hook';
import * as fetchUtil from 'api/fetchUtil';

let cardContext;
function ContactsView() {
  const { state, actions } = useCards();

  const [renderCount, setRenderCount] = useState(0);
  const [cards, setCards] = useState([]);
  const card = useContext(CardContext);
  cardContext = card;

  useEffect(() => {
    const rendered = [];
    state.cards.forEach(c => {
      rendered.push(
        <div key={c.cardId} data-testid="card">
          <span key={c.cardId} data-testid={'cardid-' + c.cardId}>{ c.name }</span>
        </div>
      );
    });
    setCards(rendered);
    setRenderCount(renderCount + 1);
  }, [state]);

  return (
    <div data-testid="cards" count={renderCount}>
      { cards }
    </div>
  );
}

function ContactsTestApp() {
  return (
    <UploadContextProvider>
      <ChannelContextProvider>
        <CardContextProvider>
          <ProfileContextProvider>
            <StoreContextProvider>
              <AccountContextProvider>
                <ViewportContextProvider>
                  <ContactsView />
                </ViewportContextProvider>
              </AccountContextProvider>
            </StoreContextProvider>
          </ProfileContextProvider>
        </CardContextProvider>
      </ChannelContextProvider>
    </UploadContextProvider>
  );
}

let fetchCards;
let fetchProfile;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {

  fetchCards = [];
  fetchProfile = {};

  const mockFetch = jest.fn().mockImplementation((url, options) => {

    if (url.startsWith('/contact/cards?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCards)
      });
    }
    else if (url.startsWith('/contact/cards/000a/profile?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchProfile)
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
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('add, update and remove contact', async () => {
  render(<ContactsTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
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

  await act(async () => {
    cardContext.actions.setToken('abc123');
    cardContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('cards').children).toHaveLength(1);
    expect(screen.getByTestId('cardid-000a').textContent).toBe('tester');
  });

  fetchCards = [{
    id: '000a',
    revision: 2,
    data: {
      detailRevision: 2,
      profileRevision: 4,
      notifiedProfile: 3,
      notifiedArticle: 5,
      notifiedChannel: 6,
      notifiedView: 7,
    }
  }];

  fetchProfile = { guid: '01ab23', handle: 'test1', name: 'tested', imageSet: false,
        seal: 'abc', version: '1.1.1', node: 'test.org' };

  await act(async () => {
    cardContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('cardid-000a').textContent).toBe('tested');
  });

  fetchCards = [{
    id: '000a',
    revision: 3,
  }];

  await act(async () => {
    cardContext.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('cards').children).toHaveLength(0);
  });

});



