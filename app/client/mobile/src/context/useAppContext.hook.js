import { useState, useEffect } from 'react';

import { DatabagSDK } from 'databag-client-sdk';

export function useAppContext() {
  const [state, setState] = useState({
  });

  useEffect(() => {
    console.log("IN APP CONTEXT");
  }, []);

  const actions = {
  }

  return { state, actions }
}

