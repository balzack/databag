import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import ReactPlayer from 'react-player'
import ReactResizeDetector from 'react-resize-detector';
import { SoundOutlined } from '@ant-design/icons';
import { AudioAssetWrapper } from './AudioAsset.styled';

export function AudioAsset({ label, audioUrl }) {

  const [active, setActive] = useState(false);
  const [dimension, setDimension] = useState({});
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setActive(false);
    setPlaying(false);
  }, [label, audioUrl]);

  const onReady = () => {
    setPlaying(true);
  }

  const Player = () => {
    if (!active) {
      return (
        <div onClick={() => setActive(true)}>
          <SoundOutlined style={{ fontSize: 48, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      )
    }
    return <ReactPlayer style={{ visibility: 'hidden' }} playing={playing} height="100%" width="100%" controls="true" url={audioUrl} onReady={onReady} />
  }

  return (
    <AudioAssetWrapper>
      <ReactResizeDetector handleWidth={false} handleHeight={true}>
        {({ height }) => {
          if (height != dimension.height) {
            setDimension({ height });
          }
          return <div style={{ height: '100%', width: dimension.height, backgroundColor: 'black' }} />
        }}
      </ReactResizeDetector>
      <div class="player" style={{ width: dimension.height, height: dimension.height }}>
        <Player />
      </div>
    </AudioAssetWrapper>
  )
}

