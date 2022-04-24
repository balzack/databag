import { useEffect, useState, useRef } from 'react';
import { getGroups } from '../Api/getGroups';

export function useGroupContext() {
  const [state, setState] = useState({
    groups: new Map(),
  });
  const access = useRef(null);
  const revision = useRef(null);
  const groups = useRef(new Map());
  const next = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const updateGroups = async () => {
    let delta = await getGroups(access.current, revision.current);
    for (let group of delta) {
      if (group.data) {
        groups.set(group.id, group);
      }
      else {
        groups.delete(group.id);
      }
    }
  }

  const setGroups = async (rev) => {
    if (next.current == null) {
      if (revision.current != rev) {
        await updateGroups();
        updateState({ groups: groups.current });
        revision.current = rev;
      }
      if (next.current != null) {
        let r = next.current;
        next.current = null;
        setGroups(r);
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
      setGroups(rev);
    },
  }

  return { state, actions }
}

