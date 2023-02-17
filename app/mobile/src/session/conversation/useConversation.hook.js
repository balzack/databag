import { useState } from 'react';

export function useConversation() {
  const [state, setState] = useState({});

  const actions = {};

  return { state, actions };
}

