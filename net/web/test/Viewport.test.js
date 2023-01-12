import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'

import { ViewportContext, ViewportContextProvider } from 'context/ViewportContext';

function ViewportView() {
  const [renderCount, setRenderCount] = useState(0);
  const viewport = useContext(ViewportContext);

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [viewport.state]);

  return (
    <div>
      <span data-testid="count">{ renderCount }</span>
      <span data-testid="display">{ viewport.state.display }</span>
      <span data-testid="width">{ viewport.state.width }</span>
      <span data-testid="height">{ viewport.state.height }</span>
    </div>
  );
}

function ViewportTestApp() {
  return (
    <ViewportContextProvider>
      <ViewportView />
    </ViewportContextProvider>
  );
}

test('get, set and clear', async () => {
  render(<ViewportTestApp />);

  await waitFor(async () => {
    expect(screen.getByTestId('display').textContent).toBe('large');
    expect(screen.getByTestId('width').textContent).toBe('1024');
    expect(screen.getByTestId('height').textContent).toBe('768');
  });

});



