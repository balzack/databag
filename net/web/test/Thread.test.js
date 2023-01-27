import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContext, ProfileContextProvider } from 'context/ProfileContext';
import { StoreContextProvider } from 'context/StoreContext';
import { ViewportContextProvider } from 'context/ViewportContext';
import { ConversationContextProvider } from 'context/ConversationContext';
import { CardContextProvider } from 'context/CardContext';
import { UploadContextProvider } from 'context/UploadContext';
import { useConversation } from 'session/conversation/useConversation.hook';

import * as fetchUtil from 'api/fetchUtil';

function ThreadView() {
  const { state, actions } = useConversation('card01', 'channel01');
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const rendered = [];
    setRenderCount(renderCount + 1);
  }, [state]);

  return (
    <div data-testid="thread" count={renderCount}></div>
  );
}

function ThreadTestApp() {
  return (
    <StoreContextProvider>
      <UploadContextProvider>
        <CardContextProvider>
          <ProfileContextProvider>
            <AccountContextProvider>
              <ViewportContextProvider>
                <ConversationContextProvider>
                  <AppContextProvider>
                    <ThreadView />
                  </AppContextProvider>
                </ConversationContextProvider>
              </ViewportContextProvider>
            </AccountContextProvider>
          </ProfileContextProvider>
        </CardContextProvider>
      </UploadContextProvider>
    </StoreContextProvider>
  );
}

let updated;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  let updated = false; 
  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (options.method === 'PUT') {
      updated = true;
    }
    return Promise.resolve({
      json: () => Promise.resolve({ name: updated ? 'tested' : 'tester' })
    });
  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('add, update, remove topic', async () => {

    render(<ThreadTestApp />);
});

