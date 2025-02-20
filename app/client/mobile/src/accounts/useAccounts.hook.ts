import {useEffect, useState, useContext, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import type { Member } from 'databag-client-sdk';

export function useAccounts() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    layout: '',
    strings: display.state.strings,
    members: [] as Member[],
    loading: false,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const sync = async () => {
    if (!state.loading) {
      try {
        updateState({ loading: true });
        const service = app.state.service;
        const members = await service.getMembers();
        updateState({ members, loading: false });
      } catch (err) {
        console.log(err);
        updateState({ loading: false });
      }
    }
  }

  useEffect(() => {
    const { layout, strings} = display.state;
    updateState({ layout, strings});
  }, [display.state]);

  const actions = {
    reload: sync,
    addAccount: async () => {
      return await app.state.service.createMemberAccess();
    },
    accessAccount: async (accountId: number) => {
      return await app.state.service.resetMemberAccess(accountId);
    },
    blockAccount: async (accountId: number, flag: boolean) => {
      await app.state.service.blockMember(accountId, flag);
      await sync();
    },
    removeAccount: async (accountId: number) => {
      await app.state.service.removeMember(accountId);
      await sync();
    },
  };

  return {state, actions};
}
