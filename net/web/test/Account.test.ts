import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { AccountContextProvider, AccountContext } from 'context/AccountContext';
import { StoreContextProvider } from 'context/StoreContext';
import * as fetchUtil from 'api/fetchUtil';

let accountContext = null;
function AccountView() {
  const [renderCount, setRenderCount] = useState(0);
  const account = useContext(AccountContext);
  accountContext = account;

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [account.state]);

  return (
    <div>
      <span data-testid="count">{ renderCount }</span>
      <span data-testid="seal">{ account.state.seal }</span>
      <span data-testid="sealKey">{ account.state.sealKey }</span>
      <span data-testid="searchable">{ account.state.status?.searchable.toString() }</span>
    </div>
  );
}

function AccountTestApp() {
  return (
    <StoreContextProvider>
      <AccountContextProvider>
        <AccountView />
      </AccountContextProvider>
    </StoreContextProvider>
  )
}

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
let fetchStatus;
let sealSet;

beforeEach(() => {
  fetchStatus = {};
  sealSet = false;

  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (url === '/account/seal?agent=abc123') {
      sealSet = true;
      return Promise.resolve({
        json: () => Promise.resolve({})
      });
    }
    else if (url === '/account/status?agent=abc123') {
      return Promise.resolve({
        json: () => Promise.resolve(fetchStatus)
      });
    }
    else {
      return Promise.resolve({
        json: () => Promise.resolve({})
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

test('testing account sync', async () => {
  render(<AccountTestApp />);

  await waitFor(async () => {
    expect(accountContext).not.toBe(null);
  });

  fetchStatus = { disabled: false, storageUsed: 1, searchable: true, pushEnabled: false, sealable: true };
  
  await act(async () => {
    accountContext.actions.setToken('abc123');
    await accountContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('searchable').textContent).toBe('true');
    expect(screen.getByTestId('seal').textContent).toBe('');
    expect(screen.getByTestId('sealKey').textContent).toBe('');
    expect(sealSet).toBe(false);
  });

  await act(async () => {
    await accountContext.actions.setSeal('testeal', 'testsealkey');
  });

  fetchStatus = { disabled: false, storageUsed: 1, searchable: true, pushEnabled: false, sealable: true, seal: 'testseal' };
 
  await act(async () => {
    await accountContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(sealSet).toBe(true);
    expect(screen.getByTestId('seal').textContent).toBe('testseal');
    expect(screen.getByTestId('sealKey').textContent).toBe('testsealkey');
  });
});



