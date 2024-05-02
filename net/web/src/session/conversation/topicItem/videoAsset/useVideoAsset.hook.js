import { useState, useRef } from 'react';

export function useVideoAsset(asset) {

  const revoke = useRef();
  const index = useRef(0);

  const [state, setState] = useState({
    width: 0,
    height: 0,
    active: false,
    dimension: { width: 0, height: 0 },
    loading: false,
    error: false,
    url: null,
    loaded: false,
    block: 0,
    total: 0,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setActive: async (width, height) => {
      if (asset.encrypted) {
        try {
          const view = index.current;
          updateState({ active: true, width, height, error: false, loaded: false, loading: true, url: null });
          const blob = await asset.getDecryptedBlob(() => view !== index.current, (block, total) => updateState({ block, total }));
          const url = URL.createObjectURL(blob);
          revoke.current = url;
          updateState({ url, loading: false });
        }
        catch (err) {
          console.log(err);
          updateState({ error: true });
        }
      }
      else {
        updateState({ active: true, width, height, loading: false, url: asset.hd });
      }
    },
    clearActive: () => {
      index.current += 1;
      updateState({ active: false });
      if (revoke.current) {
        URL.revokeObjectURL(revoke.current);
        revoke.current = null;
      }
    },
    setDimension: (dimension) => {
      updateState({ dimension });
    },
    setLoaded: () => {
      updateState({ loaded: true });
    },
  };

  return { state, actions };
}

