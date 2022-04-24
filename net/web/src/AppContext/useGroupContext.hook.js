import { useEffect, useState, useRef } from 'react';
import { getGroups } from '../Api/getGroups';

export function useGroupContext() {
  const [state, setState] = useState({
    token: null,
    revision: null,
    groups: new Map(),
  });
  const next = useRef(null);
  const groups = useRef(new Map());

  useEffect(() => {
  }, []);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setGroups = async (revision) => {
    if (next.current == null) {
      let delta = await getGroups(state.token, state.revision);
      for (let group of delta) {
        if (group.data) {
          groups.set(group.id, group);
        }
        else {
          groups.delete(group.id);
        }
      }
      updateState({ revision, groups });
      if (next.current != null) {
        let rev = next.current;
        next.current = null;
        setGroups(rev);
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
      setGroups(revision);
    },
  }

  return { state, actions }
}

