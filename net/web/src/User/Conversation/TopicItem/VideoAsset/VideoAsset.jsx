import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import ReactPlayer from 'react-player'
import ReactResizeDetector from 'react-resize-detector';
import { PlayCircleOutlined } from '@ant-design/icons';
import { VideoAssetWrapper } from './VideoAsset.styled';

export function VideoAsset({ thumbUrl, videoUrl }) {

  const [active, setActive] = useState(false);
  const [dimension, setDimension] = useState({});
  const [visibility, setVisibility] = useState('hidden');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setActive(false);
    setVisibility('hidden');
    setPlaying(false);
  }, [thumbUrl, videoUrl]);

  const onReady = () => {
    setPlaying(true);
  }

  const onPlay = () => {
    setVisibility('visible');
  }

  if (!thumbUrl) {
    return <ReactPlayer height="100%" width="auto" controls="true" url={videoUrl} />
  }

  const Player = () => {
    if (!active) {
      return (
        <div onClick={() => setActive(true)}>
          <PlayCircleOutlined style={{ fontSize: 48, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
      )
    }
    return <ReactPlayer style={{ visibility }} playing={playing} height="100%" width="100%" controls="true" url={videoUrl} onReady={onReady} onPlay={onPlay} />
  }

  return (
    <VideoAssetWrapper>
      <ReactResizeDetector handleWidth={true} handleHeight={true}>
        {({ width, height }) => {
          if (width != dimension.width || height != dimension.height) {
            setDimension({ width, height });
          }
          return <img style={{ height: '100%', objectFit: 'contain' }} src={thumbUrl} alt="" />
        }}
      </ReactResizeDetector>
      <div class="player" style={{ width: dimension.width, height: dimension.height }}>
        <Player />
      </div>
    </VideoAssetWrapper>
  )
}

