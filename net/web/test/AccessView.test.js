import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ViewportContextProvider } from 'context/ViewportContext';
import { AppContextProvider } from 'context/AppContext';
import { Access } from 'access/Access';
import * as fetchUtil from 'api/fetchUtil';

function AccessTestApp() {
  return (
    <ViewportContextProvider>
      <AppContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={ <Access mode="login" /> } />
            <Route path="/login" element={ <Access mode="login" /> } />
            <Route path="/create" element={ <Access mode="create" /> } />
          </Routes>
        </Router>
      </AppContextProvider>
    </ViewportContextProvider>
  );
}

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  });
});

const realFetchWithTimeout = fetchUtil.fetchWithTimeout;
const realFetchWithCustomTimeout = fetchUtil.fetchWithCustomTimeout;
beforeEach(() => {
  const mockFetch = jest.fn().mockImplementation((url, options) => {
    return Promise.resolve({
      json: () => Promise.resolve([])
    });
  });
  fetchUtil.fetchWithTimeout = mockFetch;
  fetchUtil.fetchWithCustomTimeout = mockFetch;
});

afterEach(() => {
  fetchUtil.fetchWithTimeout = realFetchWithTimeout;
  fetchUtil.fetchWithCustomTimeout = realFetchWithCustomTimeout;
});

test('login and create', async () => {
  await act(async () => {
    render(<AccessTestApp />);
  });
});



