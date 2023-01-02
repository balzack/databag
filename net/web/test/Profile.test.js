import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { ProfileContextProvider, ProfileContext } from 'context/ProfileContext';
import * as fetchUtil from 'api/fetchUtil';

let profileContext = null;
function ProfileView() {
  const profile = useContext(ProfileContext);
  profileContext = profile;

  return (
    <div>
      <span data-testid="guid">{ profile.state.identity?.guid }</span>
      <span data-testid="handle">{ profile.state.identity?.handle }</span>
      <span data-testid="name">{ profile.state.identity?.name }</span>
      <span data-testid="description">{ profile.state.identity?.description }</span>
      <span data-testid="location">{ profile.state.identity?.location }</span>
      <span data-testid="image">{ profile.state.identity?.image }</span>
      <span data-testid="revision">{ profile.state.identity?.revision }</span>
      <span data-testid="seal">{ profile.state.identity?.seal }</span>
      <span data-testid="version">{ profile.state.identity?.version }</span>
      <span data-testid="node">{ profile.state.identity?.node }</span>
    </div>
  );
}

function ProfileTestApp() {
  return (
    <ProfileContextProvider>
      <ProfileView />
    </ProfileContextProvider>
  )
}

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
let identity = { };

beforeEach(() => {
  const mockFetch = jest.fn().mockImplementation((url, options) => {
    if (options.method === 'PUT') {
      identity = JSON.parse(options.body);
    }
    return Promise.resolve({
      json: () => Promise.resolve(identity)
    });
  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('testing', async () => {
  render(<ProfileTestApp />);

  await waitFor(async () => {
    expect(profileContext).not.toBe(null);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe("");
  });

  await act(async () => {
    identity = { name: 'jester' };
    await profileContext.actions.setToken({ guid: 'abc', server: 'test.org', appToken: '123' });
    await profileContext.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe("jester");
  }); 

  await act(async () => {
    identity = { name: 'tester' };
    await profileContext.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe("tester");
  }); 

  await act(async () => {
    await profileContext.actions.clearToken();
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').textContent).toBe("");
  });


});



