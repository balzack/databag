import { useState, useRef } from 'react';

export function useAudioAsset(asset) {

  const revoke = useRef();
  const index = useRef(0);

  const [state, setState] = useState({
    active: false,
    loading: false,
    error: false,
    ready: false,
    url: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setActive: async () => {
      if (asset.encrypted) {
        try {
          const view = index.current;
          updateState({ active: true, ready: false, error: false, loading: true, url: null });
          const blob = await asset.getDecryptedBlob(() => view != index.current);
          const url = URL.createObjectURL(blob);
          revoke.current = url;
          updateState({ loading: false, url });
        }
        catch (err) {
          console.log(err);
          updateState({ error: true });
        }
      }
      else {
        updateState({ active: true, loading: false, url: asset.full });
      }
    },
    clearActive: () => {
      index.current += 1;
      updateState({ active: false, url: null });
      if (revoke.current) {
        URL.revokeObjectURL(revoke.current);
        revoke.current = null;
      }
    },
    ready: () => {
      updateState({ ready: true });
    }
  };

  return { state, actions };
}

