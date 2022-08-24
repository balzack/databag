import React, { useRef, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import ReactPlayer from 'react-player'
import ReactResizeDetector from 'react-resize-detector';
import { SelectOutlined, ExpandOutlined, MinusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { VideoAssetWrapper } from './VideoAsset.styled';

export function VideoAsset({ thumbUrl, lqUrl, hdUrl }) {

  const [state, setState] = useState({});
  const player = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
  }, [thumbUrl, hdUrl, lqUrl]);

  const onPopOut = () => {
    if (state.width == 0 || state.height == 0) {
      updateState({ popout: true, popWidth: '50%', inline: false, popoutUrl: hdUrl, playing: false, inlineUrl: null });
    }
    else {
      if (state.width / state.height > window.innerWidth / window.innerHeight) {
        updateState({ popout: true, popWidth: '70%', inline: false, popoutUrl: hdUrl, playing: false, inlineUrl: null });
      }
      else {
        let width = Math.floor(70 * (state.width / state.height) * (window.innerHeight / window.innerWidth));
        updateState({ popout: true, popWidth: width + '%', inline: false, popoutUrl: hdUrl, playing: false, inlineUrl: null });
      }
    }
  }

  const CenterButton = () => {
    if (!state.inline) {
      return (
        <div onClick={() => updateState({ inline: true, inlineUrl: lqUrl, playing: false })}>
          <SelectOutlined style={{ fontSize: 48, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      )
    }
    if (state.playing) {
      return (
        <div onClick={() => updateState({ playing: false })}>
          <MinusCircleOutlined style={{ fontSize: 48, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      )
    }
    else {
      return (
        <div onClick={() => updateState({ playing: true })}>
          <PlayCircleOutlined style={{ fontSize: 48, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      )
    }
  }

  const Controls = () => {
    return (
      <div>
        <div class="control">
          <CenterButton />
        </div>
        <div class="expand" onClick={() => onPopOut()}>
          <ExpandOutlined style={{ fontSize: 24, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      </div>
    )
  }

  return (
    <VideoAssetWrapper>
      <ReactResizeDetector handleWidth={true} handleHeight={true}>
        {({ width, height }) => {
          if (width != state.width || height != state.height) {
            updateState({ width, height });
          }
          return <img style={{ height: '100%', objectFit: 'contain' }} src={thumbUrl} alt="" />
        }}
      </ReactResizeDetector>
      <div class="player" style={{ width: state.width, height: state.height }}>
        <ReactPlayer ref={player} controls={false} playing={state.playing}
            height="100%" width="100%" url={state.inlineUrl} />
        <Controls />
      </div>
      <Modal visible={state.popout} width={state.popWidth} bodyStyle={{ paddingBottom: 0, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={() => { updateState({ popout: false })}}>
        <ReactPlayer controls={true} height="100%" width="100%" url={state.popoutUrl} />
      </Modal>
    </VideoAssetWrapper>
  )
}

