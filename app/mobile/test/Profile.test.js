import React, { useState, useEffect, useContext } from 'react';
import { Text } from 'react-native';
import { useTestStoreContext } from './useTestStoreContext.hook';
import {render, screen, waitFor, fireEvent} from '@testing-library/react-native'
import { ProfileContextProvider, ProfileContext } from 'context/ProfileContext';
import * as fetchUtil from 'api/fetchUtil';

function ProfileTest() {
  const [ msg, setMsg ] = useState();
  const profile = useContext(ProfileContext);

  const testSetup = async () => {
    await profile.actions.clearSession();
    await profile.actions.setSession({ guid: 'abc', server: 'test.org', appToken: '123' });
    await profile.actions.setRevision(1);
    setMsg("DONE");
  };

  useEffect(() => {
    testSetup();
  }, []);

  return (<Text testID="done">{ msg }</Text>);
}

function ProfileTestApp() {
  return (
    <ProfileContextProvider>
      <ProfileTest />
    </ProfileContextProvider>
  )
}

const realUseContext = React.useContext;
const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;

beforeEach(() => {
  const mockUseContext = jest.fn().mockImplementation((ctx) => {
    return useTestStoreContext();
  });
  React.useContext = mockUseContext;

  const mockFetch = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      json: () => Promise.resolve({ name: 'jester' })
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
      expect(screen.getByTestId('done').props.children).toBe("DONE");
    });
    //await new Promise(r => setTimeout(r, 2000));
});



