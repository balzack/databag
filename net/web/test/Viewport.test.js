import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'

import { SettingsContext, SettingsContextProvider } from 'context/SettingsContext';

function ViewportView() {
  const [renderCount, setRenderCount] = useState(0);
  const settings = useContext(SettingsContext);

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [settings.state]);

  return (
    <div>
      <span data-testid="count">{ renderCount }</span>
      <span data-testid="display">{ settings.state.display }</span>
      <span data-testid="width">{ settings.state.width }</span>
      <span data-testid="height">{ settings.state.height }</span>
    </div>
  );
}

function ViewportTestApp() {
  return (
    <SettingsContextProvider>
      <ViewportView />
    </SettingsContextProvider>
  );
}

test('display size', async () => {
  render(<ViewportTestApp />);

  await waitFor(async () => {
    expect(screen.getByTestId('display').textContent).toBe('large');
    expect(screen.getByTestId('width').textContent).toBe('1024');
    expect(screen.getByTestId('height').textContent).toBe('768');
  });

});



