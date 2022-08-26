import React, { useEffect, useState, useRef } from 'react';
import { Spin, Input } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { PlayCircleOutlined, MinusCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { AudioFileWrapper } from './AudioFile.styled';

import background from 'images/audio.png';

export function AudioFile({ url, onLabel }) {

  const [width, setWidth] = useState(0);
  const [playing, setPlaying] = useState(false);

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
    <AudioFileWrapper>
      <ReactResizeDetector handleWidth={false} handleHeight={true}>
        {({ height }) => {
          if (height != width) {
            setWidth(height);
          }
          return <div style={{ height: '100%', width: width }} />
        }}
      </ReactResizeDetector>
      <div class="player" style={{ width: width, height: width }}>
        <div class="control">
          { playing && (
            <div onClick={() => play(false)}>
              <MinusCircleOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          )}
          { !playing && (
            <div onClick={() => play(true)}>
              <PlayCircleOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          )}
          <audio style={{ position: 'absolute', top: 0, visibility: 'hidden' }} src={url} ref={audio} />
        </div>
        <div class="label">
          <Input bordered={false} size="small" onChange={(e) => onLabel(e.target.value)} />
        </div>
      </div>
    </AudioFileWrapper>
  )
}

