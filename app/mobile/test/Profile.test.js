import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react-native'
import { ProfileContextProvider, ProfileContext } from 'context/ProfileContext';
import * as fetchUtil from 'api/fetchUtil';

function ProfileView() {
  const profile = useContext(ProfileContext);

  return (
    <View testID="profile" profile={profile}>
      <Text testID="guid">{ profile.state.profile?.guid }</Text>
      <Text testID="handle">{ profile.state.profile?.handle }</Text>
      <Text testID="name">{ profile.state.profile?.name }</Text>
      <Text testID="description">{ profile.state.profile?.description }</Text>
      <Text testID="location">{ profile.state.profile?.location }</Text>
      <Text testID="image">{ profile.state.profile?.image }</Text>
      <Text testID="revision">{ profile.state.profile?.revision }</Text>
      <Text testID="seal">{ profile.state.profile?.seal }</Text>
      <Text testID="version">{ profile.state.profile?.version }</Text>
      <Text testID="node">{ profile.state.profile?.node }</Text>
      <Text testID="imageUrl">{ profile.state.imageUrl }</Text>
    </View>
  );
}

function ProfileTestApp() {
  return (
    <ProfileContextProvider>
      <ProfileView />
    </ProfileContextProvider>
  )
}

const realUseContext = React.useContext;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
let identity = { };

beforeEach(() => {
  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    return useTestStoreContext();
  });
  React.useContext = mockUseContext;

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
  React.useContext = realUseContext;
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('testing', async () => {
  render(<ProfileTestApp />)

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe(undefined);
  });

  await act(async () => {
    identity = { name: 'jester' };
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setSession({ guid: 'abc', server: 'test.org', appToken: '123' });
    await profile.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("jester");
  });

  await act(async () => {
    identity = { name: 'tester' };
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("tester");
  });

  await act(async () => {
    identity = { name: 'jester' };
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("tester");
  });

  await act(async () => {
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.clearSession();
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe(undefined);
  });

  await act(async () => {
    identity = { name: 'jester' };
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setSession({ guid: 'abc', server: 'test.org', appToken: '123' });
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("tester");
    expect(screen.getByTestId('imageUrl').props.children).toBe("https://test.org/profile/image?agent=123&revision=2");
  });

  await act(async () => {
    const profile = screen.getByTestId('profile').props.profile;
    for (let i = 0; i < 1024; i++) {
      identity = { revision: i };
      await profile.actions.setRevision(i);  
    }
  });

  await waitFor(async () => {
    expect(screen.getByTestId('revision').props.children).toBe(1023);
  });

  await act(async () => {
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setProfileData("vesper", "sf", "dweb"); 
    await profile.actions.setRevision(1024);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("vesper");
  });
  
});



