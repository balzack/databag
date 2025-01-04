import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../context/AppContext'
import { Focus } from 'databag-client-sdk'
import { ContextType } from '../../context/ContextType'
import { MediaAsset } from '../../conversation/Conversation';

export function useBinaryAsset(topicId: string, asset: MediaAsset) {
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
    dataUrl: '',
    loading: false,
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
      const assetId = asset.binary ? asset.binary.data : asset.encrypted ? asset.encrypted.parts : null;
      if (focus && assetId != null && !state.loading && !state.dataUrl) {
        cancelled.current = false;
        updateState({ loading: true, loadPercent: 0 });
        try {
          const dataUrl = await focus.getTopicAssetUrl(topicId, assetId, (loadPercent: number)=>{ updateState({ loadPercent }); return !cancelled.current });
          updateState({ dataUrl, loading: false });
        } catch (err) {
          updateState({ loading: false });
          console.log(err);
        }
      }
    }
  }

  return { state, actions }
}