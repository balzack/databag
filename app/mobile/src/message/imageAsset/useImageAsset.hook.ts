import {useState, useContext, useEffect, useRef} from 'react';
import {AppContext} from '../../context/AppContext';
import {DisplayContext} from '../../context/DisplayContext';
import {ContextType} from '../../context/ContextType';
import {MediaAsset} from '../../conversation/Conversation';
import {Download} from '../../download';

export function useImageAsset(topicId: string, asset: MediaAsset) {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
    thumbUrl: null,
    dataUrl: null,
    ratio: 1,
    loading: false,
    loaded: false,
    loadPercent: 0,
    width: 0,
    height: 0,
    failed: false,
  });
  const cancelled = useRef(false);

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const setThumb = async () => {
    const {focus} = app.state;
    const assetId = asset.image ? asset.image.thumb : asset.encrypted ? asset.encrypted.thumb : null;
    if (focus && assetId != null) {
      try {
        const thumbUrl = await focus.getTopicAssetUrl(topicId, assetId);
        updateState({thumbUrl});
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setThumb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  const actions = {
    loaded: e => {
      const {width, height} = e.nativeEvent.source;
      updateState({loaded: true, ratio: width / height});
    },
    fullscreen: e => {
      const {width, height} = e.nativeEvent.layout;
      updateState({width, height});
    },
    cancelLoad: () => {
      cancelled.current = true;
    },
    failed: () => {
      updateState({failed: true});
    },
    download: async () => {
      try {
        updateState({failed: false});
        await Download(state.dataUrl, topicId);
      } catch (err) {
        console.log(err);
        updateState({faled: true});
      }
    },
    loadImage: async () => {
      const {focus} = app.state;
      const assetId = asset.image ? asset.image.full : asset.encrypted ? asset.encrypted.parts : null;
      if (focus && assetId != null && !state.loading && !state.dataUrl) {
        cancelled.current = false;
        updateState({loading: true, loadPercent: 0});
        try {
          const dataUrl = await focus.getTopicAssetUrl(topicId, assetId, (loadPercent: number) => {
            updateState({loadPercent});
            return !cancelled.current;
          });
          updateState({dataUrl});
        } catch (err) {
          console.log(err);
          updateState({failed: true});
        }
        updateState({loading: false});
      }
    },
  };

  return {state, actions};
}
