import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { Focus } from 'databag-client-sdk'
import { ContextType } from '../../context/ContextType'
import { MediaAsset } from '../../conversation/Conversation';

export function useImageAsset(topicId: string, asset: MediaAsset) {
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
    thumbUrl: null,
    dataUrl: null,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setThumb = async () => {
    const { focus } = app.state;
    const assetId = asset.image ? asset.image.thumb : asset.encrypted ? asset.encrypted.thumb : null;
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
    loadImage: async () => {
console.log("CHECK0");
      const { focus } = app.state;
      const assetId = asset.image ? asset.image.full : asset.encrypted ? asset.encrypted.parts : null;
      if (focus && assetId != null) {
        try {
console.log("CHECK1");
          const dataUrl = await focus.getTopicAssetUrl(topicId, assetId);
          updateState({ dataUrl });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  return { state, actions }
}
