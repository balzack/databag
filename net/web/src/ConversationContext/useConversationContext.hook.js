import { useEffect, useState, useRef } from 'react';

export function useConversationContext() {
  const [state, setState] = useState({});

  useEffect(() => {
    console.log("CREATED CONVERSATION");
  }, []);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
  }

  return { state, actions }
}


