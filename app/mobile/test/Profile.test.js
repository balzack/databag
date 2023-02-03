import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react-native'
import { ProfileContextProvider, ProfileContext } from 'context/ProfileContext';
import * as fetchUtil from 'api/fetchUtil';

function ProfileView() {
  const [renderCount, setRenderCount] = useState(0);
  const profile = useContext(ProfileContext);

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [profile.state]);

  return (
    <View testID="profile" profile={profile} renderCount={renderCount}>
      <Text testID="guid">{ profile.state.identity?.guid }</Text>
      <Text testID="handle">{ profile.state.identity?.handle }</Text>
      <Text testID="name">{ profile.state.identity?.name }</Text>
      <Text testID="description">{ profile.state.identity?.description }</Text>
      <Text testID="location">{ profile.state.identity?.location }</Text>
      <Text testID="image">{ profile.state.identity?.image }</Text>
      <Text testID="revision">{ profile.state.identity?.revision }</Text>
      <Text testID="seal">{ profile.state.identity?.seal }</Text>
      <Text testID="version">{ profile.state.identity?.version }</Text>
      <Text testID="node">{ profile.state.identity?.node }</Text>
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
    await profile.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
    await profile.actions.setRevision(1);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("jester");
  });

  await act(async () => {
    identity = { name: 'tester', image: 'abc123' };
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("tester");
    expect(screen.getByTestId('imageUrl').props.children).toBe("https://test.org/profile/image?agent=123&revision=2");
  });

  await act(async () => {
    identity = { name: 'jester' };
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setRevision(2);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("tester");
    expect(screen.getByTestId('imageUrl').props.children).toBe("https://test.org/profile/image?agent=123&revision=2");
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
    await profile.actions.setSession({ guid: 'abc', server: 'test.org', token: '123' });
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("tester");
    expect(screen.getByTestId('imageUrl').props.children).toBe("https://test.org/profile/image?agent=123&revision=2");
  });

  await act(async () => {
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setRevision(3);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('name').props.children).toBe("jester");
    expect(screen.getByTestId('imageUrl').props.children).toBe(null);
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
  
  const renderCount = screen.getByTestId('profile').props.renderCount;

  await act(async () => {
    identity = { name: 'renderer' };
    const profile = screen.getByTestId('profile').props.profile;
    await profile.actions.setRevision(2048);
  });

  await act(async () => {
    expect(screen.getByTestId('profile').props.renderCount).toBe(renderCount + 1);
  });
});



