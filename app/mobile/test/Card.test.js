import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import { prettyDOM } from '@testing-library/dom';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react-native';
import { CardContextProvider, CardContext } from 'context/CardContext';
import * as fetchUtil from 'api/fetchUtil';

function CardView() {
  const [renderCount, setRenderCount] = useState(0);
  const card = useContext(CardContext);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setRenderCount(renderCount + 1);
    const rendered = [];
    card.state.cards.forEach((value) => {
      rendered.push(<Text key={value.card.cardId} testID={value.card.cardId}>{ value.card.profile.handle }</Text>);
    });
    setCards(rendered);
  }, [card.state]);

  return (
    <View key="cards" testID="card" card={card} renderCount={renderCount}>
      { cards }
    </View>
  );
}

function CardTestApp() {
  return (
    <CardContextProvider>
      <CardView />
    </CardContextProvider>
  )
}

const realUseContext = React.useContext;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;

let fetchCards;
let fetchDetail;
let fetchProfile;
beforeEach(() => {
  fetchCards = [];

  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    return useTestStoreContext();
  });
  React.useContext = mockUseContext;

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    console.log(url);

    if (url.startsWith('https://test.org/contact/cards?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchCards)
      });
    }
    if (url.startsWith('https://test.org/contact/cards/000a/profile?agent')) {
      return Promise.resolve({
        json: () => Promise.resolve(fetchProfile)
      });
    }
    if (url.startsWith('https://test.org/contact/cards/000a/detail?agent')) {
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
  React.useContext = realUseContext;
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('add, update, and remove', async () => {
  
  render(<CardTestApp />)

  await act(async () => {
    const card = screen.getByTestId('card').props.card;
    await card.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
    await card.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('card').props.children).toHaveLength(0);
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
    const card = screen.getByTestId('card').props.card;
    await card.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('card').props.children).toHaveLength(1);
    expect(screen.getByTestId('000a').props.children).toBe('test1');
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
    handle: 'test2',
  };

  fetchDetail = {
    status: 'confirmed',
  }

  await act(async () => {
    const card = screen.getByTestId('card').props.card;
    await card.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('card').props.children).toHaveLength(1);
    expect(screen.getByTestId('000a').props.children).toBe('test2');
  });

  fetchCards = [{
    id: '000a',
    revision: 3,
  }];

  await act(async () => {
    const card = screen.getByTestId('card').props.card;
    await card.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('card').props.children).toHaveLength(1);
  });

  await act(async () => {
    const card = screen.getByTestId('card').props.card;
    await card.actions.setRevision(4);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('card').props.children).toHaveLength(0);
  });

});



