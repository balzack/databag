import { useState } from 'react';

export function useVideoAsset(asset) {

  const [state, setState] = useState({
    width: 0,
    height: 0,
    active: false,
    dimension: { width: 0, height: 0 },
    loading: false,
    error: false,
    url: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setActive: async (width, height) => {
      if (asset.encrypted) {
        updateState({ active: true, width, height, loading: true, url: null });
        const blob = await asset.getDecryptedBlob();
        const url = URL.createObjectURL(blob);
        updateState({ loading: false, url });
      }
      else {
        updateState({ popout: true, width, height, loading: false, url: asset.hd });
      }
    },
    clearActive: () => {
      updateState({ active: false });
    },
    setDimension: (dimension) => {
      updateState({ dimension });
    },
  };

  return { state, actions };
}

