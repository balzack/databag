import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { Focus } from 'databag-client-sdk'
import { ContextType } from '../../context/ContextType'
import { MediaAsset } from '../../conversation/Conversation';

export function useVideoAsset(topicId: string, asset: MediaAsset) {
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    getAssetUrl: async (topicId: string, assetId: string) => {
      const { focus } = app.state;
      if (!focus) {
        throw new Error('no channel in focus');
      }
      return await focus.getTopicAssetUrl(topicId, assetId, (percent: number)=>true);
    },
  }

  return { state, actions }
}
