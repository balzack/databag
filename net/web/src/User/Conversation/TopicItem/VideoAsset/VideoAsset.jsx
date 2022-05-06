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

  const onFullScreen = () => {
    updateState({ fullscreen: true, modalUrl: hdUrl, playing: false, url: null });
  }

  const CenterButton = () => {
    if (!state.loaded) {
      return (
        <div onClick={() => updateState({ loaded: true, url: lqUrl, controls: false, paused: true, playing: false })}>
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
    if (state.controls) {
      return <></>;
    }
    return (
      <div>
        <div class="control">
          <CenterButton />
        </div>
        <div class="fullscreen" onClick={() => onFullScreen()}>
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
        <ReactPlayer ref={player} controls={state.controls} playing={state.playing}
            height="100%" width="100%" url={state.url} />
        <Controls />
      </div>
      <Modal visible={state.fullscreen} width={'60%'} bodyStyle={{ paddingBottom: 0, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={() => { updateState({ fullscreen: false, modalUrl: null })}}>
        <ReactPlayer controls={true} height="100%" width="100%" url={state.modalUrl} />
      </Modal>
    </VideoAssetWrapper>
  )
}

