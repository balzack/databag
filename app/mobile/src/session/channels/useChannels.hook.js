import { useState } from 'react';

export function useChannels() {
  const [state, setState] = useState({});

  const actions = {};

  return { state, actions };
}

