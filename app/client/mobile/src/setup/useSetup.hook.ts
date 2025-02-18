import {useEffect, useState, useContext, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import type { Setup } from 'databag-client-sdk';

const DEBOUNCE_MS = 2000;
const DELAY_MS = 1000;

export function useSetup() {
  const updated = useRef(false);
  const loading = useRef(false);
  const debounce = useRef(null);
  const setup = useRef(null as null | Setup);
  const app = useContext(AppContext);
  const display = useContext(DisplayContext);
  const [state, setState] = useState({
    layout: '',
    strings: {},
    loading: true,
    updating: false,
    error: false,
    accountStorage: '',
    setup: null as null | Setup,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const sync = async () => {
    while (loading.current) {
      try {
        const service = app.state.service;
        setup.current = await service.getSetup();
        loading.current = false;
        const storage = Math.floor(setup.current.accountStorage / 1073741824); 
        updateState({ setup: setup.current, accountStorage: storage.toString(), loading: false });    
      } catch (err) {
        console.log(err);
        await new Promise((r) => setTimeout(r, DELAY_MS));
      }
    }
  }

  const save = () => {
    updated.current = true;
    updateState({ updating: true });
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      updated.current = false;
      try {
        const service = app.state.service;
        await service.setSetup(setup.current);
        if (updated.current) {
          save()
        } else {
          updateState({ updating: false });
        }
      } catch (err) {
        console.log(err);
        updateState({ error: true });
      }
    }, DEBOUNCE_MS);
  }

  useEffect(() => {
    const { layout, strings} = display.state;
    updateState({ layout, strings});
  }, [display.state]);

  useEffect(() => {
    if (app.state.service) {
      loading.current = true;
      sync();
      return () => {
        loading.current = false;
      }
    }
  }, []);

  const actions = {
    clearError: () => {
      updateState({ error: false });
    },
    setDomain: (domain: string) => {
      if (setup.current) {
        setup.current.domain = domain;
        updateState({ setup: setup.current });
        save();
      }
    },
    setAccountStorage: (accountStorage: number) => {
      if (setup.current) {
        const storage = parseInt(accountStorage) * 1073741824;
        setup.current.accountStorage = storage;
        updateState({ setup: setup.current, accountStorage });
        save();
      }
    },
  };

  return {state, actions};
}
