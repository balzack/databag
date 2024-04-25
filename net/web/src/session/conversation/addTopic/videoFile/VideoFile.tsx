import React, { useState, useRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { VideoFileWrapper } from './VideoFile.styled';

export function VideoFile({ url, onPosition }) {
  const [state, setState] = useState({ width: 0, height: 0 });
  const player = useRef(null);
  const seek = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const onSeek = (offset) => {
    if (player.current) {
      const len = player.current.duration;
      if (len > 16) {
        offset *= Math.floor(len / 16);
      }
      seek.current += offset;
      if (seek.current < 0 || seek.current >= len) {
        seek.current = 0;
      }
      onPosition(seek.current);
      player.current.currentTime = seek.current;
      player.current.play();
    }
  };

  const onPause = () => {
    player.current.pause();
  };

  return (
    <VideoFileWrapper>
      <ReactResizeDetector
        handleWidth={true}
        handleHeight={true}
      >
        {({ width, height }) => {
          if (width !== state.width || height !== state.height) {
            updateState({ width, height });
          }
          return (
            <video
              ref={player}
              muted
              onPlay={onPause}
              src={url}
              width={'auto'}
              height={'100%'}
              playsinline="true"
            />
          );
        }}
      </ReactResizeDetector>
      <div
        className="overlay"
        style={{ width: state.width, height: state.height }}
      >
        <div className="seek">
          <div className="left-seek">
            <div
              className="icon"
              onClick={() => onSeek(-1)}
            >
              <LeftOutlined style={{ fontSize: 32, color: '#eeeeee' }} />
            </div>
          </div>
          <div className="right-seek">
            <div
              className="icon"
              onClick={() => onSeek(1)}
            >
              <RightOutlined style={{ fontSize: 32, color: '#eeeeee' }} />
            </div>
          </div>
        </div>
      </div>
    </VideoFileWrapper>
  );
}
