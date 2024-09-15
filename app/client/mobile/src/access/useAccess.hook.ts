import {useRef, useState, useContext, useEffect} from 'react';
import {DisplayContext} from '../context/DisplayContext';
import {AppContext} from '../context/AppContext';
import {ContextType} from '../context/ContextType';

const location = 'https://balzack.coredb.org';

export function useAccess() {
  const debounceAvailable = useRef(setTimeout(() => {}, 0));
  const debounceTaken = useRef(setTimeout(() => {}, 0));
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    layout: null,
    strings: display.state.strings,
    mode: 'account',
    username: '',
    handle: '',
    password: '',
    confirm: '',
    token: '',
    code: '',
    loading: false,
    secure: false,
    node: '',
    available: 0,
    taken: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const {username, token, node, secure, mode} = state;
    if (mode === 'create') {
      checkTaken(username, token, node, secure);
      getAvailable(node, secure);
    }
  }, [state.mode, state.username, state.token, state.node, state.secure]);

  const getAvailable = (node: string, secure: boolean) => {
    clearTimeout(debounceAvailable.current);
    debounceAvailable.current = setTimeout(async () => {
      try {
        if (node) {
          const available = await app.actions.getAvailable(node, secure);
          updateState({available});
        } else {
          updateState({available: 0});
        }
      } catch (err) {
        console.log(err);
        updateState({available: 0});
      }
    }, 2000);
  };

  const checkTaken = (
    username: string,
    token: string,
    node: string,
    secure: boolean,
  ) => {
    updateState({taken: false});
    clearTimeout(debounceTaken.current);
    debounceTaken.current = setTimeout(async () => {
      try {
        if (node && username) {
          const available = await app.actions.getUsername(
            username,
            token,
            node,
            secure,
          );
          updateState({taken: !available});
        } else {
          updateState({taken: false});
        }
      } catch (err) {
        console.log(err);
        updateState({taken: false});
      }
    }, 2000);
  };

  useEffect(() => {
    const {layout} = display.state;
    updateState({layout});
  }, [display.state.layout]);

  const actions = {
    setMode: (mode: string) => {
      updateState({mode});
    },
    setUsername: (username: string) => {
      updateState({username});
    },
    setPassword: (password: string) => {
      updateState({password});
    },
    setConfirm: (confirm: string) => {
      updateState({confirm});
    },
    setToken: (token: string) => {
      updateState({token});
    },
    setCode: (code: string) => {
      updateState({code});
    },
    setNode: (node: string) => {
      const insecure =
        /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(
          node,
        );
      updateState({node, secure: !insecure});
    },
    setLoading: (loading: boolean) => {
      updateState({loading});
    },
    accountLogin: async () => {
      const {username, password, node, secure, code} = state;
      console.log('LOGIN:', username, password, node, secure, code);

      await app.actions.accountLogin(username, password, node, secure, code);
    },
    accountCreate: async () => {
      const {username, password, node, secure, token} = state;
      await app.actions.accountCreate(username, password, node, secure, token);
    },
    accountAccess: async () => {
      const {node, secure, token} = state;
      await app.actions.accountAccess(node, secure, token);
    },
    adminLogin: async () => {
      const {password, node, secure, code} = state;
      await app.actions.adminLogin(password, node, secure, code);
    },
  };

  return {state, actions};
}
