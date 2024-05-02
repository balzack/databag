import React, { useState, useRef } from 'react';
import { Progress, Modal, Spin } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { PlayCircleOutlined, MinusCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { AudioAssetWrapper, AudioModalWrapper } from './AudioAsset.styled';
import { useAudioAsset } from './useAudioAsset.hook';
import { Colors } from 'constants/Colors';

import background from 'images/audio.png';

export function AudioAsset({ asset }) {

  const [width, setWidth] = useState(0);
  const [playing, setPlaying] = useState(true);

  const { actions, state } = useAudioAsset(asset);

  const audio = useRef(null);

  const play = (on) => {
    setPlaying(on);
    if (on) {
      audio.current.play();
    }
    else {
      audio.current.pause();
    }
  }

  return (
    <AudioAssetWrapper>
      <ReactResizeDetector handleWidth={false} handleHeight={true}>
        {({ height }) => {
          if (height !== width) {
            setWidth(height);
          }
          return <div style={{ height: '100%', width: width }} />
        }}
      </ReactResizeDetector>
      <div class="player" style={{ width: width, height: width }}>
        <img class="background" src={background} alt="audio background" />
        <div class="control" onClick={actions.setActive}>
          <SoundOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
        <div class="label">{ asset.label }</div>
      </div>
      <Modal centered={true} visible={state.active} width={256 + 12} bodyStyle={{ width: '100%', height: 'auto', paddingBottom: 6, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={actions.clearActive}>
        <audio style={{ position: 'absolute', top: 0, visibility: 'hidden' }} autoplay="true"
          src={state.url} type="audio/mpeg" ref={audio} onPlay={actions.ready} />
        <AudioModalWrapper>
          <img class="background" src={background} alt="audio background" />
          { state.loading && state.error && (
            <div class="failed">
              <Spin size="large" delay={250} />
            </div>
          )}
          { state.loading && !state.error && (
            <div class="loading">
              <Spin size="large" delay={250} />
              { state.total !== 0 && (
                <Progress percent={Math.floor(100 * state.block / state.total)} size="small" showInfo={false} trailColor={Colors.white} strokeColor={Colors.background} />
              )}
            </div>
          )}
          { !state.ready && !state.loading && (
            <div class="loading">
              <Spin size="large" delay={250} />
            </div>
          )}
          { state.ready && !state.loading && playing && (
            <div class="control" onClick={() => play(false)}>
              <MinusCircleOutlined style={{ fontSize: 64, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          )}
          { state.ready && !state.loading && !playing && (
            <div class="control" onClick={() => play(true)}>
              <PlayCircleOutlined style={{ fontSize: 64, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          )}
          <div class="label">{ asset.label }</div>
        </AudioModalWrapper>
      </Modal>
    </AudioAssetWrapper>
  )
}

