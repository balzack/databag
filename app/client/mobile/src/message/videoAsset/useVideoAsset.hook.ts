import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../context/AppContext'
import { Focus } from 'databag-client-sdk'
import { ContextType } from '../../context/ContextType'
import { MediaAsset } from '../../conversation/Conversation';

export function useVideoAsset(topicId: string, asset: MediaAsset) {
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
    thumbUrl: null,
    dataUrl: null,
    ratio: 1,
    loading: false,
    loaded: false,
    loadPercent: 0,
  })
  const cancelled = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setThumb = async () => {
    const { focus } = app.state;
    const assetId = asset.video ? asset.video.thumb : asset.encrypted ? asset.encrypted.thumb : null;
    if (focus && assetId != null) {
      try {
        const thumbUrl = await focus.getTopicAssetUrl(topicId, assetId);
        updateState({ thumbUrl });
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setThumb();
  }, [asset]);    

  const actions = {
    loaded: (e) => {
      const { width, height } = e.nativeEvent.source;
      updateState({ loaded: true, ratio: width / height });
    },
    cancelLoad: () => {
      cancelled.current = true;
    },
    loadVideo: async () => {
      const { focus } = app.state;
      const assetId = asset.video ? asset.video.hd || asset.video.lq : asset.encrypted ? asset.encrypted.parts : null;
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
