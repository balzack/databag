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
    setAccountStorage: (accountStorage: string) => {
      if (setup.current) {
        const storage = parseInt(accountStorage) * 1073741824;
        if (storage >= 0) {
          setup.current.accountStorage = storage;
          updateState({ setup: setup.current, accountStorage });
        } else {
          setup.current.accountStorage = 0;
          updateState({ setup: setup.current, accountStorage: 0 });
        }
        save();
      }
    },
    setKeyType: (keyType: string) => {
      if (setup.current) {
        setup.current.keyType = keyType;
        updateState({ setup: setup.current });
        save();
      }
    },
    setEnableOpenAccess: (enableOpenAccess: boolean) => {
      if (setup.current) {
        setup.current.enableOpenAccess = enableOpenAccess;
        updateState({ setup: setup.current });
        save();
      }
    },
    setOpenAccessLimit: (openAccessLimit: string) => {
      if (setup.current) {
        const limit = parseInt(openAccessLimit);
        if (limit >= 0) {
          setup.current.openAccessLimit = limit;
          updateState({ setup: setup.current, openAccessLimit });
        } else {
          setup.current.openAccessLimit = 0;
          updateState({ setup: setup.current, openAccessLimit: 0 });
        }
        save();
      }
    },
    setPushSupported: (pushSupported: boolean) => {
      if (setup.current) {
        setup.current.pushSupported = pushSupported;
        updateState({ setup: setup.current });
        save();
      }
    },
    setAllowUnsealed: (allowUnsealed: boolean) => {
      if (setup.current) {
        setup.current.allowUnsealed = allowUnsealed;
        updateState({ setup: setup.current });
        save();
      }
    },
    setEnableImage: (enableImage: boolean) => {
      if (setup.current) {
        setup.current.enableImage = enableImage;
        updateState({ setup: setup.current });
        save();
      }
    },
    setEnableAudio: (enableAudio: boolean) => {
      if (setup.current) {
        setup.current.enableAudio = enableAudio;
        updateState({ setup: setup.current });
        save();
      }
    },
    setEnableVideo: (enableVideo: boolean) => {
      if (setup.current) {
        setup.current.enableVideo = enableVideo;
        updateState({ setup: setup.current });
        save();
      }
    },
    setEnableBinary: (enableBinary: boolean) => {
      if (setup.current) {
        setup.current.enableBinary = enableBinary;
        updateState({ setup: setup.current });
        save();
      }
    },
    setEnableIce: (enableIce: boolean) => {
      if (setup.current) {
        setup.current.enableIce = enableIce;
        updateState({ setup: setup.current });
        save();
      }
    },
    setEnableService: (enableService: boolean) => {
      if (setup.current) {
        setup.current.enableService = enableService;
        updateState({ setup: setup.current });
        save();
      }
    },
    setIceUrl: (iceUrl: string) => {
      if (setup.current) {
        setup.current.iceUrl = iceUrl;
        updateState({ setup: setup.current });
        save();
      }
    },
    setIceUsername: (iceUsername: string) => {
      if (setup.current) {
        setup.current.iceUsername = iceUsername;
        updateState({ setup: setup.current });
        save();
      }
    },
    setIcePassword: (icePassword: string) => {
      if (setup.current) {
        setup.current.icePassword = icePassword;
        updateState({ setup: setup.current });
        save();
      }
    },
  };

  return {state, actions};
}
