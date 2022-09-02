import React, { useEffect, useState, useRef } from 'react';
import { Spin } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { PlayCircleOutlined, MinusCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { AudioAssetWrapper } from './AudioAsset.styled';

import background from 'images/audio.png';

export function AudioAsset({ label, audioUrl }) {

  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [url, setUrl] = useState(null);

  const audio = useRef(null);

  useEffect(() => {
    setActive(false);
    setReady(false);
    setPlaying(true);
    setUrl(null);
  }, [label, audioUrl]);

  const onActivate = () => {
    setUrl(audioUrl);
    setActive(true);
  }

  const onReady = () => {
    setReady(true);
  }

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          { !active && (
            <div class="control" onClick={() => onActivate()}>
              <SoundOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          )}
          { active && !ready && (
            <div class="control">
              <Spin />
            </div>
          )}
          { active && ready && playing && (
            <div class="control" onClick={() => play(false)}>
              <MinusCircleOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          )}
          { active && ready && !playing && (
            <div class="control" onClick={() => play(true)}>
              <PlayCircleOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          )}
          <audio style={{ position: 'absolute', top: 0, visibility: 'hidden' }} autoplay="true"
            src={url} type="audio/mpeg" ref={audio} onPlay={onReady} />
        </div>
      </div>
      <div class="label">{ label }</div>
    </AudioAssetWrapper>
  )
}

