import React, { useEffect, useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { SoundOutlined } from '@ant-design/icons';
import { AudioFileWrapper, LabelInput } from './AudioFile.styled';

export function AudioFile({ onLabel }) {

  const [state, setState] = useState({ height: 0 });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  return (
    <AudioFileWrapper>
      <ReactResizeDetector handleWidth={false} handleHeight={true}>
        {({ height }) => {
          if (height != state.height) {
            updateState({ height });
          }
          return (
            <div class="square" style={{ width: state.height }}>
              <SoundOutlined style={{ fontSize: 32, color: '#eeeeee' }} />
              <LabelInput placeholder="Label" bordered={false} onChange={(e) => onLabel(e.target.value)}/>;
            </div>
          )
        }}
      </ReactResizeDetector>
    </AudioFileWrapper>
  )
}

