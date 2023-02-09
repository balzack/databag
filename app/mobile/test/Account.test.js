import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react-native'
import { AccountContextProvider, AccountContext } from 'context/AccountContext';
import * as fetchUtil from 'api/fetchUtil';

function AccountView() {
  const [renderCount, setRenderCount] = useState(0);
  const account = useContext(AccountContext);

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [account.state]);

  return (
    <View testID="account" account={account} renderCount={renderCount}>
      <Text testID="searchable">{ account.state.status?.searchable }</Text>
    </View>
  );
}

function AccountTestApp() {
  return (
    <AccountContextProvider>
      <AccountView />
    </AccountContextProvider>
  )
}

let fetchStatus;
const realUseContext = React.useContext;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    return useTestStoreContext();
  });
  React.useContext = mockUseContext;

  fetchStatus = {};
  const mockFetch = jest.fn().mockImplementation((url, options) => {
    return Promise.resolve({
      json: () => Promise.resolve(fetchStatus)
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
  render(<AccountTestApp />)

  await waitFor(async () => {
    expect(screen.getByTestId('searchable').props.children).toBe(undefined);
  });

  fetchStatus = { searchable: true };

  await act(async () => {
    const account = screen.getByTestId('account').props.account;
    await account.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
    await account.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('searchable').props.children).toBe(true);
  });

  fetchStatus = { searchable: false };

  await act(async () => {
    const account = screen.getByTestId('account').props.account;
    await account.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('searchable').props.children).toBe(false);
  });

});



