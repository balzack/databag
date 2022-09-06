import { useState } from 'react';

export function useAppContext() {
  const [state, setState] = useState({});

  const actions = {
  }

  return { state, actions }
}


