import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { CardContext, CardContextProvider } from 'context/CardContext';
import { ViewportContextProvider } from 'context/ViewportContext';
import { useContact } from 'session/contact/useContact.hook';
import * as fetchUtil from 'api/fetchUtil';

let contactHook;
let cardContext;
function ContactView() {
  const [name, setName] = useState();
  const [status, setStatus] = useState();
  const { state, actions } = useContact('01ab23');
  const [renderCount, setRenderCount] = useState(0);
  const card = useContext(CardContext);
  cardContext = card;
  contactHook = actions;

  useEffect(() => {
    const rendered = [];
    setName(state.name);
    setStatus(state.status);
    setRenderCount(renderCount + 1);
  }, [state]);

  return (
    <div count={renderCount}>
      <div data-testid="name">{ name }</div>
      <div data-testid="status">{ status }</div>
    </div>
  );
}

function ContactTestApp() {
  return (
    <CardContextProvider>
      <ViewportContextProvider>
        <ContactView />
      </ViewportContextProvider>
    </CardContextProvider>
  );
}

let fetchCards;
let fetchProfile;
let fetchDetail;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  fetchCards = [];
  fetchDetail = {};
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
    else if (url.startsWith('/contact/cards/000a/detail?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchDetail)
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

test('update contact name', async () => {

  render(<ContactTestApp />);

  await waitFor(async () => {
    expect(cardContext).not.toBe(null);
    expect(contactHook).not.toBe(null);
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
    expect(screen.getByTestId('name').textContent).toBe('tester');
    expect(screen.getByTestId('status').textContent).toBe('connected');
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
    },
  }];

  fetchProfile = { guid: '01ab23', handle: 'test1', name: 'tested', imageSet: false,
        seal: 'abc', version: '1.1.1', node: 'test.org' },

  await act(async () => {
    cardContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe('tested');
    expect(screen.getByTestId('status').textContent).toBe('connected');
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

  fetchDetail = { status: 'confirmed', statusUpdate: 137 },

  await act(async () => {
    cardContext.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe('tested');
    expect(screen.getByTestId('status').textContent).toBe('connected');
  });

  fetchCards = [{
    id: '000a',
    revision: 3,
    data: {
      detailRevision: 3,
      profileRevision: 4,
      notifiedProfile: 3,
      notifiedArticle: 5,
      notifiedChannel: 6,
      notifiedView: 7,
    },
  }];

  fetchDetail = { status: 'confirmed', statusUpdate: 137 },

  await act(async () => {
    cardContext.actions.setRevision(4);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe('tested');
    expect(screen.getByTestId('status').textContent).toBe('saved');
  });

  fetchCards = [{
    id: '000a',
    revision: 4,
  }];

  await act(async () => {
    cardContext.actions.setRevision(5);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe('');
    expect(screen.getByTestId('status').textContent).toBe('');
  });


});

