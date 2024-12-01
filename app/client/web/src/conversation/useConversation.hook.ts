import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { Focus, Topic, AssetSource, HostingMode, TransformType } from 'databag-client-sdk'
import { ContextType } from '../context/ContextType'

export function useConversation() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    focus: null as Focus | null,
    layout: null,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { layout } = display.state
    updateState({ layout })
  }, [display.state])

  useEffect(() => {
    const focus = app.state.focus;
    if (focus) {
      const setTopics = (topics: Topic[]) => {
        console.log(topics);
      }
      const setStatus = (status: string) => {
        console.log(status);
      }
      focus.addTopicListener(setTopics);
      focus.addStatusListener(setStatus);
      return () => {
        focus.removeTopicListener(setTopics);
        focus.removeStatusListener(setStatus);
      }
    }
  }, [app.state.focus]);

  const actions = {
    close: () => {
      app.actions.clearFocus();
    },
    more: () => {
      const { focus } = app.state;
      if (focus) {
        focus.viewMoreTopics();
      }
    },
    add: async (file: File) => {
      const { focus } = app.state;
      if (focus) {
        const asset = {
          name: 'topic',
          mimeType: 'image',
          extension: 'jpg',
          source: file,
          transforms: [ {type: TransformType.Thumb, appId: '1'}, {type: TransformType.Copy, appId: '2'}],
        }
        const topicId = await focus.addTopic(false, 'superbasictopic', (assets: {assetId: string, appId: string}[])=>{
          console.log("HERER!!!");
          console.log(assets);
          return { text: 'addedasset', assets: [{ image: { thumb: '0', full: '1' } }] };
        }, [asset], (percent: number)=>{
          console.log(percent);
        });
      }
    },
  }

  return { state, actions }
}
