import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player'
import ReactResizeDetector from 'react-resize-detector';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { VideoFileWrapper } from './VideoFile.styled';

export function VideoFile({ url, onPosition }) {

  const [state, setState] = useState({ width: 0, height: 0 });
  const [playing, setPlaying] = useState(false);
  const player = useRef(null);
  const seek = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const onSeek = (offset) => {
    if (player.current) {
      let len = player.current.getDuration();
      if (len > 128) {
        offset *= Math.floor(len / 128);
      } 
      seek.current += offset;
      if (seek.current < 0 || seek.current >= len) {
        seek.current = 0;
      }
      onPosition(seek.current);
      player.current.seekTo(seek.current, 'seconds');
      setPlaying(true);
    }
  }

  const onPause = () => {
    setPlaying(false);
  }

  return (
    <VideoFileWrapper>
      <ReactResizeDetector handleWidth={true} handleHeight={true}>
        {({ width, height }) => {
          if (width !== state.width || height !== state.height) {
            updateState({ width, height });
          }
          return <ReactPlayer ref={player} playing={playing} playbackRate={0} controls={false} height="100%" width="auto" url={url} 
              onStart={() => onPause()} onPlay={() => onPause()} />
        }}
      </ReactResizeDetector>
      <div class="overlay" style={{ width: state.width, height: state.height }}>
        <div class="seek">
          <div class="left-seek">
            <div class="icon" onClick={() => onSeek(-1)}>
              <LeftOutlined style={{ fontSize: 32, color: '#eeeeee' }} />
            </div>
          </div>
          <div class="right-seek">
            <div class="icon" onClick={() => onSeek(1)}>
              <RightOutlined style={{ fontSize: 32, color: '#eeeeee' }} />
            </div>
          </div>
        </div>
      </div>
    </VideoFileWrapper>
  )
}

