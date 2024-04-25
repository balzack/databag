import React, { useState, useEffect, useContext } from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContext, ProfileContextProvider } from 'context/ProfileContext';
import { StoreContextProvider } from 'context/StoreContext';
import { SettingsContextProvider } from 'context/SettingsContext';
import { useProfile } from 'session/account/profile/useProfile.hook';
import * as fetchUtil from 'api/fetchUtil';

let profileHook;
let profileContext;
function ProfileView() {
  const { state, actions } = useProfile();

  const [name, setName] = useState();
  const [renderCount, setRenderCount] = useState(0);
  const profile = useContext(ProfileContext);
  profileContext = profile;
  profileHook = actions;

  useEffect(() => {
    const rendered = [];
    setName(state.name);
    setRenderCount(renderCount + 1);
  }, [state]);

  return (
    //@ts-ignore
    <div
      data-testid="name"
      data-count={renderCount}
    >
      {name}
    </div>
  );
}

function ProfileTestApp() {
  return (
    <StoreContextProvider>
      <ProfileContextProvider>
        <AccountContextProvider>
          <SettingsContextProvider>
            <AppContextProvider>
              <ProfileView />
            </AppContextProvider>
          </SettingsContextProvider>
        </AccountContextProvider>
      </ProfileContextProvider>
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
      json: () => Promise.resolve({ name: updated ? 'tested' : 'tester' }),
    });
  });
  //@ts-ignore
  fetchUtil.fetchWithTimeout = mockFetch;
  //@ts-ignore
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  //@ts-ignore
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  //@ts-ignore
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('update profile name', async () => {
  render(<ProfileTestApp />);

  await waitFor(async () => {
    expect(profileContext).not.toBe(null);
    expect(profileHook).not.toBe(null);
  });

  await act(async () => {
    profileContext.actions.setToken('abc123');
    profileContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe('tester');
  });

  await act(async () => {
    profileHook.setEditName('tested');
  });

  await act(async () => {
    await profileHook.setProfileDetails();
  });

  await act(async () => {
    profileContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe('tested');
  });
});
