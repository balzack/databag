import { useEffect, useState, useRef } from 'react';
import { setAccountSearchable } from 'api/setAccountSearchable';
import { getAccountStatus } from 'api/getAccountStatus';

export function useAccountContext() {
  const [state, setState] = useState({
    init: false,
    status: null,
  });
  const access = useRef(null);
  const revision = useRef(null);
  const next = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setStatus = async (rev) => {
    if (next.current == null) {
      if (revision.current != rev) {
        let status = await getAccountStatus(access.current);
        updateState({ init: true, status });
        revision.current = rev;
      }
      if (next.current != null) {
        let r = next.current;
        next.current = null;
        setStatus(r);
      }
    }
    else {
      next.current = rev;
    }
  }

  const actions = {
    setToken: async (token) => {
      access.current = token;
    },
    setRevision: async (rev) => {
      setStatus(rev);
    },
    setSearchable: async (flag) => {
      await setAccountSearchable(access.current, flag);
    },
  }

  return { state, actions }
}


