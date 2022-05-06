import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import ReactPlayer from 'react-player'
import ReactResizeDetector from 'react-resize-detector';
import { PlayCircleOutlined, MinusCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { AudioAssetWrapper } from './AudioAsset.styled';

export function AudioAsset({ label, audioUrl }) {

  const [active, setActive] = useState(false);
  const [dimension, setDimension] = useState({});
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setActive(false);
    setPlaying(false);
  }, [label, audioUrl]);

  const onReady = () => {
    if (!ready) {
      setReady(true);
      setPlaying(true);
    }
  }

  const Control = () => {
    if (!ready) {
      return <></>
    }
    if (playing) {
      return (
        <div onClick={() => setPlaying(false)}>
          <MinusCircleOutlined style={{ fontSize: 48, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      )
    }
    return (
      <div onClick={() => setPlaying(true)}>
        <PlayCircleOutlined style={{ fontSize: 48, color: '#eeeeee', cursor: 'pointer' }} />
      </div>
    )
  }

  const Player = () => {
    if (!active) {
      return (
        <div onClick={() => setActive(true)}>
          <SoundOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      )
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Control />
        <ReactPlayer style={{ position: 'absolute', top: 0, visibility: 'hidden' }} playing={playing} height="100%" width="100%" controls="true" url={audioUrl} onReady={onReady} />
      </div>
    )
  }

  return (
    <AudioAssetWrapper>
      <ReactResizeDetector handleWidth={false} handleHeight={true}>
        {({ height }) => {
          if (height != dimension.height) {
            setDimension({ height });
          }
          return <div style={{ height: '100%', borderRadius: 4, width: dimension.height, backgroundColor: '#444444' }} />
        }}
      </ReactResizeDetector>
      <div class="player" style={{ width: dimension.height, height: dimension.height }}>
        <Player />
      </div>
    </AudioAssetWrapper>
  )
}

