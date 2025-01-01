import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../context/AppContext'
import { Focus } from 'databag-client-sdk'
import { ContextType } from '../../context/ContextType'
import { MediaAsset } from '../../conversation/Conversation';

export function useBinaryAsset(topicId: string, asset: MediaAsset) {
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
    dataUrl: null,
    loading: false,
    loaded: false,
    loadPercent: 0,
  })
  const cancelled = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    cancelLoad: () => {
      cancelled.current = true;
    },
    loadBinary: async () => {
      const { focus } = app.state;
      const assetId = asset.audio ? asset.audio.full : asset.encrypted ? asset.encrypted.parts : null;
      if (focus && assetId != null && !state.loading && !state.dataUrl) {
        cancelled.current = false; 
        updateState({ loading: true, loadPercent: 0 });
        try {
          const dataUrl = await focus.getTopicAssetUrl(topicId, assetId, (loadPercent: number)=>{ updateState({ loadPercent }); return !cancelled.current });
          updateState({ dataUrl });
        } catch (err) {
          console.log(err);
        }
        updateState({ loading: false });
      }
    }
  }

  return { state, actions }
}
