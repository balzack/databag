import { useState, useRef } from 'react';

export function useBinaryAsset(asset) {

  const index = useRef(0);
  const updated = useRef(false);

  const [state, setState] = useState({
    error: false,
    unsealing: false,
    block: 0,
    total: 0,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    download: async () => {
      if (asset.encrypted) {
        if (!state.unsealing) {
          try {
            updateState({ error: false, unsealing: true });
            const view = index.current;
            updateState({ active: true, ready: false, error: false, loading: true, url: null });
            const blob = await asset.getDecryptedBlob(() => view !== index.current, (block, total) => { 
              if (!updated.current || block === total) {
                updated.current = true;
                setTimeout(() => {
                  updated.current = false;
                }, 1000);
                updateState({ block, total });
              }
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `${asset.label}.${asset.extension.toLowerCase()}`
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
          catch (err) {
            console.log(err);
            updateState({ error: true });
          }
          updateState({ unsealing: false });
        }
      }
      else {
        const link = document.createElement("a");
        link.download = `${asset.label}.${asset.extension.toLowerCase()}`
        link.href = asset.data;
        link.click();
      }
    },
  };

  return { state, actions };
}

