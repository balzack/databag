import { useState, useRef } from 'react';

export function useImageAsset(asset) {

  const revoke = useRef();
  const index = useRef(0);

  const [state, setState] = useState({
    popout: false,
    width: 0,
    height: 0,
    loading: false,
    error: false,
    url: null,
    block: 0,
    total: 0,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setPopout: async (width, height) => {
      if (asset.encrypted) {
        try {
          const view = index.current;
          updateState({ popout: true, width, height, error: false, loading: true, url: null });
          const blob = await asset.getDecryptedBlob(() => view != index.current, (block, total) => updateState({ block, total }));
          const url = URL.createObjectURL(blob);
          updateState({ loading: false, url });
          revoke.current = url;
        }
        catch(err) {
          console.log(err);
          updateState({ error: true });
        }
      }
      else {
        updateState({ popout: true, width, height, loading: false, url: asset.full });
      }
    },
    clearPopout: () => {
      index.current += 1;
      updateState({ popout: false });
      if (revoke.current) {
        URL.revokeObjectURL(revoke.current);
        revoke.current = null;
      }
    },
  };

  return { state, actions };
}
