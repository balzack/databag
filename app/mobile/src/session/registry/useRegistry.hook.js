import { useState } from 'react';

export function useRegistry() {
  const [state, setState] = useState({});

  const actions = {};

  return { state, actions };
}

