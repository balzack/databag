import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { AppContext, AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContextProvider } from 'context/CardContext';
import { ChannelContextProvider } from 'context/ChannelContext';
import { StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { ViewportContextProvider } from 'context/ViewportContext';
import { useAccess } from 'access/useAccess.hook';
import * as fetchUtil from 'api/fetchUtil';

let navPath;
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => { return (path) => { navPath = path } },
  useLocation: () => { return 'path' },
}));

let appContext;
function AccessView() {
  const { state, actions } = useAccess();
  const app = useContext(AppContext);
  appContext = app;
  return (<div></div>);
}

function AccessTestApp() {
  return (
    <UploadContextProvider>
      <ChannelContextProvider>
        <CardContextProvider>
          <ProfileContextProvider>
            <StoreContextProvider>
              <AccountContextProvider>
                <ViewportContextProvider>
                  <AppContextProvider>
                    <AccessView />
                  </AppContextProvider>
                </ViewportContextProvider>
              </AccountContextProvider>
            </StoreContextProvider>
          </ProfileContextProvider>
        </CardContextProvider>
      </ChannelContextProvider>
    </UploadContextProvider>
  );
}

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  const mockFetch = jest.fn().mockImplementation((url, options) => {
    return Promise.resolve({
      json: () => Promise.resolve({
        guid: '123',
        appToken: 'aacc',
        created: 2,
        pushSupported: false,
      })
    });
  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('nav to session after login', async () => {
    render(<AccessTestApp />);

    await waitFor(async () => {
      expect(appContext).not.toBe(null);
    });

    await act(async () => {
      await appContext.actions.login('testusername', 'testpassword');
    });

    await waitFor(async () => {
      expect(navPath).toBe('/');
    });
});



