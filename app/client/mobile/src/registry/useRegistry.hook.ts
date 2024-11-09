import {useState, useContext, useEffect, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {Profile} from 'databag-client-sdk';

export function useRegistry() {
  const updating = useRef(false);
  const update = useRef(null as {username: string; server: string} | null);
  const debounce = useRef(setTimeout(() => {}, 0));
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    layout: '',
    strings: display.state.strings,
    username: '',
    server: '',
    profiles: [] as Profile[],
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const getRegistry = async (username: string, server: string) => {
    update.current = {username, server};
    if (!updating.current) {
      while (update.current != null) {
        updating.current = true;
        const params = update.current;
        update.current = null;
        try {
          const contact = app.state.session?.getContact();
          const handle = params.username ? params.username : null;
          const node = params.server ? params.server : null;
          const profiles = await contact.getRegistry(handle, node);
          updateState({profiles});
        } catch (err) {
          console.log(err);
          updateState({profiles: []});
        }
        updating.current = false;
      }
    }
  };

  useEffect(() => {
    const { layout } = display.state;
    updateState({ layout });
  }, [display.state]);

  useEffect(() => {
    if (!state.username && !state.server) {
      clearTimeout(debounce.current);
      getRegistry(state.username, state.server);
    } else {
      clearTimeout(debounce.current);
      debounce.current = setTimeout(() => {
        getRegistry(state.username, state.server);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.username, state.server]);

  const actions = {
    setUsername: (username: string) => {
      updateState({username});
    },
    setServer: (server: string) => {
      updateState({server});
    },
  };

  return {state, actions};
}
