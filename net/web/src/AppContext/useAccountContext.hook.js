import { useEffect, useState, useRef } from 'react';
import { setAccountSearchable } from '../Api/setAccountSearchable';
import { getAccountStatus } from '../Api/getAccountStatus';

export function useAccountContext() {
  const [state, setState] = useState({
    token: null,
    revision: 0,
    status: null,
  });
  const next = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setStatus = async (revision) => {
    if (next.current == null) {
      let status = await getAccountStatus(state.token);
      updateState({ revision, status });
      if (next.current != null) {
        let rev = next.current;
        next.current = null;
        setStatus(rev);
      }
    }
    else {
      next.current = revision;
    }
  }

  const actions = {
    setToken: async (token) => {
      updateState({ token });
    },
    setRevision: async (revision) => {
      setStatus(revision);
    },
    setSearchable: async (flag) => {
      await setAccountSearchable(state.token, flag);
    },
  }

  return { state, actions }
}


