import { useState } from 'react';

export function useCards() {
  const [state, setState] = useState({});

  const actions = {
  };

  return { state, actions };
}

