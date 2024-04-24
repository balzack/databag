import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'

import { StoreContext, StoreContextProvider } from 'context/StoreContext';

let storeContext = null;
function StoreView() {
  const [renderCount, setRenderCount] = useState(0);
  const store = useContext(StoreContext);
  storeContext = store;

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [store.state]);

  return (
    <div>
      <span data-testid="count">{ renderCount }</span>
      <span data-testid="config">{ store.state.config }</span>
    </div>
  );
}

function StoreTestApp() {
  return (
    <StoreContextProvider>
      <StoreView />
    </StoreContextProvider>
  );
}

test('get, set and clear', async () => {
  render(<StoreTestApp />);

  await waitFor(async () => {
    expect(storeContext).not.toBe(null);
  });

  await waitFor(async () => {
    expect(screen.getByTestId('config').textContent).toBe('');
  });

  await waitFor(async () => {
    storeContext.actions.setValue('config', 'testvalue');
  });

  await waitFor(async () => {
    expect(screen.getByTestId('config').textContent).toBe('testvalue');
  });

  await waitFor(async () => {
    storeContext.actions.setValue('config', 'testvalue2');
  });

  await waitFor(async () => {
    expect(screen.getByTestId('config').textContent).toBe('testvalue2');
  });

  await waitFor(async () => {
    storeContext.actions.clear();
  });

  await waitFor(async () => {
    expect(screen.getByTestId('config').textContent).toBe('');
  });

});



