import { useState } from 'react';

export function useImageAsset(asset) {

  const [state, setState] = useState({
    popout: false,
    width: 0,
    height: 0,
    loading: false,
    error: false,
    url: null, 
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setPopout: async (width, height) => {
      if (asset.encrypted) {
        updateState({ popout: true, width, height, loading: true, url: null });
        const blob = await asset.getDecryptedBlob();
        const url = URL.createObjectURL(blob);
        updateState({ loading: false, url });
      }
      else {
        updateState({ popout: true, width, height, loading: false, url: asset.full });
      }
    },
    clearPopout: () => {
      updateState({ popout: false });
    },
  };

  return { state, actions };
}
