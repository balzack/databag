import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../context/AppContext'
import { DisplayContext } from '../../context/DisplayContext'
import { Focus } from 'databag-client-sdk'
import { ContextType } from '../../context/ContextType'
import { MediaAsset } from '../../conversation/Conversation';

export function useAudioAsset(topicId: string, asset: MediaAsset) {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    dataUrl: null,
    loading: false,
    loaded: false,
    loadPercent: 0,
    failed: false,
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
    failed: () => {
      updateState({ failed: true });
    },
    download: async () => {
      try {
        updateState({ failed: false });
        await Share.share({ url: state.dataUrl });
      } catch (err) {
        console.log(err);
        updateState({ faled: true });
      }
    },
    loadAudio: async () => {
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
          updateState({ failed: true });
        }
        updateState({ loading: false });
      }
    },
  }

  return { state, actions }
}
